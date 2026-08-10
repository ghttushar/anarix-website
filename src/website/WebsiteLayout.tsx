import { Outlet } from "@tanstack/react-router";
import { MotionConfig } from "framer-motion";
import { Toaster } from "sonner";

import { AanProvider } from "@/components/aan/AanContext";
import { BrandingProvider } from "@/contexts/BrandingContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

import AanWebsitePanel from "./components/AanWebsitePanel";
import { FloatingActionIsland } from "./components/FloatingActionIsland";
import { LeadCaptureProvider } from "./components/lead-capture/LeadCaptureContext";
import LeadCaptureModal from "./components/lead-capture/LeadCaptureModal";

/**
 * Shell for every marketing route: providers, the scoped design-system wrapper
 * and the persistent surfaces (Aan panel, action island, lead capture modal).
 */
export default function WebsiteLayout() {
  return (
    <ThemeProvider>
      <BrandingProvider>
        <AanProvider>
          <MotionConfig reducedMotion="user">
            <LeadCaptureProvider>
              <div className="website-scope relative min-h-screen bg-background text-foreground antialiased">
                <Outlet />
                {/* Single Aan surface for the website, opened from the action island. */}
                <FloatingActionIsland />
                <AanWebsitePanel />
                <LeadCaptureModal />
                <Toaster position="bottom-right" />
              </div>
            </LeadCaptureProvider>
          </MotionConfig>
        </AanProvider>
      </BrandingProvider>
    </ThemeProvider>
  );
}
