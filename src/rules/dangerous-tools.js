import { createFinding } from "../finding.js";
import { createRule, projectHasText, sourceExtensions } from "./helpers.js";

const dangerousPattern = /\b(delete|remove|unlink|rmdir|exec|shell|spawn|command|writefile|readfile|fetch|request|sql)\b|delete_file|remove_file|write_file|read_file|run_command|sql_query/i;
const toolPattern = /\b(tool|registertool|server\.tool|name\s*:|function|def)\b/i;
const safetyPattern = /\b(confirm|approval|allowlist|denylist|permission|scope|dry run|dry-run|human|review)\b/i;

export const dangerousToolsRule = createRule({
  id: "dangerous-tools",
  title: "Risky tools have a safety boundary",
  category: "security",
  defaultSeverity: "high",
  async run(context) {
    const matches = (await context.grep(dangerousPattern, { extensions: sourceExtensions }))
      .filter((match) => !isNonProductionPath(match.path));
    const suspicious = matches.filter((match) => toolPattern.test(match.text));

    if (suspicious.length === 0) {
      return [];
    }

    const hasSafetyLanguage = await projectHasText(context, safetyPattern, {
      extensions: [".md", ".js", ".mjs", ".cjs", ".ts", ".tsx", ".py", ".json"]
    });

    if (hasSafetyLanguage) {
      return [createFinding(this, {
        severity: "medium",
        path: `${suspicious[0].path}:${suspicious[0].line}`,
        message: "A tool-like operation appears to touch files, commands, network requests, or data access. Safety language was found, but this still deserves review.",
        recommendation: "Confirm the tool has explicit permissions, input validation, audit logs, and clear failure behavior."
      })];
    }

    return [createFinding(this, {
      path: `${suspicious[0].path}:${suspicious[0].line}`,
      message: "A tool-like operation appears risky, and no obvious confirmation or permission boundary was found.",
      recommendation: "Add an approval flow, scoped permissions, input validation, and audit logging around risky tools."
    })];
  }
});

function isNonProductionPath(filePath) {
  return /(^|\/)(test|tests|__tests__|docs|examples)(\/|$)/i.test(filePath)
    || /\.(test|spec)\.[cm]?[jt]sx?$/i.test(filePath);
}
