# mcp-asub-ax

Statistics and Research Åland (ÅSUB) PxWeb MCP.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `subjects` | Browse the ÅSUB (Statistics Åland) PxWeb subject tree. Pass a sub-path like "Statistik" or "Statistik/BE" to list folders (type "l") and tables (type "t", id ends in ".px"); omit path to list the top-level databases (Statistik, Utredning). |
| `table_meta` | Fetch dimension definitions and valid values for an ÅSUB PxWeb table (.px file). Path must be the full table path ending in ".px" (e.g. "Statistik/BE/Befolkningsrörelsen/BE006.px"). Returns dimension codes, labels, and the value lists needed to build a query_table body. |
| `query_table` | POST a PxWeb selection query to an ÅSUB table and return the data as json-stat2. Path must end in ".px"; body is a PxWeb query object with a "query" array of {code, selection: {filter, values}} entries plus {response: {format: "json-stat2"}}. Narrow each dimension's values to stay under PxWeb's per-response cell limit. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "asub-ax": {
      "url": "https://gateway.pipeworx.io/asub-ax/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Asub Ax data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
