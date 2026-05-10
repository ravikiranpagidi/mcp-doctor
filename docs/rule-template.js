import { createFinding } from "../src/finding.js";
import { createRule } from "../src/rules/helpers.js";

export const exampleRule = createRule({
  id: "example-rule",
  title: "Example rule title",
  category: "contributor-experience",
  defaultSeverity: "low",
  async run(context) {
    const hasPackageJson = await context.fileExists("package.json");

    if (hasPackageJson) {
      return [];
    }

    return [createFinding(this, {
      message: "Explain the issue in plain language.",
      recommendation: "Give the maintainer one clear next step."
    })];
  }
});
