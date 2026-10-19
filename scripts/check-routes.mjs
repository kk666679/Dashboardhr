import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative, sep } from "node:path";

const root = process.cwd();
const appRoot = join(root, "app");
const pageRoutes = new Set();
const references = new Map();
const duplicateRefs = new Map();

function walk(directory, visit) {
  if (!existsSync(directory)) return;
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const file = join(directory, entry.name);
    if (entry.isDirectory()) walk(file, visit);
    else visit(file, entry.name);
  }
}

function routeFromPage(file) {
  const relativePath = relative(appRoot, file).split(sep).join("/");
  if (!relativePath.endsWith("/page.tsx")) return null;
  const segments = relativePath.slice(0, -"/page.tsx".length).split("/").filter(Boolean);
  if (segments[0] === "api") return null;
  return "/" + segments.map((segment) => segment.startsWith("[") ? ":dynamic" : segment).join("/");
}

walk(appRoot, (file, name) => {
  const route = routeFromPage(file);
  if (route) pageRoutes.add(route);

});

const files = [];
for (const directory of [join(root, "components"), join(root, "config"), join(root, "lib")]) {
  walk(directory, (file, name) => {
    if (/\.(ts|tsx|js|jsx|mjs)$/.test(name)) files.push(file);
  });
}

for (const file of [...new Set(files)]) {
  const content = readFileSync(file, "utf8");
  const pattern = /(?:href|push|replace|redirect|route)\s*[:=(]\s*["'`]((?:\/)[^"'`?\s]*)["'`]/g;
  for (const match of content.matchAll(pattern)) {
    const path = match[1];
    if (path.startsWith("/api/") || path.includes(":") || path.startsWith("//")) continue;
    const normalized = path.replace(/^\/(en|ms)(?=\/|$)/, "");
    const route = "/" + (normalized.split("/").map((segment) => segment.startsWith("[") ? ":dynamic" : segment).filter(Boolean).join("/") || "");
    const exists = pageRoutes.has(route) || [...pageRoutes].some((page) => {
      const pageParts = page.split("/");
      const routeParts = route.split("/");
      return pageParts.length === routeParts.length && pageParts.every((part, index) => part === routeParts[index] || part === ":dynamic");
    });
    const location = `${relative(root, file)}:${content.slice(0, match.index).split("\n").length}`;
    if (!references.has(path)) references.set(path, []);
    references.get(path).push(location);
    if (!exists) duplicateRefs.set(path, references.get(path));
  }
}

const duplicatePaths = [...references.entries()].filter(([, locations]) => locations.length > 1 && new Set(locations.map((value) => value.split(":")[0])).size > 1);
if (duplicatePaths.length) {
  console.warn(`Duplicate route references (${duplicatePaths.length}):`);
  for (const [path, locations] of duplicatePaths) console.warn(`  ${path}\n    ${locations.join("\n    ")}`);
}

const missing = [...duplicateRefs.entries()].filter(([path]) => ![...pageRoutes].some((page) => {
  const pageParts = page.split("/");
  const routeParts = path.replace(/^\/(en|ms)(?=\/|$)/, "").split("/").filter(Boolean);
  return pageParts.length === routeParts.length && pageParts.every((part, index) => part === routeParts[index] || part === ":dynamic");
}));
if (missing.length) {
  console.error(`Unresolved internal routes (${missing.length}):`);
  for (const [path, locations] of missing) console.error(`  ${path}\n    ${locations.join("\n    ")}`);
  if (process.env.ROUTE_AUDIT_STRICT === "1") process.exitCode = 1;
} else {
  console.log(`Verified ${pageRoutes.size} page routes and ${references.size} internal route references.`);
}
