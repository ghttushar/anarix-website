import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, Quote, Sparkles } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import TrustMarquee from "@/website/components/TrustMarquee";
import firatImg from "@/assets/testimonials/firat.png";
import jamesImg from "@/assets/testimonials/james.jpg";
import nausilImg from "@/assets/testimonials/nausil.png";
import joeyImg from "@/assets/testimonials/joey-dweck.jpg";

interface Person {
  quote: string;
  author: string;
  role: string;
  image: string;
  src?: string;
  poster?: string;
}

const FIRAT: Person = {
  quote:
    "Anarix helped us rethink how we approach growth on Walmart — from a conversion-first mindset to a true full-funnel strategy. By unlocking visibility at the top of the funnel and executing with precision throughout the shopper journey, they turned an underperforming SKU into a meaningful omnichannel growth driver.",
  author: "Firat Ozkan",
  role: "Co-Founder, CMO & CSO · Mount-It!",
  image: firatImg,
};

const JAMES: Person = {
  quote:
    "Since partnering with Anarix, I have seen tremendous improvements in our business. The dedication of their team to ensuring our success is unmatched as we have seen strong sales growth and dramatically improved spend efficiencies.",
  author: "James Ellington",
  role: "Sr. Director of Sales, Retail Division · Drive Medical",
  image: jamesImg,
};

const NAUSIL: Person = {
  src: "/testimonials/video.mp4",
  quote:
    "Working with Anarix has been a game changer. In just my second month, I've already seen a 20–22% increase in sales. They're rebuilding my website, helping grow my Amazon presence, and now expanding into Walmart and TikTok Shop.",
  author: "Nausil Zaheer (Nas)",
  role: "Owner, Karma Organics",
  image: nausilImg,
};

const JOEY: Person = {
  src: "/testimonials/joey-dweck.mp4",
  poster: "/testimonials/joey-dweck-poster.jpg",
  quote:
    "They spoke to me about more than just advertising. They looked at my business very holistically — not just the Amazon marketplace, but the entire ecosystem. I felt that they were just a part of my team right away.",
  author: "Joey Dweck",
  role: "Director of E-Commerce and Brand Strategy",
  image: joeyImg,
};

/** Full quote — no truncation, no expander. */
const QuoteText = ({
  text,
  className = "",
}: {
  text: string;
  className?: string;
  inverted?: boolean;
  limit?: number;
}) => <p className={className}>&ldquo;{text}&rdquo;</p>;

const Byline = ({ person, inverted }: { person: Person; inverted?: boolean }) => (
  <div className={`flex items-center gap-3 pt-4 border-t ${inverted ? "border-background/15" : "border-border"}`}>
    <Avatar className="h-9 w-9 shrink-0">
      <AvatarImage src={person.image} alt={person.author} className="object-cover" />
      <AvatarFallback className="bg-gradient-to-br from-primary to-periwinkle text-primary-foreground font-bold">
        {person.author[0]}
      </AvatarFallback>
    </Avatar>
    <div>
      <div className="text-sm font-semibold">{person.author}</div>
      <div className={`text-xs ${inverted ? "opacity-70" : "text-muted-foreground"}`}>{person.role}</div>
    </div>
  </div>
);

const VideoBody = ({ person }: { person: Person }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);

  const play = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    v.currentTime = 0;
    v.play();
    setPlaying(true);
  };

  return (
    <div className="relative w-full h-full bg-foreground/20">
      <video
        ref={videoRef}
        src={person.src}
        poster={person.poster}
        controls={playing}
        controlsList="nofullscreen"
        playsInline
        onEnded={() => setPlaying(false)}
        className="absolute inset-0 w-full h-full object-cover"
        preload="metadata"
      />
      {!playing && (
        <button
          onClick={play}
          className="absolute inset-0 flex items-center justify-center bg-foreground/30 hover:bg-foreground/20 transition-colors group"
          aria-label={`Play testimonial from ${person.author}`}
        >
          <span className="relative w-14 h-14 rounded-full bg-background/95 flex items-center justify-center shadow-strong group-hover:scale-105 transition-transform">
            <span
              className="absolute inset-0 rounded-full opacity-60 blur-md"
              style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--periwinkle)))" }}
            />
            <Play className="relative w-5 h-5 text-primary translate-x-0.5" fill="currentColor" />
          </span>
        </button>
      )}
      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-pill bg-background/85 text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground">
        Customer Story
      </div>
    </div>
  );
};

const CARD_IN = {
  initial: { opacity: 0, y: 18, scale: 0.97 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true, margin: "-60px" },
} as const;

const VIDEO_GRADIENT = {
  background: "linear-gradient(140deg, hsl(var(--foreground)) 0%, hsl(var(--primary)) 100%)",
};

const TestimonialsWrapper = () => (
  <section className="relative py-16 px-6 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-accent/20 via-background to-accent/10" />

    <div className="relative container-wide px-4">
      <motion.div
        className="max-w-3xl mb-6"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-pill bg-primary/10 text-primary text-xs font-medium uppercase tracking-[0.14em]">
          <Sparkles className="w-3.5 h-3.5" /> Proof
        </div>
        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground tracking-tight leading-[1.1]">
          These are brands who started{" "}
          <span className="text-gradient-primary">exactly where you are.</span>
        </h2>
      </motion.div>

      <div className="mb-6">
        <TrustMarquee />
      </div>

      {/* Collage: stacked quote + video on the left, tall video on the right,
          wide quote across the bottom. */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7 flex flex-col gap-4">
          <motion.article
            className="relative p-6 rounded-3xl bg-card border border-border shadow-soft overflow-hidden"
            {...CARD_IN}
            transition={{ delay: 0.05, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-30 pointer-events-none"
              style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.25), transparent 70%)" }}
            />
            <Quote className="w-8 h-8 text-primary/30 mb-3" strokeWidth={1.5} />
            <QuoteText
              text={FIRAT.quote}
              className="font-display text-lg sm:text-xl text-foreground leading-[1.4] tracking-tight mb-5"
            />
            <Byline person={FIRAT} />
          </motion.article>

          <motion.article
            className="relative flex flex-col flex-1 rounded-3xl border border-border shadow-medium overflow-hidden"
            {...CARD_IN}
            transition={{ delay: 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            style={VIDEO_GRADIENT}
          >
            <div className="relative flex-1 min-h-0" style={{ aspectRatio: "16 / 10" }}>
              <VideoBody person={JOEY} />
            </div>
            <div className="p-5 flex flex-col gap-3 text-background">
              <QuoteText text={JOEY.quote} inverted className="text-sm leading-[1.5] italic opacity-95" limit={140} />
              <Byline person={JOEY} inverted />
            </div>
          </motion.article>
        </div>

        <motion.article
          className="lg:col-span-5 relative flex flex-col rounded-3xl border border-border shadow-medium overflow-hidden"
          {...CARD_IN}
          transition={{ delay: 0.15, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={VIDEO_GRADIENT}
        >
          <div className="relative flex-1 min-h-0" style={{ aspectRatio: "3 / 4" }}>
            <VideoBody person={NAUSIL} />
          </div>
          <div className="p-5 flex flex-col gap-3 text-background">
            <QuoteText text={NAUSIL.quote} inverted className="text-sm leading-[1.5] italic opacity-95" limit={140} />
            <Byline person={NAUSIL} inverted />
          </div>
        </motion.article>

        <motion.article
          className="lg:col-span-12 relative p-6 sm:p-7 rounded-3xl bg-card border border-border shadow-soft overflow-hidden"
          {...CARD_IN}
          transition={{ delay: 0.2, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full opacity-20 pointer-events-none"
            style={{ background: "radial-gradient(circle, hsl(var(--periwinkle) / 0.4), transparent 70%)" }}
          />
          <Quote className="w-8 h-8 text-primary/30 mb-3" strokeWidth={1.5} />
          <QuoteText
            text={JAMES.quote}
            className="font-display text-lg sm:text-xl text-foreground leading-[1.4] tracking-tight mb-5 max-w-4xl"
          />
          <Byline person={JAMES} />
        </motion.article>
      </div>
    </div>
  </section>
);

export default TestimonialsWrapper;
