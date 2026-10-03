import { cards, type LinkCard, type LinkItem } from "@/config/site";

export type GroupCard = Extract<LinkCard, { kind: "group" }>;
export type DirectLink = Extract<LinkCard, { kind: "link" }>;
export type ShowItem = LinkItem & { groupName: string };

// What the detail panel needs to grow out of the clicked card and hand focus back to it.
export type OpenCard = { item: ShowItem; layoutId: string; trigger: HTMLElement | null };

export const EASE: [number, number, number, number] = [0.2, 0.8, 0.2, 1];

export const groups = cards.filter((card): card is GroupCard => card.kind === "group");
export const directLinks = cards.filter((card): card is DirectLink => card.kind === "link");
export const itemsOf = (group: GroupCard): ShowItem[] => group.items.map((item) => ({ ...item, groupName: group.name }));
export const showItems: ShowItem[] = groups.flatMap(itemsOf);

export const newTabProps = (href: string) => (href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {});
