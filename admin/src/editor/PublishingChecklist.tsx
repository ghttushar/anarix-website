import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import type { ChecklistItem } from "@blog-shared";

export function PublishingChecklist({ items }: { items: ChecklistItem[] }) {
  return (
    <div className="admin-checklist">
      {items.map((item) => (
        <div
          key={item.key}
          className={`admin-checklist__item ${item.ok ? "ok" : "warn"} ${item.required ? "required" : ""}`}
        >
          <span className="admin-checklist__icon">
            {item.ok ? (
              <CheckCircle2 size={15} />
            ) : item.required ? (
              <XCircle size={15} />
            ) : (
              <AlertTriangle size={15} />
            )}
          </span>
          <span>
            {item.label}
            {!item.ok && item.message && (
              <span className="admin-checklist__message">→ {item.message}</span>
            )}
          </span>
        </div>
      ))}
    </div>
  );
}
