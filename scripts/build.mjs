import { cp, mkdir, readFile, rm } from "node:fs/promises";
import { build } from "esbuild";
import sharp from "sharp";

await rm("dist", { recursive: true, force: true });
await mkdir("dist/icons", { recursive: true });
await mkdir("store-assets", { recursive: true });
await cp("manifest.json", "dist/manifest.json");
await cp("src/popup.html", "dist/popup.html");
await cp("src/popup.css", "dist/popup.css");

await build({
  bundle: true,
  entryPoints: ["src/popup.ts"],
  format: "iife",
  minify: true,
  outfile: "dist/popup.js",
  target: "chrome120",
});

const icon = await readFile("assets/icon.svg");
for (const size of [16, 32, 48, 128]) {
  await sharp(icon)
    .resize(size, size)
    .png()
    .toFile(`dist/icons/icon-${size}.png`);
}

await sharp(await readFile("assets/store-screenshot.svg"))
  .png()
  .toFile("store-assets/screenshot-1280x800.png");
