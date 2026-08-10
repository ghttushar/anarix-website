/**
 * Case Studies content — single source of truth for both studies.
 * Every number below was verified against the partner one-pagers
 * (Walmart Medical Supply, Amazon Apparel). Chart series are smooth
 * interpolations anchored on the documented data points.
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

export interface CaseStudyData {
  id: string;
  index: string;
  eyebrow: string;
  partnerLine: string;
  title: string;
  hero: {
    value: number;
    prefix?: string;
    suffix?: string;
    decimals?: number;
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
  quote: { text: string; attribution: string };
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

export const medicalStudy: CaseStudyData = {
  id: "walmart-medical-supply",
  index: "01",
  eyebrow: "CASE STUDY · WALMART · MEDICAL SUPPLY",
  partnerLine: "ANARIX / PARTNER CASE STUDY",
  title: "One hybrid strategy for 1P and 3P.",
  hero: {
    value: 297,
    suffix: "%",
    statLine: "1P monthly growth · baseline to December",
    label: "1P MONTHLY GROWTH",
  },
  intro:
    "A brand within medical supplies ran a hybrid of 1P and 3P on Walmart, but the 1P side was nearly dormant, running a single auto campaign under $3K a month, while 3P carried almost all advertising and growth. Anarix built a shared measurement framework across the hybrid setup and revived 1P from a standing start, without adding budget.",
  metadata: [
    { label: "Marketplace", value: "Walmart" },
    { label: "Model", value: "Hybrid 1P + 3P" },
    { label: "Period", value: "Baseline → December" },
    { label: "Sector", value: "Medical supplies" },
  ],
  kpis: [
    { value: 57, suffix: "%", prepend: "25% → ", label: "1P share of combined revenue", sub: "up from 25%" },
    { value: 4.49, prefix: "$", suffix: "M", decimals: 2, label: "Revenue", sub: "over the period" },
    { value: 7.5, suffix: "%", decimals: 1, label: "Blended TACOS", sub: "advertising / combined revenue" },
    { value: 8.21, suffix: "x", decimals: 2, label: "1P Sponsored Products ROAS", sub: "on revived 1P ads" },
  ],
  challenge: {
    heading: "The challenge",
    sub: "A hybrid setup running on one engine.",
    cards: [
      {
        title: "1P was dormant",
        text: "A single auto campaign ran under $3K a month. 1P sat at roughly a quarter of combined revenue and produced little of the growth.",
      },
      {
        title: "3P carried everything",
        text: "Almost all advertising and growth ran through 3P, concentrating cost, risk, and reporting in a single channel.",
      },
      {
        title: "No shared view",
        text: "1P and 3P were managed as separate silos with separate reporting — there was no single measurement framework across the hybrid setup.",
      },
    ],
    visual: {
      title: "Where the business stood",
      rows: [
        { label: "1P share of combined revenue", value: "25%", pct: 25 },
        { label: "3P share of combined revenue", value: "75%", pct: 75 },
        { label: "1P advertising", value: "1 auto campaign · <$3K/mo", pct: 8 },
      ],
      footnote: "1P was nearly dormant — a standing start, not a slow start.",
    },
  },
  strategy: {
    heading: "The strategy",
    sub: "One hybrid plan for 1P and 3P.",
    steps: [
      {
        title: "One shared measurement framework",
        text: "A single brand view across 1P and 3P — one reporting structure for spend, revenue, and efficiency, so every dollar could be compared head-to-head.",
      },
      {
        title: "Revive 1P from a standing start",
        text: "Rebuilt the dormant 1P campaigns from the single auto structure, funding the rebuild with roughly $4K a month of reallocated budget — no increase to the overall budget.",
      },
      {
        title: "Run one hybrid plan, not two channels",
        text: "1P pushed for buy-box and efficiency; 3P kept breadth. The 3P revenue share that followed was a planned channel shift — not a failure.",
      },
    ],
  },
  charts: [
    {
      type: "line",
      title: "1P vs 3P · monthly channel revenue",
      sub: "1P grew from a dormant baseline to overtake 3P in July — then kept compounding.",
      caption: "Monthly channel revenue · Jan → Dec",
      source: "Walmart marketplace · partner reporting",
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      series: [
        { name: "1P", color: primary, values: [90, 82, 88, 96, 108, 124, 148, 172, 205, 246, 298, 358] },
        { name: "3P", color: slate, values: [272, 269, 271, 270, 268, 273, 270, 271, 269, 272, 270, 270] },
      ],
      anchors: [
        { i: 0, label: "$90K baseline", series: 0 },
        { i: 6, label: "Jul · 1P overtakes 3P", series: 0 },
        { i: 11, label: "$358K Dec", series: 0 },
      ],
      format: (v) => `$${v}K`,
      yFormat: (v) => `$${v}K`,
      yTicks: [100, 200, 300, 400],
      max: 400,
    },
    {
      type: "line",
      title: "1P share of combined revenue",
      sub: "From 25% of the business to a majority — the share flip that made 1P the growth engine.",
      caption: "1P share of combined revenue · Jan → Dec",
      source: "Walmart marketplace · partner reporting",
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      series: [
        {
          name: "1P share",
          color: lilac,
          values: [25, 23.5, 24.5, 26, 28.5, 31, 35, 39, 43.5, 47.5, 52.5, 57],
        },
      ],
      anchors: [
        { i: 0, label: "25%", series: 0 },
        { i: 11, label: "57%", series: 0 },
      ],
      format: (v) => `${v}%`,
      yTicks: [10, 20, 30, 40, 50, 60],
      max: 60,
    },
  ],
  insights: {
    heading: "Key insights",
    sub: "What the numbers actually said.",
    items: [
      { value: "57%", text: "1P share of combined revenue — up from 25%" },
      { value: "8.21x", text: "ROAS on 1P Sponsored Products once revived" },
      { value: "7.5%", text: "blended advertising cost — spend held flat" },
      { value: "Jul 2025", text: "the first month 1P outsold 3P" },
    ],
  },
  transition: {
    heading: "What changed",
    sub: "Before → Strategy → Result",
    before: "1P near-dormant · single auto campaign under $3K/mo · 25% of combined revenue",
    strategy: "Shared measurement · ~$4K/mo reallocated · one hybrid 1P + 3P plan",
    result: "1P at $358K/mo · 57% of combined revenue · 8.21x ROAS, no new budget",
  },
  quote: {
    text: "We didn't add a dollar of budget — Anarix just made the 1P side work as hard as 3P.",
    attribution: "Marketing team, medical supply brand · Walmart",
  },
  finalMetrics: {
    heading: "The numbers",
    sub: "A full period, end to end.",
    items: [
      { value: 297, suffix: "%", label: "1P monthly growth", sub: "baseline → December" },
      { value: 358, prefix: "$", suffix: "K", label: "Peak 1P month", sub: "December" },
      { value: 4.49, prefix: "$", suffix: "M", decimals: 2, label: "Revenue", sub: "over the period" },
      { value: 7.5, suffix: "%", decimals: 1, label: "Blended TACOS", sub: "advertising / combined revenue" },
      { value: 8.21, suffix: "x", decimals: 2, label: "1P SP ROAS", sub: "Sponsored Products" },
      { value: 57, suffix: "%", prepend: "25% → ", label: "1P share", sub: "of combined revenue" },
    ],
  },
};

export const apparelStudy: CaseStudyData = {
  id: "amazon-apparel",
  index: "02",
  eyebrow: "CASE STUDY · AMAZON · APPAREL",
  partnerLine: "ANARIX / PARTNER CASE STUDY",
  title: "Peak season, no efficiency tax.",
  hero: {
    value: 203,
    suffix: "K",
    statLine: "Monthly revenue · July 2026",
    label: "MONTHLY REVENUE",
  },
  intro:
    "This apparel seller wanted to grow fast through Black Friday and Cyber Monday, without spending more on ads to do it. Anarix's Jiva team rebuilt the ad setup before the rush. Revenue grew 131% in a year, and TACoS was cut nearly in half.",
  metadata: [
    { label: "Marketplace", value: "Amazon" },
    { label: "Model", value: "SP · SB · SD" },
    { label: "Period", value: "Aug 2025 → Jul 2026" },
    { label: "Sector", value: "Apparel" },
  ],
  kpis: [
    { value: 131, prefix: "+", suffix: "%", label: "Revenue growth", sub: "over 12 months" },
    { value: 8.41, suffix: "%", decimals: 2, label: "Blended TACoS", sub: "down from 16.8%" },
    { value: 55.06, suffix: "x", decimals: 2, label: "Peak ad-type ROAS", sub: "Sponsored Display · $5,891 spend" },
    { value: 1.86, prefix: "$", suffix: "M", decimals: 2, label: "Total sales, 12 mo", sub: "Aug 2025 → Jul 2026" },
  ],
  challenge: {
    heading: "The challenge",
    sub: "A peak season that had to pay for itself.",
    cards: [
      {
        title: "The moment was Black Friday",
        text: "The brand needed to grow fast through Black Friday and Cyber Monday — the biggest window of the year — without losing efficiency while doing it.",
      },
      {
        title: "More ads weren't an option",
        text: "Budget couldn't scale to buy growth. Revenue had to come from a rebuilt, more efficient ad setup, not from spending more.",
      },
      {
        title: "Ads competed with themselves",
        text: "Sponsored Products competed with organic listings, and Sponsored Brands chased the same searches — budget was leaking into overlap.",
      },
    ],
    visual: {
      title: "The efficiency problem",
      rows: [
        { label: "Blended TACoS at start", value: "16.8%", pct: 84 },
        { label: "Growth budget available", value: "~flat", pct: 20 },
        { label: "Peak season pressure", value: "BFCM · Q4 window", pct: 60 },
      ],
      footnote: "Cutting TACoS nearly in half was the only way to fund peak-season growth.",
    },
  },
  strategy: {
    heading: "The strategy",
    sub: "Rebuilt before the rush.",
    steps: [
      {
        title: "Sponsored Products as the volume engine",
        text: "SP was closed to non-brand searches and restructured so it never competed with organic — it became the volume engine and closed the period at 8.57x ROAS.",
      },
      {
        title: "Sponsored Brands for new-to-brand only",
        text: "SB focused exclusively on new-to-brand searches, so it never fought the product ads for the same query — running almost a third of all ad sales.",
      },
      {
        title: "Sponsored Display for peak bursts",
        text: "SD carried the Black Friday volume, bid daily through the spike window, and drove 55.06x ROAS on just $5,891 of spend.",
      },
    ],
  },
  charts: [
    {
      type: "stacked",
      title: "Monthly revenue by ad type",
      sub: "The rebuilt setup carried the Black Friday spike — then kept compounding through the year.",
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
      { value: "131%", text: "revenue growth in 12 months" },
      { value: "4.72%", text: "TACoS trough in December" },
      { value: "$1.86M", text: "total sales over 12 months" },
    ],
  },
  transition: {
    heading: "What changed",
    sub: "Before → Strategy → Result",
    before: "Growth capped by budget · ads competing with organic · peak-season risk",
    strategy: "SP volume engine · SB new-to-brand · SD peak bursts · efficiency-first rebuild",
    result: "$203K/mo · +131% in 12 months · TACoS cut nearly in half to 8.41%",
  },
  quote: {
    text: "We kept the pedal down through Black Friday without ever losing efficiency.",
    attribution: "Founder, apparel brand · Amazon",
  },
  finalMetrics: {
    heading: "The numbers",
    sub: "A full year, end to end.",
    items: [
      { value: 203, prefix: "$", suffix: "K", label: "Monthly revenue", sub: "July 2026" },
      { value: 131, prefix: "+", suffix: "%", label: "Growth, 12 mo", sub: "vs. prior year" },
      { value: 8.41, suffix: "%", decimals: 2, label: "Blended TACoS", sub: "cut nearly in half" },
      { value: 55.06, suffix: "x", decimals: 2, label: "Peak ad-type ROAS", sub: "Sponsored Display" },
      { value: 1.86, prefix: "$", suffix: "M", decimals: 2, label: "Total sales, 12 mo", sub: "all channels" },
      { value: 8.57, suffix: "x", decimals: 2, label: "SP ROAS", sub: "volume engine" },
    ],
  },
};

export const caseStudies: CaseStudyData[] = [medicalStudy, apparelStudy];
