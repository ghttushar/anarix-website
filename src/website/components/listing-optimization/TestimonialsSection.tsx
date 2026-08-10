import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import firatImg from "@/assets/testimonials/firat.png";
import jamesImg from "@/assets/testimonials/james.jpg";
import nausilImg from "@/assets/testimonials/nausil.png";

const TESTIMONIALS = [
  {
    quote:
      "Anarix helped us rethink how we approach growth on Walmart — from a conversion-first mindset to a true full-funnel strategy. They turned an underperforming SKU into a meaningful omnichannel growth driver.",
    author: "Firat Ozkan",
    role: "Co-Founder, CMO & CSO, Mount-It!",
    image: firatImg,
  },
  {
    quote:
      "Since partnering with Anarix, I have seen tremendous improvements in our business. The dedication of their team to ensuring our success is unmatched as we have seen strong sales growth and dramatically improved spend efficiencies.",
    author: "James Ellington",
    role: "Sr. Director of Sales, Retail Division, Drive Medical",
    image: jamesImg,
  },
  {
    quote:
      "Working with Anarix has been a game changer. In just my second month, I've already seen a 20–22% increase in sales. They're helping grow my Amazon presence and expanding into Walmart and TikTok Shop.",
    author: "Nausil Zaheer (Nas)",
    role: "Owner, Karma Organics",
    image: nausilImg,
  },
];

const TestimonialsSection = () => (
  <motion.section
    className="mt-16"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.5 }}
  >
    <h2 className="text-center text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
      Trusted by brands, sellers &amp; agencies
    </h2>
    <p className="mt-2 text-center text-muted-foreground max-w-xl mx-auto">
      The same team behind Anarix's market intelligence helps sellers win with sharper listings.
    </p>
    <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {TESTIMONIALS.map((t) => (
        <figure
          key={t.author}
          className="pad-card rounded-2xl border border-border bg-card shadow-soft p-6 flex flex-col"
        >
          <Quote className="w-5 h-5 text-primary/50" />
          <blockquote className="mt-3 text-sm text-muted-foreground leading-relaxed flex-1">
            "{t.quote}"
          </blockquote>
          <figcaption className="mt-5 pt-4 border-t border-border/60 flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={t.image} alt={t.author} />
              <AvatarFallback>{t.author.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold text-foreground">{t.author}</p>
              <p className="text-xs text-muted-foreground">{t.role}</p>
            </div>
          </figcaption>
        </figure>
      ))}
    </div>
  </motion.section>
);

export default TestimonialsSection;