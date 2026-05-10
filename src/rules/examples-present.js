import { createFinding } from "../finding.js";
import { createRule, hasFile } from "./helpers.js";

export const examplesPresentRule = createRule({
  id: "examples-present",
  title: "Examples help new users start quickly",
  category: "contributor-experience",
  defaultSeverity: "low",
  async run(context) {
    const hasExamples = hasFile(context, (file) => {
      return file.path.startsWith("examples/") || file.path.startsWith("sample/") || file.path.startsWith("samples/");
    });

    if (hasExamples) {
      return [];
    }

    return [createFinding(this, {
      message: "No examples directory was found.",
      recommendation: "Add a minimal example server or client configuration that people can copy and run."
    })];
  }
});
