/** Unit tests — lib/security/ssrf.ts */
import { describe, it, expect } from "vitest";
import { isSafeUrl } from "./ssrf";

describe("isSafeUrl — allowed domains", () => {
  it("allows aifwms.xyz", () => expect(isSafeUrl("https://aifwms.xyz/api")).toBe(true));
  it("allows www.aifwms.xyz subdomain", () => expect(isSafeUrl("https://www.aifwms.xyz/path")).toBe(true));
  it("allows api.openai.com", () => expect(isSafeUrl("https://api.openai.com/v1/chat")).toBe(true));
  it("allows api.anthropic.com", () => expect(isSafeUrl("https://api.anthropic.com/v1")).toBe(true));
  it("allows api.ollama.ai", () => expect(isSafeUrl("https://api.ollama.ai")).toBe(true));
  it("allows api.deepseek.com", () => expect(isSafeUrl("https://api.deepseek.com")).toBe(true));
});

describe("isSafeUrl — blocked protocols", () => {
  it("blocks file:// protocol", () => expect(isSafeUrl("file:///etc/passwd")).toBe(false));
  it("blocks ftp:// protocol", () => expect(isSafeUrl("ftp://aifwms.xyz")).toBe(false));
  it("blocks javascript: URI", () => expect(isSafeUrl("javascript:alert(1)")).toBe(false));
  it("blocks data: URI", () => expect(isSafeUrl("data:text/html,<h1>hi</h1>")).toBe(false));
});

describe("isSafeUrl — private / internal IP ranges (SSRF)", () => {
  it("blocks 10.x.x.x", () => expect(isSafeUrl("http://10.0.0.1/internal")).toBe(false));
  it("blocks 192.168.x.x", () => expect(isSafeUrl("http://192.168.1.1")).toBe(false));
  it("blocks 172.16.x.x", () => expect(isSafeUrl("http://172.16.0.1")).toBe(false));
  it("blocks 172.31.x.x", () => expect(isSafeUrl("http://172.31.255.255")).toBe(false));
  it("blocks 169.254.x.x (link-local / AWS metadata)", () => expect(isSafeUrl("http://169.254.169.254/latest/meta-data/")).toBe(false));
  it("blocks 0.0.0.0", () => expect(isSafeUrl("http://0.0.0.0")).toBe(false));
});

describe("isSafeUrl — loopback in non-production (NODE_ENV=test)", () => {
  // In test env, loopback is allowed (for local Ollama etc.)
  it("allows localhost in test env", () => expect(isSafeUrl("http://localhost:11434")).toBe(true));
  it("allows 127.0.0.1 in test env", () => expect(isSafeUrl("http://127.0.0.1:3000")).toBe(true));
});

describe("isSafeUrl — unlisted external domains", () => {
  it("blocks arbitrary external domain", () => expect(isSafeUrl("https://evil.com/exfil")).toBe(false));
  it("blocks domain that partially matches an allowed domain", () => expect(isSafeUrl("https://notaifwms.xyz")).toBe(false));
  it("blocks invalid URL", () => expect(isSafeUrl("not-a-url")).toBe(false));
});
