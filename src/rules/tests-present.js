import { createFinding } from "../finding.js";
import { createRule, hasFile } from "./helpers.js";

const testFilePattern = /(^|\/)(__tests__|tests?|specs?)(\/|$)|\.(test|spec)\.[cm]?[jt]sx?$|_test\.py$/i;

export const testsPresentRule = createRule({
  id: "tests-present",
  title: "Tests are easy to find",
  category: "contributor-experience",
  defaultSeverity: "low",
  async run(context) {
    const hasTests = hasFile(context, (file) => testFilePattern.test(file.path));
    if (hasTests) {
      return [];
    }

    return [createFinding(this, {
      message: "No test files or test directory were found.",
      recommendation: "Add at least one smoke test so contributors can verify changes before opening a PR."
    })];
  }
});
