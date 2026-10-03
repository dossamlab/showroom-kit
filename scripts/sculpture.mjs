// Advanced hero: renders the Blender sculpture with the active theme colors.
// Run: npm run sculpture -- --mode test | turntable | emblems  (other options go to scripts/blender/sculpture.py)
// Blender is found through the BLENDER environment variable, then the usual install folders, then PATH.
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { theme } from "../src/config/theme.ts";

function findBlender() {
  if (process.env.BLENDER) return process.env.BLENDER;
  const roots = ["C:/Program Files/Blender Foundation"];
  for (const root of roots) {
    if (!existsSync(root)) continue;
    const versions = readdirSync(root).filter((name) => name.startsWith("Blender")).sort().reverse();
    for (const version of versions) {
      const exe = path.join(root, version, "blender.exe");
      if (existsSync(exe)) return exe;
    }
  }
  if (existsSync("/Applications/Blender.app/Contents/MacOS/Blender")) return "/Applications/Blender.app/Contents/MacOS/Blender";
  return "blender";
}

const keys = ["card", "accent", "accent2", "title"];
for (const key of keys) {
  if (!/^#[0-9a-f]{6}$/i.test(theme.colors[key])) throw new Error(`theme.colors.${key}는 #RRGGBB 형식이어야 조형물 색으로 쓸 수 있음: ${theme.colors[key]}`);
}
mkdirSync("art-raw/render", { recursive: true });
writeFileSync("art-raw/render/theme.json", JSON.stringify({ colors: Object.fromEntries(keys.map((key) => [key, theme.colors[key]])) }));

const blender = findBlender();
const args = ["-b", "--factory-startup", "--python-exit-code", "1", "-P", "scripts/blender/sculpture.py", "--", ...process.argv.slice(2)];
console.log(`${blender} ${args.join(" ")}`);
const result = spawnSync(blender, args, { stdio: "inherit" });
if (result.error) {
  console.error("Blender를 찾지 못했습니다. Blender를 설치하거나 BLENDER 환경 변수에 blender 실행 파일 경로를 넣으세요.");
  process.exitCode = 1;
} else {
  process.exitCode = result.status ?? 1;
}
