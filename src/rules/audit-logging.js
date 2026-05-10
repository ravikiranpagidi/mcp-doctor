import { createFinding } from "../finding.js";
import { createRule, projectHasText } from "./helpers.js";

const observabilityPattern = /\b(audit|log|logger|trace|tracing|span|opentelemetry|otel|metrics|observability)\b/i;

export const auditLoggingRule = createRule({
  id: "audit-logging",
  title: "Tool calls can be audited",
  category: "observability",
  defaultSeverity: "medium",
  async run(context) {
    const hasObservability = await projectHasText(context, observabilityPattern, {
      extensions: [".md", ".js", ".mjs", ".cjs", ".ts", ".tsx", ".py", ".json", ".yaml", ".yml"]
    });

    if (hasObservability) {
      return [];
    }

    return [createFinding(this, {
      message: "No obvious logging, tracing, metrics, or audit trail was found.",
      recommendation: "Log tool calls, inputs after redaction, failures, latency, and caller identity where available."
    })];
  }
});
