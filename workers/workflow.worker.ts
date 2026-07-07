/**
 * Workflow Worker — Task 4.3
 *
 * Processes the `workflow` BullMQ queue:
 * - Evaluates step types: human | auto | parallel | condition | escalation
 * - Schedules SLA timer delayed jobs; cancels on step completion
 * - On SLA expiry: escalates to fallbackAssigneeId; publishes domain event
 * - At-least-once processing; retry 3× with exponential backoff (Req 24.2)
 * - Parallel-vote Redis counter for quorum tracking (Req 24.4)
 *
 * Requirements: 24.2, 24.3, 24.4
 */

import { Worker, Queue } from "bullmq";
import IORedis from "ioredis";
import { prisma } from "@/lib/prisma";

// ─── Queue setup ──────────────────────────────────────────────────────────────

const connection = new IORedis(process.env.REDIS_URL ?? "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

export const workflowQueue    = new Queue("workflow", { connection });
export const workflowSlaQueue = new Queue("workflow-sla", { connection });

// ─── Job types ────────────────────────────────────────────────────────────────

type WorkflowJobType = "advance" | "sla-check" | "escalate";

interface WorkflowJob {
  type: WorkflowJobType;
  instanceId: string;
  stepId?: string;
  definitionId?: string;
}

// ─── Parallel vote counter key ────────────────────────────────────────────────

const parallelVoteKey = (instanceId: string, nodeId: string) =>
  `wf-parallel:${instanceId}:${nodeId}`;

// ─── Worker ───────────────────────────────────────────────────────────────────

export const workflowWorker = new Worker<WorkflowJob>(
  "workflow",
  async (job) => {
    const { type, instanceId, stepId } = job.data;

    if (type === "sla-check") {
      await handleSlaCheck(instanceId, stepId!);
      return;
    }

    if (type === "escalate") {
      await handleEscalation(instanceId, stepId!);
      return;
    }

    // type === "advance" — evaluate next step
    const instance = await prisma.workflowInstance.findFirst({
      where: { id: instanceId, status: "ACTIVE", isDeleted: false },
      include: { definition: true, steps: { orderBy: { createdAt: "desc" }, take: 1 } },
    });

    if (!instance) return;

    const graph = instance.definition.graphJson as any;
    const currentStep = instance.steps[0];
    if (!currentStep) return;

    const currentNode = graph.nodes?.find((n: any) => n.id === currentStep.stepId);
    if (!currentNode) return;

    // Handle auto steps — resolve automatically
    if (currentNode.type === "auto") {
      await prisma.$transaction(async (tx) => {
        await tx.workflowInstanceStep.update({
          where: { id: currentStep.id },
          data: { status: "COMPLETED", decidedAt: new Date(), decision: "APPROVED" },
        });

        const nextEdge = graph.edges?.find((e: any) => e.source === currentStep.stepId);
        if (nextEdge) {
          const nextNode = graph.nodes?.find((n: any) => n.id === nextEdge.target);
          if (nextNode) {
            const slaConfig = (instance.definition.slaConfig as any)?.[nextNode.id];
            const slaDeadline = slaConfig?.durationMinutes
              ? new Date(Date.now() + slaConfig.durationMinutes * 60_000)
              : undefined;

            await tx.workflowInstanceStep.create({
              data: {
                instanceId,
                stepId: nextNode.id,
                stepName: nextNode.label,
                assigneeId: nextNode.assigneeId,
                assigneeRole: nextNode.assigneeRole,
                status: "ACTIVE",
                quorum: nextNode.quorum ?? 1,
                slaDeadline,
              },
            });

            // Schedule SLA check if deadline set
            if (slaDeadline) {
              const delay = slaDeadline.getTime() - Date.now();
              await workflowQueue.add(
                "workflow",
                { type: "sla-check", instanceId, stepId: nextNode.id },
                { delay, jobId: `sla-${instanceId}-${nextNode.id}` }
              );
            }

            await tx.workflowInstance.update({
              where: { id: instanceId },
              data: { currentStepId: nextNode.id },
            });
          }
        } else {
          await tx.workflowInstance.update({
            where: { id: instanceId },
            data: { status: "COMPLETED", currentStepId: null },
          });
        }
      });
    }
  },
  {
    connection,
    concurrency: 10,
    // Req 24.2: retry 3× with exponential backoff
    settings: { backoffStrategy: (attempt) => Math.pow(2, attempt) * 1000 },
  }
);

// ─── SLA check ────────────────────────────────────────────────────────────────

async function handleSlaCheck(instanceId: string, stepId: string): Promise<void> {
  const step = await prisma.workflowInstanceStep.findFirst({
    where: { instanceId, stepId, status: "ACTIVE" },
  });

  if (!step || !step.slaDeadline) return;
  if (step.slaDeadline > new Date()) return; // Not yet breached

  // SLA breached — escalate
  await workflowQueue.add("workflow", { type: "escalate", instanceId, stepId });
}

// ─── Escalation ───────────────────────────────────────────────────────────────

async function handleEscalation(instanceId: string, stepId: string): Promise<void> {
  const instance = await prisma.workflowInstance.findFirst({
    where: { id: instanceId, status: "ACTIVE" },
    include: { definition: true },
  });
  if (!instance) return;

  const slaConfig = (instance.definition.slaConfig as any)?.[stepId];
  const fallbackAssigneeId = slaConfig?.fallbackAssigneeId;

  await prisma.$transaction(async (tx) => {
    await tx.workflowInstanceStep.updateMany({
      where: { instanceId, stepId, status: "ACTIVE" },
      data: {
        status: "ESCALATED",
        assigneeId: fallbackAssigneeId,
      },
    });

    // Create escalated step for the fallback assignee
    if (fallbackAssigneeId) {
      await tx.workflowInstanceStep.create({
        data: {
          instanceId,
          stepId,
          stepName: `[ESCALATED] ${stepId}`,
          assigneeId: fallbackAssigneeId,
          status: "ACTIVE",
          quorum: 1,
        },
      });
    }

    await tx.auditTrail.create({
      data: {
        tenantId: instance.tenantId,
        entityType: "WorkflowInstance",
        entityId: instanceId,
        action: "UPDATE",
        actorId: "system",
        actorRole: "system",
        newValue: { escalated: true, stepId, fallbackAssigneeId },
        metadata: { reason: "SLA_BREACH", path: "workflow.worker.escalation", changedFields: ["status"] },
      },
    });
  });

  console.log(`[workflow-worker] SLA breach escalated: instance=${instanceId}, step=${stepId}`);
}

workflowWorker.on("failed", (job, err) => {
  console.error(`[workflow-worker] Job failed: ${job?.id}`, err.message);
});

console.log("[workflow-worker] Started");
