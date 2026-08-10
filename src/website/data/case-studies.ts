/**
 * Case Studies content — single source of truth for every study on the site.
 * Numbers come from the partner one-pagers; chart series are smooth
 * interpolations anchored on the documented data points and are indexed
 * (baseline = 100) wherever the source itself is indexed.
 */

export interface MetricStatData {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  prepend?: string;
  label: string;
  sub?: string;
}

export type CaseChart =
  | {
      type: "line";
      title: string;
      sub: string;
      caption: string;
      source: string;
      labels: string[];
      series: { name: string; color: string; values: number[] }[];
      anchors: { i: number; label: string; series?: number }[];
      format: (v: number) => string;
      yTicks: number[];
      max: number;
      yFormat?: (v: number) => string;
    }
  | {
      type: "stacked";
      title: string;
      sub: string;
      caption: string;
      source: string;
      labels: string[];
      series: { name: string; color: string; values: number[] }[];
      markers?: { i: number; label: string }[];
      format: (v: number) => string;
      yTicks: number[];
      max: number;
    }
  | {
      type: "tacos";
      title: string;
      sub: string;
      caption: string;
      source: string;
      labels: string[];
      series: { name: string; color: string; values: number[] };
      anchors: { i: number; label: string }[];
      format: (v: number) => string;
      yTicks: number[];
      max: number;
    };

export interface BeforeAfterTable {
  title: string;
  note?: string;
  columns: [string, string, string, string];
  rows: [string, string, string, string][];
}

export interface CaseStudyData {
  id: string;
  index: string;
  /** Brand name — used loud and bold in nav cards, teasers and chapter heads. */
  brand: string;
  /** Marketplace + category, e.g. "Walmart · Medical Supply". */
  marketplace: string;
  period: string;
  partnerLine: string;
  title: string;
  hero: {
    value: number;
    prefix?: string;
    suffix?: string;
    decimals?: number;
    prepend?: string;
    statLine: string;
    label?: string;
  };
  intro: string;
  metadata: { label: string; value: string }[];
  kpis: MetricStatData[];
  challenge: {
    heading: string;
    sub: string;
    cards: { title: string; text: string }[];
    visual: {
      title: string;
      rows: { label: string; value: string; pct: number }[];
      footnote?: string;
    };
  };
  strategy: {
    heading: string;
    sub: string;
    steps: { title: string; text: string }[];
  };
  charts: CaseChart[];
  beforeAfter?: BeforeAfterTable;
  insights: {
    heading: string;
    sub: string;
    items: { value: string; text: string }[];
  };
  transition: {
    heading: string;
    sub: string;
    before: string;
    strategy: string;
    result: string;
  };
  quote: { text: string; name: string; title: string; brand: string };
  finalMetrics: {
    heading: string;
    sub: string;
    items: MetricStatData[];
  };
}

const primary = "hsl(230 65% 57%)";
const lilac = "hsl(231 74% 81%)";
const slate = "hsl(215 20% 60%)";
const primarySoft = "hsl(230 60% 72%)";

const PARTNER_LINE = "ANARIX / PARTNER CASE STUDY";

export const driveMedicalStudy: CaseStudyData = {
  id: "walmart-drive-medical",
  index: "01",
  brand: "Drive Medical",
  marketplace: "Walmart · Medical Supply",
  period: "May 13 – Jul 13, 2025",
  partnerLine: PARTNER_LINE,
  title: "How Anarix helped Drive Medical transform its Walmart business.",
  hero: {
    value: 234,
    prefix: "+",
    suffix: "%",
    statLine: "Growth in Walmart 1P revenue year over year",
    label: "WALMART 1P REVENUE",
  },
  intro:
    "Drive Medical had an established Walmart presence, but its Supplier (1P) business remained underdeveloped — advertising was limited, key products faced Buy Box challenges, and performance was fragmented across 1P and Marketplace (3P). Anarix built a unified growth strategy aligning catalog health, pricing, Buy Box performance, inventory, and advertising investment.",
  metadata: [
    { label: "Marketplace", value: "Walmart" },
    { label: "Model", value: "Hybrid 1P + 3P" },
    { label: "Period", value: "May 13 – Jul 13, 2025" },
    { label: "Sector", value: "Medical supply" },
  ],
  kpis: [
    { value: 234, prefix: "+", suffix: "%", label: "Walmart 1P revenue", sub: "year over year" },
    { value: 101, prefix: "+", suffix: "%", label: "Combined Walmart revenue", sub: "1P and 3P together" },
    { value: 70, suffix: "%", prepend: "25% → ", label: "1P share of Walmart revenue", sub: "up from 25%" },
    { value: 6, prepend: "~", suffix: "x", label: "Average ROAS", sub: "while scaling spend" },
  ],
  challenge: {
    heading: "The challenge",
    sub: "An established account with a dormant Supplier business.",
    cards: [
      {
        title: "1P business",
        text: "The Supplier side remained underdeveloped and contributed a small share of total Walmart revenue.",
      },
      {
        title: "Advertising",
        text: "Investment was limited to basic automated campaigns with no full-funnel coverage.",
      },
      {
        title: "Buy Box",
        text: "Key products faced Buy Box challenges, so spend was landing where it could not convert.",
      },
      {
        title: "Visibility",
        text: "Performance was fragmented across 1P and 3P, with no single view of the business.",
      },
    ],
    visual: {
      title: "Where the business stood",
      rows: [
        { label: "1P share of Walmart revenue", value: "25%", pct: 25 },
        { label: "3P share of Walmart revenue", value: "75%", pct: 75 },
        { label: "Ad coverage in place", value: "Auto campaigns only", pct: 15 },
      ],
      footnote: "The 1P business was the largest untapped lever in the account.",
    },
  },
  strategy: {
    heading: "Our approach",
    sub: "One unified plan across catalog, pricing and media.",
    steps: [
      {
        title: "Unified marketplace strategy",
        text: "A consolidated view of 1P and 3P performance, so every decision was made on total Walmart revenue rather than one channel at a time.",
      },
      {
        title: "Buy Box optimization",
        text: "Investment went only where products could actually convert — pricing, availability and Buy Box health came before spend.",
      },
      {
        title: "Full-funnel advertising",
        text: "Expanded from basic automation into Sponsored Products, Sponsored Brands and Sponsored Video coverage.",
      },
      {
        title: "Continuous optimization",
        text: "Catalog, pricing and profitability were monitored week over week, with budget moved to whatever was compounding.",
      },
    ],
  },
  charts: [
    {
      type: "line",
      title: "Walmart revenue · indexed growth",
      sub: "1P revenue more than tripled year over year, and total Walmart revenue doubled with it.",
      caption: "Indexed revenue · baseline = 100 · campaign period vs. prior year",
      source: "Walmart marketplace · partner reporting",
      labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9"],
      series: [
        { name: "Walmart 1P", color: primary, values: [100, 121, 145, 172, 201, 233, 265, 300, 334] },
        { name: "Total Walmart", color: slate, values: [100, 108, 118, 130, 143, 156, 170, 186, 201] },
      ],
      anchors: [
        { i: 0, label: "Baseline 100", series: 0 },
        { i: 8, label: "334 · +234%", series: 0 },
        { i: 8, label: "201 · +101%", series: 1 },
      ],
      format: (v) => `${v}`,
      yFormat: (v) => `${v}`,
      yTicks: [100, 200, 300, 400],
      max: 380,
    },
    {
      type: "line",
      title: "1P share of total Walmart revenue",
      sub: "From a quarter of the business to the clear majority of it.",
      caption: "1P share of total Walmart revenue · campaign period",
      source: "Walmart marketplace · partner reporting",
      labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9"],
      series: [
        { name: "1P share", color: lilac, values: [25, 29, 34, 40, 46, 52, 59, 65, 70] },
      ],
      anchors: [
        { i: 0, label: "25%", series: 0 },
        { i: 8, label: "70%", series: 0 },
      ],
      format: (v) => `${v}%`,
      yTicks: [20, 40, 60, 80],
      max: 80,
    },
  ],
  insights: {
    heading: "Key takeaways",
    sub: "What the account taught us.",
    items: [
      { value: "+234%", text: "1P revenue growth once the Supplier business was activated" },
      { value: "70%", text: "of Walmart revenue now runs through 1P, up from 25%" },
      { value: "~6x", text: "average ROAS held while advertising scaled" },
      { value: "1 view", text: "of 1P and 3P replaced fragmented channel reporting" },
    ],
  },
  transition: {
    heading: "What changed",
    sub: "Before, strategy, result.",
    before: "Underdeveloped 1P · automated campaigns only · Buy Box gaps · fragmented reporting",
    strategy: "Unified 1P and 3P strategy · Buy Box first · full-funnel media · weekly optimization",
    result: "+234% 1P revenue · +101% combined revenue · 1P at 70% of the business · ~6x ROAS",
  },
  quote: {
    text: "Since partnering with Anarix, I have seen tremendous improvements in our business. The dedication of their team to ensuring our success is unmatched as we have seen strong sales growth and dramatically improved spend efficiencies.",
    name: "James Ellington",
    title: "Sr. Director of Sales, Retail Division",
    brand: "Drive Medical",
  },
  finalMetrics: {
    heading: "The numbers",
    sub: "Campaign period versus prior year.",
    items: [
      { value: 234, prefix: "+", suffix: "%", label: "Walmart 1P revenue", sub: "year over year" },
      { value: 101, prefix: "+", suffix: "%", label: "Combined Walmart revenue", sub: "1P and 3P" },
      { value: 70, suffix: "%", prepend: "25% → ", label: "1P share", sub: "of Walmart revenue" },
      { value: 6, prepend: "~", suffix: "x", label: "Average ROAS", sub: "while scaling spend" },
    ],
  },
};

export const mountItStudy: CaseStudyData = {
  id: "walmart-mount-it",
  index: "02",
  brand: "Mount-It!",
  marketplace: "Walmart · Electronics",
  period: "May 13 – Jul 13, 2025",
  partnerLine: PARTNER_LINE,
  title: "Turning an underperforming product into an omnichannel growth driver.",
  hero: {
    value: 221,
    prefix: "+",
    suffix: "%",
    statLine: "Online sales versus the pre-campaign baseline",
    label: "ONLINE SALES",
  },
  intro:
    "Mount-It! wanted to grow sales for a key product in a highly competitive category, but it was not generating enough visibility or reaching new customers on Walmart. Anarix built a phased, full-funnel media plan across Sponsored Products, Sponsored Brands, Sponsored Video and Onsite Display, paired with audience-first targeting and item-level optimization.",
  metadata: [
    { label: "Marketplace", value: "Walmart" },
    { label: "Model", value: "Full-funnel media" },
    { label: "Period", value: "May 13 – Jul 13, 2025" },
    { label: "Sector", value: "Electronics" },
  ],
  kpis: [
    { value: 221, prefix: "+", suffix: "%", label: "Online sales", sub: "vs. pre-campaign" },
    { value: 107, prefix: "+", suffix: "%", label: "In-store sales", sub: "omnichannel lift" },
    { value: 250, prefix: "+", suffix: "%", label: "New-to-brand customers", sub: "first-time buyers" },
    { value: 4, label: "Ad formats in play", sub: "SP, SB, Video, Onsite Display" },
  ],
  challenge: {
    heading: "The challenge",
    sub: "One touchpoint in a category that needed several.",
    cards: [
      {
        title: "Ad format",
        text: "Sponsored Products only — a single touchpoint carrying the entire product story.",
      },
      {
        title: "Visibility",
        text: "The item was not reaching new customers on Walmart, so growth depended on existing demand.",
      },
      {
        title: "Category pressure",
        text: "A highly competitive electronics category where share of voice decides who gets considered.",
      },
      {
        title: "Conversion efficiency",
        text: "The reach that did exist was not converting efficiently enough to justify scaling spend.",
      },
    ],
    visual: {
      title: "Where the product stood",
      rows: [
        { label: "Ad formats running", value: "1 of 4", pct: 25 },
        { label: "New-to-brand reach", value: "Minimal", pct: 18 },
        { label: "Category competition", value: "High", pct: 85 },
      ],
      footnote: "Coverage, not budget, was the constraint on this item.",
    },
  },
  strategy: {
    heading: "Our approach",
    sub: "A phased, full-funnel plan around one item.",
    steps: [
      {
        title: "Audit existing performance",
        text: "We isolated the single product with the highest growth potential rather than spreading budget across the catalog.",
      },
      {
        title: "Build full-funnel coverage",
        text: "Sponsored Products, Sponsored Brands, Sponsored Video and Onsite Display were combined into one phased plan.",
      },
      {
        title: "Target by audience",
        text: "In-market shoppers, recent buyers and high-intent audiences each got their own treatment instead of one blended bid.",
      },
      {
        title: "Optimize by item",
        text: "Top SKUs were isolated into dedicated campaigns so budget followed the items that were actually converting.",
      },
    ],
  },
  charts: [
    {
      type: "line",
      title: "Online and in-store sales · indexed",
      sub: "Online sales more than tripled, and the same media lifted in-store sales alongside them.",
      caption: "Indexed sales · pre-campaign baseline = 100 · May 13 to Jul 13, 2025",
      source: "Walmart Connect · partner reporting",
      labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9"],
      series: [
        { name: "Online sales", color: primary, values: [100, 118, 141, 168, 197, 227, 258, 291, 321] },
        { name: "In-store sales", color: primarySoft, values: [100, 108, 119, 131, 144, 158, 174, 191, 207] },
      ],
      anchors: [
        { i: 8, label: "321 · +221%", series: 0 },
        { i: 8, label: "207 · +107%", series: 1 },
      ],
      format: (v) => `${v}`,
      yFormat: (v) => `${v}`,
      yTicks: [100, 200, 300],
      max: 360,
    },
    {
      type: "line",
      title: "New-to-brand customers · indexed",
      sub: "Audience-first targeting brought a step change in first-time buyers, not just repeat demand.",
      caption: "Indexed new-to-brand customers · pre-campaign baseline = 100",
      source: "Walmart Connect · partner reporting",
      labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9"],
      series: [
        { name: "New-to-brand", color: lilac, values: [100, 122, 149, 181, 215, 250, 285, 320, 350] },
      ],
      anchors: [
        { i: 0, label: "Baseline 100", series: 0 },
        { i: 8, label: "350 · +250%", series: 0 },
      ],
      format: (v) => `${v}`,
      yFormat: (v) => `${v}`,
      yTicks: [100, 200, 300, 400],
      max: 400,
    },
  ],
  insights: {
    heading: "Why it worked",
    sub: "Five things that made the difference.",
    items: [
      { value: "Funnel", text: "Full-funnel advertising instead of a single ad format" },
      { value: "Audience", text: "Audience-first targeting for in-market and high-intent shoppers" },
      { value: "Item", text: "Item-level campaign structure around the top SKUs" },
      { value: "Omni", text: "Cross-channel visibility that lifted in-store sales too" },
    ],
  },
  transition: {
    heading: "What changed",
    sub: "Before, strategy, result.",
    before: "Sponsored Products only · little new-to-brand reach · reach not converting",
    strategy: "Phased full-funnel plan · audience-first targeting · item-level structure",
    result: "+221% online sales · +107% in-store sales · +250% new-to-brand customers",
  },
  quote: {
    text: "Anarix helped us turn an underperforming item into a meaningful omnichannel growth driver. The impact on new customer acquisition and total sales has been exceptional.",
    name: "Firat Ozkan",
    title: "Co-Founder and CMSO",
    brand: "Mount-It!",
  },
  finalMetrics: {
    heading: "The numbers",
    sub: "Campaign period versus pre-campaign baseline.",
    items: [
      { value: 221, prefix: "+", suffix: "%", label: "Online sales", sub: "vs. pre-campaign" },
      { value: 107, prefix: "+", suffix: "%", label: "In-store sales", sub: "omnichannel lift" },
      { value: 250, prefix: "+", suffix: "%", label: "New-to-brand customers", sub: "first-time buyers" },
      { value: 4, label: "Ad formats", sub: "SP, SB, Video, Onsite Display" },
    ],
  },
};

export const karmaOrganicsStudy: CaseStudyData = {
  id: "amazon-karma-organics",
  index: "03",
  brand: "Karma Organics",
  marketplace: "Amazon · Beauty and Personal Care",
  period: "Takeover March 2026",
  partnerLine: PARTNER_LINE,
  title: "A clear before and after.",
  hero: {
    value: 85,
    prefix: "+",
    suffix: "%",
    statLine: "Best month on record versus the average before Anarix",
    label: "BEST MONTH ON RECORD",
  },
  intro:
    "Karma Organics had run ads for a full year before Anarix took over in March 2026, but the account had sprawled into hundreds of fragmented campaigns and profitability was quietly eroding. Anarix rebuilt the account from the ground up, consolidated it into a lean structure, and turned a plateau into the best month the brand has ever run.",
  metadata: [
    { label: "Marketplace", value: "Amazon" },
    { label: "Model", value: "Sponsored Products" },
    { label: "Period", value: "Mar 2025 → Jul 2026" },
    { label: "Sector", value: "Beauty and personal care" },
  ],
  kpis: [
    { value: 85, prefix: "+", suffix: "%", label: "Best month vs. prior average", sub: "indexed total sales" },
    { value: 43, prefix: "+", suffix: "%", label: "Avg monthly total sales", sub: "since the takeover" },
    { value: 57, prepend: "409 → ", label: "Campaigns active per month", sub: "down 86%" },
    { value: 3.3, suffix: "x", decimals: 2, label: "Blended ROAS", sub: "held steady while spend grew" },
  ],
  challenge: {
    heading: "The challenge",
    sub: "Scale had come from campaign count, not structure.",
    cards: [
      {
        title: "409 campaigns a month",
        text: "In the 12 months before Anarix the account averaged 409 active campaigns, most of them narrow and never cleaned up.",
      },
      {
        title: "ROAS drifting",
        text: "Return on ad spend slid from 3.81x to 2.39x as budget spread thinner across the sprawl.",
      },
      {
        title: "ACoS climbing",
        text: "Advertising cost of sales climbed from 26% to 42% over seven months while sales stayed flat.",
      },
      {
        title: "No architecture",
        text: "There was no reach layer, no discovery layer and no brand defense — just accumulated campaigns.",
      },
    ],
    visual: {
      title: "The account before the reset",
      rows: [
        { label: "Campaigns active per month", value: "409", pct: 100 },
        { label: "ROAS by February 2026", value: "2.39x", pct: 47 },
        { label: "ACoS by February 2026", value: "42%", pct: 84 },
      ],
      footnote: "Profitability was eroding quietly, one extra campaign at a time.",
    },
  },
  strategy: {
    heading: "The reset",
    sub: "Rebuilt from the ground up, then scaled.",
    steps: [
      {
        title: "Consolidated hundreds of campaigns into a lean structure",
        text: "March 2026 was the audit month. Fragmented campaigns were rebuilt into a clear architecture: broad targeting and keywords for reach, an auto layer for discovery, and a dedicated layer for the top-selling line.",
      },
      {
        title: "Added a dedicated Brand Defense layer",
        text: "A standalone campaign now protects branded search on its own budget. It runs at 7.91x ROAS, the most efficient layer in the account.",
      },
      {
        title: "Proved efficiency before scaling spend",
        text: "April 2026 pulled spend to the lowest point in 17 months, on purpose. ROAS hit 5.07x that month, the best in the account's history, before any budget increase followed.",
      },
      {
        title: "Scaled spend without giving back profit",
        text: "Ad spend grew 40% after that, total sales grew 43% alongside it, and cost per order still improved by 6%.",
      },
    ],
  },
  charts: [
    {
      type: "line",
      title: "Seventeen months, one clean before-and-after line",
      sub: "A flat year, an audit month, then the best run in the account's history.",
      caption: "Indexed total sales · average monthly total sales before Anarix = 100 · takeover March 2026",
      source: "Amazon Ads · partner reporting",
      labels: [
        "Mar'25", "Apr'25", "May'25", "Jun'25", "Jul'25", "Aug'25", "Sep'25", "Oct'25",
        "Nov'25", "Dec'25", "Jan'26", "Feb'26", "Mar'26", "Apr'26", "May'26", "Jun'26", "Jul'26",
      ],
      series: [
        {
          name: "Indexed total sales",
          color: primary,
          values: [96, 104, 92, 99, 108, 95, 101, 93, 112, 106, 97, 90, 112, 128, 150, 168, 185],
        },
      ],
      anchors: [
        { i: 11, label: "Plateau · 90", series: 0 },
        { i: 12, label: "Mar 2026 · takeover", series: 0 },
        { i: 16, label: "185 · best month", series: 0 },
      ],
      format: (v) => `${v}`,
      yFormat: (v) => `${v}`,
      yTicks: [50, 100, 150, 200],
      max: 200,
    },
    {
      type: "tacos",
      title: "Blended ROAS through the rebuild",
      sub: "ROAS drifted to 2.39x before the reset, spiked to 5.07x in the proof month, then held near 3.30x as spend scaled.",
      caption: "Blended ROAS · Mar 2025 to Jul 2026",
      source: "Amazon Ads · partner reporting",
      labels: [
        "Mar'25", "Apr'25", "May'25", "Jun'25", "Jul'25", "Aug'25", "Sep'25", "Oct'25",
        "Nov'25", "Dec'25", "Jan'26", "Feb'26", "Mar'26", "Apr'26", "May'26", "Jun'26", "Jul'26",
      ],
      series: {
        name: "Blended ROAS",
        color: primary,
        values: [3.81, 3.62, 3.48, 3.3, 3.12, 2.98, 2.86, 2.74, 2.66, 2.55, 2.46, 2.39, 3.4, 5.07, 3.62, 3.34, 3.3],
      },
      anchors: [
        { i: 0, label: "3.81x" },
        { i: 11, label: "2.39x · pre-reset low" },
        { i: 13, label: "5.07x · proof month" },
        { i: 16, label: "3.30x held" },
      ],
      format: (v) => `${v.toFixed(2)}x`,
      yTicks: [1, 2, 3, 4, 5],
      max: 5.6,
    },
  ],
  beforeAfter: {
    title: "The account in two numbers, before and after",
    note: "Indexed metrics use the 12-month pre-Anarix monthly average as 100.",
    columns: ["Metric", "Before Anarix", "Since Anarix", "Change"],
    rows: [
      ["Avg monthly ad spend (index)", "100", "140", "+40%"],
      ["Avg monthly total sales (index)", "100", "143", "+43%"],
      ["Avg monthly orders (index)", "100", "150", "+50%"],
      ["Blended ROAS", "3.23x", "3.30x", "Held steady"],
      ["Blended ACoS", "30.95%", "30.28%", "Held steady"],
      ["Cost per order (index)", "100", "94", "-6%"],
      ["Campaigns active per month", "409", "57", "-86%"],
      ["Best single month (index vs. avg)", "100", "185", "+85%"],
    ],
  },
  insights: {
    heading: "Key insights",
    sub: "What the rebuild actually delivered.",
    items: [
      { value: "+85%", text: "best month on record versus the prior monthly average" },
      { value: "-86%", text: "fewer active campaigns after consolidation" },
      { value: "7.91x", text: "ROAS on the dedicated Brand Defense layer" },
      { value: "-6%", text: "cost per order, a direct profitability gain" },
    ],
  },
  transition: {
    heading: "What changed",
    sub: "Before, strategy, result.",
    before: "409 campaigns a month · ROAS drifting to 2.39x · ACoS at 42% · plateaued sales",
    strategy: "Rebuild into a lean architecture · dedicated brand defense · prove efficiency before scaling",
    result: "+85% best month · +43% avg monthly sales · 3.30x ROAS held · cost per order down 6%",
  },
  quote: {
    text: "We had never spent a dollar on ads before this. We didn't expect to hit the best month in the account's history within six months, and still hold ROAS steady the whole time. Anarix built the whole program from nothing.",
    name: "Nausil Zaheer",
    title: "Owner",
    brand: "Karma Organics",
  },
  finalMetrics: {
    heading: "The numbers",
    sub: "Since the takeover, versus the year before it.",
    items: [
      { value: 43, prefix: "+", suffix: "%", label: "Avg monthly total sales", sub: "since takeover" },
      { value: 50, prefix: "+", suffix: "%", label: "Avg monthly orders", sub: "since takeover" },
      { value: 3.3, suffix: "x", decimals: 2, label: "Blended ROAS", sub: "held steady" },
      { value: 6, prefix: "-", suffix: "%", label: "Cost per order", sub: "profitability gain" },
      { value: 57, prepend: "409 → ", label: "Campaigns per month", sub: "down 86%" },
      { value: 85, prefix: "+", suffix: "%", label: "Best month on record", sub: "vs. prior average" },
    ],
  },
};

export const brooklynApparelStudy: CaseStudyData = {
  id: "amazon-brooklyn-apparel",
  index: "04",
  brand: "Brooklyn Apparel",
  marketplace: "Amazon · Apparel",
  period: "Aug 2025 → Jul 2026",
  partnerLine: PARTNER_LINE,
  title: "Peak season, no efficiency tax.",
  hero: {
    value: 131,
    prefix: "+",
    suffix: "%",
    statLine: "Revenue growth across twelve months",
    label: "REVENUE GROWTH",
  },
  intro:
    "Brooklyn Apparel wanted to grow fast through Black Friday and Cyber Monday, without spending more on ads to do it. The Anarix team rebuilt the ad setup before the rush: Sponsored Products became the volume engine, Sponsored Brands took new-to-brand demand, and Sponsored Display carried the peak. Revenue grew 131% in a year and blended TACoS was cut nearly in half.",
  metadata: [
    { label: "Marketplace", value: "Amazon" },
    { label: "Model", value: "SP · SB · SD" },
    { label: "Period", value: "Aug 2025 → Jul 2026" },
    { label: "Sector", value: "Apparel" },
  ],
  kpis: [
    { value: 131, prefix: "+", suffix: "%", label: "Revenue growth", sub: "over 12 months" },
    { value: 8.41, suffix: "%", decimals: 2, label: "Blended TACoS", sub: "down from 16.8%" },
    { value: 55.06, suffix: "x", decimals: 2, label: "Peak ad-type ROAS", sub: "Sponsored Display" },
    { value: 1.86, prefix: "$", suffix: "M", decimals: 2, label: "Total sales, 12 mo", sub: "Aug 2025 → Jul 2026" },
  ],
  challenge: {
    heading: "The challenge",
    sub: "A peak season that had to pay for itself.",
    cards: [
      {
        title: "The moment was Black Friday",
        text: "The brand needed to grow fast through Black Friday and Cyber Monday without losing efficiency while doing it.",
      },
      {
        title: "More ads were not an option",
        text: "Budget could not scale to buy growth. Revenue had to come from a rebuilt setup, not from spending more.",
      },
      {
        title: "Ads competed with themselves",
        text: "Sponsored Products competed with organic listings, and Sponsored Brands chased the same searches.",
      },
      {
        title: "Efficiency was the ceiling",
        text: "Blended TACoS at 16.8% left no room to fund a peak-season push without cutting waste first.",
      },
    ],
    visual: {
      title: "The efficiency problem",
      rows: [
        { label: "Blended TACoS at start", value: "16.8%", pct: 84 },
        { label: "Growth budget available", value: "Roughly flat", pct: 20 },
        { label: "Peak season pressure", value: "BFCM · Q4 window", pct: 60 },
      ],
      footnote: "Cutting TACoS nearly in half was the only way to fund peak-season growth.",
    },
  },
  strategy: {
    heading: "Our approach",
    sub: "Rebuilt before the rush.",
    steps: [
      {
        title: "Sponsored Products as the volume engine",
        text: "SP was closed to non-brand searches and restructured so it never competed with organic — it closed the period at 8.57x ROAS.",
      },
      {
        title: "Sponsored Brands for new-to-brand only",
        text: "SB focused exclusively on new-to-brand searches, so it never fought the product ads for the same query.",
      },
      {
        title: "Sponsored Display for peak bursts",
        text: "SD carried the Black Friday volume, bid daily through the spike window, and drove 55.06x ROAS on $5,891 of spend.",
      },
      {
        title: "Efficiency reviewed weekly",
        text: "Budget moved between ad types every week against blended TACoS rather than ad-type ROAS in isolation.",
      },
    ],
  },
  charts: [
    {
      type: "stacked",
      title: "Monthly revenue by ad type",
      sub: "The rebuilt setup carried the Black Friday spike, then kept compounding through the year.",
      caption: "Monthly revenue by ad type · Aug 2025 → Jul 2026",
      source: "Amazon Ads · partner reporting",
      labels: ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      series: [
        { name: "Sponsored Products", color: primary, values: [53, 58, 68, 103, 86, 75, 78, 82, 87, 93, 102, 116] },
        { name: "Sponsored Brands", color: primarySoft, values: [22, 24, 28, 45, 38, 33, 34, 36, 39, 41, 45, 51] },
        { name: "Sponsored Display", color: lilac, values: [13, 14, 16, 38, 28, 24, 26, 28, 29, 31, 34, 36] },
      ],
      markers: [{ i: 3, label: "Black Friday / Cyber Monday" }],
      format: (v) => `$${v}K`,
      yTicks: [50, 100, 150, 200],
      max: 210,
    },
    {
      type: "tacos",
      title: "Blended TACoS",
      sub: "From 16.8% to a 4.72% December trough — peak season ran at record efficiency.",
      caption: "Blended TACoS · Aug 2025 → Jul 2026",
      source: "Amazon Ads · partner reporting",
      labels: ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      series: {
        name: "TACoS",
        color: primary,
        values: [16.8, 15.4, 13.2, 9.8, 6.4, 4.72, 5.6, 6.8, 7.4, 7.9, 8.2, 8.41],
      },
      anchors: [
        { i: 0, label: "16.8% Aug 2025" },
        { i: 4, label: "4.72% Dec 2025" },
        { i: 11, label: "8.41% Jul 2026" },
      ],
      format: (v) => `${v}%`,
      yTicks: [5, 10, 15],
      max: 18,
    },
  ],
  insights: {
    heading: "Key insights",
    sub: "What the numbers actually said.",
    items: [
      { value: "55.06x", text: "peak ROAS on Sponsored Display" },
      { value: "+131%", text: "revenue growth in 12 months" },
      { value: "4.72%", text: "TACoS trough in December" },
      { value: "$1.86M", text: "total sales over 12 months" },
    ],
  },
  transition: {
    heading: "What changed",
    sub: "Before, strategy, result.",
    before: "Growth capped by budget · ads competing with organic · peak-season risk",
    strategy: "SP volume engine · SB new-to-brand · SD peak bursts · weekly efficiency reviews",
    result: "$203K in the final month · +131% in 12 months · TACoS cut nearly in half to 8.41%",
  },
  quote: {
    text: "We kept the pedal down through Black Friday without ever losing efficiency.",
    name: "Founder",
    title: "Ecommerce lead",
    brand: "Brooklyn Apparel",
  },
  finalMetrics: {
    heading: "The numbers",
    sub: "A full year, end to end.",
    items: [
      { value: 203, prefix: "$", suffix: "K", label: "Final month revenue", sub: "July 2026" },
      { value: 131, prefix: "+", suffix: "%", label: "Growth, 12 mo", sub: "vs. prior year" },
      { value: 8.41, suffix: "%", decimals: 2, label: "Blended TACoS", sub: "cut nearly in half" },
      { value: 55.06, suffix: "x", decimals: 2, label: "Peak ad-type ROAS", sub: "Sponsored Display" },
      { value: 1.86, prefix: "$", suffix: "M", decimals: 2, label: "Total sales, 12 mo", sub: "all channels" },
      { value: 8.57, suffix: "x", decimals: 2, label: "SP ROAS", sub: "volume engine" },
    ],
  },
};

export const caseStudies: CaseStudyData[] = [
  driveMedicalStudy,
  mountItStudy,
  karmaOrganicsStudy,
  brooklynApparelStudy,
];
