"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import ShowcaseCard from "./ShowcaseCard";
import SpiralPath from "./SpiralPath";
import { EASE, groups, itemsOf, type OpenCard } from "./utils";

const GRID_SIZES = "(max-width: 767px) 50vw, (max-width: 1099px) 33vw, 260px";

export default function Catalog({ onOpen }: { onOpen: (open: OpenCard) => void }) {
  const ref = useRef<HTMLElement>(null);
  return (
    <main id="catalog" ref={ref} className="sr-catalog">
      <SpiralPath targetRef={ref} />
      {groups.map((group) => (
        <section key={group.id} id={`group-${group.id}`} className="sr-group" aria-labelledby={`group-${group.id}-title`}>
          <div className="sr-group-head" data-spiral-anchor>
            {group.emblem ? <img className="sr-emblem" src={group.emblem} alt="" width={64} height={64} /> : null}
            <div>
              <h2 id={`group-${group.id}-title`} className="sr-group-title">
                <span className="sr-group-num">{group.number}</span>
                {group.name}
              </h2>
              <p className="sr-group-desc">{group.description}</p>
            </div>
          </div>
          <div className="sr-grid">
            {itemsOf(group).map((item, index) => (
              <motion.div
                key={item.id}
                className="sr-cell"
                initial={{ opacity: 0, y: 48, rotateX: 18 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: index * 0.06, duration: 0.7, ease: EASE }}
                style={{ transformPerspective: 900 }}
              >
                <ShowcaseCard item={item} layoutId={`catalog-${item.id}`} onOpen={onOpen} sizes={GRID_SIZES} />
              </motion.div>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
