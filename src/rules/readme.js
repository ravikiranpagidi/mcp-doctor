import { createFinding } from "../finding.js";
import { createRule, findReadme } from "./helpers.js";

export const readmeRule = createRule({
  id: "readme",
  title: "README explains how to run the server",
  category: "contributor-experience",
  defaultSeverity: "medium",
  async run(context) {
    const readme = findReadme(context);
    if (!readme) {
      return [createFinding(this, {
        message: "No README was found.",
        recommendation: "Add a README with install steps, local run instructions, available tools, and example client usage."
      })];
    }

    const content = (await context.readText(readme.path)).toLowerCase();
    const hasRunInstructions = /npm|pnpm|yarn|uv|python|docker|run|start/.test(content);
    const mentionsTools = /tool|tools|capabilit|mcp/.test(content);

    if (!hasRunInstructions || !mentionsTools) {
      return [createFinding(this, {
        severity: "low",
        path: readme.path,
        message: "README exists, but it does not clearly cover both run instructions and MCP tool capabilities.",
        recommendation: "Add a quick start and a short list of exposed MCP tools."
      })];
    }

    return [];
  }
});
