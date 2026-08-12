import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/router";
import Navbar from "@/website/components/Navbar";
import HeroSectionNew from "@/website/components/home/HeroSectionNew";
import PainPointsSection from "@/website/components/home/PainPointsSection";
import TestimonialsWrapper from "@/website/components/home/TestimonialsWrapper";
import ProcessSteps from "@/website/components/home/ProcessSteps";
import PhilosophySection from "@/website/components/home/PhilosophySection";
import ServicesGrid from "@/website/components/home/ServicesGrid";
import CaseStudyTeasers from "@/website/components/home/CaseStudyTeasers";
import ScrollProgress from "@/website/components/ScrollProgress";
import Footer from "@/website/components/Footer";
import NextStep from "@/website/components/marketing/NextStep";
import LeadCaptureBand from "@/website/components/lead-capture/LeadCaptureBand";
import { ArrowRight } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <ScrollProgress />

      <HeroSectionNew />


      <CaseStudyTeasers />

      <PainPointsSection />

      <ServicesGrid />


      <TestimonialsWrapper />

      <ProcessSteps />

      <PhilosophySection />

      {/* CTA Section */}
      <section className="relative pad-cta overflow-hidden">
        <div className="container-page px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-pill bg-primary/10 text-primary text-xs font-medium uppercase tracking-[0.14em]">
              The night shift
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight leading-[1.1] mb-4">
              Hand it over.{" "}
              <span className="text-gradient-primary">Sleep through the 11pm check.</span>
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Thirty minutes with our team is enough to see how your accounts would run under Anarix.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="https://calendly.com/sunil-anarix/30min" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="rounded-pill px-8 h-12 text-base bg-primary text-primary-foreground hover:bg-primary/90 btn-shine group">
                  Book a demo
                  <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </a>
              <Link to="/products">
                <Button size="lg" variant="outline" className="rounded-pill px-8 h-12 text-base border-border hover:border-primary/40 transition-all duration-200">
                  Explore the products
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <LeadCaptureBand />

      <NextStep
        title="See the numbers behind the claims"
        description="Two accounts, two marketplaces, what changed, month by month."
        to="/case-studies"
        label="Read the case studies"
      />

      <Footer />
    </div>
  );
};

export default Home;
