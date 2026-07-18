/** Temporary probe: explicit .ts import from src/. Delete once chat works. */
import { NAME } from "../src/data.ts";

interface NodeRequest {
  method?: string;
}
interface NodeResponse {
  status(code: number): NodeResponse;
  json(body: unknown): void;
}

export default function handler(_req: NodeRequest, res: NodeResponse): void {
  res.status(200).json({ style: "ts", name: NAME });
}
