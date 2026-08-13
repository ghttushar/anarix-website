import { motion } from "framer-motion";
import { CalendarClock, Mail, MapPin, Phone, Send, MessageSquare, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/website/components/PageLayout";

const Contact = () => (
  <PageLayout>
    <div className="container-page px-6">
      <div className="grid lg:grid-cols-2 gap-grid-lg items-start">
        {/* Left - creative illustration area */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Card behind the copy so the headline always reads clearly */}
          <div className="rounded-3xl border border-border bg-card shadow-strong">
            <div className="relative m-2 overflow-hidden rounded-[1.35rem] bg-gradient-to-br from-primary/12 via-accent to-primary/5 pad-card-lg min-h-[360px] flex flex-col justify-center">
              {/* Floating icons */}
              {[
                { icon: MessageSquare, x: "15%", y: "20%", delay: 0 },
                { icon: Mail, x: "70%", y: "15%", delay: 0.5 },
                { icon: Globe, x: "80%", y: "65%", delay: 1 },
                { icon: Send, x: "20%", y: "75%", delay: 1.5 },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="absolute w-10 h-10 rounded-xl bg-card/90 border border-border/60 shadow-soft flex items-center justify-center"
                  style={{ left: item.x, top: item.y }}
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 3 + i * 0.5,
                    delay: item.delay,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <item.icon className="w-5 h-5 text-primary" />
                </motion.div>
              ))}

              <div className="relative z-10">
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.08] mb-4">
                  Get in <span className="text-gradient-primary">Touch</span>
                </h1>
                <p className="text-lg text-muted-foreground mb-8">We'd love to hear from you.</p>

                <div className="space-y-3">
                  {[
                    { icon: Mail, text: "hello@anarix.ai" },
                    { icon: MapPin, text: "New York, NY" },
                    { icon: Phone, text: "+1 (555) 000-0000" },
                  ].map((row) => (
                    <div
                      key={row.text}
                      className="flex items-center gap-3 p-3 rounded-xl border border-primary/20 bg-primary/10 backdrop-blur-sm"
                    >
                      <row.icon className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium text-foreground">{row.text}</span>
                    </div>
                  ))}
                </div>

                {/* Scheduling action, set apart as a deliberate footer row */}
                <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-border/70 bg-card/80 p-4 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex w-10 h-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <CalendarClock className="w-5 h-5 text-primary" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        Prefer to talk it through?
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Thirty minutes with our team, no deck.
                      </p>
                    </div>
                  </div>
                  <a
                    href="https://calendly.com/sunil-anarix/30min"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0"
                  >
                    <Button className="w-full rounded-pill h-11 px-6 bg-primary text-primary-foreground btn-shine sm:w-auto">
                      Schedule a demo
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right - form */}
        <motion.form
          className="space-y-5 pt-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          onSubmit={(e) => e.preventDefault()}
        >
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-2">
            Send us a message
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            We typically respond within 24 hours.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">First Name</label>
              <input
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
                placeholder="Jane"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Last Name</label>
              <input
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
                placeholder="Doe"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
              placeholder="you@company.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Subject</label>
            <input
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
              placeholder="How can we help?"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Message</label>
            <textarea
              rows={5}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow resize-none"
              placeholder="Tell us more..."
            />
          </div>
          <Button
            type="submit"
            className="w-full rounded-xl h-11 bg-primary text-primary-foreground btn-shine"
          >
            Send Message <Send className="w-4 h-4 ml-1" />
          </Button>
        </motion.form>
      </div>
    </div>
  </PageLayout>
);

export default Contact;
