// Checks src/config/site.ts, src/config/theme.ts and the converted pictures. Run: npm run check
import assert from "node:assert/strict";
import { existsSync, readdirSync } from "node:fs";
import { cards, profile } from "../src/config/site.ts";
import { themes, THEME_ID } from "../src/config/theme.ts";
import { visuals } from "../src/config/visuals.ts";

const warnings = [];

// WCAG 2 contrast ratio between two opaque #RRGGBB colors.
const channel = (value) => {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};
const luminance = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return 0.2126 * channel(n >> 16) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
};
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
assert.equal(contrast("#FFFFFF", "#000000").toFixed(1), "21.0", "대비 계산 자체 검사");
assert.equal(contrast("#777777", "#FFFFFF").toFixed(2), "4.48", "대비 계산 자체 검사");

// Themes: every preset and the custom one must stay readable.
const HEX = /^#[0-9a-fA-F]{6}$/;
const RULES = [
  ["ink", "bg", 4.5],
  ["ink", "card", 4.5],
  ["dim", "bg", 4.5],
  ["dim", "card", 4.5],
  ["accent", "bg", 4.5],
  ["accent", "card", 4.5],
  ["title", "bg", 3],
  ["accentInk", "accent", 4.5]
];
assert.ok(themes[THEME_ID], `THEME_ID "${THEME_ID}"에 해당하는 테마가 없음`);
for (const [id, theme] of Object.entries(themes)) {
  for (const [fg, bg, min] of RULES) {
    for (const key of [fg, bg]) assert.match(theme.colors[key], HEX, `${id}.colors.${key}는 #RRGGBB 형식이어야 함`);
    const ratio = contrast(theme.colors[fg], theme.colors[bg]);
    assert.ok(ratio >= min, `${id}: ${fg}와 ${bg}의 글자 대비 ${ratio.toFixed(2)}가 기준 ${min}보다 낮음`);
  }
  assert.ok(theme.artStyle.trim().length > 40, `${id}.artStyle이 비어 있음`);
}

// Links.
const ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const HREF = /^(https?:\/\/|mailto:)/;
const groups = cards.filter((card) => card.kind === "group");
const items = groups.flatMap((group) => group.items);
const ids = new Set();
for (const group of groups) {
  assert.match(group.id, ID, `묶음 id 형식 오류: ${group.name}`);
  assert.ok(group.shortName?.trim(), `shortName 없음: ${group.id}`);
  if (group.emblem) assert.ok(existsSync(`public${group.emblem}`), `표장 파일 없음: public${group.emblem}`);
}
for (const item of items) {
  assert.match(item.id ?? "", ID, `id 형식 오류(영문 소문자와 하이픈): ${item.name}`);
  assert.ok(!ids.has(item.id), `id 중복: ${item.id}`);
  ids.add(item.id);
  assert.ok(item.tag?.trim(), `tag 없음: ${item.id}`);
  assert.match(item.href, HREF, `주소는 http, https, mailto로 시작해야 함: ${item.id}`);
  if (item.cover) {
    for (const size of [480, 960]) assert.ok(existsSync(`public${item.cover}-${size}.webp`), `그림 파일 없음: public${item.cover}-${size}.webp`);
  }
  if (!item.scene?.trim()) warnings.push(`장면 설명(scene)이 없어 그림 지시서에서 빠짐: ${item.id}`);
}
for (const link of cards.filter((card) => card.kind === "link")) assert.match(link.href, HREF, `주소 형식 오류: ${link.id}`);

// Pictures converted but not linked yet.
const coverDir = "public/visuals/covers";
for (const file of existsSync(coverDir) ? readdirSync(coverDir) : []) {
  const id = file.match(/^(.*)-480\.webp$/)?.[1];
  if (id && !items.some((item) => item.cover === `/visuals/covers/${id}`)) warnings.push(`그림은 있는데 연결 안 됨: ${id} (cover에 "/visuals/covers/${id}")`);
}

// Optional pictures recorded by `npm run art`.
const has = (name) => existsSync(`public/visuals/${name}`);
if (visuals.heroObject) assert.ok(has("hero-object-720.webp") && has("hero-object-480.webp"), "visuals.heroObject가 true인데 조형물 파일이 없음 (npm run art)");
if (visuals.heroBg) assert.ok(has("hero-bg-1280.webp") && has("hero-bg-2400.webp"), "visuals.heroBg가 true인데 배경 파일이 없음 (npm run art)");
if (profile.hero === "image" && !visuals.heroObject) warnings.push("조형물 그림이 아직 없음 (art-raw/hero-object.png를 넣고 npm run art)");

assert.ok(!JSON.stringify({ profile, cards }).includes("—"), "긴 줄표 문자는 쓰지 않음");

for (const warning of warnings) console.warn(`주의: ${warning}`);
console.log(`ok: 테마 ${Object.keys(themes).length}개(사용 중 ${THEME_ID}), 묶음 ${groups.length}개, 링크 ${items.length}개`);
