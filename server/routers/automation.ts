// server/routers/automation.ts
import { z } from "zod";
import { router, publicProcedure } from "../trpc";

// ── Zod schemas ──────────────────────────────────────────────────────────────
const automationStatusSchema = z.enum(["draft", "active", "paused", "archived"]);
const automationTriggerSchema = z.enum(["schedule", "webhook", "event"]);
const automationActionSchema = z.enum([
  "email",
  "slack",
  "webhook",
  "updateRecord",
  "createRecord",
  "approval",
]);

const automationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  description: z.string().optional(),
  trigger: automationTriggerSchema,
  action: automationActionSchema,
  config: z.record(z.string(), z.any()), // flexible config for different actions
  status: automationStatusSchema.default("draft"),
  schedule: z.string().optional(), // cron expression if trigger === "schedule"
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

type Automation = z.infer<typeof automationSchema> & { id: string };

// ── In-memory store (replace with Prisma/Drizzle) ──────────────────────────
let automations: Automation[] = [];
let idCounter = 1;

function findById(id: string): Automation | undefined {
  return automations.find((a) => a.id === id);
}

function generateId(): string {
  return String(idCounter++);
}

// ── tRPC Router ──────────────────────────────────────────────────────────────
export const automationRouter = router({
  // Get all automations (with optional filters)
  getAll: publicProcedure
    .input(
      z.object({
        status: automationStatusSchema.optional(),
        search: z.string().optional(),
      }).optional()
    )
    .query(({ input }) => {
      let result = automations;
      if (input?.status) {
        result = result.filter((a) => a.status === input.status);
      }
      if (input?.search) {
        const searchLower = input.search.toLowerCase();
        result = result.filter(
          (a) =>
            a.name.toLowerCase().includes(searchLower) ||
            a.description?.toLowerCase().includes(searchLower)
        );
      }
      return result;
    }),

  // Get a single automation by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      const automation = findById(input.id);
      if (!automation) {
        throw new Error(`Automation with id ${input.id} not found`);
      }
      return automation;
    }),

  // Create a new automation
  create: publicProcedure
    .input(automationSchema.omit({ id: true, createdAt: true, updatedAt: true }))
    .mutation(({ input }) => {
      const newAutomation: Automation = {
        ...input,
        id: generateId(),
        status: input.status || "draft",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      automations.push(newAutomation);
      return newAutomation;
    }),

  // Update an existing automation
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        data: automationSchema.partial().omit({ id: true, createdAt: true, updatedAt: true }),
      })
    )
    .mutation(({ input }) => {
      const index = automations.findIndex((a) => a.id === input.id);
      if (index === -1) {
        throw new Error(`Automation with id ${input.id} not found`);
      }
      const existing = automations[index];
      const updated = {
        ...existing,
        ...input.data,
        updatedAt: new Date(),
      };
      automations[index] = updated;
      return updated;
    }),

  // Delete an automation
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => {
      const index = automations.findIndex((a) => a.id === input.id);
      if (index === -1) {
        throw new Error(`Automation with id ${input.id} not found`);
      }
      automations.splice(index, 1);
      return { success: true };
    }),

  // Run an automation manually (simulate execution)
  run: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const automation = findById(input.id);
      if (!automation) {
        throw new Error(`Automation with id ${input.id} not found`);
      }
      // Simulate running the automation (replace with actual logic)
      console.log(`Running automation: ${automation.name} (${automation.action})`);
      // You would call your workflow engine, send emails, call webhooks, etc. here
      return {
        success: true,
        message: `Automation "${automation.name}" executed successfully`,
        executedAt: new Date(),
      };
    }),

  // Toggle status (active ↔ paused) or set to draft/archived
  toggleStatus: publicProcedure
    .input(
      z.object({
        id: z.string(),
        status: automationStatusSchema,
      })
    )
    .mutation(({ input }) => {
      const index = automations.findIndex((a) => a.id === input.id);
      if (index === -1) {
        throw new Error(`Automation with id ${input.id} not found`);
      }
      const existing = automations[index];
      const updated = {
        ...existing,
        status: input.status,
        updatedAt: new Date(),
      };
      automations[index] = updated;
      return updated;
    }),
});

export type AutomationRouter = typeof automationRouter;
