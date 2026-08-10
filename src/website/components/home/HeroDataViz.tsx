import { useEffect, useRef } from "react";

const PARTICLE_COUNT = 120;
const CONNECTION_DIST = 150;
const GRID_CELL = CONNECTION_DIST;

// Brand palette (light mode): primary #4A62D9, accent #A7AEF2
const BRAND_HUE = 231;
const BRAND_SAT = 66;
const BRAND_LIGHT = 55;
const ACCENT_HUE = 233;
const ACCENT_SAT = 74;
const ACCENT_LIGHT = 80;

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  baseX: number; baseY: number;
  hue: number; sat: number; light: number;
  radius: number; alpha: number;
  pulseOffset: number;
}

const HeroDataViz = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const sizeRef = useRef({ w: 0, h: 0 });
  const runningRef = useRef(false);

  const initParticles = (w: number, h: number) => {
    const p: Particle[] = [];
    const cols = 14;
    const rows = 8;
    const gapX = w / (cols + 1);
    const gapY = h / (rows + 1);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const baseX = gapX * (c + 1) + (Math.random() - 0.5) * 18;
        const baseY = gapY * (r + 1) + (Math.random() - 0.5) * 18;
        const isAccent = Math.random() < 0.3;
        p.push({
          x: baseX, y: baseY,
          vx: 0, vy: 0,
          baseX, baseY,
          hue: isAccent ? ACCENT_HUE : BRAND_HUE,
          sat: isAccent ? ACCENT_SAT : BRAND_SAT,
          light: isAccent ? ACCENT_LIGHT + Math.random() * 8 : BRAND_LIGHT + Math.random() * 15,
          radius: isAccent ? 2 + Math.random() * 1.5 : 1 + Math.random() * 1.5,
          alpha: 0.5 + Math.random() * 0.5,
          pulseOffset: Math.random() * Math.PI * 2,
        });
      }
    }
    particlesRef.current = p.slice(0, PARTICLE_COUNT);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let visible = true;
    let reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const section = canvas.closest("section");
      const w = window.innerWidth;
      const h = section ? section.offsetHeight : window.innerHeight;
      if (w === sizeRef.current.w && h === sizeRef.current.h) return;
      sizeRef.current = { w, h };
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles(w, h);
      drawFrame();
    };

    const drawFrame = () => {
      const w = sizeRef.current.w;
      const h = sizeRef.current.h;
      if (!w || !h) return;
      const pts = particlesRef.current;
      ctx.clearRect(0, 0, w, h);
      if (reducedMotion) return;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Subtle pulsing glow ring at center
      const cx = w * 0.5;
      const cy = h * 0.45;
      const pulse = Math.sin(performance.now() * 0.00072) * 0.3 + 0.7;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 200);
      grad.addColorStop(0, `hsla(${BRAND_HUE}, 60%, 70%, ${0.06 * pulse})`);
      grad.addColorStop(0.5, `hsla(${BRAND_HUE}, 60%, 70%, ${0.02 * pulse})`);
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, 200, 0, Math.PI * 2);
      ctx.fill();

      // Subtle rotating ring
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(performance.now() * 0.000144);
      ctx.strokeStyle = `hsla(${BRAND_HUE}, 60%, 70%, ${0.04 * pulse})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(0, 0, 120, 60, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Update particles
      for (const p of pts) {
        const dx = p.baseX - p.x;
        const dy = p.baseY - p.y;
        p.vx += dx * 0.006;
        p.vy += dy * 0.006;
        p.vx *= 0.93;
        p.vy *= 0.93;

        const mdx = p.x - mx;
        const mdy = p.y - my;
        const mDist = Math.hypot(mdx, mdy);
        if (mDist < 200 && mDist > 0) {
          const force = (200 - mDist) / 200 * 0.8;
          p.vx += (mdx / mDist) * force;
          p.vy += (mdy / mDist) * force;
        }

        p.x += p.vx;
        p.y += p.vy;
      }

      // Spatial hash grid: build buckets of nearby particles, then only
      // test pairs that can possibly be within CONNECTION_DIST.
      const cols = Math.ceil(w / GRID_CELL) + 1;
      const rows = Math.ceil(h / GRID_CELL) + 1;
      const grid: number[][][] = Array.from({ length: cols }, () => Array.from({ length: rows }, () => [] as number[]));
      for (let i = 0; i < pts.length; i++) {
        const cx2 = Math.floor(pts[i].x / GRID_CELL);
        const cy2 = Math.floor(pts[i].y / GRID_CELL);
        if (cx2 >= 0 && cx2 < cols && cy2 >= 0 && cy2 < rows) grid[cx2][cy2].push(i);
      }

      ctx.lineWidth = 0.8;
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        const gx = Math.floor(a.x / GRID_CELL);
        const gy = Math.floor(a.y / GRID_CELL);
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            const nx = gx + dx;
            const ny = gy + dy;
            if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) continue;
            for (const j of grid[nx][ny]) {
              if (j <= i) continue;
              const b = pts[j];
              const d = Math.hypot(a.x - b.x, a.y - b.y);
              if (d < CONNECTION_DIST) {
                const alpha = (1 - d / CONNECTION_DIST) * 0.25;
                if (alpha < 0.02) continue;
                ctx.strokeStyle = `hsla(${(a.hue + b.hue) / 2}, 60%, 65%, ${alpha})`;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
              }
            }
          }
        }
      }

      // Draw particles with glow
      for (const p of pts) {
        const pulseAlpha = p.alpha * (0.7 + Math.sin(performance.now() * 0.00096 + p.pulseOffset) * 0.3);

        // Core
        ctx.fillStyle = `hsla(${p.hue}, ${p.sat}%, ${p.light}%, ${pulseAlpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Outer glow - only for particles bright enough to matter
        if (pulseAlpha > 0.4) {
          const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 4);
          glow.addColorStop(0, `hsla(${p.hue}, ${p.sat}%, ${p.light}%, ${pulseAlpha * 0.3})`);
          glow.addColorStop(1, "transparent");
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const animate = () => {
      if (!runningRef.current) return;
      drawFrame();
      rafRef.current = requestAnimationFrame(animate);
    };

    const start = () => {
      if (runningRef.current) return;
      runningRef.current = true;
      rafRef.current = requestAnimationFrame(animate);
    };

    const stop = () => {
      runningRef.current = false;
      cancelAnimationFrame(rafRef.current);
    };

    resize();
    window.addEventListener("resize", resize);

    // Observe section size changes (e.g. after font load)
    const section = canvas.closest("section");
    let ro: ResizeObserver | null = null;
    if (section) {
      ro = new ResizeObserver(() => resize());
      ro.observe(section);
    }

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMouse);

    // Pause animation when hero is off-screen
    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window && section) {
      io = new IntersectionObserver(
        (entries) => {
          visible = entries[0]?.isIntersecting ?? true;
          if (visible && !reducedMotion) start();
          else stop();
        },
        { rootMargin: "200px" }
      );
      io.observe(section);
    }

    // Respect prefers-reduced-motion (single static frame)
    const onMotionPreference = (e: MediaQueryListEvent) => {
      reducedMotion = e.matches;
      if (reducedMotion) {
        stop();
        drawFrame();
      } else if (visible) {
        start();
      }
    };
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener("change", onMotionPreference);

    if (!reducedMotion) start();

    return () => {
      stop();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      ro?.disconnect();
      io?.disconnect();
      mq.removeEventListener("change", onMotionPreference);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
      style={{ maskImage: "radial-gradient(ellipse 90% 85% at 50% 45%, black 20%, transparent 85%)" }}
    />
  );
};

export default HeroDataViz;
