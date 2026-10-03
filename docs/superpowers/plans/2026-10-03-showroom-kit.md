# showroom-kit 1단계 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use subagent-driven-development (recommended) or executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 도쌤 쇼룸 코드를 일반화해, 선생님이 질문에 답하고 Gemini·ChatGPT 그림만 만들면 자기 콘셉트의 링크 쇼룸이 되는 템플릿 저장소를 만든다.

**Architecture:** Next.js 16 페이지 하나. 선생님 내용은 `src/config/site.ts`, 색·화풍은 `src/config/theme.ts`(테마 3종 + 자유 콘셉트 자리), 선택 그림의 존재 여부는 `npm run art`가 쓰는 `src/config/visuals.ts`. 화면 부품은 도쌤 쇼룸(`../dossamlab-linktree`)에서 복사하고, 색은 `<html>`에 CSS 변수로 넘긴다. 스크립트 3개(`check`, `brief`, `art`)가 검사·지시서·변환을 맡는다.

**Tech Stack:** Next.js 16.2, React 19.1, TypeScript 5, motion 14, next/font(Fraunces, Noto Sans KR), sharp 0.34(개발용), Node 22.18 이상(스크립트가 `.ts` 설정 파일을 바로 읽는다).

설계: `docs/superpowers/specs/2026-10-03-showroom-kit-design.md`

## Global Constraints

- 작업 폴더: `C:/Users/user/vibe-coding/showroom-kit` (git `main`). 원본 코드: `C:/Users/user/vibe-coding/dossamlab-linktree`(읽기만).
- 도쌤의 그림(`public/visuals/*`), 링크, Blender 스크립트, 문서는 키트에 넣지 않는다.
- 의존성: `motion`, `next`, `react`, `react-dom` + 개발용 `sharp`, `typescript`, `@types/*`. 그 밖에는 추가하지 않는다.
- 화면 문구는 쉬운 한국어, 긴 줄표 문자(U+2014) 금지.
- 예시 내용은 가짜 값만: 예시 선생님 `홍길동`, 소속 `○○고`, 예시 주소 `https://example.com/...`, 메일 `teacher@example.com`.
- 글자 대비 기준(WCAG): `ink`·`dim`·`accent`와 `bg`·`card` 사이 4.5:1 이상, `title`과 `bg` 3:1 이상, `accentInk`와 `accent` 4.5:1 이상.
- 커밋은 경로를 지정해 올린다(`git add -A` 금지). 메시지 끝 줄: `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`
- GitHub 저장소 생성과 푸시는 사용자 승인 뒤에만.

## 파일 구조

| 파일 | 할 일 | 작업 |
|---|---|---|
| `package.json`, `tsconfig.json`, `next.config.ts`, `next-env.d.ts`, `.gitignore`, `.env.example` | 프로젝트 설정 | 1 |
| `public/icons/*.svg`, `public/assets/dorms-community.png` | 원 템플릿 아이콘·DoRms 이미지(대체 블록) | 1 |
| `src/config/site.ts` | 프로필·묶음·링크·출처(예시 내용) | 1 |
| `src/config/theme.ts` | 테마 타입, 3종, 고른 테마 | 1 |
| `src/config/visuals.ts` | 선택 그림 존재 여부(art가 다시 씀) | 1 |
| `src/app/layout.tsx`, `page.tsx`, `globals.css`, `icon.svg` | 글꼴·메타데이터·색 변수, 페이지, 모양, 파비콘 | 1 |
| `src/components/showroom/*` | 도쌤 쇼룸 부품 복사 + Showroom·Hero·utils 수정 | 1 |
| `scripts/check.mjs` | 검사 | 2 |
| `src/components/showroom/HeroObject.tsx`, `scripts/art.mjs` | 기본형 조형물, 그림 변환 | 3 |
| `scripts/brief.mjs`, `docs/art-brief.md` | 그림 지시서 | 4 |
| `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.github/copilot-instructions.md`, `README.md`, `docs/how-to-use.html`, `LICENSE`, `LICENSE-CONTENT` | 안내·라이선스 | 5 |

---

### Task 1: 저장소 뼈대 (복사, 설정 파일, 색 변수)

**Files:**
- Create: 위 표의 작업 1 파일 전부
- Copy from `../dossamlab-linktree`: `tsconfig.json`, `next.config.ts`, `next-env.d.ts`, `.env.example`, `public/icons/`, `public/assets/dorms-community.png`, `src/components/showroom/{CardArt,CardDetail,Catalog,Marquee,ShowcaseCard,SpiralPath,utils,Hero,Showroom}.tsx|ts`, `src/app/globals.css`, `src/app/page.tsx`

**Interfaces:**
- Produces:
  - `site.ts`: `type Credit = { text: string; href?: string }`, `type Profile = { kicker: string; heroTitle: string; description: string; hero: "image" | "none"; heroScene: string; backgroundScene?: string; credits: Credit[] }`, `profile: Profile`, `type LinkItem = { id; name; tag; description?; href; thumb?; scene?: string; cover?: string }`, `type LinkCard`(group은 `emblem?: string; emblemScene?: string` 포함), `cards: LinkCard[]`
  - `theme.ts`: `type Theme`, `themes`, `type ThemeId`, `THEME_ID`, `theme: Theme`
  - `visuals.ts`: `visuals: { heroObject: boolean; heroBg: boolean }`
  - CSS 변수(`<html>`): `--bg --bg-glow --surface --surface-hover --card --card-art --ink --title --dim --line --accent --accent-ink --accent-hover --accent2 --shadow --glow --backdrop`

- [ ] **Step 1: 복사**

```bash
cd C:/Users/user/vibe-coding/showroom-kit
SRC=../dossamlab-linktree
mkdir -p public/assets src/app src/components/showroom src/config scripts docs .github
cp $SRC/tsconfig.json $SRC/next.config.ts $SRC/next-env.d.ts $SRC/.env.example .
cp -r $SRC/public/icons public/
cp $SRC/public/assets/dorms-community.png public/assets/
cp $SRC/src/components/showroom/{CardArt,CardDetail,Catalog,Marquee,ShowcaseCard,SpiralPath,Hero,Showroom}.tsx src/components/showroom/
cp $SRC/src/components/showroom/utils.ts src/components/showroom/
cp $SRC/src/app/globals.css $SRC/src/app/page.tsx src/app/
```

- [ ] **Step 2: package.json, .gitignore**

`package.json`:

```json
{
  "name": "showroom-kit",
  "version": "1.0.0",
  "private": true,
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/dossamlab/showroom-kit.git"
  },
  "engines": {
    "node": ">=22.18"
  },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "check": "node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/check.mjs",
    "brief": "node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/brief.mjs",
    "art": "node scripts/art.mjs"
  },
  "dependencies": {
    "motion": "^14.0.0",
    "next": "^16.2.10",
    "react": "19.1.0",
    "react-dom": "19.1.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "sharp": "^0.34.5",
    "typescript": "^5"
  },
  "overrides": {
    "postcss": "8.5.16"
  }
}
```

`.gitignore`:

```gitignore
.next
node_modules
out
dist
.env
.env.*
!.env.example
.DS_Store
npm-debug.log*
.claude/
.vercel
/art-raw/
```

- [ ] **Step 3: `src/config/theme.ts`**

```ts
export type Theme = {
  id: string;
  name: string;
  scheme: "dark" | "light";
  pattern: "stars" | "grid";
  colors: {
    bg: string;
    bgGlow: string;
    surface: string;
    surfaceHover: string;
    card: string;
    cardArt: string;
    ink: string;
    title: string;
    dim: string;
    line: string;
    accent: string;
    accentInk: string;
    accentHover: string;
    accent2: string;
    shadow: string;
    glow: string;
    backdrop: string;
  };
  // Gradient pairs for cards that have no picture yet.
  artFallbacks: [string, string][];
  // Shared style sentence for every picture request in docs/art-brief.md (English works best).
  artStyle: string;
};

export const themes = {
  "night-museum": {
    id: "night-museum",
    name: "밤의 과학관",
    scheme: "dark",
    pattern: "stars",
    colors: {
      bg: "#0C0F24",
      bgGlow: "rgba(110,125,230,0.38)",
      surface: "rgba(255,255,255,0.06)",
      surfaceHover: "rgba(255,255,255,0.12)",
      card: "#151936",
      cardArt: "#10132C",
      ink: "#EDEBFA",
      title: "#F7E7C4",
      dim: "#9EA3C6",
      line: "rgba(255,255,255,0.10)",
      accent: "#F2C879",
      accentInk: "#1A1630",
      accentHover: "#F7D693",
      accent2: "#A9B8E8",
      shadow: "rgba(0,0,0,0.45)",
      glow: "rgba(242,200,121,0.28)",
      backdrop: "rgba(5,6,15,0.72)"
    },
    artFallbacks: [
      ["#1A1F45", "#3A4290"],
      ["#1B2A4A", "#2F5F8A"],
      ["#2A1F45", "#5A3F8A"],
      ["#1F3340", "#2F6A6F"],
      ["#33264A", "#7A5A9A"]
    ],
    artStyle:
      "Isometric 3D miniature diorama, handcrafted clay and painted-resin toy look, soft rounded shapes, tilt-shift macro photography with shallow depth of field. The diorama sits on a small round pedestal in the center, displayed like a museum exhibit at night: deep navy seamless background (#0C0F24) with a faint starry gradient, a warm golden spotlight from the upper left, gentle lilac rim light, soft contact shadows. Palette: deep navy, warm gold (#F2C879), lilac (#A9B8E8), with soft pastel accents (rose #E7C6DC, mint #CFE0D6, sky #9BB4D4). Clean, cute, premium, consistent lighting. No text, no letters, no numbers, no logos, no watermark."
  },
  "lavender-lab": {
    id: "lavender-lab",
    name: "라벤더 실험실",
    scheme: "light",
    pattern: "grid",
    colors: {
      bg: "#F4F2F8",
      bgGlow: "rgba(169,184,232,0.45)",
      surface: "rgba(46,44,58,0.05)",
      surfaceHover: "rgba(46,44,58,0.10)",
      card: "#FFFFFF",
      cardArt: "#ECE8F6",
      ink: "#2E2C3A",
      title: "#3A3F8F",
      dim: "#625E78",
      line: "rgba(46,44,58,0.12)",
      accent: "#4F5FCC",
      accentInk: "#FFFFFF",
      accentHover: "#3F4FBC",
      accent2: "#C9A2C0",
      shadow: "rgba(46,44,58,0.14)",
      glow: "rgba(127,143,230,0.30)",
      backdrop: "rgba(30,28,45,0.45)"
    },
    artFallbacks: [
      ["#E9E4F7", "#C9C2EC"],
      ["#DCEBF2", "#AFCBE0"],
      ["#F3DDE9", "#D9AFC8"],
      ["#E2F0E6", "#B6D6C0"],
      ["#F4ECD8", "#DCC796"]
    ],
    artStyle:
      "Isometric 3D miniature diorama, handcrafted clay and painted-resin toy look, soft rounded shapes, tilt-shift macro photography with shallow depth of field. The diorama sits on a small round pedestal with a soft silver-lilac rim in the center, shown like a gentle exhibit in a bright studio: light lavender seamless background (#F4F2F8), soft diffused daylight from the upper left, gentle pastel bounce light, soft contact shadows. Palette: lavender, periwinkle (#4F5FCC), rose (#E7C6DC), mint (#CFE0D6), sky (#9BB4D4), butter (#F0E0BC). Clean, cute, friendly, consistent lighting. No text, no letters, no numbers, no logos, no watermark."
  },
  "research-notebook": {
    id: "research-notebook",
    name: "연구 노트",
    scheme: "light",
    pattern: "grid",
    colors: {
      bg: "#F7F1E6",
      bgGlow: "rgba(224,112,58,0.16)",
      surface: "rgba(43,36,28,0.05)",
      surfaceHover: "rgba(43,36,28,0.10)",
      card: "#FFFBF3",
      cardArt: "#EFE4D2",
      ink: "#2B241C",
      title: "#2B241C",
      dim: "#6A5D4C",
      line: "rgba(120,90,50,0.16)",
      accent: "#B4501F",
      accentInk: "#FFFFFF",
      accentHover: "#9C4419",
      accent2: "#2F6F73",
      shadow: "rgba(80,60,30,0.16)",
      glow: "rgba(224,112,58,0.22)",
      backdrop: "rgba(43,36,28,0.45)"
    },
    artFallbacks: [
      ["#F1E6D3", "#DCC5A2"],
      ["#E6EEE9", "#B9CFC6"],
      ["#F4DFD0", "#D9A989"],
      ["#EDE6D6", "#CDBF9F"],
      ["#E2E8EC", "#B5C3CC"]
    ],
    artStyle:
      "Isometric 3D miniature diorama made of paper craft and clay, warm handmade look, soft rounded shapes, tilt-shift macro photography with shallow depth of field. The diorama sits on a small round wooden pedestal with a brass rim in the center, shown like a specimen on a researcher's desk: warm cream paper background (#F7F1E6) with a faint sepia grid, warm desk-lamp light from the upper left, soft contact shadows. Palette: cream, warm brown, burnt orange (#B4501F), teal (#2F6F73), mustard (#E8B04A). Cozy, curious, consistent lighting. No text, no letters, no numbers, no logos, no watermark."
  }
} satisfies Record<string, Theme>;

export type ThemeId = keyof typeof themes;

// 고른 테마. 자유 콘셉트는 themes에 "custom"을 같은 모양으로 더하고 여기를 "custom"으로 바꾼다.
export const THEME_ID: ThemeId = "night-museum";

export const theme: Theme = themes[THEME_ID];
```

- [ ] **Step 4: `src/config/site.ts` (예시 내용)**

```ts
// 선생님 내용은 이 파일에만 적는다. scene(그림 장면)은 영어로 쓰면 그림이 잘 나온다.
export type IconName =
  | "dorms-community"
  | "naver-blog"
  | "instagram"
  | "kakao-chat"
  | "kakao-group"
  | "download"
  | "manual"
  | "privacy"
  | "school"
  | "docs"
  | "contact"
  | "magazine"
  | "code"
  | "game";

export type Thumb =
  | { kind: "image"; src: string; alt: string }
  | { kind: "icon"; icon: IconName };

export type LinkItem = {
  id: string; // 영문 소문자와 하이픈. 그림 파일 이름(art-raw/<id>.png)이 된다.
  name: string;
  tag: string; // 짧은 분류, 예: "퀴즈 게임"
  description?: string;
  href: string;
  thumb?: Thumb;
  scene?: string; // 그림 지시서에 들어갈 장면 설명
  cover?: string; // 그림 경로, 예: "/visuals/covers/quiz-game" (npm run art 뒤에 채운다)
};

export type LinkCard =
  | {
      kind: "group";
      id: string;
      number: string;
      name: string;
      shortName: string;
      description: string;
      thumb: Thumb;
      emblem?: string; // 묶음 표장 그림, 예: "/visuals/emblems/class-apps.webp"
      emblemScene?: string; // 표장 그림을 지시서에 넣고 싶을 때만
      items: LinkItem[];
    }
  | {
      kind: "link";
      id: string;
      number: string;
      name: string;
      description: string;
      href: string;
      thumb: Thumb;
    };

export type Credit = { text: string; href?: string };

export type Profile = {
  kicker: string; // 맨 위 칩과 브라우저 탭 제목, 예: "○○고 교사 홍길동"
  heroTitle: string; // 큰 제목
  description: string; // 한 줄 소개
  hero: "image" | "none"; // "image"면 첫 화면 조형물 그림(art-raw/hero-object.png)을 보여 준다
  heroScene: string; // 조형물 그림 장면
  backgroundScene?: string; // 첫 화면 배경 그림(선택)
  credits: Credit[]; // 화면 맨 아래 출처 문구. 비어 있으면 보이지 않는다
};

export const profile: Profile = {
  kicker: "○○고 교사 홍길동",
  heroTitle: "Hong Lab",
  description: "수업에서 바로 쓰는 웹앱과 자료를 모아 둔 홍길동 선생님의 쇼룸",
  hero: "image",
  heroScene:
    "A floating miniature island holding a tiny school building, a glowing lightbulb tower and small paper airplanes circling around it, shown as one standalone sculpture.",
  credits: []
};

export const cards: LinkCard[] = [
  {
    kind: "group",
    id: "dorms-activity",
    number: "01",
    name: "도름스 커뮤니티 나의 활동",
    shortName: "도름스 활동",
    description: "DoRms에서 나누고 있는 나의 활동을 모아두는 곳",
    thumb: { kind: "image", src: "/assets/dorms-community.png", alt: "DoRms community" },
    items: [
      {
        id: "dorms-profile",
        name: "내 DoRms 프로필",
        tag: "프로필",
        description: "DoRms에 쓴 글과 만든 앱을 한곳에서 모아 보는 프로필",
        href: "https://dorms.school/",
        thumb: { kind: "image", src: "/assets/dorms-community.png", alt: "DoRms community" },
        scene: "A miniature community bulletin board with small colorful blank note cards pinned to it and a tiny desk lamp, a cozy sharing corner."
      },
      {
        id: "sample-post",
        name: "예시 글: 수업 자료 나눔",
        tag: "자료 나눔",
        description: "DoRms에 올린 글 주소로 바꿔 주세요",
        href: "https://dorms.school/board",
        thumb: { kind: "icon", icon: "docs" },
        scene: "A miniature stack of neatly bound lesson handouts tied with a ribbon, a small open folder and a pencil cup."
      }
    ]
  },
  {
    kind: "group",
    id: "class-apps",
    number: "02",
    name: "수업에서 바로 쓰는 웹앱",
    shortName: "수업 웹앱",
    description: "설치 없이 링크 하나로 여는 수업용 웹앱",
    thumb: { kind: "icon", icon: "game" },
    items: [
      {
        id: "quiz-game",
        name: "예시 앱: 개념 퀴즈 게임",
        tag: "퀴즈 게임",
        description: "수업 개념을 퀴즈로 다지는 게임",
        href: "https://example.com/quiz",
        thumb: { kind: "icon", icon: "game" },
        scene: "A miniature game show stage with a big round buzzer button, colorful blank quiz cards and tiny spotlights."
      },
      {
        id: "class-timer",
        name: "예시 앱: 활동 타이머",
        tag: "수업 도구",
        description: "모둠 활동 시간을 크게 보여 주는 타이머",
        href: "https://example.com/timer",
        thumb: { kind: "icon", icon: "school" },
        scene: "A miniature classroom desk with a large friendly hourglass, a round timer with a blank face and small colorful sticky notes."
      },
      {
        id: "idea-board",
        name: "예시 앱: 아이디어 모음판",
        tag: "참여 도구",
        description: "학생 생각을 한 화면에 모으는 게시판",
        href: "https://example.com/board",
        thumb: { kind: "icon", icon: "magazine" },
        scene: "A miniature corkboard covered with blank colorful speech-bubble notes connected by thin strings, with a tiny step ladder beside it."
      }
    ]
  },
  {
    kind: "link",
    id: "instagram",
    number: "03",
    name: "인스타그램",
    description: "만드는 과정과 소식을 짧게 남기는 곳",
    href: "https://www.instagram.com/",
    thumb: { kind: "icon", icon: "instagram" }
  },
  {
    kind: "link",
    id: "contact",
    number: "04",
    name: "연락처",
    description: "teacher@example.com",
    href: "mailto:teacher@example.com",
    thumb: { kind: "icon", icon: "contact" }
  }
];
```

- [ ] **Step 5: `src/config/visuals.ts`**

```ts
// Written by `npm run art`. Says which optional pictures exist so the page only asks for files that are there.
export const visuals: { heroObject: boolean; heroBg: boolean } = {"heroObject":false,"heroBg":false};
```

- [ ] **Step 6: `src/app/layout.tsx`, `src/app/icon.svg`**

`src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Fraunces, Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { profile } from "@/config/site";
import { theme } from "@/config/theme";
import { visuals } from "@/config/visuals";

const display = Fraunces({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const body = Noto_Sans_KR({ subsets: ["latin"], variable: "--font-body", display: "swap" });

// Share previews need an absolute address: an explicit one, else the one Vercel gives the build.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");
const shareImage = visuals.heroObject ? "/visuals/hero-object-720.webp" : "/assets/dorms-community.png";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: profile.kicker,
  description: profile.description,
  openGraph: { title: profile.kicker, description: profile.description, images: [shareImage] }
};

// Theme colors become CSS variables on <html>: bgGlow -> --bg-glow.
const themeVars = Object.fromEntries(
  Object.entries(theme.colors).map(([key, value]) => [`--${key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`, value])
) as React.CSSProperties;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${display.variable} ${body.variable}`} style={{ ...themeVars, colorScheme: theme.scheme }}>
      <body>{children}</body>
    </html>
  );
}
```

`src/app/icon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="16" fill="#1A1F45"/>
  <path d="M33 32a3 3 0 1 1-3-3 6 6 0 0 1 6 6 9 9 0 0 1-9 9 12 12 0 0 1-12-12 15 15 0 0 1 15-15 18 18 0 0 1 18 18" fill="none" stroke="#F2C879" stroke-width="4" stroke-linecap="round"/>
</svg>
```

- [ ] **Step 7: 부품 수정 (utils, Hero, Showroom)**

`src/components/showroom/utils.ts` 첫 줄 교체:

```ts
import { cards, type LinkCard, type LinkItem } from "@/config/site";
```

`src/components/showroom/Hero.tsx`: 맨 위 import 5줄(`"use client";` 다음)을 아래 4줄로 바꾸고(HeroSculpture import 삭제), `{profile.title}`을 `{profile.kicker}`로 바꾸고, `<HeroSculpture />` 줄을 지운다. 조형물은 Task 3에서 붙인다.

```tsx
import { Fragment } from "react";
import { motion } from "motion/react";
import { profile } from "@/config/site";
import { EASE, directLinks, groups, newTabProps } from "./utils";
```

`src/components/showroom/Showroom.tsx` 전체:

```tsx
"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import { LayoutGroup, MotionConfig } from "motion/react";
import { profile } from "@/config/site";
import { theme } from "@/config/theme";
import { visuals } from "@/config/visuals";
import CardDetail from "./CardDetail";
import Catalog from "./Catalog";
import Hero from "./Hero";
import Marquee from "./Marquee";
import { directLinks, groups, newTabProps, type OpenCard } from "./utils";

export default function Showroom({ initialTab }: { initialTab?: string }) {
  const [open, setOpen] = useState<OpenCard | null>(null);

  // Links such as ?tab=02 jump to the matching group.
  useEffect(() => {
    const tab = (initialTab || "").trim().toLowerCase();
    if (!tab) return;
    const group = groups.find((g) => g.id === tab || g.number === tab.padStart(2, "0"));
    if (group) document.getElementById(`group-${group.id}`)?.scrollIntoView({ block: "start" });
  }, [initialTab]);

  const closeDetail = useCallback(() => {
    open?.trigger?.focus({ preventScroll: true });
    setOpen(null);
  }, [open]);

  return (
    <MotionConfig reducedMotion="user">
      <LayoutGroup>
        <div className="sr-root" data-pattern={theme.pattern}>
          <div className="sr-sky" aria-hidden="true" />
          {visuals.heroBg ? <div className="sr-sky-photo" aria-hidden="true" /> : null}
          <Hero />
          <Marquee onOpen={setOpen} paused={open !== null} />
          <Catalog onOpen={setOpen} />
          <footer className="sr-foot">
            {directLinks.map((link) => (
              <a key={link.id} className="sr-foot-link" href={link.href} {...newTabProps(link.href)}>
                <b>{link.name}</b>
                <span>{link.description}</span>
              </a>
            ))}
            {profile.credits.length ? (
              <p className="sr-credit">
                {profile.credits.map((credit, index) => (
                  <Fragment key={index}>
                    {index > 0 ? " · " : null}
                    {credit.href ? (
                      <a href={credit.href} {...newTabProps(credit.href)}>
                        {credit.text}
                      </a>
                    ) : (
                      credit.text
                    )}
                  </Fragment>
                ))}
              </p>
            ) : null}
          </footer>
          <CardDetail open={open} onClose={closeDetail} />
        </div>
      </LayoutGroup>
    </MotionConfig>
  );
}
```

- [ ] **Step 8: CSS를 테마 변수로**

아래 Python을 한 번 실행해 `src/app/globals.css`를 고친다. 일회성 변환이라 스크립트 파일로 남기지 않는다.

```bash
python - <<'EOF'
import io
p = "src/app/globals.css"
s = io.open(p, encoding="utf-8").read()
plain = [
  ("background: #0C0F24;", "background: var(--bg);"),
  ("color: #EDEBFA;", "color: var(--ink);"),
  ("outline: 2px solid var(--gold, #F2C879);", "outline: 2px solid var(--accent);"),
  ("var(--gold)", "var(--accent)"),
  ("background: rgba(255, 255, 255, 0.06);", "background: var(--surface);"),
  ("background: rgba(255, 255, 255, 0.05);", "background: var(--surface);"),
  ("background: rgba(255, 255, 255, 0.12);", "background: var(--surface-hover);"),
  ("text-shadow: 0 0 26px rgba(242, 200, 121, 0.28);", "text-shadow: 0 0 26px var(--glow);"),
  ("color: #1A1630;", "color: var(--accent-ink);"),
  ("background: #F7D693;", "background: var(--accent-hover);"),
  ("background: #10132C;", "background: var(--card-art);"),
  ("box-shadow: 0 18px 36px rgba(0, 0, 0, 0.45), 0 0 28px rgba(127, 143, 230, 0.1);", "box-shadow: 0 18px 36px var(--shadow);"),
  ("border-color: rgba(242, 200, 121, 0.45);", "border-color: color-mix(in srgb, var(--accent) 45%, transparent);"),
  ("box-shadow: 0 22px 44px rgba(0, 0, 0, 0.5), 0 0 36px rgba(242, 200, 121, 0.18);", "box-shadow: 0 22px 44px var(--shadow), 0 0 36px var(--glow);"),
  ("box-shadow: 0 10px 24px rgba(0, 0, 0, 0.35);", "box-shadow: 0 10px 24px var(--shadow);"),
  ("filter: drop-shadow(0 6px 14px rgba(242, 200, 121, 0.25));", "filter: drop-shadow(0 6px 14px var(--glow));"),
  ("background: rgba(5, 6, 15, 0.72);", "background: var(--backdrop);"),
  ("border: 1px solid rgba(242, 200, 121, 0.35);", "border: 1px solid color-mix(in srgb, var(--accent) 35%, transparent);"),
  ("box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6), 0 0 60px rgba(242, 200, 121, 0.15);", "box-shadow: 0 30px 80px var(--shadow), 0 0 60px var(--glow);"),
  ("background: rgba(12, 15, 36, 0.7);", "background: color-mix(in srgb, var(--card) 80%, transparent);"),
]
for old, new in plain:
    assert old in s, old
    s = s.replace(old, new)

# Stars only for dark themes; light themes get a faint grid.
s = s.replace(".sr-root::before {", '.sr-root[data-pattern="stars"]::before {', 1)
grid = '''.sr-root[data-pattern="grid"]::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image:
    linear-gradient(var(--line) 1px, transparent 1px),
    linear-gradient(90deg, var(--line) 1px, transparent 1px);
  background-size: 40px 40px;
}

.sr-sky {'''
s = s.replace(".sr-sky {", grid, 1)

old_sky = '''  background:
    radial-gradient(ellipse 80% 60% at 50% -10%, var(--bg-glow), transparent 65%),
    image-set(url("/visuals/hero-bg-1280.webp") 1x, url("/visuals/hero-bg-2400.webp") 2x) center top / cover no-repeat;
  opacity: 0.55;
  -webkit-mask-image: linear-gradient(#000 45%, transparent);
  mask-image: linear-gradient(#000 45%, transparent);
}'''
new_sky = '''  background: radial-gradient(ellipse 80% 60% at 50% -10%, var(--bg-glow), transparent 65%);
}

/* Optional background painting (art-raw/hero-bg.png) behind the hero, faded toward the bottom. */
.sr-sky-photo {
  position: absolute;
  inset: 0 0 auto;
  height: min(100svh, 900px);
  z-index: 0;
  pointer-events: none;
  background: image-set(url("/visuals/hero-bg-1280.webp") 1x, url("/visuals/hero-bg-2400.webp") 2x) center top / cover no-repeat;
  opacity: 0.55;
  -webkit-mask-image: linear-gradient(#000 45%, transparent);
  mask-image: linear-gradient(#000 45%, transparent);
}'''
assert old_sky in s
s = s.replace(old_sky, new_sky)

# The Blender sculpture styles are not part of the kit (stage 2); the hero object styles come in Task 3.
start = s.index("/* Hero sculpture:")
end = s.index("/* Strip */")
s = s[:start] + s[end:]

import re
leftover = re.findall(r"#[0-9A-Fa-f]{6}|rgba\((?!0, 0, 0, 0)", s)
print("hard-coded colors left:", leftover)
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
EOF
```

Expected: `hard-coded colors left: ['#cdd6ff', '#cdd6ff', '#e8ecff', '#e8ecff']`. 어두운 테마 전용 별 무늬 색만 남는다. 그 밖의 색이 남으면 해당 줄을 테마 변수로 바꾼다.

- [ ] **Step 9: 설치와 빌드**

```bash
npm install --no-audit --no-fund
npm run build
```
Expected: `✓ Compiled successfully`, 타입 오류 없음.

- [ ] **Step 10: Commit**

```bash
git add package.json package-lock.json tsconfig.json next.config.ts next-env.d.ts .gitignore .env.example public src
git commit -m "feat: 쇼룸 키트 뼈대(도쌤 쇼룸 부품, 예시 내용, 테마 3종, 색 변수)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: 검사 스크립트

**Files:**
- Create: `scripts/check.mjs`

**Interfaces:**
- Consumes: `cards`, `profile`(site.ts), `themes`, `THEME_ID`(theme.ts), `visuals`(visuals.ts)
- Produces: `npm run check` 종료 코드(0 통과, 1 실패), 경고는 `주의:`로 시작하는 줄

- [ ] **Step 1: 검사 스크립트 작성**

`scripts/check.mjs`:

```js
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

assert.ok(!JSON.stringify({ profile, cards }).includes("\u2014"), "긴 줄표 문자는 쓰지 않음");

for (const warning of warnings) console.warn(`주의: ${warning}`);
console.log(`ok: 테마 ${Object.keys(themes).length}개(사용 중 ${THEME_ID}), 묶음 ${groups.length}개, 링크 ${items.length}개`);
```

- [ ] **Step 2: 실패하는지 확인 (나쁜 대비)**

`src/config/theme.ts`의 `lavender-lab` `dim`을 잠시 `"#A9A6BB"`로 바꾸고 실행.

Run: `npm run check`
Expected: FAIL, `lavender-lab: dim와 bg의 글자 대비 2.3x가 기준 4.5보다 낮음`

그다음 `dim`을 `"#625E78"`로 되돌린다.

- [ ] **Step 3: 통과 확인**

Run: `npm run check`
Expected: `주의: 조형물 그림이 아직 없음 ...` 경고 1줄과 `ok: 테마 3개(사용 중 night-museum), 묶음 2개, 링크 5개`

- [ ] **Step 4: Commit**

```bash
git add scripts/check.mjs
git commit -m "feat: 링크·그림·글자 대비 검사 스크립트" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: 기본형 조형물과 그림 변환

**Files:**
- Create: `src/components/showroom/HeroObject.tsx`, `scripts/art.mjs`
- Modify: `src/components/showroom/Hero.tsx`(조형물 붙이기), `src/app/globals.css`(조형물 모양)

**Interfaces:**
- Consumes: `profile.hero`, `visuals.heroObject`, `EASE`(utils)
- Produces: `npm run art`가 쓰는 파일: `public/visuals/covers/<id>-{480,960}.webp`, `hero-object-{720,480}.webp`, `hero-bg-{1280,2400}.webp`, `emblems/<묶음 id>.webp`, `src/config/visuals.ts`

- [ ] **Step 1: `src/components/showroom/HeroObject.tsx`**

```tsx
"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { EASE } from "./utils";

const TILT_SPRING = { stiffness: 120, damping: 16, mass: 0.8 };

// One transparent illustration (art-raw/hero-object.png, converted by `npm run art`) that floats,
// leans toward the mouse and drifts with the scroll. Reduced motion is handled in CSS.
export default function HeroObject() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(pointerY, [0, 1], [8, -8]), TILT_SPRING);
  const rotateY = useSpring(useTransform(pointerX, [0, 1], [-10, 10]), TILT_SPRING);
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start end", "end start"] });
  const drift = useTransform(scrollYProgress, [0, 1], [40, -40]);

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      const box = wrapRef.current?.getBoundingClientRect();
      if (reduce || event.pointerType !== "mouse" || !box) return;
      pointerX.set(Math.min(1, Math.max(0, (event.clientX - box.left) / box.width)));
      pointerY.set(Math.min(1, Math.max(0, (event.clientY - box.top) / box.height)));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, pointerX, pointerY]);

  return (
    <motion.div
      ref={wrapRef}
      className="sr-object"
      aria-hidden="true"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, duration: 1.1, ease: EASE }}
      style={{ y: drift }}
    >
      <div className="sr-object-float">
        <motion.img
          src="/visuals/hero-object-720.webp"
          srcSet="/visuals/hero-object-480.webp 480w, /visuals/hero-object-720.webp 720w"
          sizes="(max-width: 767px) 90vw, 560px"
          alt=""
          draggable={false}
          style={{ rotateX, rotateY, transformPerspective: 900 }}
        />
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Hero에 붙이기**

`src/components/showroom/Hero.tsx`: import 두 줄 추가.

```tsx
import { visuals } from "@/config/visuals";
import HeroObject from "./HeroObject";
```

`</motion.div>`(버튼 묶음) 바로 다음, `</header>` 앞에:

```tsx
      {profile.hero === "image" && visuals.heroObject ? <HeroObject /> : null}
```

- [ ] **Step 3: 조형물 모양**

`src/app/globals.css`의 `/* Strip */` 바로 앞에:

```css
/* Hero object: one transparent illustration that floats and leans. The strip below overlaps its base. */
.sr-object {
  position: relative;
  z-index: 0;
  width: min(90vw, 64vh, 560px);
  aspect-ratio: 1;
  margin: 0 auto -110px;
}

.sr-object::before {
  content: "";
  position: absolute;
  inset: 12%;
  z-index: -1;
  border-radius: 50%;
  background: radial-gradient(circle, var(--glow), transparent 70%);
  filter: blur(28px);
}

.sr-object-float,
.sr-object img {
  display: block;
  width: 100%;
  height: 100%;
}

.sr-object img {
  object-fit: contain;
}

@media (prefers-reduced-motion: no-preference) {
  .sr-object-float {
    animation: sr-bob 6s ease-in-out infinite;
  }
}

@keyframes sr-bob {
  50% {
    transform: translateY(-8px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .sr-object,
  .sr-object img {
    transform: none !important;
  }
}

@media (max-width: 767px) {
  .sr-object {
    margin-bottom: -70px;
  }
}

```

- [ ] **Step 4: `scripts/art.mjs`**

```js
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
```

- [ ] **Step 5: 시험 그림으로 확인 (불투명 조형물에 원형 마스크)**

```bash
mkdir -p art-raw
node -e "const s=require('sharp');Promise.all([s({create:{width:1200,height:1500,channels:3,background:'#3A4290'}}).png().toFile('art-raw/quiz-game.png'),s({create:{width:1500,height:1500,channels:3,background:'#F2C879'}}).png().toFile('art-raw/hero-object.png')]).then(()=>console.log('made'))"
npm run art
node -e "const s=require('sharp');s('public/visuals/hero-object-720.webp').raw().toBuffer({resolveWithObject:true}).then(({data,info})=>console.log(info.width,info.height,info.channels,'corner alpha',data[3],'center alpha',data[((360*720)+360)*4+3]))"
cat src/config/visuals.ts
```
Expected: `720 720 4 corner alpha 0 center alpha 255`, visuals에 `"heroObject":true`.

그다음 `src/config/site.ts`의 `quiz-game`에 `cover: "/visuals/covers/quiz-game"`를 잠시 넣고 `npm run check` → `ok`, `npm run build` → 성공, 미리보기에서 조형물이 떠 있고 마우스로 기운다.

마지막으로 시험 흔적을 지운다(커밋하지 않는다):

```bash
rm -rf art-raw public/visuals
git checkout src/config/visuals.ts src/config/site.ts
```

- [ ] **Step 6: Commit**

```bash
git add src/components/showroom/HeroObject.tsx src/components/showroom/Hero.tsx src/app/globals.css scripts/art.mjs
git commit -m "feat: 기본형 조형물(그림 한 장 연출)과 그림 변환 스크립트" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: 그림 지시서 만들기

**Files:**
- Create: `scripts/brief.mjs`, `docs/art-brief.md`(생성물)

**Interfaces:**
- Consumes: `profile.hero`, `profile.heroScene`, `profile.backgroundScene`, `cards[].items[].scene`, `group.emblemScene`, `theme.artStyle`, `theme.colors.bg`, `theme.name`, `theme.id`
- Produces: `docs/art-brief.md`, 파일 이름 규칙 `<id>.png`, `hero-object.png`, `emblem-<묶음 id>.png`, `hero-bg.png`

- [ ] **Step 1: `scripts/brief.mjs`**

```js
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
  process.exit(1);
}

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
```

- [ ] **Step 2: 장면 빠짐이면 실패하는지 확인**

`site.ts`의 `idea-board` `scene` 줄을 잠시 지우고 실행.

Run: `npm run brief`
Expected: 종료 코드 1, `장면 설명(scene)이 없는 그림이 있어 지시서를 만들지 않았다: 예시 앱: 아이디어 모음판`

`git checkout src/config/site.ts`로 되돌린다.

- [ ] **Step 3: 지시서 만들기와 내용 확인**

```bash
npm run brief
grep -c "\*\*\[A 공통 화풍\]\*\*" docs/art-brief.md
grep -o "\`[a-z0-9-]*\.png\`" docs/art-brief.md | sort -u
```
Expected: `docs/art-brief.md: 그림 6장`, `[A]` 6개, 파일 이름 `dorms-profile.png sample-post.png quiz-game.png class-timer.png idea-board.png hero-object.png`.

- [ ] **Step 4: Commit**

```bash
git add scripts/brief.mjs docs/art-brief.md
git commit -m "feat: 테마 화풍과 장면 설명으로 그림 지시서를 만드는 스크립트" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: 안내 문서와 라이선스

**Files:**
- Create: `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.github/copilot-instructions.md`, `README.md`, `docs/how-to-use.html`, `LICENSE`, `LICENSE-CONTENT`

**Interfaces:**
- Consumes: 명령 이름(`check`, `brief`, `art`, `build`, `dev`), 설정 필드 이름(Task 1), 파일 이름 규칙(Task 4)

- [ ] **Step 1: `AGENTS.md`**

```markdown
# 쇼룸 키트 작업 안내 (모든 AI 도구 공통)

이 저장소는 선생님 한 명의 링크 쇼룸 사이트다. 선생님 내용은 `src/config/site.ts`, 색과 화풍은 `src/config/theme.ts`에만 있다. 그림은 선생님이 Gemini나 ChatGPT로 만들고, AI는 질문, 설정 채우기, 그림 지시서, 변환, 검사, 커밋을 맡는다.

## 처음 시작할 때: 하나씩 묻는다

1. 표시 이름과 소속(맨 위 칩과 탭 제목, 예: `○○고 교사 홍길동`). 공개 저장소와 공개 사이트에 그대로 보인다는 것을 알리고 학교 이름을 넣어도 되는지 확인한다.
2. 큰 제목(짧은 영문 권장, 예: `Hong Lab`. 한글도 된다).
3. 한 줄 소개.
4. DoRms 커뮤니티 회원인지. 아니면 `dorms-activity` 묶음을 지운다. 회원이면 프로필 주소와 올린 글 주소를 받는다.
5. 링크 묶음과 링크. 묶음은 이름, 칩에 쓸 짧은 이름, 설명. 링크는 이름, 짧은 분류, 한 줄 설명, 주소. 비공개 주소나 개인정보가 든 주소면 공개해도 되는지 다시 묻는다.
6. 바로가기(인스타그램, 메일 등)와 공개해도 되는 연락처.
7. 콘셉트. 기본 테마 3종(밤의 과학관 `night-museum`, 라벤더 실험실 `lavender-lab`, 연구 노트 `research-notebook`) 중 하나, 또는 말로 설명하는 자유 콘셉트.

## 설정 채우기

- 링크 `id`는 영문 소문자와 하이픈. 그림 파일 이름이 된다.
- 링크마다 `scene`(영어 한두 문장)을 쓴다. 그 링크를 상징하는 3D 미니어처 장면 하나, 주요 소품 3~5개. 쓴 뒤 선생님에게 한국어로 요약해 확인받는다.
- `profile.hero`가 `"image"`이면 `profile.heroScene`에 사이트 전체를 상징하는 물체 하나를 쓴다. 조형물을 원하지 않으면 `"none"`.
- 묶음 표장을 원하면 묶음에 `emblemScene`을, 첫 화면 배경 그림을 원하면 `profile.backgroundScene`을 쓴다(둘 다 선택).
- 예시 링크(`example.com`, `teacher@example.com`)와 예시 이름은 모두 선생님 내용으로 바꾼다.

## 자유 콘셉트

1. `src/config/theme.ts`의 `themes`에 `custom`을 기존 테마와 같은 모양으로 더하고 `THEME_ID`를 `"custom"`으로 바꾼다.
2. 콘셉트에 맞게 `scheme`(`"dark"`/`"light"`)과 `pattern`(`"stars"`/`"grid"`)을 고른다.
3. `bg`, `card`, `ink`, `title`, `dim`, `accent`, `accentInk`는 `#RRGGBB`로 쓴다(대비 검사 대상).
4. `artStyle`은 기본 테마 문장과 같은 구조(재질, 받침대, 조명, 배경색, 팔레트)로 영어로 쓰고, 끝에 `No text, no letters, no numbers, no logos, no watermark.`를 남긴다.
5. `npm run check`가 대비 부족을 알리면 색을 고쳐 다시 검사한다.

## 그림

1. `npm run brief`로 `docs/art-brief.md`를 만들고, 선생님에게 이 파일의 1번 그림부터 만들라고 안내한다. 무료 요금제는 하루 생성 횟수 제한이 있어 하루 이상 걸릴 수 있다고 알린다.
2. 1번 그림이 `art-raw/`에 오면 함께 보고 화풍을 확정한다. 나머지는 1번을 기준 이미지로 첨부해 만들게 한다.
3. 그림이 들어오면 `npm run art`. 그다음 링크의 `cover`에 `/visuals/covers/<id>`, 표장은 묶음의 `emblem`에 `/visuals/emblems/<묶음 id>.webp`를 적고 `npm run check`.
4. 그림을 직접 열어 보고 글자, 로고, 실제 사람 얼굴이 들어간 그림은 다시 만들게 한다.
5. 그림이 없어도 사이트는 색 블록과 아이콘으로 동작한다. 그림은 천천히 채워도 된다.

## 명령어

| 명령 | 하는 일 |
|---|---|
| `npm install` | 처음 한 번 |
| `npm run dev` | 미리보기 (http://localhost:3000) |
| `npm run check` | 링크, 그림 파일, 글자 대비 검사 |
| `npm run brief` | 그림 지시서 `docs/art-brief.md` 만들기 |
| `npm run art` | `art-raw/` 그림을 웹용으로 변환 |
| `npm run build` | 배포 전 빌드 확인 |

## 작업을 끝낼 때마다

`npm run check`와 `npm run build`를 통과시키고 커밋, 푸시한다. 푸시하면 Vercel이 자동으로 다시 배포한다.

## 배포 (처음 한 번, 선생님이 직접)

1. https://vercel.com 에 GitHub 계정으로 가입하고 로그인한다.
2. Add New, Project를 누르고 이 저장소를 Import 한다.
3. Project Name이 주소가 된다(`이름.vercel.app`). Deploy를 누른다.

AI는 선생님 대신 로그인하거나 비밀번호, 결제 정보를 다루지 않는다.

## 고정 규칙

- 화면 문구는 쉬운 한국어로 쓰고 긴 줄표 문자는 쓰지 않는다.
- 학생 이름, 사진, 성적 같은 개인정보와 실제 사람 얼굴 그림은 넣지 않는다.
- API 키나 비밀번호를 저장소에 넣지 않는다. 이 키트는 키가 필요 없다.
- 선생님이 직접 만든 것만 넣는다. 다른 사람이 만든 앱, DoRms에서 "함께 만든"으로만 표시된 앱은 넣지 않는다.
- 출처 표시가 필요한 재료(예: Meshy 무료 플랜 3D 모델은 CC BY 4.0)를 쓰면 `profile.credits`에 출처를 적는다.
- `src/components/`의 화면 코드는 선생님이 요청할 때만 고친다.
```

- [ ] **Step 2: 도구별 안내 파일**

`CLAUDE.md`:

```markdown
@AGENTS.md
```

`GEMINI.md`와 `.github/copilot-instructions.md`(같은 내용):

```markdown
이 저장소의 작업 안내는 `AGENTS.md`에 있다. 작업 전에 `AGENTS.md`를 읽고 그대로 따른다.
```

- [ ] **Step 3: `README.md`**

````markdown
# showroom-kit: 나만의 링크 쇼룸 키트

> **도름스 도쌤**이 만든 제작 키트입니다.

수업 웹앱, 자료, 연수 자료 링크를 3D 미니어처 그림 카드로 보여 주는 쇼룸 사이트 키트입니다. AI 도구가 묻는 말에 답하고, Gemini나 ChatGPT로 그림만 만들면 내 콘셉트의 쇼룸이 완성됩니다.

실제 예시: [dossamlink.vercel.app](https://dossamlink.vercel.app) (도쌤의 쇼룸)

## 무엇이 들어 있나

| | |
|---|---|
| **화면** | 첫 화면 조형물, 흐르는 카드 띠(스크롤 반응), 묶음별 진열장, 카드 펼침 상세, 진열장을 따라 그려지는 선 |
| **테마** | 밤의 과학관, 라벤더 실험실, 연구 노트. 말로 설명하면 AI가 새 테마를 만든다(글자 대비 자동 검사) |
| **그림 지시서** | `npm run brief`가 그림마다 Gemini·ChatGPT에 그대로 붙여 넣을 요청문을 만든다 |
| **검사** | 링크, 그림 파일, 글자 대비를 `npm run check`로 확인 |
| **AI 안내** | `AGENTS.md` 하나에 질문 순서와 규칙. Claude Code, 안티그래비티, Codex, Copilot 어디서 열어도 같은 순서 |

## 필요한 것

- GitHub 계정, Vercel 계정(GitHub로 가입)
- AI 코딩 도구 하나(Claude Code, 안티그래비티, Codex 등)
- Node.js 22.18 이상(24 LTS 권장), git
- 그림용 Gemini 또는 ChatGPT(무료 요금제는 하루 생성 횟수 제한이 있다)

## 5분 시작

1. 이 저장소 오른쪽 위 **Use this template** → **Create a new repository**로 내 저장소를 만든다.
2. 내 저장소를 내려받아 AI 도구로 연다.
3. AI에게 "쇼룸 만들어줘"라고 말한다. AI가 이름, 소개, 링크, 콘셉트를 차례로 묻는다.
4. AI가 만든 `docs/art-brief.md`를 열어 1번 그림부터 만들고 `art-raw/` 폴더에 저장한다.
5. AI에게 "그림 넣어줘"라고 하면 변환, 검사, 커밋, 푸시까지 한다.

처음이라면 순서도가 있는 [docs/how-to-use.html](docs/how-to-use.html)을 먼저 본다.

## 배포

1. [vercel.com](https://vercel.com)에 GitHub 계정으로 로그인한다.
2. **Add New → Project**에서 내 저장소를 **Import** 한다.
3. **Project Name**이 주소가 된다(`이름.vercel.app`). **Deploy**.

그다음부터는 푸시하면 자동으로 다시 배포된다.

## 직접 고칠 곳

| 파일 | 내용 |
|---|---|
| `src/config/site.ts` | 이름, 소개, 묶음, 링크, 그림 장면 |
| `src/config/theme.ts` | 테마 고르기(`THEME_ID`), 색, 화풍 문장 |

## 라이선스

- 코드: MIT ([LICENSE](LICENSE)). DoRms 링크트리 템플릿(`dorms-linktree-template`)에서 출발했다.
- 문서와 지시서 틀: CC BY-NC-SA 4.0 ([LICENSE-CONTENT](LICENSE-CONTENT)).
- 내가 만든 그림과 내용의 저작권은 만든 사람에게 있다.
````

- [ ] **Step 4: `docs/how-to-use.html`**

```html
<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>showroom-kit 사용법</title>
<style>
  :root { --bg: #0C0F24; --card: #151936; --ink: #EDEBFA; --dim: #9EA3C6; --gold: #F2C879; --line: rgba(255,255,255,.12); }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--bg); color: var(--ink); font-family: "Pretendard", "Noto Sans KR", system-ui, sans-serif; line-height: 1.7; word-break: keep-all; }
  main { max-width: 860px; margin: 0 auto; padding: 48px 20px 80px; }
  h1 { font-size: 32px; margin: 0 0 6px; }
  .lead { color: var(--dim); margin: 0 0 32px; }
  .flow { display: grid; gap: 14px; }
  .step { display: grid; grid-template-columns: 48px 1fr; gap: 14px; padding: 18px 20px; border: 1px solid var(--line); border-radius: 16px; background: var(--card); }
  .num { width: 48px; height: 48px; border-radius: 50%; display: grid; place-items: center; background: var(--gold); color: #1A1630; font-weight: 800; font-size: 20px; }
  .who { display: inline-block; font-size: 12px; font-weight: 700; padding: 2px 8px; border-radius: 6px; margin-left: 6px; vertical-align: middle; }
  .me { background: rgba(242,200,121,.18); color: var(--gold); }
  .ai { background: rgba(169,184,232,.18); color: #C9D2FF; }
  h2 { font-size: 19px; margin: 0 0 4px; }
  p, li { color: var(--dim); margin: 4px 0; }
  code { background: rgba(255,255,255,.08); padding: 1px 6px; border-radius: 6px; color: var(--ink); }
  .arrow { text-align: center; color: var(--gold); font-size: 20px; line-height: 1; }
  .note { margin-top: 28px; padding: 16px 20px; border-radius: 14px; border: 1px dashed var(--line); }
</style>
</head>
<body>
<main>
  <h1>showroom-kit 사용법</h1>
  <p class="lead">처음부터 배포까지 순서대로 따라 하면 된다. <span class="who me">선생님</span>은 내가 직접, <span class="who ai">AI</span>는 AI 도구가 하는 일이다.</p>

  <div class="flow">
    <div class="step"><div class="num">1</div><div>
      <h2>계정 만들기 <span class="who me">선생님</span></h2>
      <p>GitHub 계정을 만들고, Vercel(vercel.com)에 GitHub 계정으로 가입한다. Node.js 22.18 이상과 git, AI 코딩 도구 하나를 설치한다.</p>
    </div></div>
    <div class="arrow">↓</div>
    <div class="step"><div class="num">2</div><div>
      <h2>템플릿 복사 <span class="who me">선생님</span></h2>
      <p>키트 저장소에서 <code>Use this template</code> → <code>Create a new repository</code>. 내 저장소를 내 컴퓨터로 내려받아 AI 도구로 연다.</p>
    </div></div>
    <div class="arrow">↓</div>
    <div class="step"><div class="num">3</div><div>
      <h2>"쇼룸 만들어줘" <span class="who me">선생님</span> <span class="who ai">AI</span></h2>
      <p>AI가 이름과 소속, 큰 제목, 소개, 링크, 콘셉트를 하나씩 묻는다. 학교 이름은 공개해도 될 때만 넣는다. AI가 설정 파일을 채우고 링크마다 그림 장면을 써서 보여 준다.</p>
    </div></div>
    <div class="arrow">↓</div>
    <div class="step"><div class="num">4</div><div>
      <h2>그림 만들기 <span class="who me">선생님</span></h2>
      <p>AI가 만든 <code>docs/art-brief.md</code>를 연다. 그림마다 [A][B][C] 세 칸을 이어 붙여 Gemini나 ChatGPT에 넣는다.</p>
      <ul>
        <li>1번 그림을 먼저 만들고, 마음에 들면 나머지는 1번을 기준 이미지로 첨부해 같은 화풍으로 만든다.</li>
        <li>만든 그림은 <code>art-raw/</code> 폴더에 표에 적힌 파일 이름 그대로 저장한다.</li>
        <li>무료 요금제는 하루 생성 횟수 제한이 있다. 그림이 없어도 사이트는 동작하니 천천히 채워도 된다.</li>
      </ul>
    </div></div>
    <div class="arrow">↓</div>
    <div class="step"><div class="num">5</div><div>
      <h2>"그림 넣어줘" <span class="who ai">AI</span></h2>
      <p>AI가 그림을 웹용으로 바꾸고(<code>npm run art</code>), 검사하고(<code>npm run check</code>), 빌드를 확인한 뒤 커밋하고 푸시한다.</p>
    </div></div>
    <div class="arrow">↓</div>
    <div class="step"><div class="num">6</div><div>
      <h2>배포 <span class="who me">선생님</span></h2>
      <p>Vercel에서 <code>Add New → Project</code> → 내 저장소 <code>Import</code> → <code>Deploy</code>. 프로젝트 이름이 주소(<code>이름.vercel.app</code>)가 된다. 다음부터는 푸시만 하면 자동으로 바뀐다.</p>
    </div></div>
  </div>

  <div class="note">
    <p><b>지켜 주세요</b>: 학생 이름, 사진, 성적 같은 개인정보와 실제 사람 얼굴 그림은 넣지 않습니다. API 키나 비밀번호는 필요 없고, 저장소에 넣으면 안 됩니다. 내가 만든 것만 링크합니다.</p>
  </div>
</main>
</body>
</html>
```

- [ ] **Step 5: 라이선스**

`LICENSE`:

```text
MIT License

Copyright (c) 2026 dossamlab
Copyright (c) 2026 shinnanchanguk (dorms-linktree-template)

이 라이선스는 이 저장소의 **코드**에 적용된다:
`src/`, `scripts/`, 그리고 루트의 설정 파일들(`package.json`, `tsconfig.json`, `next.config.ts`).

`docs/`의 문서, 그림 지시서 틀, `src/config/theme.ts`의 화풍 문장(`artStyle`)은
별도 라이선스를 따른다. LICENSE-CONTENT 참조.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

`LICENSE-CONTENT`:

```markdown
# 콘텐츠 라이선스: CC BY-NC-SA 4.0

이 라이선스는 이 저장소의 **콘텐츠**에 적용된다:
`docs/`의 모든 문서, 그림 지시서 틀, `src/config/theme.ts`의 화풍 문장(`artStyle`).

    Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
    (CC BY-NC-SA 4.0)
    https://creativecommons.org/licenses/by-nc-sa/4.0/deed.ko

요약. 다음이 허용된다:
- **공유**: 어떤 매체로든 복제·배포
- **변경**: 리믹스·변형·2차적 저작물 작성

조건:
- **저작자 표시(BY)**: 출처를 밝힐 것
- **비영리(NC)**: 상업적 목적으로 이용할 수 없다
- **동일조건변경허락(SA)**: 변경했다면 같은 라이선스로 배포할 것

수업, 연수, 공개 교육 자료 배포는 전부 여기에 해당한다.

**직접 만든 내용은 이 라이선스에 매이지 않는다.** 내 링크, 소개 문구, 내가 만든 그림의
저작권은 만든 사람의 것이다.
```

- [ ] **Step 6: 긴 줄표 검사와 Commit**

```bash
grep -rn "—" AGENTS.md README.md docs/how-to-use.html LICENSE-CONTENT GEMINI.md .github/copilot-instructions.md || echo "no long dash"
git add AGENTS.md CLAUDE.md GEMINI.md .github/copilot-instructions.md README.md docs/how-to-use.html LICENSE LICENSE-CONTENT
git commit -m "docs: AI 도구 공통 안내, README, 사용법 순서도, 라이선스" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```
Expected: `no long dash`

---

### Task 6: 전체 검증

**Files:**
- Create(로컬, git 제외): `.claude/launch.json`

- [ ] **Step 1: 검사와 빌드**

```bash
npm run check && npm run build
```
Expected: 경고 1줄(조형물 그림 없음)과 `ok`, 빌드 성공.

- [ ] **Step 2: 테마 3종 화면 확인**

`.claude/launch.json`:

```json
{
  "version": "0.0.1",
  "configurations": [
    { "name": "showroom-kit", "runtimeExecutable": "npm.cmd", "runtimeArgs": ["run", "dev", "--", "--port", "3300"], "port": 3300 }
  ]
}
```

`preview_start`로 `showroom-kit`을 연다. `src/config/theme.ts`의 `THEME_ID`를 `"night-museum"`, `"lavender-lab"`, `"research-notebook"`으로 차례로 바꾸며 PC(1280x800)와 폰 폭에서 확인한다.
- 글자와 버튼이 잘 읽히는지(밝은 테마에서 흰 글자가 사라지지 않는지).
- 밝은 테마는 격자 무늬, 어두운 테마는 별 무늬인지.
- 그림 없는 카드가 테마 색 블록과 아이콘으로 보이는지.
- 카드 펼침 상세, Esc 닫기, 초점 복귀, 띠 흐름, 진열장 선.

확인이 끝나면 `THEME_ID`를 `"night-museum"`으로 되돌린다.

- [ ] **Step 3: 그림이 있는 상태 확인**

이번에는 투명 배경 PNG 조형물로 시험한다(Task 3에서는 불투명 그림의 원형 마스크를 시험했다).

```bash
mkdir -p art-raw
node -e "const s=require('sharp');s({create:{width:1500,height:1500,channels:4,background:{r:0,g:0,b:0,alpha:0}}}).composite([{input:Buffer.from('<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1500\" height=\"1500\"><circle cx=\"750\" cy=\"750\" r=\"500\" fill=\"#F2C879\"/></svg>')}]).png().toFile('art-raw/hero-object.png').then(()=>console.log('made'))"
npm run art
```

미리보기에서 조형물이 떠 있고, 마우스 쪽으로 기울고, 스크롤하면 위로 흘러가는지 본다. 움직임 줄이기를 흉내 내면 멈춰 있는지 본다. 확인 뒤 정리한다.

```bash
rm -rf art-raw public/visuals
git checkout src/config/visuals.ts
```

- [ ] **Step 4: 작업 폴더 지침에 키트 추가**

`C:/Users/user/vibe-coding/CLAUDE.md`의 프로젝트 지도 표에 한 줄 추가(`dossamlab-linktree` 줄 다음):

```markdown
| `showroom-kit` | 다른 선생님용 쇼룸 템플릿 키트(도쌤 쇼룸 일반화). 원격 `dossamlab/showroom-kit` | Next.js + Motion. `npm run check`(링크·그림·대비) / `brief`(그림 지시서) / `art`(변환) |
```

- [ ] **Step 5: 사용자에게 GitHub 생성 승인 받기**

공개 저장소 생성과 템플릿 설정은 사용자 승인 뒤에 한다.

```bash
gh repo create dossamlab/showroom-kit --public --source . --push
gh repo edit dossamlab/showroom-kit --template
```

---

## 실행 중 바뀐 점

- DoRms 로고(`public/assets/dorms-community.png`)는 사용자가 만든 그림이 아니라 빼고, 새로 그린 `public/icons/community.svg`로 대신했다. 아이콘 이름 `dorms-community`도 `community`로 바꿨다. 공유 미리보기는 조형물 그림이 없으면 그림 없이 나간다.

---

## 2단계 (별도 설계)

Blender 고급형 조형물: `dossamlab-linktree/scripts/blender/sculpture.py`를 테마 색과 연동해 일반화하고, Meshy 소품 지시서와 출처 문구(`profile.credits`)를 붙인다.
