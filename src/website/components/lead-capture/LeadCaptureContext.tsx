import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

/** Which capture flow the shared modal should show. */
export type LeadCaptureKind = "audit" | "teardown";

interface LeadCaptureContextValue {
  isOpen: boolean;
  kind: LeadCaptureKind;
  openLeadCapture: (kind?: LeadCaptureKind) => void;
  closeLeadCapture: () => void;
}

const LeadCaptureContext = createContext<LeadCaptureContextValue | null>(null);

export const LeadCaptureProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [kind, setKind] = useState<LeadCaptureKind>("teardown");

  const openLeadCapture = useCallback((next: LeadCaptureKind = "teardown") => {
    setKind(next);
    setIsOpen(true);
  }, []);
  const closeLeadCapture = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ isOpen, kind, openLeadCapture, closeLeadCapture }),
    [isOpen, kind, openLeadCapture, closeLeadCapture],
  );

  return <LeadCaptureContext.Provider value={value}>{children}</LeadCaptureContext.Provider>;
};

export const useLeadCapture = () => {
  const ctx = useContext(LeadCaptureContext);
  if (!ctx) {
    throw new Error("useLeadCapture must be used within LeadCaptureProvider");
  }
  return ctx;
};
