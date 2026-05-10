import { createFinding } from "../finding.js";
import { createRule } from "./helpers.js";

const lifecycleScripts = new Set(["preinstall", "install", "postinstall", "prepare"]);
const riskyShellPattern = /\b(curl|wget|bash|sh|powershell|rm\s+-rf|del\s+\/|Invoke-WebRequest)\b/i;

export const lifecycleScriptsRule = createRule({
  id: "lifecycle-scripts",
  title: "Install scripts are safe to review",
  category: "supply-chain",
  defaultSeverity: "medium",
  async run(context) {
    if (!(await context.fileExists("package.json"))) {
      return [];
    }

    const pkg = await context.readJson("package.json");
    const scripts = pkg.scripts ?? {};
    const findings = [];

    for (const [name, command] of Object.entries(scripts)) {
      if (!lifecycleScripts.has(name)) continue;

      findings.push(createFinding(this, {
        severity: riskyShellPattern.test(command) ? "high" : "medium",
        path: "package.json",
        message: `package.json defines a ${name} lifecycle script: "${command}".`,
        recommendation: "Avoid automatic install-time behavior where possible. If needed, document why it is safe."
      }));
    }

    return findings;
  }
});
