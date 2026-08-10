import { motion } from "framer-motion";
import { ArrowRight, ScanSearch } from "lucide-react";

import { Link } from "@/lib/router";

/** Slim call-out banner for the free listing image analyzer. */
const ToolBanner = () => (
  <section className="relative py-6" aria-label="Free listing image analyzer">
    <div className="container-page px-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link
          to="/listing-optimization"
          className="group flex flex-col sm:flex-row items-center gap-4 rounded-2xl border border-border bg-card px-5 py-4 shadow-soft transition-all duration-200 hover:border-primary/40 hover:-translate-y-0.5"
        >
          <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary flex-shrink-0">
            <ScanSearch className="w-5 h-5" />
          </span>
          <span className="flex-1 text-center sm:text-left">
            <span className="block text-sm font-semibold text-foreground">
              New — free listing image analyzer
            </span>
            <span className="block text-sm text-muted-foreground">
              Paste an ASIN or product link and see how your main image scores on Amazon and Walmart.
            </span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-pill bg-primary px-5 h-10 text-sm font-medium text-primary-foreground flex-shrink-0">
            Analyze my listing
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </Link>
      </motion.div>
    </div>
  </section>
);

export default ToolBanner;
