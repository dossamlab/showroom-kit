// Writes docs/art-brief.md: one copy-and-paste request per picture, built from the scenes in
// src/config/site.ts and the chosen theme's art style. Run: npm run brief
import { writeFileSync } from "node:fs";
import { cards, profile } from "../src/config/site.ts";
import { theme } from "../src/config/theme.ts";

const NO_TEXT = "No text, letters, numbers, logos or watermarks.";
const SPEC = {
  card: `Vertical 4:5 image, at least 1200x1500 px. Keep the subject centered with about 10% empty margin on every side. ${NO_TEXT} No real people or real faces; any people are small simple toy figures.`,
  object: `Square 1:1 image, at least 1500x1500 px. One standalone object only, centered, filling about 80% of the frame. Ignore the background described above: transparent background PNG with no floor, backdrop or shadow plane. If a transparent background is not possible, use a plain solid ${theme.colors.bg} background. ${NO_TEXT}`,
  emblem: `Square 1:1 image, at least 1024x1024 px. One small standalone object, centered, filling about 70% of the frame. Ignore the background described above: transparent background PNG. If a transparent background is not possible, use a plain solid ${theme.colors.bg} background. ${NO_TEXT}`,
  background: `Wide 16:9 image, at least 2400x1350 px. A calm, wide scene in the same world; keep the center soft and fairly empty so a title can sit on top. ${NO_TEXT}`
};

const groups = cards.filter((card) => card.kind === "group");
const pictures = [];
for (const group of groups) {
  for (const item of group.items) pictures.push({ file: `${item.id}.png`, label: item.name, scene: item.scene, spec: SPEC.card });
}
if (profile.hero === "image") pictures.push({ file: "hero-object.png", label: "첫 화면 조형물", scene: profile.heroScene, spec: SPEC.object });
for (const group of groups) {
  if (group.emblemScene) pictures.push({ file: `emblem-${group.id}.png`, label: `${group.name} 표장`, scene: group.emblemScene, spec: SPEC.emblem });
}
if (profile.backgroundScene) pictures.push({ file: "hero-bg.png", label: "첫 화면 배경", scene: profile.backgroundScene, spec: SPEC.background });

const missing = pictures.filter((picture) => !picture.scene?.trim());
if (missing.length) {
  console.error(`장면 설명(scene)이 없는 그림이 있어 지시서를 만들지 않았다: ${missing.map((picture) => picture.label).join(", ")}`);
  // exitCode instead of process.exit(): exiting abruptly crashes Node on Windows while output is still flushing.
  process.exitCode = 1;
} else {
  writeBrief();
}

function writeBrief() {
  const block = (text) => "```text\n" + text.trim() + "\n```";
  const today = new Date().toISOString().slice(0, 10);
  const lines = [
    "# 그림 지시서",
    "",
    `> \`npm run brief\`가 만든 파일이다. 고칠 때는 \`src/config/site.ts\`의 장면 설명을 고친 뒤 다시 만든다. 테마: ${theme.name}(${theme.id}), 만든 날: ${today}.`,
    "",
    "## 만드는 순서",
    "",
    "1. Gemini(나노 바나나) 또는 ChatGPT에 그림마다 [A], [B], [C] 세 칸을 순서대로 이어 붙여 넣는다.",
    "2. 1번 그림을 먼저 만든다. 화풍이 마음에 들면 나머지는 1번 그림을 기준 이미지로 함께 첨부해 같은 화풍으로 만든다.",
    "3. 만든 그림은 `art-raw/` 폴더에 아래 파일 이름 그대로 PNG로 저장한다.",
    "4. AI 도구에게 \"그림 넣어줘\"라고 하면 변환하고 연결한다.",
    "",
    "| # | 파일 이름 | 무엇 |",
    "|---|---|---|",
    ...pictures.map((picture, index) => `| ${index + 1} | \`${picture.file}\` | ${picture.label} |`),
    ""
  ];
  pictures.forEach((picture, index) => {
    lines.push(
      `## ${index + 1}. \`${picture.file}\` ${picture.label}`,
      "",
      "**[A 공통 화풍]**",
      "",
      block(theme.artStyle),
      "",
      "**[B 이 그림의 장면]**",
      "",
      block(picture.scene),
      "",
      "**[C 출력 규격]**",
      "",
      block(picture.spec),
      ""
    );
  });
  writeFileSync("docs/art-brief.md", lines.join("\n"));
  console.log(`docs/art-brief.md: 그림 ${pictures.length}장`);
}
