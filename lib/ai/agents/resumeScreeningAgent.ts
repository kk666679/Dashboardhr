/**
 * Resume Screening Agent — Sprint 11, Task 11.3
 *
 * Parses PDF/DOCX/TXT resumes using the AI provider fallback chain
 * (OpenAI → Anthropic → Ollama) and returns a structured scorecard.
 *
 * Requirements: 3.3, 3.4, 23.1
 */

import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";

export interface ResumeScorecard {
  name?: string;
  email?: string;
  phone?: string;
  skills: string[];
  yearsOfExperience: number;
  highestEducation?: string;
  certifications: string[];
  languages: string[];
  summary: string;
  /** 0–100 match score against the job requirements */
  score: number;
  strengths: string[];
  concerns: string[];
}

const RESUME_PARSE_PROMPT = (resumeText: string, jobRequirements: string) => `
You are an expert HR recruiter. Parse the following resume and score it against the job requirements.

RESUME:
${resumeText.slice(0, 8000)}

JOB REQUIREMENTS:
${jobRequirements.slice(0, 2000)}

Return a JSON object with exactly this structure:
{
  "name": "string or null",
  "email": "string or null",
  "phone": "string or null",
  "skills": ["skill1", "skill2"],
  "yearsOfExperience": 0,
  "highestEducation": "string or null",
  "certifications": ["cert1"],
  "languages": ["English"],
  "summary": "2-3 sentence professional summary",
  "score": 75,
  "strengths": ["strength1", "strength2"],
  "concerns": ["concern1"]
}

Score 0–100 where 100 = perfect match. Be objective and concise.
Return ONLY valid JSON, no markdown.
`;

// ─── Provider fallback chain ──────────────────────────────────────────────────

type Provider = "openai" | "anthropic" | "ollama";

const PROVIDER_CHAIN: Provider[] = ["openai", "anthropic", "ollama"];

async function tryProvider(provider: Provider, prompt: string): Promise<string> {
  if (provider === "openai") {
    const result = await generateText({
      model: openai("gpt-4o-mini"),
      prompt,
    } as any);
    return result.text;
  }
  if (provider === "anthropic") {
    const result = await generateText({
      model: anthropic("claude-3-haiku-20240307"),
      prompt,
    } as any);
    return result.text;
  }

  if (provider === "ollama") {
    const res = await fetch(
      `${process.env.OLLAMA_BASE_URL ?? "http://localhost:11434"}/api/generate`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "llama3.2", prompt, stream: false }),
      }
    );
    const json = (await res.json()) as { response: string };
    return json.response;
  }
  throw new Error(`Unknown provider: ${provider}`);
}

async function withFallback(prompt: string): Promise<string> {
  for (const provider of PROVIDER_CHAIN) {
    try {
      return await tryProvider(provider, prompt);
    } catch (err) {
      console.warn(`[resumeScreeningAgent] Provider ${provider} failed:`, (err as Error).message);
    }
  }
  throw new Error("All AI providers unavailable");
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function parseResume(
  resumeText: string,
  jobRequirements: string = ""
): Promise<ResumeScorecard> {
  const prompt = RESUME_PARSE_PROMPT(resumeText, jobRequirements);

  let raw: string;
  try {
    raw = await withFallback(prompt);
  } catch {
    // Fallback scorecard on total AI failure
    return {
      skills: [],
      yearsOfExperience: 0,
      certifications: [],
      languages: [],
      summary: "Automated parsing failed. Please review manually.",
      score: 0,
      strengths: [],
      concerns: ["Automated parsing failed"],
    };
  }

  try {
    // Strip any markdown code fences if present
    const clean = raw.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(clean) as ResumeScorecard;
    // Clamp score to 0–100
    parsed.score = Math.max(0, Math.min(100, parsed.score ?? 0));
    return parsed;
  } catch {
    return {
      skills: [],
      yearsOfExperience: 0,
      certifications: [],
      languages: [],
      summary: raw.slice(0, 200),
      score: 0,
      strengths: [],
      concerns: ["JSON parse failed — raw text stored"],
    };
  }
}

export async function scoreCandidate(
  parsedProfile: ResumeScorecard,
  requiredSkills: string[]
): Promise<number> {
  if (!requiredSkills.length) return parsedProfile.score;

  const matchCount = requiredSkills.filter((req) =>
    parsedProfile.skills.some((s) => s.toLowerCase().includes(req.toLowerCase()))
  ).length;

  const skillMatch = (matchCount / requiredSkills.length) * 60;
  const aiScore = parsedProfile.score * 0.4;

  return Math.round(skillMatch + aiScore);
}
