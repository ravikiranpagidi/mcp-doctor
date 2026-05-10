import fs from "node:fs/promises";
import path from "node:path";

const ignoredDirectories = new Set([
  ".git",
  "node_modules",
  "dist",
  "build",
  "coverage",
  ".next",
  ".venv",
  "venv",
  "__pycache__"
]);

const textExtensions = new Set([
  ".cjs",
  ".js",
  ".json",
  ".jsx",
  ".md",
  ".mjs",
  ".py",
  ".rb",
  ".rs",
  ".toml",
  ".ts",
  ".tsx",
  ".txt",
  ".yaml",
  ".yml"
]);

export async function createContext(cwd, config = {}) {
  const files = await walk(cwd, {
    maxFiles: config.maxFiles ?? 3000
  });

  return {
    cwd,
    config,
    files,
    fileExists: (relativePath) => fileExists(path.join(cwd, relativePath)),
    readText: (relativePath) => readText(path.join(cwd, relativePath)),
    readJson: (relativePath) => readJson(path.join(cwd, relativePath)),
    findFiles: (predicate) => files.filter(predicate),
    grep: (pattern, options = {}) => grepFiles(cwd, files, pattern, options)
  };
}

async function walk(root, options) {
  const result = [];

  async function visit(directory) {
    if (result.length >= options.maxFiles) return;

    let entries = [];
    try {
      entries = await fs.readdir(directory, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      const absolutePath = path.join(directory, entry.name);
      const relativePath = path.relative(root, absolutePath).replaceAll("\\", "/");

      if (entry.isDirectory()) {
        if (!ignoredDirectories.has(entry.name)) {
          await visit(absolutePath);
        }
        continue;
      }

      if (!entry.isFile()) continue;

      result.push({
        path: relativePath,
        absolutePath,
        name: entry.name,
        extension: path.extname(entry.name).toLowerCase()
      });

      if (result.length >= options.maxFiles) break;
    }
  }

  await visit(root);
  return result;
}

async function fileExists(absolutePath) {
  try {
    await fs.access(absolutePath);
    return true;
  } catch {
    return false;
  }
}

async function readText(absolutePath) {
  return fs.readFile(absolutePath, "utf8");
}

async function readJson(absolutePath) {
  return JSON.parse(await readText(absolutePath));
}

async function grepFiles(cwd, files, pattern, options) {
  const extensions = options.extensions ? new Set(options.extensions) : textExtensions;
  const matches = [];

  for (const file of files) {
    if (!extensions.has(file.extension)) continue;
    if (options.paths && !options.paths.some((prefix) => file.path.startsWith(prefix))) continue;

    let content = "";
    try {
      content = await fs.readFile(path.join(cwd, file.path), "utf8");
    } catch {
      continue;
    }

    const lines = content.split(/\r?\n/);
    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index];
      if (pattern.test(line)) {
        matches.push({
          path: file.path,
          line: index + 1,
          text: line.trim()
        });
      }
    }
  }

  return matches;
}
