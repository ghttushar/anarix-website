import apparel from "@/assets/case-studies/apparel.jpg";
import distribution from "@/assets/case-studies/distribution.jpg";
import medicalSupply from "@/assets/case-studies/medical-supply.jpg";
import mounts from "@/assets/case-studies/mounts.jpg";
import organicCare from "@/assets/case-studies/organic-care.jpg";
import specialtyFood from "@/assets/case-studies/specialty-food.jpg";

export interface CaseMedia {
  /** Catalog-style photo standing in for the brand's category. */
  image: string;
  /** Short alt text, category only, never a private brand name. */
  alt: string;
  /** Three floating labels that describe what the team worked on. */
  chips: [string, string, string];
  /** Category label shown on the mock listing card. */
  category: string;
}

const FALLBACK: CaseMedia = {
  image: distribution,
  alt: "Premium consumer products arranged in a studio catalog grid",
  chips: ["Catalog audited", "Ads restructured", "Margin protected"],
  category: "Marketplace catalog",
};

const MEDIA: Record<string, CaseMedia> = {
  "walmart-drive-medical": {
    image: medicalSupply,
    alt: "Lightweight aluminium rollator walker photographed in a bright studio",
    chips: ["Item pages fixed", "Search share won", "Spend rebalanced"],
    category: "Mobility and medical supply",
  },
  "walmart-mount-it": {
    image: mounts,
    alt: "Matte black dual monitor arm on a walnut desk under cinematic light",
    chips: ["Variants merged", "Keywords harvested", "ROAS held"],
    category: "Ergonomic mounts and electronics",
  },
  "amazon-karma-organics": {
    image: organicCare,
    alt: "Glass nail lacquer and cuticle oil bottles with wooden caps on warm marble",
    chips: ["Listings rewritten", "Bids day-parted", "TACoS trimmed"],
    category: "Beauty and personal care",
  },
  "amazon-apparel-seller": {
    image: apparel,
    alt: "Folded premium cotton knitwear in neutral tones on a pale stone surface",
    chips: ["Peak plan built", "Formats expanded", "Efficiency kept"],
    category: "Apparel",
  },
  "walmart-specialty-food-launch": {
    image: specialtyFood,
    alt: "Artisan spice jars and a bottle of chilli sauce in warm low light",
    chips: ["Launch phased", "Content indexed", "Demand compounded"],
    category: "Specialty food",
  },
  "amazon-multi-category-distributor": {
    image: distribution,
    alt: "Travel, beauty and pantry products laid out in a clean studio grid",
    chips: ["Portfolio ranked", "Spend scaled", "ROAS improved"],
    category: "Multi-brand distribution",
  },
};

export const caseMedia = (id: string): CaseMedia => MEDIA[id] ?? FALLBACK;
