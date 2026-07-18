/** Temporary probe: NodeNext-style .js import from src/. Delete once chat works. */
import { NAME } from "../src/data.js";

interface NodeRequest {
  method?: string;
}
interface NodeResponse {
  status(code: number): NodeResponse;
  json(body: unknown): void;
}

export default function handler(_req: NodeRequest, res: NodeResponse): void {
  res.status(200).json({ style: "js", name: NAME });
}
