/**
 * Temporary canary to isolate a FUNCTION_INVOCATION_FAILED on /api/chat:
 * zero imports, so if this also crashes the problem is project-level
 * function config, not chat.ts's import chain. Delete once chat works.
 */
interface NodeRequest {
  method?: string;
}
interface NodeResponse {
  status(code: number): NodeResponse;
  json(body: unknown): void;
}

export default function handler(_req: NodeRequest, res: NodeResponse): void {
  res.status(200).json({ ok: true, node: process.version });
}
