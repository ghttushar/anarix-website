import { useState, useRef, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "@/lib/router";
import { GripVertical, CalendarPlus, ScanSearch, ArrowUp, Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

import { AanMascot } from "@/components/aan/AanMascot";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { useAan } from "@/components/aan/AanContext";

interface ActionItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  highlight?: boolean;
  badge?: number;
  alwaysShowLabel?: boolean;
}

const hiddenRoutes = ["/cancel-plan", "/downgrade-plan"];

export function FloatingActionIsland() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; startPosX: number; startPosY: number; pointerId: number; el: HTMLElement } | null>(null);
  const collapseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { openCopilot, mode } = useAan();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 800);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleDragStart = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = (e.currentTarget.closest("[data-island]") as HTMLElement)?.getBoundingClientRect();
    if (!rect) return;
    const target = e.currentTarget;
    try { target.setPointerCapture(e.pointerId); } catch { void 0; }
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startPosX: rect.left + rect.width / 2,
      startPosY: rect.top,
      pointerId: e.pointerId,
      el: target,
    };
    const handleMove = (ev: PointerEvent) => {
      if (!dragRef.current || ev.pointerId !== dragRef.current.pointerId) return;
      setPosition({
        x: dragRef.current.startPosX + (ev.clientX - dragRef.current.startX),
        y: dragRef.current.startPosY + (ev.clientY - dragRef.current.startY),
      });
    };
    const handleUp = (ev: PointerEvent) => {
      if (!dragRef.current || ev.pointerId !== dragRef.current.pointerId) return;
      try { dragRef.current.el.releasePointerCapture(dragRef.current.pointerId); } catch { void 0; }
      setIsDragging(false);
      dragRef.current = null;
      target.removeEventListener("pointermove", handleMove);
      target.removeEventListener("pointerup", handleUp);
      target.removeEventListener("pointercancel", handleUp);
    };
    target.addEventListener("pointermove", handleMove);
    target.addEventListener("pointerup", handleUp);
    target.addEventListener("pointercancel", handleUp);
  }, []);

  const shouldHide = hiddenRoutes.some((route) => location.pathname.startsWith(route));
  if (shouldHide) return null;

  const handleMouseEnter = () => {
    if (collapseTimer.current) {
      clearTimeout(collapseTimer.current);
      collapseTimer.current = null;
    }
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    collapseTimer.current = setTimeout(() => {
      setIsExpanded(false);
    }, 300);
  };

  const themeAction: ActionItem = {
    icon: isDark ? Sun : Moon,
    label: isDark ? "Light mode" : "Dark mode",
    onClick: () => setTheme(isDark ? "light" : "dark"),
  };

  const actions: ActionItem[] = [
    { icon: ScanSearch, label: "Listing Optimization", onClick: () => navigate("/listing-optimization"), highlight: false, alwaysShowLabel: true },
    { icon: CalendarPlus, label: "Book a demo", onClick: () => window.open("https://calendly.com/sunil-anarix/30min", "_blank") },
    themeAction,
    ...(scrolled ? [{ icon: ArrowUp, label: "Top", onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }) }] : []),
  ];

  const style: React.CSSProperties = position
    ? { left: `${position.x}px`, top: `${position.y}px`, transform: "translateX(-50%)" }
    : { left: "50%", bottom: "24px", transform: "translateX(-50%)" };

  return (
    <div
      className="fixed z-50"
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Invisible expanded hit area */}
      <div className={cn("relative", isExpanded ? "p-4 -m-4" : "")}>
        <div
          data-island
          className={cn(
            "bg-card/95 backdrop-blur-md border border-primary/60 rounded-full shadow-lg transition-all duration-300 ease-out",
            isExpanded ? "px-2 py-2" : "px-3 py-2",
            isDragging && "cursor-grabbing"
          )}
        >
          <div className="flex items-center gap-1.5">
            <button
              onPointerDown={handleDragStart}
              style={{ touchAction: "none" }}
              className="h-7 w-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-grab active:cursor-grabbing shrink-0"
              title="Drag to reposition"
            >
              <GripVertical className="h-3.5 w-3.5" />
            </button>
            <div className="h-5 w-px bg-border" />
            {mode !== "copilot" && (
              <button
                type="button"
                onClick={openCopilot}
                className="group flex items-center gap-1.5 h-9 pl-1 pr-3 rounded-full bg-card border border-border shadow-sm hover:shadow-md hover:border-primary/40 transition-all"
                title="Ask Aan"
              >
                <AanMascot size={32} state="idle" interactive floating />
                {isExpanded && (
                  <span className="text-sm font-medium text-foreground whitespace-nowrap animate-in fade-in duration-200">
                    Ask Aan
                  </span>
                )}
              </button>
            )}
            <div className="flex items-center gap-0.5">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={action.onClick}
                  className={cn(
                    "rounded-full transition-all duration-200 relative h-8",
                    (isExpanded || action.alwaysShowLabel) ? "px-3 gap-1.5" : "px-2",
                    action.highlight && "text-destructive"
                  )}
                >
                  <action.icon className="h-3.5 w-3.5 shrink-0" />
                  {(isExpanded || action.alwaysShowLabel) && (
                    <span className="text-xs whitespace-nowrap animate-in fade-in duration-200">{action.label}</span>
                  )}
                  {action.badge && action.badge > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
                      {action.badge}
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
