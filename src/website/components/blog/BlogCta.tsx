import { ArrowRight } from "lucide-react";
import { RELATED_SERVICES } from "@blog-shared";

import { Link } from "@/lib/router";

/** Deliberately quiet — a single line + one button, never a full section, per spec §5. */
export function BlogCta({ serviceId }: { serviceId?: string }) {
  const service = RELATED_SERVICES.find((s) => s.id === serviceId) ?? RELATED_SERVICES[0];

  return (
    <div
      className="ws-card border-primary/20 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
      style={{
        background: "linear-gradient(120deg, hsl(var(--primary) / 0.08), hsl(var(--accent) / 0.5))",
      }}
    >
      <div>
        <p className="text-base font-semibold text-foreground font-display">{service.label}</p>
        <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
      </div>
      <Link to={service.href} className="ws-btn ws-btn--primary btn-shine shrink-0">
        Learn more <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
