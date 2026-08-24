import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { zipSync } from "fflate";

const manifest = JSON.parse(await readFile("manifest.json", "utf8"));
const packagePath = `release/jira-ticket-to-markdown-${manifest.version}.zip`;

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
await rm(packagePath, { force: true });
await writeFile(packagePath, zipSync(await collect("dist"), { level: 9 }));
