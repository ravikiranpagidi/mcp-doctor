import { createFinding } from "../finding.js";
import { createRule } from "./helpers.js";

export const envFilesRule = createRule({
  id: "env-files",
  title: "Secrets are not committed",
  category: "security",
  defaultSeverity: "high",
  async run(context) {
    const committedEnvFiles = context.files.filter((file) => {
      const name = file.name.toLowerCase();
      if (!name.startsWith(".env")) return false;
      return !name.includes("example") && !name.includes("sample") && !name.includes("template");
    });

    return committedEnvFiles.map((file) => createFinding(this, {
      path: file.path,
      message: "A real .env-style file appears to be present in the repository.",
      recommendation: "Remove secrets from the repository and keep only .env.example with placeholder values."
    }));
  }
});
