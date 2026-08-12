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
  alt: "Assorted consumer products in a catalog grid",
  chips: ["Catalog audited", "Ads restructured", "Margin protected"],
  category: "Marketplace catalog",
};

const MEDIA: Record<string, CaseMedia> = {
  "walmart-drive-medical": {
    image: medicalSupply,
    alt: "Aluminium medical rollator walker on a light background",
    chips: ["Item pages fixed", "Search share won", "Spend rebalanced"],
    category: "Mobility and medical supply",
  },
  "walmart-mount-it": {
    image: mounts,
    alt: "Adjustable dual monitor desk mount on a light background",
    chips: ["Variants merged", "Keywords harvested", "ROAS held"],
    category: "Ergonomic mounts",
  },
  "amazon-karma-organics": {
    image: organicCare,
    alt: "Organic care bottles with wooden caps on a light background",
    chips: ["Listings rewritten", "Bids day-parted", "TACoS trimmed"],
    category: "Organic personal care",
  },
  "amazon-apparel-seller": {
    image: apparel,
    alt: "Folded cotton hoodie and t-shirts photographed flat",
    chips: ["Peak plan built", "Formats expanded", "Efficiency kept"],
    category: "Apparel",
  },
  "walmart-specialty-food-launch": {
    image: specialtyFood,
    alt: "Glass jars of spices and sauce on a light background",
    chips: ["Launch phased", "Content indexed", "Demand compounded"],
    category: "Specialty food",
  },
  "amazon-multi-category-distributor": {
    image: distribution,
    alt: "Assorted consumer product boxes and bottles in a grid",
    chips: ["Portfolio ranked", "Spend scaled", "ROAS improved"],
    category: "Multi-brand distribution",
  },
};

export const caseMedia = (id: string): CaseMedia => MEDIA[id] ?? FALLBACK;
