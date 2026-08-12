import { useEffect } from "react";

import { useLocation } from "@/lib/router";

import { useLeadCapture } from "./LeadCaptureContext";

const SEEN_KEY = "anarix.leadPrompt.seen";
const SCROLL_TRIGGER = 0.4;
const BLOCKED = ["/company/contact"];

/**
 * Shows the lead modal once per session, either on exit intent or after the
 * visitor has read 40% of the page. Never interrupts the contact page.
 */
export default function LeadCapturePrompt() {
  const { openLeadCapture } = useLeadCapture();
  const location = useLocation();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (BLOCKED.some((path) => location.pathname.startsWith(path))) return;
    if (window.sessionStorage.getItem(SEEN_KEY)) return;

    let done = false;
    const fire = () => {
      if (done) return;
      done = true;
      window.sessionStorage.setItem(SEEN_KEY, "1");
      openLeadCapture();
    };

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max >= SCROLL_TRIGGER) fire();
    };
    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) fire();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [location.pathname, openLeadCapture]);

  return null;
}
