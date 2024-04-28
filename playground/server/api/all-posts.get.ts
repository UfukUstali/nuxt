import { readFile } from "node:fs/promises";

export default defineEventHandler(async (event) => {
  const { server } = getQuery(event);
  const posts = (
    await readFile(
      `playground/${server ? "server" : "client"}posts.txt`,
      "utf-8"
    ).catch(() => "")
  ).split("\n");
  return {
    posts,
  };
});
