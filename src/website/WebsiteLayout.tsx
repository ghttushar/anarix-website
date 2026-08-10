import { Outlet } from "@tanstack/react-router";
import { MotionConfig } from "framer-motion";
import "./website.css";
import AanWebsitePanel from "./components/AanWebsitePanel";
import { FloatingActionIsland } from "./components/FloatingActionIsland";
import { LeadCaptureProvider } from "./components/lead-capture/LeadCaptureContext";
import LeadCaptureModal from "./components/lead-capture/LeadCaptureModal";

export default function WebsiteLayout() {
  return (
    <MotionConfig reducedMotion="user">
      <LeadCaptureProvider>
        <div className="website-scope relative min-h-screen bg-background text-foreground antialiased">
          <Outlet />
          {/* Single Aan surface for the website - opened from the Floating Action Island */}
          <FloatingActionIsland />
          <AanWebsitePanel />
          <LeadCaptureModal />
        </div>
      </LeadCaptureProvider>
    </MotionConfig>
  );
}
