interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * Statistics and Research Åland (ÅSUB) PxWeb MCP.
 *
 * Keyless PxWeb API. Navigation: GET the base for the database list (returns
 * {dbid}: "Statistik" and "Utredning"), then drill into the "Statistik"
 * database where the folder/table tree lives. Tree items have type "l"
 * (folder) or "t" (table); table ids carry a ".px" suffix (e.g. "BE006.px").
 * Some folder ids contain spaces/non-ASCII characters (Swedish) — pass them
 * through verbatim (they are URL-encoded before the request). Metadata is a
 * GET on the full table path; data is a POST of a PxWeb query body to the same
 * path.
 *
 * PxWeb enforces a per-response cell limit (rows × columns of selected values).
 * Narrow each dimension via selection.values to stay under it; an over-large
 * selection returns a non-200 error.
 */


const BASE = 'https://pxweb.asub.ax/PXWeb/api/v1/en';
const UA = 'pipeworx-mcp-asub-ax/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  {
    name: 'subjects',
    description: 'Navigate the subject tree. Empty path returns the database list (drill into "Statistik"); items have type "l" (folder) or "t" (table, id ends in ".px").',
    inputSchema: {
      type: 'object',
      properties: { path: { type: 'string', description: 'Sub-path under the API base (default empty = database list). e.g. "Statistik" or "Statistik/BE".' } },
    },
  },
  {
    name: 'table_meta',
    description: 'Table definition (dimensions, valid values). Path must end in the ".px" table id.',
    inputSchema: {
      type: 'object',
      properties: { path: { type: 'string', description: 'e.g. "Statistik/BE/Befolkningsrörelsen/BE006.px"' } },
      required: ['path'],
    },
  },
  {
    name: 'query_table',
    description: 'Pull data from a table. body is a PxWeb query object. Mind PxWeb cell limits — narrow each dimension via selection.values.',
    inputSchema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'e.g. "Statistik/BE/Befolkningsrörelsen/BE006.px"' },
        body: { type: 'object', description: '{query: [{code, selection: {filter, values}}], response: {format: "json-stat2"}}' },
      },
      required: ['path', 'body'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'subjects': {
      const path = (args.path as string | undefined)?.replace(/^\/+|\/+$/g, '') ?? '';
      return asubGet(path ? `/${encodePath(path)}/` : '/');
    }
    case 'table_meta':
      return asubGet(`/${encodePath(reqStr(args, 'path', '"Statistik/BE/Befolkningsrörelsen/BE006.px"').replace(/^\/+|\/+$/g, ''))}`);
    case 'query_table': {
      const path = reqStr(args, 'path', '"Statistik/BE/Befolkningsrörelsen/BE006.px"').replace(/^\/+|\/+$/g, '');
      const body = args.body;
      if (!body || typeof body !== 'object') throw new Error('body must be a PxWeb query object.');
      const res = await fetch(`${BASE}/${encodePath(path)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'User-Agent': UA },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`ÅSUB: ${res.status} ${await res.text().then((t) => t.slice(0, 200))}`);
      return res.json();
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function asubGet(path: string): Promise<unknown> {
  const res = await fetch(`${BASE}${path}`, { headers: { Accept: 'application/json', 'User-Agent': UA } });
  if (!res.ok) throw new Error(`ÅSUB: ${res.status} ${await res.text().then((t) => t.slice(0, 200))}`);
  return res.json();
}

function encodePath(path: string): string {
  return path.split('/').map(encodeURIComponent).join('/');
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
