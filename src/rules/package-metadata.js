import { createFinding } from "../finding.js";
import { createRule, hasAnyPath } from "./helpers.js";

const manifestPaths = [
  "package.json",
  "pyproject.toml",
  "requirements.txt",
  "go.mod",
  "Cargo.toml",
  "pom.xml"
];

export const packageMetadataRule = createRule({
  id: "package-metadata",
  title: "Project metadata is discoverable",
  category: "maintainability",
  defaultSeverity: "medium",
  async run(context) {
    const findings = [];
    const hasManifest = hasAnyPath(context, manifestPaths);

    if (!hasManifest) {
      findings.push(createFinding(this, {
        message: "No common project manifest was found, so contributors may not know how to install or run the server.",
        recommendation: "Add package.json, pyproject.toml, go.mod, Cargo.toml, or another clear project manifest."
      }));
      return findings;
    }

    if (await context.fileExists("package.json")) {
      const pkg = await context.readJson("package.json");
      const searchable = [
        pkg.name,
        pkg.description,
        ...(Array.isArray(pkg.keywords) ? pkg.keywords : [])
      ].join(" ").toLowerCase();

      if (!searchable.includes("mcp") && !searchable.includes("model context protocol")) {
        findings.push(createFinding(this, {
          severity: "low",
          path: "package.json",
          message: "package.json does not make the MCP purpose obvious in name, description, or keywords.",
          recommendation: "Add MCP-related keywords and a short description so the project is easier to discover."
        }));
      }
    }

    return findings;
  }
});
