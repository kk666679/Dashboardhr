import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import { randomUUID } from "crypto";

/* ------------------------------------------------------------------ */
/* 🧠 TYPES */
/* ------------------------------------------------------------------ */

type AgentRole = "hr-agent" | "compliance-agent" | "iso-agent";

type AgentMessage = {
  id: string;
  role: "user" | "assistant" | "tool";
  content: string;
  timestamp: number;
};

type Candidate = {
  id: string;
  name: string;
  role: string;
  experience: number;
  skills: string[];
};

type CandidateScore = {
  technical: number;
  experience: number;
  communication: number;
  cultureFit: number;
  total: number;
  reasoning: string;
};

type RankedCandidate = {
  candidateId: string;
  score: CandidateScore;
  rank: number;
  shortlisted: boolean;
};

/* ------------------------------------------------------------------ */
/* 🧠 AGENTS */
/* ------------------------------------------------------------------ */

const agents: Record<
  AgentRole,
  { id: AgentRole; name: string; system: string }
> = {
  "hr-agent": {
    id: "hr-agent",
    name: "HR Agent",
    system:
      "You are an expert HR AI. You evaluate candidates, rank them, and recommend hiring decisions.",
  },
  "compliance-agent": {
    id: "compliance-agent",
    name: "Compliance Agent",
    system:
      "You ensure hiring and HR processes comply with legal and regulatory standards.",
  },
  "iso-agent": {
    id: "iso-agent",
    name: "ISO Agent",
    system:
      "You enforce ISO standards, governance rules, and audit compliance.",
  },
};

/* ------------------------------------------------------------------ */
/* 🧰 TOOL SYSTEM (typed, extensible) */
/* ------------------------------------------------------------------ */

const tools = {
  screenCandidates: {
    id: "screenCandidates",
    description: "Score and rank candidates for a job description",
    run: async (input: { jd: string; candidates: Candidate[] }) => {
      const scored: RankedCandidate[] = input.candidates.map((c) => {
        const score: CandidateScore = {
          technical: Math.random() * 10,
          experience: Math.random() * 10,
          communication: Math.random() * 10,
          cultureFit: Math.random() * 10,
          total: 0,
          reasoning: "Auto-generated scoring simulation",
        };

        score.total =
          score.technical * 0.35 +
          score.experience * 0.3 +
          score.communication * 0.2 +
          score.cultureFit * 0.15;

        return {
          candidateId: c.id,
          score,
          rank: 0,
          shortlisted: false,
        };
      });

      const ranked = scored
        .sort((a, b) => b.score.total - a.score.total)
        .map((c, i) => ({
          ...c,
          rank: i + 1,
          shortlisted: c.score.total >= 7.5,
        }));

      return {
        jd: input.jd,
        ranked,
        shortlisted: ranked.filter((c) => c.shortlisted),
      };
    },
  },

  generateInterviewQuestions: {
    id: "generateInterviewQuestions",
    description: "Generate interview questions for a candidate",
    run: async (input: { role: string; skills: string[] }) => {
      return [
        `Describe your experience with ${input.role}`,
        `What challenges have you faced using ${input.skills.slice(0, 2).join(", ")}?`,
        `Explain a difficult problem you solved recently`,
      ];
    },
  },
};

/* ------------------------------------------------------------------ */
/* 🧠 FAKE LLM (replace with Claude / OpenAI / Vercel AI SDK) */
/* ------------------------------------------------------------------ */

async function fakeLLM(system: string, prompt: string) {
  return `[${system}] Response:\n\n${prompt}`;
}

/* ------------------------------------------------------------------ */
/* 🧠 ROUTER */
/* ------------------------------------------------------------------ */

export const agentRouter = router({
  /* -------------------------------------------------------------- */
  /* LIST AGENTS */
  /* -------------------------------------------------------------- */
  list: publicProcedure.query(() =>
    Object.values(agents).map(({ id, name }) => ({ id, name }))
  ),

  /* -------------------------------------------------------------- */
  /* GET AGENT */
  /* -------------------------------------------------------------- */
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => agents[input.id as AgentRole] ?? null),

  /* -------------------------------------------------------------- */
  /* CHAT (multi-agent reasoning entrypoint) */
  /* -------------------------------------------------------------- */
  chat: protectedProcedure
    .input(
      z.object({
        agentId: z.string(),
        message: z.string(),
        sessionId: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const agent = agents[input.agentId as AgentRole];

      if (!agent) throw new Error("Agent not found");

      const sessionId = input.sessionId ?? randomUUID();

      const response = await fakeLLM(agent.system, input.message);

      const messages: AgentMessage[] = [
        {
          id: randomUUID(),
          role: "user",
          content: input.message,
          timestamp: Date.now(),
        },
        {
          id: randomUUID(),
          role: "assistant",
          content: response,
          timestamp: Date.now(),
        },
      ];

      return {
        sessionId,
        agentId: agent.id,
        messages,
      };
    }),

  /* -------------------------------------------------------------- */
  /* TOOL EXECUTION (typed + safe dispatch) */
  /* -------------------------------------------------------------- */
  executeTool: protectedProcedure
    .input(
      z.object({
        agentId: z.string(),
        toolId: z.string(),
        parameters: z.record(z.any()),
      })
    )
    .mutation(async ({ input }) => {
      const tool = tools[input.toolId as keyof typeof tools];

      if (!tool) {
        throw new Error(`Tool not found: ${input.toolId}`);
      }

      const result = await (tool.run as (p: any) => Promise<any>)(input.parameters);

      return {
        success: true,
        agentId: input.agentId,
        toolId: input.toolId,
        result,
        timestamp: Date.now(),
      };
    }),

  /* -------------------------------------------------------------- */
  /* HR PIPELINE (FULL RECRUITMENT AGENT) */
  /* -------------------------------------------------------------- */
  hrScreen: protectedProcedure
    .input(
      z.object({
        jd: z.string(),
        candidates: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            role: z.string(),
            experience: z.number(),
            skills: z.array(z.string()),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      // Step 1: run screening tool
      const result = await tools.screenCandidates.run({
        jd: input.jd,
        candidates: input.candidates as Candidate[],
      });

      // Step 2: generate interview questions per shortlisted candidate
      const enriched = await Promise.all(
        result.ranked.map(async (c) => {
          const candidate = input.candidates.find(
            (x) => x.id === c.candidateId
          );

          const questions = await tools.generateInterviewQuestions.run({
            role: candidate?.role ?? "",
            skills: candidate?.skills ?? [],
          } as { role: string; skills: string[] });

          return {
            ...c,
            interviewQuestions: questions,
          };
        })
      );

      return {
        jd: input.jd,
        ranked: enriched,
        shortlisted: enriched.filter((c) => c.shortlisted),
        summary: `Processed ${input.candidates.length} candidates`,
      };
    }),

  /* -------------------------------------------------------------- */
  /* STUBS (compatibility / legacy hooks) */
  /* -------------------------------------------------------------- */
  employeeOnboard: protectedProcedure.mutation(() => ({
    success: true,
    message: "Onboarded via agent system",
  })),

  expatVisaApply: protectedProcedure
    .input(z.object({ nationality: z.string() }))
    .mutation(() => ({
      success: true,
      visaStatus: "PENDING",
      note: "Processed by compliance agent",
    })),
});