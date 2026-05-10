# MCP Doctor

MCP Doctor is a friendly production-readiness scanner for Model Context Protocol servers.

It helps developers answer one simple question:

> Is this MCP server safe, observable, documented, and friendly enough for real users?

The first version focuses on practical checks that contributors can understand and extend:

- risky tools that touch files, shell commands, network calls, or databases
- missing authentication and permission documentation
- missing audit logs, tracing, or monitoring
- committed `.env` files
- risky package lifecycle scripts
- missing README, tests, examples, and CI

## Quick Start

```bash
npx mcp-doctor scan ./my-mcp-server
```

Or run it from a clone:

```bash
npm install
npm test
npm start
```

This project intentionally has no runtime dependencies. If you have Node.js 18 or newer, you can run the scanner and tests.

## Example Output

```text
MCP Doctor
Path: /workspace/weather-server
Score: 67/100
Findings: 1 high, 2 medium, 1 low, 0 info

[HIGH] dangerous-tools (src/server.ts:42)
  A tool-like operation appears risky, and no obvious confirmation or permission boundary was found.
  Fix: Add an approval flow, scoped permissions, input validation, and audit logging around risky tools.
```

## CLI

```bash
mcp-doctor scan [path]
mcp-doctor scan [path] --json
mcp-doctor scan [path] --fail-level high
mcp-doctor scan [path] --only dangerous-tools,auth-boundary
mcp-doctor scan [path] --skip readme,ci-present
mcp-doctor --list-rules
```

## Configuration

Add `.mcp-doctor.json` to the project you are scanning:

```json
{
  "skipRules": ["ci-present"],
  "maxFiles": 3000
}
```

## Built-In Rules

| Rule | Category | Purpose |
| --- | --- | --- |
| `package-metadata` | maintainability | Checks whether project metadata is discoverable. |
| `readme` | contributor experience | Checks whether the README explains usage and tools. |
| `dangerous-tools` | security | Looks for risky tool-like file, shell, network, or database operations. |
| `auth-boundary` | security | Checks whether auth, scopes, or permissions are documented. |
| `audit-logging` | observability | Checks whether tool calls can be logged, traced, or audited. |
| `lifecycle-scripts` | supply chain | Flags install-time package scripts. |
| `env-files` | security | Flags committed `.env` files. |
| `tests-present` | contributor experience | Checks for visible tests. |
| `examples-present` | contributor experience | Checks for examples. |
| `ci-present` | contributor experience | Checks for CI workflows. |

## Why This Exists

MCP makes it easier to connect agents to real tools. That also means a small server can expose powerful actions: files, databases, browsers, internal APIs, cloud resources, or shell commands.

MCP Doctor is not a formal security audit. It is a fast first pass that helps maintainers find obvious gaps before a server is shared, installed, or used in production.

## Contributor-Friendly Roadmap

Good first issues:

- add new rules for Python MCP servers
- improve dangerous tool detection
- add SARIF output for GitHub code scanning
- add Markdown output for pull request comments
- add framework-specific checks for popular MCP SDKs
- add an `--init` command that creates a starter config
- add OpenTelemetry-specific tracing checks
- add a curated ruleset for enterprise MCP servers

See [CONTRIBUTING.md](./CONTRIBUTING.md) and [docs/writing-rules.md](./docs/writing-rules.md).

## License

MIT
