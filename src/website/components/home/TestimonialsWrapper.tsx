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

/** Quote with an inline expander so long quotes don't stretch the section. */
const QuoteText = ({ text, className = "", inverted }: { text: string; className?: string; inverted?: boolean }) => {
  const [open, setOpen] = useState(false);
  const long = text.length > 165;
  return (
    <p className={className}>
      &ldquo;{open || !long ? text : `${text.slice(0, 160).trimEnd()}…`}&rdquo;{" "}
      {long && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={`text-xs font-semibold underline underline-offset-2 ${
            inverted ? "text-background/80 hover:text-background" : "text-primary hover:opacity-80"
          }`}
        >
          {open ? "Read less" : "Read more"}
        </button>
      )}
    </p>
  );
};

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

const VideoCard = ({ person, delay }: { person: Person; delay: number }) => {
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
    <motion.article
      className="relative rounded-3xl border border-border shadow-medium overflow-hidden flex flex-col"
      initial={{ opacity: 0, y: 18, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{ background: "linear-gradient(140deg, hsl(var(--foreground)) 0%, hsl(var(--primary)) 100%)" }}
    >
      <div className="relative bg-foreground/20" style={{ aspectRatio: "4 / 3" }}>
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
            <span className="relative w-16 h-16 rounded-full bg-background/95 flex items-center justify-center shadow-strong group-hover:scale-105 transition-transform">
              <span
                className="absolute inset-0 rounded-full opacity-60 blur-md"
                style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--periwinkle)))" }}
              />
              <Play className="relative w-6 h-6 text-primary translate-x-0.5" fill="currentColor" />
            </span>
          </button>
        )}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-pill bg-background/85 text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground">
          Customer Story
        </div>
      </div>
      <div className="p-5 flex flex-col gap-4 text-background">
        <QuoteText text={person.quote} inverted className="text-sm leading-[1.5] italic opacity-95" />
        <Byline person={person} inverted />
      </div>
    </motion.article>
  );
};

const TextCard = ({ person, delay }: { person: Person; delay: number }) => (
  <motion.article
    className="relative p-6 sm:p-7 rounded-3xl bg-card border border-border shadow-soft overflow-hidden"
    initial={{ opacity: 0, y: 18, scale: 0.97 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
  >
    <Quote className="w-8 h-8 text-primary/30 mb-3" strokeWidth={1.5} />
    <QuoteText
      text={person.quote}
      className="font-display text-lg sm:text-xl text-foreground leading-[1.4] tracking-tight mb-6"
    />
    <Byline person={person} />
  </motion.article>
);

const TestimonialsWrapper = () => (
  <section className="relative py-16 px-6 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-accent/20 via-background to-accent/10" />

    <div className="relative container-wide px-4">
      <motion.div
        className="max-w-3xl mb-8"
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

      <div className="mb-8">
        <TrustMarquee />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <VideoCard person={NAUSIL} delay={0.05} />
        <VideoCard person={JOEY} delay={0.1} />
        <TextCard person={FIRAT} delay={0.15} />
        <TextCard person={JAMES} delay={0.2} />
      </div>
    </div>
  </section>
);

export default TestimonialsWrapper;
