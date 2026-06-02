# mcp-asub-ax

Statistics and Research Åland (ÅSUB) PxWeb MCP.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 701+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `subjects` | Navigate the subject tree. Empty path returns the database list (drill into "Statistik"); items have type "l" (folder) or "t" (table, id ends in ".px"). |
| `table_meta` | Table definition (dimensions, valid values). Path must end in the ".px" table id. |
| `query_table` | Pull data from a table. body is a PxWeb query object. Mind PxWeb cell limits — narrow each dimension via selection.values. |

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

Or connect to the full Pipeworx gateway for access to all 701+ data sources:

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

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
