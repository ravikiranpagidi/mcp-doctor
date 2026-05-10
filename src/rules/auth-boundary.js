import { createFinding } from "../finding.js";
import { createRule, projectHasText } from "./helpers.js";

const authPattern = /\b(auth|oauth|token|bearer|api key|apikey|scope|permission|acl|rbac)\b/i;

export const authBoundaryRule = createRule({
  id: "auth-boundary",
  title: "Authentication and permissions are documented",
  category: "security",
  defaultSeverity: "medium",
  async run(context) {
    const hasAuth = await projectHasText(context, authPattern, {
      extensions: [".md", ".js", ".mjs", ".cjs", ".ts", ".tsx", ".py", ".json", ".yaml", ".yml"]
    });

    if (hasAuth) {
      return [];
    }

    return [createFinding(this, {
      message: "No obvious authentication, permission, token, or scope boundary was found.",
      recommendation: "Document how clients authenticate and how each tool is scoped before production use."
    })];
  }
});
