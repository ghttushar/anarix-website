import { motion } from "framer-motion";
import { useState, type MouseEvent, type ReactNode } from "react";
import type { CaseChart } from "../../data/case-studies";

const EASE = [0.22, 1, 0.36, 1] as const;

const W = 640;
const H = 260;
const PAD = { l: 44, r: 16, t: 20, b: 32 };
const plotW = W - PAD.l - PAD.r;
const plotH = H - PAD.t - PAD.b;

function x(i: number, n: number) {
  return PAD.l + (i * plotW) / (n - 1);
}

function y(v: number, max: number) {
  return PAD.t + (1 - v / max) * plotH;
}

/** Catmull-Rom → cubic bezier, so lines stay anchored on real data points. */
export function smoothPath(pts: { x: number; y: number }[]) {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

export function areaPath(pts: { x: number; y: number }[]) {
  if (pts.length < 2) return "";
  const line = smoothPath(pts);
  return `${line} L ${pts[pts.length - 1].x} ${PAD.t + plotH} L ${pts[0].x} ${PAD.t + plotH} Z`;
}

function ChartShell({
  title,
  sub,
  caption,
  source,
  legend,
  children,
}: {
  title: string;
  sub: string;
  caption: string;
  source: string;
  legend?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-border bg-card shadow-soft p-6 sm:p-8 lg:p-10">
      <div className="flex items-baseline justify-between gap-4 flex-wrap">
        <div>
          <h3 className="font-display text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
            {title}
          </h3>
          <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{sub}</p>
        </div>
      </div>
      <div className="mt-8">{children}</div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-border/60 pt-4">
        <p className="text-xs text-muted-foreground">{caption}</p>
        <p className="text-xs text-muted-foreground/80">Source: {source}</p>
      </div>
      {legend ? <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">{legend}</div> : null}
    </div>
  );
}

function LegendDot({ name, color }: { name: string; color: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
      {name}
    </span>
  );
}

function GridLines({
  ticks,
  max,
  yFormat,
}: {
  ticks: number[];
  max: number;
  yFormat?: (v: number) => string;
}) {
  return (
    <>
      {ticks.map((t) => (
        <g key={t}>
          <line
            x1={PAD.l}
            x2={W - PAD.r}
            y1={y(t, max)}
            y2={y(t, max)}
            className="text-border"
            stroke="currentColor"
            strokeOpacity={0.5}
            strokeDasharray="4 4"
          />
          <text
            x={PAD.l - 8}
            y={y(t, max) + 3}
            textAnchor="end"
            className="fill-current text-muted-foreground text-[10px] font-medium"
          >
            {yFormat ? yFormat(t) : t}
          </text>
        </g>
      ))}
    </>
  );
}

function XLabels({ labels }: { labels: string[] }) {
  return (
    <>
      {labels.map((lbl, i) => (
        <text
          key={i}
          x={x(i, labels.length)}
          y={H - 14}
          textAnchor="middle"
          className="fill-current text-muted-foreground text-[10px] font-medium"
        >
          {lbl}
        </text>
      ))}
    </>
  );
}

/** Pulsing ring that marks the headline point of a chart. */
function PeakPulse({ cx, cy, color }: { cx: number; cy: number; color: string }) {
  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r={7}
      fill="none"
      stroke={color}
      strokeWidth={1.5}
      initial={{ scale: 0.6, opacity: 0.7 }}
      whileInView={{ scale: [0.6, 1.9, 0.6], opacity: [0.7, 0, 0.7] }}
      viewport={{ once: true }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut", delay: 1.4 }}
      style={{ transformBox: "fill-box", transformOrigin: "center" }}
    />
  );
}

function useHoverIndex(n: number) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const onMove = (e: MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const idx = Math.round((px - PAD.l) / (plotW / (n - 1)));
    setHoverIndex(Math.max(0, Math.min(n - 1, idx)));
  };
  return { hoverIndex, setHoverIndex, onMove };
}

function TooltipCard({
  cx,
  title,
  rows,
}: {
  cx: number;
  title: string;
  rows: { color: string; name: string; value: string }[];
}) {
  const side = cx > W - 180 ? "right" : "left";
  const boxX = side === "right" ? cx - 158 : cx + 12;
  const boxW = 146;
  const lineH = 16 + rows.length * 18;
  const boxY = PAD.t + 6;
  return (
    <g style={{ pointerEvents: "none" }}>
      <rect
        x={boxX}
        y={boxY}
        width={boxW}
        height={lineH}
        rx={8}
        style={{ fill: "hsl(var(--card))", stroke: "hsl(var(--border))" }}
      />
      <text
        x={boxX + 10}
        y={boxY + 14}
        className="fill-current text-muted-foreground text-[9px] font-semibold uppercase tracking-wide"
      >
        {title}
      </text>
      {rows.map((r, i) => (
        <g key={r.name}>
          <circle cx={boxX + 12} cy={boxY + 26 + i * 18} r={3} fill={r.color} />
          <text
            x={boxX + 22}
            y={boxY + 29 + i * 18}
            className="fill-current text-muted-foreground text-[10px] font-medium"
          >
            {r.name}
          </text>
          <text
            x={boxX + boxW - 10}
            y={boxY + 29 + i * 18}
            textAnchor="end"
            className="fill-current text-foreground text-[10px] font-bold"
          >
            {r.value}
          </text>
        </g>
      ))}
    </g>
  );
}

function AnnotatedDots({
  anchors,
  pts,
  colors,
  dimmed,
}: {
  anchors: { i: number; label: string; series?: number }[];
  pts: { x: number; y: number }[][];
  colors: string[];
  dimmed?: number | null;
}) {
  return (
    <>
      {anchors.map((a, k) => {
        const s = a.series ?? 0;
        const p = pts[s][a.i];
        const anchor = a.i === 0 ? "start" : a.i === pts[s].length - 1 ? "end" : "middle";
        return (
          <g key={k} opacity={dimmed !== null && dimmed !== s ? 0.25 : 1} style={{ transition: "opacity 0.2s" }}>
            <motion.circle
              cx={p.x}
              cy={p.y}
              r={5.5}
              fill={colors[s]}
              stroke="hsl(var(--card))"
              strokeWidth={2.5}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: 0.9 + k * 0.15, ease: EASE }}
            >
              <title>{a.label}</title>
            </motion.circle>
            <motion.text
              x={p.x}
              y={Math.min(p.y + 18, H - PAD.b - 2)}
              textAnchor={anchor}
              className="fill-current text-muted-foreground text-[10px] font-medium"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: 1.05 + k * 0.15 }}
            >
              {a.label}
            </motion.text>
          </g>
        );
      })}
    </>
  );
}

function LineChartCore({
  series,
  labels,
  max,
  yTicks,
  format,
  yFormat,
  anchors,
  title,
}: {
  series: { name: string; color: string; values: number[] }[];
  labels: string[];
  max: number;
  yTicks: number[];
  format: (v: number) => string;
  yFormat?: (v: number) => string;
  anchors: { i: number; label: string; series?: number }[];
  title: string;
}) {
  const n = labels.length;
  const pts = series.map((s) => s.values.map((v, i) => ({ x: x(i, n), y: y(v, max) })));
  const { hoverIndex, setHoverIndex, onMove } = useHoverIndex(n);
  const peakIdx = pts[0].reduce((bi, _p, i, arr) => (arr[i].y < arr[bi].y ? i : bi), 0);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-auto"
      role="img"
      aria-label={title}
      onMouseMove={onMove}
      onMouseLeave={() => setHoverIndex(null)}
    >
      <GridLines ticks={yTicks} max={max} yFormat={yFormat} />
      <XLabels labels={labels} />
      {hoverIndex !== null ? (
        <line
          x1={x(hoverIndex, n)}
          x2={x(hoverIndex, n)}
          y1={PAD.t}
          y2={PAD.t + plotH}
          className="text-primary"
          stroke="currentColor"
          strokeOpacity={0.4}
          strokeDasharray="3 3"
        />
      ) : null}
      {pts.map((seriesPts, si) => (
        <g
          key={si}
          opacity={hoverIndex === null ? 1 : hoverIndex === si ? 1 : 0.25}
          style={{ transition: "opacity 0.2s" }}
        >
          <motion.path
            d={areaPath(seriesPts)}
            fill={series[si].color}
            fillOpacity={0.07}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 1, delay: 0.6 }}
          />
          <motion.path
            d={smoothPath(seriesPts)}
            fill="none"
            stroke={series[si].color}
            strokeWidth={3}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 1.6, ease: EASE }}
          >
            <title>{series[si].name}</title>
          </motion.path>
        </g>
      ))}
      <AnnotatedDots anchors={anchors} pts={pts} colors={series.map((s) => s.color)} dimmed={hoverIndex} />
      {hoverIndex !== null ? (
        <>
          {pts.map((seriesPts, si) => (
            <circle
              key={si}
              cx={seriesPts[hoverIndex].x}
              cy={seriesPts[hoverIndex].y}
              r={4.5}
              fill={series[si].color}
              stroke="hsl(var(--card))"
              strokeWidth={2}
            />
          ))}
          <TooltipCard
            cx={x(hoverIndex, n)}
            title={labels[hoverIndex]}
            rows={series.map((s) => ({
              color: s.color,
              name: s.name,
              value: format(s.values[hoverIndex]),
            }))}
          />
        </>
      ) : null}
      <PeakPulse cx={pts[0][peakIdx].x} cy={pts[0][peakIdx].y} color={series[0].color} />
    </svg>
  );
}

export function LineChart({ chart }: { chart: Extract<CaseChart, { type: "line" }> }) {
  return (
    <ChartShell
      title={chart.title}
      sub={chart.sub}
      caption={chart.caption}
      source={chart.source}
      legend={chart.series.map((s) => (
        <LegendDot key={s.name} name={s.name} color={s.color} />
      ))}
    >
      <LineChartCore
        series={chart.series}
        labels={chart.labels}
        max={chart.max}
        yTicks={chart.yTicks}
        format={chart.format}
        yFormat={chart.yFormat}
        anchors={chart.anchors}
        title={chart.title}
      />
    </ChartShell>
  );
}

export function StackedBarChart({ chart }: { chart: Extract<CaseChart, { type: "stacked" }> }) {
  const n = chart.labels.length;
  const gw = plotW / n;
  const barW = gw * 0.55;
  const baseY = PAD.t + plotH;
  const { hoverIndex, setHoverIndex, onMove } = useHoverIndex(n);
  const totals = chart.series[0].values.map((_, i) => chart.series.reduce((acc, s) => acc + s.values[i], 0));
  return (
    <ChartShell
      title={chart.title}
      sub={chart.sub}
      caption={chart.caption}
      source={chart.source}
      legend={chart.series.map((s) => (
        <LegendDot key={s.name} name={s.name} color={s.color} />
      ))}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        role="img"
        aria-label={chart.title}
        onMouseMove={onMove}
        onMouseLeave={() => setHoverIndex(null)}
      >
        <GridLines ticks={chart.yTicks} max={chart.max} yFormat={(v) => chart.format(v)} />
        <XLabels labels={chart.labels} />
        {chart.markers?.map((m, k) => {
          const cx = x(m.i, n);
          return (
            <g key={k}>
              <line
                x1={cx}
                x2={cx}
                y1={PAD.t - 2}
                y2={baseY}
                className="text-primary"
                stroke="currentColor"
                strokeOpacity={0.45}
                strokeDasharray="3 3"
                strokeWidth={1.5}
              />
              <rect
                x={cx - 86}
                y={PAD.t - 26}
                width={172}
                height={20}
                rx={10}
                style={{ fill: "hsl(var(--primary) / 0.1)", stroke: "hsl(var(--primary) / 0.25)" }}
              />
              <text
                x={cx}
                y={PAD.t - 12}
                textAnchor="middle"
                className="fill-current text-primary text-[10px] font-semibold uppercase tracking-wide"
              >
                {m.label}
              </text>
            </g>
          );
        })}
        {chart.series[0].values.map((_, i) => {
          let y0 = baseY;
          return (
            <g key={i} opacity={hoverIndex === null || hoverIndex === i ? 1 : 0.45} style={{ transition: "opacity 0.2s" }}>
              {chart.series.map((s, si) => {
                const h = (s.values[i] / chart.max) * plotH;
                const rectY = y0 - h;
                y0 = rectY;
                return (
                  <motion.rect
                    key={si}
                    x={x(i, n) - barW / 2}
                    width={barW}
                    rx={3}
                    fill={s.color}
                    initial={{ y: baseY, height: 0, opacity: 0.6 }}
                    whileInView={{ y: rectY, height: h, opacity: 1 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.9, delay: i * 0.05 + si * 0.06, ease: EASE }}
                  >
                    <title>{`${s.name}: ${chart.format(s.values[i])}`}</title>
                  </motion.rect>
                );
              })}
            </g>
          );
        })}
        {hoverIndex !== null ? (
          <TooltipCard
            cx={x(hoverIndex, n)}
            title={`${chart.labels[hoverIndex]} · total ${chart.format(totals[hoverIndex])}`}
            rows={chart.series.map((s) => ({
              color: s.color,
              name: s.name,
              value: chart.format(s.values[hoverIndex]),
            }))}
          />
        ) : null}
      </svg>
    </ChartShell>
  );
}

export function TACoSChart({ chart }: { chart: Extract<CaseChart, { type: "tacos" }> }) {
  const n = chart.labels.length;
  const pts = chart.series.values.map((v, i) => ({ x: x(i, n), y: y(v, chart.max) }));
  const { hoverIndex, setHoverIndex, onMove } = useHoverIndex(n);
  const troughIdx = pts.reduce((bi, _p, i, arr) => (arr[i].y > arr[bi].y ? i : bi), 0);
  return (
    <ChartShell
      title={chart.title}
      sub={chart.sub}
      caption={chart.caption}
      source={chart.source}
      legend={<LegendDot name={chart.series.name} color={chart.series.color} />}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        role="img"
        aria-label={chart.title}
        onMouseMove={onMove}
        onMouseLeave={() => setHoverIndex(null)}
      >
        <GridLines ticks={chart.yTicks} max={chart.max} yFormat={(v) => `${v}%`} />
        <XLabels labels={chart.labels} />
        {hoverIndex !== null ? (
          <line
            x1={x(hoverIndex, n)}
            x2={x(hoverIndex, n)}
            y1={PAD.t}
            y2={PAD.t + plotH}
            className="text-primary"
            stroke="currentColor"
            strokeOpacity={0.4}
            strokeDasharray="3 3"
          />
        ) : null}
        <motion.path
          d={areaPath(pts)}
          fill={chart.series.color}
          fillOpacity={0.07}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 1, delay: 0.6 }}
        />
        <motion.path
          d={smoothPath(pts)}
          fill="none"
          stroke={chart.series.color}
          strokeWidth={3}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 1.6, ease: EASE }}
        />
        <AnnotatedDots anchors={chart.anchors} pts={[pts]} colors={[chart.series.color]} />
        {hoverIndex !== null ? (
          <>
            <circle
              cx={pts[hoverIndex].x}
              cy={pts[hoverIndex].y}
              r={4.5}
              fill={chart.series.color}
              stroke="hsl(var(--card))"
              strokeWidth={2}
            />
            <TooltipCard
              cx={x(hoverIndex, n)}
              title={chart.labels[hoverIndex]}
              rows={[{ color: chart.series.color, name: chart.series.name, value: chart.format(chart.series.values[hoverIndex]) }]}
            />
          </>
        ) : null}
        <PeakPulse cx={pts[troughIdx].x} cy={pts[troughIdx].y} color={chart.series.color} />
      </svg>
    </ChartShell>
  );
}

export function CaseChartBlock({ chart }: { chart: CaseChart }) {
  if (chart.type === "line") return <LineChart chart={chart} />;
  if (chart.type === "stacked") return <StackedBarChart chart={chart} />;
  return <TACoSChart chart={chart} />;
}
