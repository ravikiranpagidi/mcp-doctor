# Demo MCP Server

This is a tiny fixture used by MCP Doctor examples and tests.

## Run

```bash
node src/server.js
```

## Tools

- `read_weather`: returns a fake weather response

## Security Notes

This demo uses no external auth because it has no real data access. Production servers should use authentication, scoped permissions, audit logs, and tracing.
