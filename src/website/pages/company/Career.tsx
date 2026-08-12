import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ArrowRight, Heart, Zap, Users, Globe, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/router";
import PageLayout from "@/website/components/PageLayout";

const positions = [
  { title: "Senior ML Engineer", dept: "Engineering", location: "Remote", type: "Full-time", desc: "Build and deploy ML models that optimize ad spend for 500+ brands. Work with large-scale data pipelines and real-time bidding systems." },
  { title: "Full-Stack Developer", dept: "Engineering", location: "New York / Remote", type: "Full-time", desc: "Build the Anarix platform using React, TypeScript, and Node.js. Own features from design to deployment." },
  { title: "Product Designer", dept: "Design", location: "Remote", type: "Full-time", desc: "Design intuitive interfaces for complex data visualization and AI-powered workflows. User research to pixel-perfect delivery." },
  { title: "Senior Account Manager", dept: "Client Success", location: "New York", type: "Full-time", desc: "Manage a portfolio of high-growth brands. Be the strategic partner that drives results using our platform." },
  { title: "Data Analyst", dept: "Analytics", location: "Remote", type: "Full-time", desc: "Analyze campaign performance data to identify optimization opportunities. Build dashboards and automated reporting." },
  { title: "Content Marketing Manager", dept: "Marketing", location: "Remote", type: "Full-time", desc: "Create compelling content that drives organic growth. Blog posts, case studies, whitepapers, and social media." },
];

const perks = [
  { icon: Heart, title: "Health and Wellness", desc: "Full medical, dental, vision + $500/mo wellness stipend." },
  { icon: Zap, title: "Growth Budget", desc: "$2K/year for courses, conferences, and books." },
  { icon: Globe, title: "Remote First", desc: "Work from anywhere. Async by default." },
  { icon: Users, title: "Team Retreats", desc: "Quarterly in-person gatherings around the world." },
];

const Careers = () => {
  const [expandedJob, setExpandedJob] = useState<number | null>(null);

  return (
    <PageLayout>
      <div className="container-page px-6">
        {/* Hero with animated stats */}
        <motion.div
          className="text-center gap-heading"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.08] mb-6">
            Build the Future of{" "}
            <span className="text-gradient-primary">E-commerce</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
            Join a team that's passionate about helping brands grow profitably.
          </p>

          {/* Animated counters */}
          <div className="flex items-center justify-center gap-grid sm:gap-grid-lg">
            {[
              { value: "40+", label: "Team Members" },
              { value: "8", label: "Countries" },
              { value: "6", label: "Open Roles" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <div className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Culture perks */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 gap-block">
          {perks.map((p, i) => (
            <motion.div
              key={p.title}
              className="pad-card-sm rounded-2xl border border-border bg-gradient-to-br from-card to-accent/30 text-center"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
            >
              <p.icon className="w-7 h-7 text-primary mx-auto mb-3" />
              <h4 className="font-semibold text-foreground text-sm mb-1">{p.title}</h4>
              <p className="text-xs text-muted-foreground">{p.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Open positions - accordion */}
        <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-6">Open Positions</h2>
        <div className="space-y-3 gap-block">
          {positions.map((pos, i) => (
            <motion.div
              key={pos.title}
              className="rounded-xl border border-border bg-card overflow-hidden hover:border-primary/30 transition-all duration-300"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.06, duration: 0.4 }}
            >
              <button
                className="w-full flex items-center justify-between p-5 text-left"
                onClick={() => setExpandedJob(expandedJob === i ? null : i)}
                aria-expanded={expandedJob === i}
                aria-controls={`job-panel-${i}`}
                aria-label={`${pos.title}, ${pos.dept}, ${pos.location}`}
              >
                <div>
                  <h4 className="font-semibold text-foreground">{pos.title}</h4>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span>{pos.dept}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{pos.location}</span>
                    <span>{pos.type}</span>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${expandedJob === i ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {expandedJob === i && (
                  <motion.div
                    id={`job-panel-${i}`}
                    role="region"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 border-t border-border pt-4">
                      <p className="text-sm text-muted-foreground mb-4">{pos.desc}</p>
                      <Button size="sm" className="rounded-pill bg-primary text-primary-foreground btn-shine">
                        Apply Now <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-muted-foreground mb-4">Don't see your role? We're always looking for great people.</p>
          <Link to="/company/contact"><Button className="rounded-pill bg-primary text-primary-foreground btn-shine">Send Open Application</Button></Link>
        </div>
      </div>
    </PageLayout>
  );
};

export default Careers;
