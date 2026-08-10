import { motion } from "framer-motion";
import { Check, X, Sparkles, Link2, Store, LayoutGrid } from "lucide-react";

/**
 * Scroll-revealed feature story below the analyzer.
 * Alternating copy/visual rows; the visual card enters with a soft lift and
 * its inner elements stagger in afterwards.
 */

const copyIn = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const cardIn = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1 },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.18 } },
};

const itemIn = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

const Row = ({
  eyebrow,
  accent,
  rest,
  body,
  visual,
  flip,
}: {
  eyebrow?: string;
  accent: string;
  rest: string;
  body: string[];
  visual: React.ReactNode;
  flip?: boolean;
}) => (
  <motion.div
    className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center py-16 sm:py-28"
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, margin: "-15%" }}
    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
  >
    <motion.div variants={copyIn} className={flip ? "order-2" : ""}>
      {eyebrow && (
        <span className="inline-flex items-center gap-1.5 rounded-pill border border-border bg-surface-elevated px-3 py-1 text-xs font-semibold text-primary">
          <Sparkles className="w-3.5 h-3.5" />
          {eyebrow}
        </span>
      )}
      <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.1] text-foreground">
        <span className="text-gradient-primary">{accent}</span> {rest}
      </h2>
      {body.map((line) => (
        <p key={line} className="mt-5 text-base text-muted-foreground leading-relaxed max-w-xl">
          {line}
        </p>
      ))}
    </motion.div>

    <motion.div
      variants={cardIn}
      className={flip ? "order-1" : ""}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div variants={stagger} className="relative">
        {visual}
      </motion.div>
    </motion.div>
  </motion.div>
);

const Panel = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-3xl border border-border bg-card shadow-medium overflow-hidden">{children}</div>
);

const ScoreBar = ({ value, label, sub }: { value: number; label: string; sub?: string }) => (
  <motion.div variants={itemIn} className="p-5 border-t border-border">
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-sm font-semibold text-foreground">{label}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
      <p className="font-numeric text-3xl font-bold text-foreground tabular-nums">{value}%</p>
    </div>
    <div className="mt-3 h-2 rounded-pill bg-accent/60 overflow-hidden">
      <motion.div
        className="h-full rounded-pill bg-primary"
        initial={{ width: 0 }}
        whileInView={{ width: `${value}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  </motion.div>
);

const BrowserChrome = ({ url }: { url: string }) => (
  <motion.div variants={itemIn} className="flex items-center gap-2 bg-surface-elevated px-4 py-3 border-b border-border">
    <span className="flex gap-1.5">
      {["bg-destructive/60", "bg-primary/40", "bg-primary/70"].map((dot) => (
        <span key={dot} className={`w-2.5 h-2.5 rounded-full ${dot}`} />
      ))}
    </span>
    <span className="flex-1 truncate rounded-pill bg-background border border-border px-3 py-1 text-xs text-muted-foreground">
      {url}
    </span>
  </motion.div>
);

const PasteVisual = () => (
  <Panel>
    <BrowserChrome url="https://www.amazon.com/dp/B08N5WRWNW" />
    <motion.div variants={itemIn} className="p-5 flex items-center gap-3">
      <span className="flex items-center gap-2 flex-1 rounded-pill border border-border bg-background px-3 py-2.5 text-xs text-muted-foreground">
        <Link2 className="w-3.5 h-3.5 text-primary" />
        <span className="truncate">amazon.com/dp/B08N5WRWNW</span>
      </span>
      <span className="rounded-pill bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground">
        Analyze
      </span>
    </motion.div>
    <ScoreBar value={41} label="Amazon US · Overall image score" sub="Main image + 3 variants" />
    <motion.ul variants={itemIn} className="p-5 space-y-2.5 border-t border-border">
      {["Main image resolution below 1600px", "Product occupies 62% of the frame"].map((line) => (
        <li key={line} className="flex items-start gap-2.5 text-xs text-muted-foreground">
          <span className="mt-0.5 flex items-center justify-center w-4 h-4 rounded-full bg-destructive/15 text-destructive flex-shrink-0">
            <X className="w-2.5 h-2.5" />
          </span>
          {line}
        </li>
      ))}
    </motion.ul>
  </Panel>
);

const RULES: { label: string; ok: boolean }[] = [
  { label: "Pure white background (RGB 255,255,255)", ok: true },
  { label: "Zoom-ready at 1600px or larger", ok: true },
  { label: "No text, badges or watermarks", ok: false },
  { label: "Product fills 85% of the frame", ok: false },
  { label: "No props competing with the product", ok: true },
  { label: "At least four informative variants", ok: false },
];

const RulesVisual = () => (
  <Panel>
    <motion.div variants={itemIn} className="flex items-center justify-between gap-3 px-5 py-4 bg-surface-elevated border-b border-border">
      <p className="text-sm font-semibold text-foreground">Marketplace rule check</p>
      <span className="font-numeric text-xs text-muted-foreground tabular-nums">40+ rules</span>
    </motion.div>
    <ul className="p-2">
      {RULES.map((rule) => (
        <motion.li
          key={rule.label}
          variants={itemIn}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-foreground"
        >
          <span
            className={`flex items-center justify-center w-5 h-5 rounded-full flex-shrink-0 ${
              rule.ok ? "bg-primary/15 text-primary" : "bg-destructive/15 text-destructive"
            }`}
          >
            {rule.ok ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
          </span>
          <span className="text-xs text-muted-foreground">{rule.label}</span>
        </motion.li>
      ))}
    </ul>
  </Panel>
);

const MarketplaceVisual = () => (
  <Panel>
    <motion.div variants={itemIn} className="px-5 py-4 bg-surface-elevated border-b border-border flex items-center gap-2">
      <Store className="w-4 h-4 text-primary" />
      <p className="text-sm font-semibold text-foreground">Marketplace</p>
    </motion.div>
    <div className="p-4 space-y-2.5">
      {[
        { name: "Amazon US", score: 62, active: true },
        { name: "Walmart US", score: 34, active: false },
      ].map((mp) => (
        <motion.div
          key={mp.name}
          variants={itemIn}
          className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${
            mp.active ? "border-primary/40 bg-primary/5" : "border-border bg-background"
          }`}
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-accent/60 text-primary flex-shrink-0">
            <LayoutGrid className="w-4 h-4" />
          </span>
          <span className="flex-1 text-sm font-semibold text-foreground">{mp.name}</span>
          <span className="font-numeric text-lg font-bold text-foreground tabular-nums">{mp.score}%</span>
        </motion.div>
      ))}
    </div>
    <ScoreBar value={78} label="Score after rule-specific fixes" sub="Same asset, per-marketplace crops" />
  </Panel>
);

const FixVisual = () => (
  <Panel>
    <motion.div variants={itemIn} className="relative aspect-square bg-accent/40 flex items-center justify-center">
      <div className="w-1/2 h-1/2 rounded-3xl bg-card border border-border shadow-soft" />
      <motion.span
        className="absolute top-4 left-4 rounded-pill bg-card border border-border px-3 py-1 text-xs font-semibold text-primary"
        initial={{ opacity: 0, y: -8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        Regenerated
      </motion.span>
    </motion.div>
    <ScoreBar value={87} label="Projected score after fix" sub="Up from 41% on the original asset" />
    <motion.div variants={itemIn} className="p-5 border-t border-border">
      <span className="flex items-center justify-center gap-2 rounded-pill bg-primary h-11 text-sm font-semibold text-primary-foreground">
        <Sparkles className="w-4 h-4" />
        Get my image
      </span>
    </motion.div>
  </Panel>
);

const CompareVisual = () => (
  <Panel>
    <motion.div variants={itemIn} className="px-5 py-4 bg-surface-elevated border-b border-border">
      <p className="text-sm font-semibold text-foreground">Compare to the category leader</p>
    </motion.div>
    <div className="grid grid-cols-2 gap-3 p-4">
      {[
        { tag: "Your listing", score: 41 },
        { tag: "Best seller #1", score: 92 },
      ].map((col) => (
        <motion.div key={col.tag} variants={itemIn} className="rounded-2xl border border-border p-3">
          <div className="aspect-square rounded-xl bg-accent/50" />
          <p className="mt-3 text-xs font-semibold text-muted-foreground">{col.tag}</p>
          <p className="font-numeric text-2xl font-bold text-foreground tabular-nums">{col.score}%</p>
        </motion.div>
      ))}
    </div>
    <ScoreBar value={92} label="Category benchmark" sub="Top three organic results" />
  </Panel>
);

const FeatureStory = () => (
  <section className="mt-16" aria-label="How the listing analyzer works">
    <Row
      eyebrow="Easier than copy and paste"
      accent="Paste a link."
      rest="Get the whole picture."
      body={[
        "If you can copy and paste, you can run an audit. Drop in an Amazon ASIN, a Walmart item ID, or the full product URL — we pull the live main image straight off the listing.",
        "No signup, no tagging, no spreadsheet. The score and the issue list land in a few seconds.",
      ]}
      visual={<PasteVisual />}
    />
    <Row
      flip
      eyebrow="40+ marketplace rules"
      accent="Graded against"
      rest="the rules that actually gate you."
      body={[
        "Resolution, background purity, frame fill, watermarks, prop clutter, variant coverage — every check maps to a published marketplace requirement or a pattern we see in top-ranked listings.",
        "Critical issues are separated from nice-to-haves, so you know what to fix first.",
      ]}
      visual={<RulesVisual />}
    />
    <Row
      eyebrow="Amazon and Walmart"
      accent="Multiple marketplaces?"
      rest="No problem."
      body={[
        "Each marketplace scores images differently. We grade against the rule set for the channel you sell on, then show what the same asset would score elsewhere.",
        "One source image, per-channel guidance.",
      ]}
      visual={<MarketplaceVisual />}
    />
    <Row
      flip
      eyebrow="Click to fix"
      accent="Regenerate"
      rest="instead of rebriefing a designer."
      body={[
        "Once the audit is done, generate a corrected version of your main image — reframed, cleaned up, and cropped to the rules it failed.",
        "Preview it in the tool, then have the full-resolution file sent to your inbox.",
      ]}
      visual={<FixVisual />}
    />
    <Row
      eyebrow="Benchmarks"
      accent="See how you stack up"
      rest="against the best seller."
      body={[
        "Scores only mean something in context. We compare your images against the leaders in your category so you know whether you are competing or coasting.",
        "That gap is usually where the missing conversion sits.",
      ]}
      visual={<CompareVisual />}
    />
  </section>
);

export default FeatureStory;
