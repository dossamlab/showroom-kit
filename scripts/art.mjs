// Converts art-raw/*.png into the WebP files the page loads and records which optional pictures exist.
// File names come from docs/art-brief.md. Run: npm run art
import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const RAW = "art-raw";
const OUT = "public/visuals";
const pngs = existsSync(RAW) ? readdirSync(RAW).filter((name) => name.endsWith(".png")) : [];
mkdirSync(`${OUT}/covers`, { recursive: true });
mkdirSync(`${OUT}/emblems`, { recursive: true });

// Floating pictures need a transparent background. When the image tool filled it anyway,
// keep a centered circle and fade everything outside it.
async function transparentObject(file) {
  const image = sharp(file).ensureAlpha();
  const { isOpaque } = await image.stats();
  if (!isOpaque) return sharp(await image.png().toBuffer()).trim().toBuffer();
  const { width, height } = await sharp(file).metadata();
  const mask = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><defs><radialGradient id="g"><stop offset="72%" stop-color="#fff"/><stop offset="100%" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><ellipse cx="${width / 2}" cy="${height / 2}" rx="${width / 2}" ry="${height / 2}" fill="url(#g)"/></svg>`
  );
  return sharp(file).ensureAlpha().composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();
}

const toSquare = (buffer, size, out) =>
  sharp(buffer)
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 80, alphaQuality: 85 })
    .toFile(out);

for (const file of pngs) {
  const id = path.basename(file, ".png");
  const source = path.join(RAW, file);
  if (id === "hero-object") {
    const object = await transparentObject(source);
    for (const size of [720, 480]) await toSquare(object, size, `${OUT}/hero-object-${size}.webp`);
  } else if (id === "hero-bg") {
    for (const width of [1280, 2400]) {
      await sharp(source).resize(width, Math.round((width * 9) / 16), { fit: "cover" }).webp({ quality: 80 }).toFile(`${OUT}/hero-bg-${width}.webp`);
    }
  } else if (id.startsWith("emblem-")) {
    await toSquare(await transparentObject(source), 256, `${OUT}/emblems/${id.slice("emblem-".length)}.webp`);
  } else {
    for (const width of [480, 960]) {
      await sharp(source).resize(width, Math.round((width * 5) / 4), { fit: "cover" }).webp({ quality: 80 }).toFile(`${OUT}/covers/${id}-${width}.webp`);
    }
  }
  console.log(`변환: ${file}`);
}

const has = (name) => existsSync(`${OUT}/${name}`);
const visuals = {
  heroObject: has("hero-object-720.webp") && has("hero-object-480.webp"),
  heroBg: has("hero-bg-1280.webp") && has("hero-bg-2400.webp")
};
writeFileSync(
  "src/config/visuals.ts",
  `// Written by \`npm run art\`. Says which optional pictures exist so the page only asks for files that are there.\nexport const visuals: { heroObject: boolean; heroBg: boolean } = ${JSON.stringify(visuals)};\n`
);
console.log(`visuals: ${JSON.stringify(visuals)}`);
