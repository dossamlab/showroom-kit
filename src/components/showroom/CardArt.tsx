"use client";

import { useState } from "react";
import { theme } from "@/config/theme";
import type { ShowItem } from "./utils";

const fallbackOf = (id: string) => {
  let hash = 0;
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return theme.artFallbacks[hash % theme.artFallbacks.length];
};

export default function CardArt({ item, sizes }: { item: ShowItem; sizes: string }) {
  const [failed, setFailed] = useState(false);

  if (item.cover && !failed) {
    return (
      <img
        className="sr-art-img"
        src={`${item.cover}-480.webp`}
        srcSet={`${item.cover}-480.webp 480w, ${item.cover}-960.webp 960w`}
        sizes={sizes}
        alt=""
        loading="lazy"
        decoding="async"
        draggable={false}
        onError={() => setFailed(true)}
      />
    );
  }
  // No illustration yet: show the item's icon (or its logo image, e.g. the DoRms tile) on a theme gradient.
  const [from, to] = fallbackOf(item.id);
  const tile = item.thumb?.kind === "image" ? item.thumb.src : `/icons/${item.thumb?.kind === "icon" ? item.thumb.icon : "school"}.svg`;
  return (
    <span className="sr-art-fallback" style={{ background: `linear-gradient(160deg, ${from}, ${to})` }}>
      <img src={tile} alt="" draggable={false} />
    </span>
  );
}
