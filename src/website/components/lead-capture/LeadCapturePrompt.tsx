import { useEffect } from "react";

import { useLocation } from "@/lib/router";

import { useLeadCapture } from "./LeadCaptureContext";

const SEEN_KEY = "anarix.leadPrompt.seen";
const DELAY_MS = 15000;
const BLOCKED = ["/company/contact"];

/**
 * Opens the listing audit popup once per session, 15 seconds after the visitor
 * lands. Never interrupts the contact page.
 */
export default function LeadCapturePrompt() {
  const { openLeadCapture } = useLeadCapture();
  const location = useLocation();

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    if (BLOCKED.some((path) => location.pathname.startsWith(path))) return undefined;
    if (window.sessionStorage.getItem(SEEN_KEY)) return undefined;

    const id = window.setTimeout(() => {
      window.sessionStorage.setItem(SEEN_KEY, "1");
      openLeadCapture("audit");
    }, DELAY_MS);

    return () => window.clearTimeout(id);
  }, [location.pathname, openLeadCapture]);

  return null;
}
