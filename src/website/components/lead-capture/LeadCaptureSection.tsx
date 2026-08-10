import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const LeadCaptureSection = () => {
  const { ref, isVisible } = useScrollReveal();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow placeholder:text-muted-foreground";

  return (
    <section ref={ref} className="relative pad-section overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-periwinkle/10 pointer-events-none" />
      <div className="relative container-page px-6">
        <div
          className={`max-w-3xl mx-auto rounded-3xl border border-border bg-card shadow-soft p-8 sm:p-12 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
        >
          {!submitted ? (
            <div className="text-center mb-8">
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground leading-[1.1] mb-4">
                Get your <span className="text-gradient-primary">free margin audit</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                See exactly where your marketplace P&L is leaking — in less time than a pizza delivery.
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3 py-8 text-center"
            >
              <CheckCircle2 className="w-12 h-12 text-primary" />
              <h3 className="text-2xl font-bold text-foreground">You&apos;re all set!</h3>
              <p className="text-muted-foreground">
                We&apos;ll reach out within 24 hours to schedule your free margin audit.
              </p>
            </motion.div>
          )}

          {!submitted && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <input required type="text" name="name" placeholder="Full Name" autoComplete="name" className={inputClass} aria-label="Full Name" />
                <input required type="email" name="email" placeholder="Work Email" autoComplete="email" className={inputClass} aria-label="Work Email" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <input required name="company" placeholder="Company Name" autoComplete="organization" className={inputClass} aria-label="Company Name" />
                <input type="tel" name="phone" placeholder="Contact Number (optional)" autoComplete="tel" className={inputClass} aria-label="Contact Number (optional)" />
              </div>
              <motion.button
                type="submit"
                whileTap={{ scale: 0.98 }}
                className="group w-full inline-flex items-center justify-center gap-2 rounded-pill h-12 bg-primary text-primary-foreground text-base font-medium hover:bg-primary/90 btn-shine transition-all duration-200 hover:-translate-y-0.5 hover:shadow-strong"
              >
                Get My Free Audit
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </motion.button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default LeadCaptureSection;