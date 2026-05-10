import { createFinding } from "../finding.js";
import { createRule, hasFile } from "./helpers.js";

export const ciPresentRule = createRule({
  id: "ci-present",
  title: "Continuous integration runs checks",
  category: "contributor-experience",
  defaultSeverity: "low",
  async run(context) {
    const hasCi = hasFile(context, (file) => {
      return file.path.startsWith(".github/workflows/") || file.path.startsWith(".gitlab-ci") || file.path === "azure-pipelines.yml";
    });

    if (hasCi) {
      return [];
    }

    return [createFinding(this, {
      message: "No CI workflow was found.",
      recommendation: "Add a small CI workflow that runs tests on pull requests."
    })];
  }
});
