# Contributing to MCP Doctor

Thanks for helping make MCP servers safer and easier to ship.

This repo is designed so a useful contribution can be small:

1. Add or improve one rule in `src/rules/`.
2. Add or update one test in `test/`.
3. Add a short note in the README if the rule is user-facing.

## Local Setup

```bash
npm install
npm test
node ./bin/mcp-doctor.js scan ./examples/demo-mcp-server
```

The scanner has no runtime dependencies. Node.js 18 or newer is enough.

## Project Shape

```text
bin/mcp-doctor.js        CLI entrypoint
src/scanner.js           Loads config, runs rules, returns report data
src/context.js           File discovery and helper methods for rules
src/rules/               One file per rule
src/reporters/           Console and JSON output
test/                    Node.js built-in test runner
docs/writing-rules.md    How to add a rule
```

## Rule Guidelines

Good rules are:

- easy to explain in one sentence
- conservative enough to avoid noisy findings
- actionable, with a clear recommendation
- small enough to test with a temporary fixture
- useful before a project reaches production

Avoid rules that only enforce personal style preferences.

## Pull Request Checklist

- [ ] I added or updated tests.
- [ ] I ran `npm test`.
- [ ] I updated docs when behavior changed.
- [ ] I kept findings actionable and low-noise.

## Issue Labels We Like

- `good first issue`: small rule, docs, or test work
- `rule idea`: new scan rule proposal
- `help wanted`: useful but not yet scoped
- `security`: auth, secrets, permissions, or supply-chain checks
- `observability`: logs, traces, metrics, evaluation, or audit trails
