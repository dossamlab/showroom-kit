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
