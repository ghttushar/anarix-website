import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

type Channel = {
  id: string;
  name: string;
  stat: string;
  statLabel: string;
  /** Node centre on the 800x420 stage. */
  x: number;
  y: number;
};

const channels: Channel[] = [
  { id: "amazon", name: "Amazon", stat: "3.4x", statLabel: "Blended ROAS", x: 150, y: 96 },
  { id: "walmart", name: "Walmart", stat: "11.2%", statLabel: "TACoS", x: 150, y: 324 },
  { id: "shopify", name: "Shopify", stat: "+38%", statLabel: "Repeat rate", x: 650, y: 210 },
];

const HUB = { x: 400, y: 210 };

const curve = (c: Channel): string => {
  const midX = (c.x + HUB.x) / 2;
  const lift = c.y === HUB.y ? -60 : (c.y < HUB.y ? -40 : 40);
  return `M ${c.x} ${c.y} Q ${midX} ${(c.y + HUB.y) / 2 + lift} ${HUB.x} ${HUB.y}`;
};

/**
 * Visual hook: the three marketplaces we run, wired into one operating hub,
 * with signal pulses travelling both ways. Copy-light on purpose.
 */
const MarketplaceNetwork = () => {
  const [hovered, setHovered] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();
  const activeChannel = channels.find((c) => c.id === hovered) ?? null;

  return (
    <section className="relative pad-section overflow-hidden">
      <div className="container-page px-6 sm:px-8">
        <div className="text-center max-w-2xl mx-auto pb-8">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-pill bg-primary/10 text-primary text-xs font-medium uppercase tracking-[0.14em]">
            One operating layer
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground leading-[1.08]">
            Every channel, <span className="text-gradient-primary">one nervous system.</span>
          </h2>
        </div>

        <div
          className="relative mx-auto overflow-hidden rounded-3xl border border-border bg-card shadow-medium"
          style={{ maxWidth: 960 }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 70% at 50% 40%, hsl(var(--primary) / 0.10), transparent 70%)",
            }}
          />

          <svg
            viewBox="0 0 800 420"
            className="relative w-full"
            style={{ height: "clamp(300px, 42vw, 440px)" }}
            role="img"
            aria-label="Amazon, Walmart and Shopify accounts connected into one Anarix hub"
          >
            {/* Faint grid floor */}
            <g stroke="hsl(var(--border))" opacity={0.5}>
              {Array.from({ length: 9 }, (_, i) => (
                <line key={`h${i}`} x1={0} x2={800} y1={i * 52 + 10} y2={i * 52 + 10} />
              ))}
              {Array.from({ length: 13 }, (_, i) => (
                <line key={`v${i}`} y1={0} y2={420} x1={i * 64 + 8} x2={i * 64 + 8} />
              ))}
            </g>

            {channels.map((c, idx) => {
              const dim = hovered !== null && hovered !== c.id;
              return (
                <g key={c.id} opacity={dim ? 0.25 : 1} style={{ transition: "opacity 250ms" }}>
                  <path
                    d={curve(c)}
                    fill="none"
                    stroke="hsl(var(--primary) / 0.35)"
                    strokeWidth={2}
                    strokeDasharray="6 8"
                  />
                  {!reduceMotion &&
                    [0, 1].map((p) => (
                      <motion.circle
                        key={p}
                        r={4}
                        fill="hsl(var(--primary))"
                        initial={{ offsetDistance: "0%" }}
                        animate={{ offsetDistance: "100%" }}
                        transition={{
                          duration: 3.2,
                          delay: idx * 0.6 + p * 1.6,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        style={{ offsetPath: `path("${curve(c)}")`, offsetRotate: "0deg" }}
                      />
                    ))}
                </g>
              );
            })}

            {/* Hub */}
            <g>
              {!reduceMotion && (
                <motion.circle
                  cx={HUB.x}
                  cy={HUB.y}
                  r={54}
                  fill="none"
                  stroke="hsl(var(--primary) / 0.35)"
                  style={{ originX: `${HUB.x}px`, originY: `${HUB.y}px` }}
                  animate={{ scale: [1, 1.45], opacity: [0.5, 0] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut" }}
                />
              )}
              <circle cx={HUB.x} cy={HUB.y} r={52} fill="hsl(var(--primary) / 0.12)" stroke="hsl(var(--primary) / 0.5)" />
              <text
                x={HUB.x}
                y={HUB.y - 2}
                textAnchor="middle"
                className="font-display"
                fontSize={17}
                fontWeight={600}
                fill="hsl(var(--foreground))"
              >
                Anarix
              </text>
              <text
                x={HUB.x}
                y={HUB.y + 16}
                textAnchor="middle"
                fontSize={9}
                letterSpacing="1.4"
                fill="hsl(var(--muted-foreground))"
              >
                NIGHT SHIFT
              </text>

            </g>

            {/* Channel nodes */}
            {channels.map((c) => {
              const on = hovered === c.id;
              return (
                <g
                  key={c.id}
                  onMouseEnter={() => setHovered(c.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{ cursor: "pointer", transition: "opacity 250ms" }}
                  opacity={hovered && !on ? 0.35 : 1}
                >
                  <circle
                    cx={c.x}
                    cy={c.y}
                    r={on ? 46 : 42}
                    fill="hsl(var(--card))"
                    stroke={on ? "hsl(var(--primary))" : "hsl(var(--border))"}
                    strokeWidth={on ? 2 : 1.5}
                    style={{ transition: "all 250ms" }}
                  />
                  <text
                    x={c.x}
                    y={c.y - 2}
                    textAnchor="middle"
                    fontSize={14}
                    fontWeight={600}
                    fill="hsl(var(--foreground))"
                  >
                    {c.name}
                  </text>
                  <text
                    x={c.x}
                    y={c.y + 16}
                    textAnchor="middle"
                    fontSize={13}
                    fontWeight={700}
                    className="font-numeric"
                    fill="hsl(var(--primary))"
                  >
                    {c.stat}
                  </text>
                  <text
                    x={c.x}
                    y={c.y + 62}
                    textAnchor="middle"
                    fontSize={9}
                    letterSpacing="1.4"
                    fill="hsl(var(--muted-foreground))"
                  >
                    {c.statLabel.toUpperCase()}
                  </text>

                </g>
              );
            })}
          </svg>

          {/* One live-looking stat chip, driven by the hovered node */}
          <div className="absolute inset-x-0 bottom-0 flex justify-center" style={{ paddingBottom: 18 }}>
            <motion.div
              key={activeChannel?.id ?? "idle"}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-3 rounded-pill border border-border bg-card/90 px-4 py-2 shadow-soft backdrop-blur-sm"
            >
              {activeChannel ? (
                <>
                  <span className="font-numeric text-lg font-bold leading-none text-foreground">
                    {activeChannel.stat}
                  </span>
                  <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    {activeChannel.name} · {activeChannel.statLabel}
                  </span>
                </>
              ) : (
                <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  Hover a marketplace
                </span>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketplaceNetwork;
