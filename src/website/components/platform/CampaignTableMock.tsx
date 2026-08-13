import { ArrowUpDown, Search, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const columns = ["Campaign", "Budget", "Spend", "Sales", "ROAS", "ACoS"];

interface Row {
  status: "Live" | "Paused" | "Completed";
  name: string;
  strategy: string;
  budget: string;
  spend: string;
  sales: string;
  roas: string;
  acos: string;
}

const rows: Row[] = [
  { status: "Live", name: "Brand Awareness · Q1", strategy: "Dynamic bids", budget: "$150.00", spend: "$2,847.32", sales: "$12,453.87", roas: "4.37x", acos: "22.9%" },
  { status: "Paused", name: "Summer Sale Campaign", strategy: "Dynamic up/down", budget: "$200.00", spend: "$1,523.45", sales: "$5,678.90", roas: "3.73x", acos: "26.8%" },
  { status: "Live", name: "Holiday Specials", strategy: "Fixed", budget: "$300.00", spend: "$8,756.23", sales: "$34,521.67", roas: "3.94x", acos: "25.4%" },
];

const statusStyle: Record<Row["status"], string> = {
  Live: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Paused: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Completed: "bg-muted text-muted-foreground",
};

/** Recreation of the campaign performance table with sortable-looking headers. */
const CampaignTableMock = () => {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-5 py-3 border-b border-border">
        <p className="text-xs sm:text-sm font-semibold text-foreground">Campaigns</p>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1 text-[11px] text-muted-foreground">
            <Search className="w-3 h-3" /> Search campaigns
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2 py-1 text-[11px] text-muted-foreground">
            <SlidersHorizontal className="w-3 h-3" /> Filter
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 sm:px-5 py-2.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                Status
              </th>
              {columns.map((c) => (
                <th
                  key={c}
                  className="px-3 py-2.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground"
                >
                  <span className="inline-flex items-center gap-1">
                    {c} <ArrowUpDown className="w-2.5 h-2.5 opacity-50" />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <motion.tr
                key={r.name}
                className="border-b border-border/60 last:border-0 hover:bg-muted/30"
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.08, duration: 0.4, ease: EASE }}
              >
                <td className="px-4 sm:px-5 py-3">
                  <span className={`inline-flex rounded-md px-1.5 py-0.5 text-[10px] font-medium ${statusStyle[r.status]}`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <p className="text-xs sm:text-sm font-medium text-foreground whitespace-nowrap">{r.name}</p>
                  <p className="text-[10px] text-muted-foreground">{r.strategy}</p>
                </td>
                <td className="px-3 py-3 font-numeric text-xs sm:text-sm text-foreground whitespace-nowrap">{r.budget}</td>
                <td className="px-3 py-3 font-numeric text-xs sm:text-sm text-foreground whitespace-nowrap">{r.spend}</td>
                <td className="px-3 py-3 font-numeric text-xs sm:text-sm text-foreground whitespace-nowrap">{r.sales}</td>
                <td className="px-3 py-3 font-numeric text-xs sm:text-sm font-semibold text-primary whitespace-nowrap">{r.roas}</td>
                <td className="px-3 py-3 font-numeric text-xs sm:text-sm text-muted-foreground whitespace-nowrap">{r.acos}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CampaignTableMock;
