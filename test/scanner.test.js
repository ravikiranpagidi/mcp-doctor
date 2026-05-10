import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { scanProject } from "../src/scanner.js";

test("reports missing README for a minimal project", async () => {
  const dir = await tempProject();
  await writeJson(path.join(dir, "package.json"), {
    name: "demo-mcp-server",
    keywords: ["mcp"]
  });

  const result = await scanProject({ cwd: dir, onlyRules: ["readme"] });

  assert.equal(result.summary.findings, 1);
  assert.equal(result.findings[0].ruleId, "readme");
  assert.equal(result.findings[0].severity, "medium");
});

test("flags committed env files but allows examples", async () => {
  const dir = await tempProject();
  await fs.writeFile(path.join(dir, ".env"), "TOKEN=real-secret");
  await fs.writeFile(path.join(dir, ".env.example"), "TOKEN=placeholder");

  const result = await scanProject({ cwd: dir, onlyRules: ["env-files"] });

  assert.equal(result.summary.findings, 1);
  assert.equal(result.findings[0].path, ".env");
});

test("flags dangerous tool-like operations without safety language", async () => {
  const dir = await tempProject();
  await fs.mkdir(path.join(dir, "src"));
  await fs.writeFile(path.join(dir, "src", "server.js"), `
    server.tool("delete_file", async function deleteFile(input) {
      return unlink(input.path);
    });
  `);

  const result = await scanProject({ cwd: dir, onlyRules: ["dangerous-tools"] });

  assert.equal(result.summary.findings, 1);
  assert.equal(result.findings[0].ruleId, "dangerous-tools");
  assert.equal(result.findings[0].severity, "high");
});

test("config can skip rules", async () => {
  const dir = await tempProject();
  await writeJson(path.join(dir, "package.json"), { name: "demo" });
  await writeJson(path.join(dir, ".mcp-doctor.json"), {
    skipRules: ["readme"]
  });

  const result = await scanProject({ cwd: dir });
  assert.equal(result.findings.some((finding) => finding.ruleId === "readme"), false);
});

async function tempProject() {
  return fs.mkdtemp(path.join(os.tmpdir(), "mcp-doctor-"));
}

async function writeJson(filePath, value) {
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`);
}
