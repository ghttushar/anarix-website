import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

interface LeadCaptureContextValue {
  isOpen: boolean;
  openLeadCapture: () => void;
  closeLeadCapture: () => void;
}

const LeadCaptureContext = createContext<LeadCaptureContextValue | null>(null);

export const LeadCaptureProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openLeadCapture = useCallback(() => setIsOpen(true), []);
  const closeLeadCapture = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ isOpen, openLeadCapture, closeLeadCapture }),
    [isOpen, openLeadCapture, closeLeadCapture]
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
