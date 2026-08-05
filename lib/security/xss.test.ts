/** Unit tests — lib/security/xss.ts */
import { describe, it, expect } from "vitest";
import { sanitizeHtml, escapeHtml, safeJsonStringify } from "./xss";

describe("sanitizeHtml", () => {
  it("passes safe HTML through unchanged", () => {
    const safe = "<p>Hello <strong>world</strong></p>";
    expect(sanitizeHtml(safe)).toContain("Hello");
    expect(sanitizeHtml(safe)).toContain("world");
  });

  it("strips <script> tags", () => {
    const xss = '<p>Hi</p><script>alert("xss")</script>';
    const result = sanitizeHtml(xss);
    expect(result).not.toContain("<script>");
    expect(result).not.toContain("alert");
  });

  it("strips inline event handlers (onerror)", () => {
    const xss = '<img src="x" onerror="alert(1)">';
    const result = sanitizeHtml(xss);
    expect(result).not.toContain("onerror");
  });

  it("strips onclick attributes", () => {
    const xss = '<div onclick="evil()">click</div>';
    expect(sanitizeHtml(xss)).not.toContain("onclick");
  });

  it("strips <iframe>", () => {
    const xss = '<iframe src="https://evil.com"></iframe>';
    expect(sanitizeHtml(xss)).not.toContain("iframe");
  });

  it("strips <form> elements", () => {
    const xss = '<form action="//evil.com"><input name="cc"></form>';
    expect(sanitizeHtml(xss)).not.toContain("<form");
  });

  it("allows safe block-level elements", () => {
    const html = "<h2>Title</h2><ul><li>Item</li></ul>";
    const result = sanitizeHtml(html);
    expect(result).toContain("Title");
    expect(result).toContain("Item");
  });

  it("allows safe anchor with href", () => {
    const html = '<a href="https://aifwms.xyz">link</a>';
    expect(sanitizeHtml(html)).toContain("href");
  });

  it("returns empty string for empty input", () => {
    expect(sanitizeHtml("")).toBe("");
  });
});

describe("escapeHtml", () => {
  it("escapes ampersand", () => expect(escapeHtml("A & B")).toBe("A &amp; B"));
  it("escapes less-than", () => expect(escapeHtml("<div>")).toBe("&lt;div&gt;"));
  it("escapes double-quotes", () => expect(escapeHtml('"hi"')).toBe("&quot;hi&quot;"));
  it("escapes single-quotes", () => expect(escapeHtml("it's")).toBe("it&#039;s"));
  it("leaves safe text unchanged", () => expect(escapeHtml("Hello World 123")).toBe("Hello World 123"));
  it("escapes script tag literal", () => {
    expect(escapeHtml("<script>alert(1)</script>")).toBe("&lt;script&gt;alert(1)&lt;/script&gt;");
  });
});

describe("safeJsonStringify", () => {
  it("serialises a plain object", () => {
    const obj = { name: "Alice", age: 30 };
    expect(JSON.parse(safeJsonStringify(obj))).toEqual(obj);
  });

  it("escapes </script> to prevent XSS in inline JSON", () => {
    const malicious = { payload: "</script><script>alert(1)</script>" };
    const result = safeJsonStringify(malicious);
    expect(result).not.toContain("</script>");
    expect(result).toContain("\\u003c/script>");
  });

  it("handles nested objects", () => {
    const nested = { a: { b: { c: 42 } } };
    expect(JSON.parse(safeJsonStringify(nested))).toEqual(nested);
  });

  it("handles arrays", () => {
    const arr = [1, "two", true, null];
    expect(JSON.parse(safeJsonStringify(arr))).toEqual(arr);
  });
});
