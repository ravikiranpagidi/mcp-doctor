import fs from "node:fs/promises";
import path from "node:path";
import { createContext } from "./context.js";
import { rules as builtinRules } from "./rules/index.js";
import { calculateScore, countBySeverity } from "./severity.js";

export async function scanProject(options = {}) {
  const cwd = path.resolve(options.cwd ?? ".");
  const config = await loadConfig(cwd, options.configPath);
  const ruleSet = selectRules(builtinRules, {
    onlyRules: options.onlyRules ?? config.onlyRules ?? [],
    skipRules: [...(options.skipRules ?? []), ...(config.skipRules ?? [])]
  });

  const context = await createContext(cwd, config);
  const findings = [];

  for (const rule of ruleSet) {
    const ruleFindings = await rule.run(context);
    findings.push(...ruleFindings);
  }

  const counts = countBySeverity(findings);

  return {
    tool: "mcp-doctor",
    version: "0.1.0",
    cwd,
    scannedAt: new Date().toISOString(),
    summary: {
      score: calculateScore(findings),
      filesScanned: context.files.length,
      rulesRun: ruleSet.length,
      findings: findings.length,
      counts
    },
    findings
  };
}

function selectRules(rules, { onlyRules, skipRules }) {
  const only = new Set(onlyRules);
  const skip = new Set(skipRules);

  return rules.filter((rule) => {
    if (only.size > 0 && !only.has(rule.id)) return false;
    return !skip.has(rule.id);
  });
}

async function loadConfig(cwd, explicitPath) {
  const candidates = explicitPath
    ? [path.resolve(cwd, explicitPath)]
    : [
        path.join(cwd, ".mcp-doctor.json"),
        path.join(cwd, "mcp-doctor.config.json")
      ];

  for (const candidate of candidates) {
    try {
      const raw = await fs.readFile(candidate, "utf8");
      return JSON.parse(raw);
    } catch (error) {
      if (error.code === "ENOENT") continue;
      throw new Error(`Could not read config at ${candidate}: ${error.message}`);
    }
  }

  return {};
}
