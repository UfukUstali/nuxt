import { appendFile } from "node:fs/promises";
import { existsSync } from "node:fs";

export default defineEventHandler(async (event) => {
  const { post, server } = (await readBody(event)) as {
    post: string;
    server: boolean;
  };

  const path = `playground/${server ? "server" : "client"}posts.txt`;

  if (existsSync(path)) {
    await appendFile(path, `\n${post}`);
  }
  return {};
});
