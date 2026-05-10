# Writing Rules

Rules are plain JavaScript objects with a small interface:

```js
export const myRule = {
  id: "my-rule",
  title: "Human-readable title",
  category: "security",
  defaultSeverity: "medium",
  async run(context) {
    return [];
  }
};
```

Add the rule to `src/rules/index.js` so the scanner can run it.

## Finding Shape

Use `createFinding(rule, values)` from `src/finding.js`:

```js
import { createFinding } from "../finding.js";

return [createFinding(this, {
  path: "src/server.ts:42",
  message: "The tool can delete files without an obvious confirmation boundary.",
  recommendation: "Require explicit user confirmation and restrict the file paths the tool can touch."
})];
```

## Context Helpers

Every rule receives a `context` object:

```js
context.cwd
context.files
context.fileExists("package.json")
context.readText("README.md")
context.readJson("package.json")
context.findFiles((file) => file.extension === ".ts")
context.grep(/server\.tool/i, { extensions: [".ts", ".js"] })
```

## Severity

Use the lowest severity that still helps the maintainer prioritize:

- `high`: likely security, secret, supply-chain, or destructive-action risk
- `medium`: production-readiness gap that should be addressed before serious use
- `low`: contributor experience or polish issue
- `info`: useful context without a strong recommendation

## Test Pattern

Use temporary directories so tests do not depend on local state:

```js
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { scanProject } from "../src/scanner.js";

test("my rule finds the expected issue", async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "mcp-doctor-"));
  await fs.writeFile(path.join(dir, "package.json"), JSON.stringify({ name: "demo" }));

  const result = await scanProject({ cwd: dir, onlyRules: ["my-rule"] });
  assert.equal(result.findings[0].ruleId, "my-rule");
});
```

## Good Rule Ideas

- MCP SDK-specific tool registration checks
- prompt-injection guidance for tools that read untrusted text
- OpenTelemetry semantic convention checks
- OAuth/resource server configuration checks
- container and Dockerfile hardening checks
- CI checks for publishing provenance and lockfiles
