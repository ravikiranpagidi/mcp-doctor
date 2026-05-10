#!/usr/bin/env node
import { scanProject } from "../src/scanner.js";
import { rules } from "../src/rules/index.js";
import { printConsoleReport } from "../src/reporters/console.js";
import { printJsonReport } from "../src/reporters/json.js";
import { compareSeverity, severityRank } from "../src/severity.js";

const version = "0.1.0";

async function main(argv) {
  const args = parseArgs(argv);

  if (args.help) {
    printHelp();
    return 0;
  }

  if (args.version) {
    console.log(`mcp-doctor ${version}`);
    return 0;
  }

  if (args.listRules) {
    for (const rule of rules) {
      console.log(`${rule.id.padEnd(24)} ${rule.defaultSeverity.padEnd(7)} ${rule.title}`);
    }
    return 0;
  }

  const result = await scanProject({
    cwd: args.path,
    configPath: args.config,
    onlyRules: args.onlyRules,
    skipRules: args.skipRules
  });

  if (args.format === "json") {
    printJsonReport(result);
  } else {
    printConsoleReport(result);
  }

  if (args.failLevel) {
    const shouldFail = result.findings.some((finding) => {
      return compareSeverity(finding.severity, args.failLevel) >= 0;
    });
    return shouldFail ? 1 : 0;
  }

  return 0;
}

function parseArgs(argv) {
  const parsed = {
    path: ".",
    format: "console",
    config: undefined,
    failLevel: undefined,
    onlyRules: [],
    skipRules: [],
    help: false,
    version: false,
    listRules: false
  };

  const tokens = [...argv];
  if (tokens[0] === "scan") {
    tokens.shift();
  }

  while (tokens.length > 0) {
    const token = tokens.shift();

    if (token === "--help" || token === "-h") {
      parsed.help = true;
      continue;
    }

    if (token === "--version" || token === "-v") {
      parsed.version = true;
      continue;
    }

    if (token === "--list-rules") {
      parsed.listRules = true;
      continue;
    }

    if (token === "--json") {
      parsed.format = "json";
      continue;
    }

    if (token === "--format") {
      parsed.format = expectValue(token, tokens);
      continue;
    }

    if (token === "--config") {
      parsed.config = expectValue(token, tokens);
      continue;
    }

    if (token === "--fail-level") {
      const value = expectValue(token, tokens).toLowerCase();
      if (!(value in severityRank)) {
        throw new Error(`Unknown fail level "${value}". Use low, medium, or high.`);
      }
      parsed.failLevel = value;
      continue;
    }

    if (token === "--only") {
      parsed.onlyRules = splitList(expectValue(token, tokens));
      continue;
    }

    if (token === "--skip") {
      parsed.skipRules = splitList(expectValue(token, tokens));
      continue;
    }

    if (token.startsWith("-")) {
      throw new Error(`Unknown option ${token}`);
    }

    parsed.path = token;
  }

  if (!["console", "json"].includes(parsed.format)) {
    throw new Error(`Unknown format "${parsed.format}". Use console or json.`);
  }

  return parsed;
}

function expectValue(flag, tokens) {
  const value = tokens.shift();
  if (!value || value.startsWith("-")) {
    throw new Error(`${flag} requires a value`);
  }
  return value;
}

function splitList(value) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function printHelp() {
  console.log(`mcp-doctor

Usage:
  mcp-doctor scan [path] [options]
  mcp-doctor --list-rules

Options:
  --json                  Print machine-readable JSON
  --format <console|json> Choose output format
  --config <path>         Use a JSON config file
  --only <ids>            Run only comma-separated rule ids
  --skip <ids>            Skip comma-separated rule ids
  --fail-level <level>    Exit 1 when findings include low, medium, or high
  --list-rules            Show built-in rules
  --help                  Show this help

Examples:
  mcp-doctor scan .
  mcp-doctor scan ./server --fail-level high
  mcp-doctor scan . --json
`);
}

main(process.argv.slice(2))
  .then((code) => {
    process.exitCode = code;
  })
  .catch((error) => {
    console.error(`mcp-doctor: ${error.message}`);
    process.exitCode = 1;
  });
