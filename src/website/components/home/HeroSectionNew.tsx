import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import HeroDataViz from "./HeroDataViz";
import HeroManagedStudio from "./HeroManagedStudio";
import walmartPremiumBadge from "@/assets/badges/badge-walmart-premium-partner.png";
import amazonVerifiedBadge from "@/assets/badges/badge-amazon-ads-verified.png";
import walmartFinalistBadge from "@/assets/badges/badge-walmart-finalist.jpg";

/** Official partner badges, used as issued: no recolouring, no reproportioning. */
const topBadges = [
  { src: walmartPremiumBadge, alt: "Walmart Connect Premium Partner" },
  { src: amazonVerifiedBadge, alt: "Amazon Ads Verified Partner" },
];

/** Channel name: brand blue, a size up, with a hand-drawn scribble underline. */
const Channel = ({ children }: { children: string }) => (
  <span className="relative inline-block whitespace-nowrap font-bold text-primary text-[1.18em] leading-none">
    {children}
    <svg
      className="pointer-events-none absolute -bottom-[0.28em] left-0 h-[0.42em] w-full overflow-visible"
      viewBox="0 0 100 12"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <motion.path
        d="M1 8.4C14 4.6 27 4 40 6.4c13 2.4 26 3 39 -1.2c7 -2.3 13 -2.6 19 -0.8"
        fill="none"
        stroke="currentColor"
        className="text-primary/70"
        strokeWidth="2.6"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
      />
    </svg>
  </span>
);

const HeroSectionNew = () => {
  return (
    <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden pt-24 pb-10">
      <HeroDataViz />

      <div className="relative z-10 container-wide px-4 w-full">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 lg:items-center">
          <div className="lg:col-span-7">
            <motion.div
              className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-pill bg-primary/10 border border-primary/20 text-sm font-medium text-primary"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              Expert-managed marketplace growth
            </motion.div>

            <motion.h1
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.08] mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              Two plus marketplaces. A dozen dashboards.
              <br />
              <span className="text-gradient-primary">
                And you, checking Seller Central at 11pm.
              </span>
            </motion.h1>

            <motion.p
              className="max-w-xl text-base sm:text-lg text-muted-foreground mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              You didn&apos;t build this brand to babysit ad campaigns and chase stockouts. Anarix
              runs your <Channel>Amazon</Channel>, <Channel>Walmart</Channel>,{" "}
              <Channel>Shopify</Channel> and <Channel>TikTok</Channel> accounts end-to-end, ads,
              listings, inventory, compliance, as one team. You keep full visibility.{" "}
              <span className="text-foreground font-semibold">We take the 11pm shift.</span>
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-start gap-4 mb-8"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <a
                href="https://calendly.com/sunil-anarix/30min"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="rounded-pill px-8 h-12 text-base bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-strong active:translate-y-0 active:scale-[0.97] will-change-transform btn-shine group"
                >
                  Let us run it for you
                  <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </a>
            </motion.div>
          </div>

          <div className="lg:col-span-5 mt-10 lg:mt-0 max-w-md lg:max-w-none mx-auto w-full">
            <HeroManagedStudio />
          </div>
        </div>

        {/* Official partner badges */}
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-8">
            {topBadges.map((badge) => (
              <img
                key={badge.alt}
                src={badge.src}
                alt={badge.alt}
                loading="lazy"
                className="w-auto rounded-xl object-contain"
                style={{ height: "clamp(72px, 7vw, 104px)" }}
              />
            ))}
          </div>
          <img
            src={walmartFinalistBadge}
            alt="Walmart Connect Partner Finalist"
            loading="lazy"
            className="mx-auto mt-5 w-auto rounded-xl object-contain"
            style={{ height: "clamp(44px, 4vw, 64px)" }}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSectionNew;
