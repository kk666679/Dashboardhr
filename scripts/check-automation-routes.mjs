import { readdirSync, readFileSync } from "node:fs";
import { join, relative, sep } from "node:path";

const root = process.cwd();
const automationPages = new Set();
const sourceFiles = [];

function walk(directory, onFile) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const file = join(directory, entry.name);
    if (entry.isDirectory()) walk(file, onFile);
    else onFile(file, entry.name);
  }
}

walk(join(root, "app", "dashboard", "automation"), (file, name) => {
  if (name === "page.tsx") {
    automationPages.add(`/${relative(join(root, "app"), file.slice(0, -"/page.tsx".length)).split(sep).join("/")}`);
  }
  if (/\.(ts|tsx)$/.test(name)) sourceFiles.push(file);
});

for (const directory of [
  join(root, "components", "features", "automation"),
  join(root, "components", "dashboard-sidebar"),
]) {
  walk(directory, (file, name) => {
    if (/\.(ts|tsx)$/.test(name)) sourceFiles.push(file);
  });
}

const missing = new Set();
for (const file of sourceFiles) {
  const content = readFileSync(file, "utf8");
  for (const match of content.matchAll(/["'](\/dashboard\/automation(?:\/[^?'"\s]*)?)/g)) {
    if (!automationPages.has(match[1])) missing.add(match[1]);
  }
}

if (missing.size) {
  console.error(`Missing automation routes: ${[...missing].join(", ")}`);
  process.exit(1);
}

const integrationChecks = [
  {
    file: join(root, "components", "features", "automation", "index.ts"),
    snippets: [
      'FlowDesignerWithProvider as FlowDesigner',
      'export { AutomationNavigation }',
      'export { WorkflowExecutionMonitor }',
    ],
  },
  {
    file: join(root, "app", "dashboard", "automation", "designer", "page.tsx"),
    snippets: [
      "useSearchParams()",
      'searchParams.get("flowId")',
      'searchParams.get("template")',
      'searchParams.get("standard")',
      "<FlowDesigner flowId={flowId} template={templateId} standard={standard} />",
    ],
  },
];

const failedChecks = [];
for (const { file, snippets } of integrationChecks) {
  const content = readFileSync(file, "utf8");
  for (const snippet of snippets) {
    if (!content.includes(snippet)) failedChecks.push(`${relative(root, file)}: missing ${snippet}`);
  }
}

if (failedChecks.length) {
  console.error(`Automation integration checks failed:\n${failedChecks.join("\n")}`);
  process.exit(1);
}

console.log(`Verified ${automationPages.size} automation routes, static references, and designer integration.`);
