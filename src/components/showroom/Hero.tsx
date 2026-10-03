"use client";

import { Fragment } from "react";
import { motion } from "motion/react";
import { profile } from "@/config/site";
import { visuals } from "@/config/visuals";
import HeroObject from "./HeroObject";
import HeroSculpture from "./HeroSculpture";
import { EASE, directLinks, groups, newTabProps } from "./utils";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.6, ease: EASE }
});

export default function Hero() {
  return (
    <header className="sr-hero">
      <motion.span className="sr-kicker" {...fadeUp(0)}>
        {profile.kicker}
      </motion.span>
      <h1 className="sr-title" aria-label={profile.heroTitle}>
        {profile.heroTitle.split(" ").map((word, wordIndex, words) => {
          // Letters are grouped per word so a narrow screen breaks between words, not inside one.
          const start = words.slice(0, wordIndex).join("").length + wordIndex;
          return (
            <Fragment key={wordIndex}>
              {wordIndex > 0 ? " " : null}
              <span className="sr-word" aria-hidden="true">
                {Array.from(word).map((char, index) => (
                  <motion.span
                    key={index}
                    className="sr-letter"
                    initial={{ opacity: 0, y: "70%", rotate: 8 }}
                    animate={{ opacity: 1, y: "0%", rotate: 0 }}
                    transition={{ delay: 0.18 + (start + index) * 0.045, duration: 0.75, ease: EASE }}
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            </Fragment>
          );
        })}
      </h1>
      <motion.p className="sr-desc" {...fadeUp(0.8)}>
        {profile.description}
      </motion.p>
      <ul className="sr-chips" aria-label="묶음별 링크 수">
        {groups.map((group, index) => (
          <motion.li key={group.id} className="sr-chip" {...fadeUp(0.95 + index * 0.08)}>
            {group.shortName} <b>{group.items.length}</b>
          </motion.li>
        ))}
      </ul>
      <motion.div className="sr-actions" {...fadeUp(1.1)}>
        <a className="sr-btn sr-btn-primary" href="#catalog">
          전체 보기 <span aria-hidden="true">↓</span>
        </a>
        {directLinks.map((link) => (
          <a key={link.id} className="sr-btn" href={link.href} {...newTabProps(link.href)}>
            {link.name}
          </a>
        ))}
      </motion.div>
      {profile.hero === "image" && visuals.heroObject ? <HeroObject /> : null}
      {profile.hero === "sculpture" && visuals.sculptureFrames ? <HeroSculpture /> : null}
    </header>
  );
}
