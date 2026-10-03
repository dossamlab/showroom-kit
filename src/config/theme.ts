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
