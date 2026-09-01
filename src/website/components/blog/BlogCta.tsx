import { ArrowRight } from "lucide-react";
import { RELATED_SERVICES } from "@blog-shared";

import { Link } from "@/lib/router";

/** Deliberately quiet — a single line + one button, never a full section, per spec §5. */
export function BlogCta({ serviceId }: { serviceId?: string }) {
  const service = RELATED_SERVICES.find((s) => s.id === serviceId) ?? RELATED_SERVICES[0];

  return (
    <div className="ws-card border-primary/20 bg-primary/5 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-foreground">{service.label}</p>
        <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
      </div>
      <Link to={service.href} className="ws-btn ws-btn--outline shrink-0">
        Learn more <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
