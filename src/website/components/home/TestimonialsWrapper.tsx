import { useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Play, Quote, Sparkles } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import TrustMarquee from "@/website/components/TrustMarquee";
import firatImg from "@/assets/testimonials/firat.png";
import jamesImg from "@/assets/testimonials/james.jpg";
import nausilImg from "@/assets/testimonials/nausil.png";
import joeyImg from "@/assets/testimonials/joey-dweck.jpg";
import nasVideo from "../../../../public/testimonials/video.mp4.asset.json";
import joeyVideo from "../../../../public/testimonials/joey-dweck.mp4.asset.json";

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
    "Anarix helped us rethink how we approach growth on Walmart, from a conversion-first mindset to a true full-funnel strategy. By unlocking visibility at the top of the funnel and executing with precision throughout the shopper journey, they turned an underperforming SKU into a meaningful omnichannel growth driver.",
  author: "Firat Ozkan",
  role: "Co-Founder, CMO and CSO · Mount-It!",
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
  src: nasVideo.url,
  poster: "/testimonials/nas-poster.jpg",
  quote:
    "Working with Anarix has been a game changer. In just my second month, I've already seen a 20–22% increase in sales. They're rebuilding my website, helping grow my Amazon presence, and now expanding into Walmart and TikTok Shop.",
  author: "Nausil Zaheer (Nas)",
  role: "Owner, Karma Organics",
  image: nausilImg,
};

const JOEY: Person = {
  src: joeyVideo.url,
  poster: "/testimonials/joey-dweck-poster.jpg",
  quote:
    "They spoke to me about more than just advertising. They looked at my business very holistically, not just the Amazon marketplace, but the entire ecosystem. I felt that they were just a part of my team right away.",
  author: "Joey Dweck",
  role: "Director of E-Commerce and Brand Strategy",
  image: joeyImg,
};

/** Placeholder testimonial - replace src, poster, author, role, quote and image with the real upload. */
const NEW_CUSTOMER: Person = {
  src: nasVideo.url,
  quote: "Placeholder quote for the next customer story.",
  author: "New Customer",
  role: "Company - Role",
  image: jamesImg,
};

/** Full quote, no truncation, no expander. */
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
  <div
    className={`flex items-center gap-3 pt-4 border-t ${inverted ? "border-background/15" : "border-border"}`}
  >
    <Avatar className="h-9 w-9 shrink-0">
      <AvatarImage src={person.image} alt={person.author} className="object-cover" />
      <AvatarFallback className="bg-gradient-to-br from-primary to-periwinkle text-primary-foreground font-bold">
        {person.author[0]}
      </AvatarFallback>
    </Avatar>
    <div>
      <div className="text-sm font-semibold">{person.author}</div>
      <div className={`text-xs ${inverted ? "opacity-70" : "text-muted-foreground"}`}>
        {person.role}
      </div>
    </div>
  </div>
);

/** Slim attribution overlaid on the bottom of a video tile. */
const OverlayByline = ({ person }: { person: Person }) => (
  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent pt-12 pb-4 px-4">
    <div className="flex items-center gap-3">
      <Avatar className="h-9 w-9 shrink-0 ring-2 ring-white/25">
        <AvatarImage src={person.image} alt={person.author} className="object-cover" />
        <AvatarFallback className="bg-gradient-to-br from-primary to-periwinkle text-primary-foreground font-bold">
          {person.author[0]}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <div className="text-sm font-semibold text-white truncate">{person.author}</div>
        <div className="text-xs text-white/70 truncate">{person.role}</div>
      </div>
    </div>
  </div>
);

const VideoBody = ({ person, byline }: { person: Person; byline?: ReactNode }) => {
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
              style={{
                background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--periwinkle)))",
              }}
            />
            <Play className="relative w-5 h-5 text-primary translate-x-0.5" fill="currentColor" />
          </span>
        </button>
      )}
      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-pill bg-background/85 text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground">
        Customer Story
      </div>
      {byline}
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
  <section className="relative py-20 px-6 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-accent/20 via-background to-accent/10" />

    <div className="relative container-wide px-4">
      <motion.div
        className="max-w-5xl mb-8"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-pill bg-primary/10 text-primary text-xs font-medium uppercase tracking-[0.14em]">
          <Sparkles className="w-3.5 h-3.5" /> Proof
        </div>
        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground tracking-tight leading-[1.1] text-balance">
          These are brands who started{" "}
          <span className="text-gradient-primary">exactly where you are.</span>
        </h2>
      </motion.div>

      <div className="mb-8">
        <TrustMarquee />
      </div>

      {/* Mosaic: row 1 = quote | portrait | portrait | quote, row 2 = Joey split card.
          Portrait videos are true 9:16 with a byline overlay scrim. */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <motion.article
          className="relative lg:col-span-3 order-1 flex flex-col justify-center p-6 rounded-3xl bg-card border border-border shadow-soft overflow-hidden"
          {...CARD_IN}
          transition={{ delay: 0.05, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-30 pointer-events-none"
            style={{
              background: "radial-gradient(circle, hsl(var(--primary) / 0.25), transparent 70%)",
            }}
          />
          <Quote className="w-10 h-10 text-primary/20 mb-3" strokeWidth={1.5} />
          <QuoteText
            text={FIRAT.quote}
            className="font-display text-lg sm:text-xl text-foreground leading-[1.4] tracking-tight mb-5"
          />
          <Byline person={FIRAT} />
        </motion.article>

        <motion.article
          className="lg:col-span-3 order-3 relative overflow-hidden rounded-3xl border border-border shadow-medium"
          {...CARD_IN}
          transition={{ delay: 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={VIDEO_GRADIENT}
        >
          <div className="relative" style={{ aspectRatio: "9 / 16" }}>
            <VideoBody person={NAUSIL} byline={<OverlayByline person={NAUSIL} />} />
          </div>
        </motion.article>

        <motion.article
          className="lg:col-span-3 order-4 relative overflow-hidden rounded-3xl border border-border shadow-medium"
          {...CARD_IN}
          transition={{ delay: 0.15, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={VIDEO_GRADIENT}
        >
          <div className="relative" style={{ aspectRatio: "9 / 16" }}>
            <VideoBody person={NEW_CUSTOMER} byline={<OverlayByline person={NEW_CUSTOMER} />} />
          </div>
        </motion.article>

        <motion.article
          className="relative lg:col-span-3 order-2 flex flex-col justify-center p-6 rounded-3xl bg-card border border-border shadow-soft overflow-hidden"
          {...CARD_IN}
          transition={{ delay: 0.2, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full opacity-20 pointer-events-none"
            style={{
              background: "radial-gradient(circle, hsl(var(--periwinkle) / 0.4), transparent 70%)",
            }}
          />
          <Quote className="w-10 h-10 text-primary/20 mb-3" strokeWidth={1.5} />
          <QuoteText
            text={JAMES.quote}
            className="font-display text-lg sm:text-xl text-foreground leading-[1.4] tracking-tight mb-5"
          />
          <Byline person={JAMES} />
        </motion.article>

        <motion.article
          className="lg:col-span-12 order-5 relative flex flex-col lg:flex-row rounded-3xl border border-border shadow-medium overflow-hidden"
          {...CARD_IN}
          transition={{ delay: 0.25, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={VIDEO_GRADIENT}
        >
          <div className="p-6 lg:p-8 flex flex-col justify-center gap-4 text-background lg:w-5/12">
            <QuoteText
              text={JOEY.quote}
              inverted
              className="font-display text-lg sm:text-xl leading-[1.4] tracking-tight"
            />
            <Byline person={JOEY} inverted />
          </div>
          <div className="relative lg:w-7/12" style={{ aspectRatio: "16 / 9" }}>
            <VideoBody person={JOEY} />
          </div>
        </motion.article>
      </div>
    </div>
  </section>
);

export default TestimonialsWrapper;
