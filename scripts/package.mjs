import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { zipSync } from "fflate";

async function collect(directory, root = directory) {
  const files = {};
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) Object.assign(files, await collect(path, root));
    else
      files[relative(root, path).replaceAll("\\", "/")] = new Uint8Array(
        await readFile(path),
      );
  }
  return files;
}

await mkdir("release", { recursive: true });
await rm("release/jira-ticket-to-markdown-0.1.0.zip", { force: true });
await writeFile(
  "release/jira-ticket-to-markdown-0.1.0.zip",
  zipSync(await collect("dist"), { level: 9 }),
);
