import { motion, useReducedMotion } from "framer-motion";

/** Names shown in the rotating trust strip. */
export const TRUSTED_BRANDS = [
  "Drive Medical",
  "Karma Organics",
  "Crazy Cups",
  "Mount-It!",
  "Aquasonic",
  "Pure Daily Care",
  "NapQueen",
  "Pete's Pasta",
  "Mothercould",
];

const Track = ({ brands }: { brands: string[] }) => (
  <>
    {brands.map((brand) => (
      <span key={brand} className="flex items-center gap-8 flex-shrink-0">
        <span className="text-sm font-semibold text-foreground/45 hover:text-foreground/80 transition-colors tracking-tight whitespace-nowrap">
          {brand}
        </span>
        <span className="w-1 h-1 rounded-full bg-border" aria-hidden="true" />
      </span>
    ))}
  </>
);

/**
 * Seamless rotating brand strip. Two identical tracks slide left by exactly
 * half the total width, so the loop never shows a gap. Falls back to a static
 * wrapped list when the visitor prefers reduced motion.
 */
const TrustMarquee = ({ label = "Trusted by operators at" }: { label?: string }) => {
  const reduced = useReducedMotion();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-6 border-b border-border/40">
      <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground/60 flex-shrink-0">
        {label}
      </span>

      {reduced ? (
        <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
          {TRUSTED_BRANDS.map((brand) => (
            <span key={brand} className="text-sm font-semibold text-foreground/45 tracking-tight">
              {brand}
            </span>
          ))}
        </div>
      ) : (
        <div
          className="relative flex-1 overflow-hidden group"
          style={{
            maskImage: "linear-gradient(90deg, transparent, black 6%, black 94%, transparent)",
            WebkitMaskImage:
              "linear-gradient(90deg, transparent, black 6%, black 94%, transparent)",
          }}
        >
          <motion.div
            className="flex items-center gap-8"
            style={{ width: "max-content" }}
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 38, ease: "linear", repeat: Infinity }}
          >
            <Track brands={TRUSTED_BRANDS} />
            <Track brands={TRUSTED_BRANDS} />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TrustMarquee;
