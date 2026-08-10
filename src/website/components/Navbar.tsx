import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Menu, X, ChevronDown, ChevronRight, ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "@/lib/router";
import { useLeadCapture } from "@/website/components/lead-capture/LeadCaptureContext";

interface MegaMenuColumn {
  heading: string;
  items: { label: string; href: string; desc?: string; external?: boolean }[];
}

interface NavItem {
  label: string;
  href?: string;
  dropdown?: { label: string; href: string }[];
  megaMenu?: MegaMenuColumn[];
}

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Products",
    megaMenu: [
      {
        heading: "Products",
        items: [
          { label: "Product Overview", href: "/products", desc: "Everything Anarix offers." },
          { label: "Insight Engine Platform", href: "/products/platform", desc: "The unified commerce intelligence platform." },
          { label: "Jiva AI", href: "/products/aan-ai", desc: "The AI-powered strategic assistant." },
          { label: "Signals", href: "/products/signals", desc: "Real-time market intelligence." },
          { label: "MCP", href: "/products/mcp", desc: "Model Context Protocol integrations." },
        ],
      },
      {
        heading: "Developers",
        items: [
          { label: "Documentation", href: "/documentation", desc: "Developer guides & APIs.", external: true },
        ],
      },
    ],
  },
  { label: "Case Studies", href: "/case-studies" },
  {
    label: "Company",
    dropdown: [
      { label: "About", href: "/company/about" },
      { label: "Careers", href: "/company/career" },
    ],
  },
  { label: "Pricing", href: "/pricing" },
  { label: "Listing Optimization", href: "/listing-optimization" },
  { label: "Contact Us", href: "/company/contact" },
];

const productPaths = [
  "/products",
  "/products/platform",
  "/products/aan-ai",
  "/products/signals",
  "/products/mcp",
  "/product",
  "/aan-ai",
  "/signals",
  "/mcp",
  "/documentation",
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpandedSection, setMobileExpandedSection] = useState<string | null>(null);
  const location = useLocation();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const { openLeadCapture } = useLeadCapture();

  const activePath = location.pathname;

  const isActiveSection = (item: NavItem): boolean => {
    if (item.label === "Products") return productPaths.some((p) => activePath === p || activePath.startsWith(`${p}/`));
    if (item.label === "Company") return activePath.startsWith("/company");
    if (!item.href) return false;
    if (item.href === "/") return activePath === "/";
    return activePath === item.href || activePath.startsWith(`${item.href}/`);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
    setMobileExpandedSection(null);
  }, [location.pathname]);

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center px-4 pt-4"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent origin-left"
        style={{ scaleX }}
      />
      <nav
        className={`grid grid-cols-[auto_1fr_auto] items-center px-6 py-3 w-full container-wide rounded-pill border backdrop-blur-xl transition-all duration-500 ${
          scrolled
            ? "bg-surface-elevated/95 shadow-medium border-border/80"
            : "bg-surface-elevated/60 shadow-soft border-border/30"
        }`}
      >
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-foreground tracking-tight whitespace-nowrap">
          Anarix<span className="text-primary">.ai</span>
        </Link>

        {/* Desktop Nav - centered */}
        <div className="hidden lg:flex items-center justify-center gap-0.5">
          {navItems.map((item) => {
            const active = isActiveSection(item);
            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => (item.dropdown || item.megaMenu) && setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
                onFocus={() => (item.dropdown || item.megaMenu) && setOpenDropdown(item.label)}
                onBlur={(e) => {
                  const next = e.relatedTarget as Node | null;
                  if (next && e.currentTarget.contains(next)) return;
                  setOpenDropdown(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setOpenDropdown(null);
                }}
              >
                {item.href ? (
                  <Link
                    to={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 group ${
                      active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {item.label}
                    <span
                      className={`absolute bottom-0.5 left-3 right-3 h-[2px] bg-primary rounded-full origin-left transition-transform duration-300 ${
                        active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </Link>
                ) : (
                  <button
                    aria-expanded={openDropdown === item.label}
                    aria-haspopup={item.megaMenu ? "menu" : "true"}
                    className={`relative flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 group ${
                      active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {item.label}
                    {(item.dropdown || item.megaMenu) && (
                      <ChevronDown
                        className="w-3.5 h-3.5 transition-transform duration-200"
                        style={{
                          transform: openDropdown === item.label ? "rotate(180deg)" : "rotate(0deg)",
                        }}
                      />
                    )}
                    <span
                      className={`absolute bottom-0.5 left-3 right-3 h-[2px] bg-primary rounded-full origin-left transition-transform duration-300 ${
                        active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </button>
                )}

                {/* Simple dropdown */}
                <AnimatePresence>
                  {item.dropdown && openDropdown === item.label && (
                    <motion.div
                      id={`menu-${item.label}`}
                      role="menu"
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute top-full left-0 mt-1 min-w-[180px] py-2 bg-surface-elevated rounded-xl border border-border shadow-medium z-50"
                    >
                      {item.dropdown.map((sub) => (
                        <Link
                          key={sub.label}
                          to={sub.href}
                          role="menuitem"
                          aria-current={activePath === sub.href ? "page" : undefined}
                          className={`block px-4 py-2.5 text-sm rounded-lg transition-colors duration-150 ${
                            activePath === sub.href
                              ? "text-foreground bg-accent"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent"
                          }`}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Mega-menu dropdown */}
                <AnimatePresence>
                  {item.megaMenu && openDropdown === item.label && (
                    <motion.div
                      id={`menu-${item.label}`}
                      role="menu"
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 py-6 px-8 bg-surface-elevated rounded-2xl border border-border shadow-strong z-50"
                      style={{ width: "720px" }}
                    >
                      <div className="grid grid-cols-2 gap-x-8">
                        {item.megaMenu.map((col, ci) => (
                          <div key={col.heading} className={ci > 0 ? "border-l border-border/40 pl-8" : ""}>
                            <div className="flex items-baseline justify-between mb-3">
                              <h4 className="text-[10px] font-bold text-primary/70 uppercase tracking-[0.16em]">
                                {col.heading}
                              </h4>
                              {ci === 0 ? (
                                <p className="text-xs text-muted-foreground italic">Build. Measure. Scale.</p>
                              ) : null}
                            </div>
                            <ul className="space-y-1">
                              {col.items.map((sub) => (
                                <li key={sub.label}>
                                  <Link
                                    to={sub.href}
                                    role="menuitem"
                                    target={sub.external ? "_blank" : undefined}
                                    rel={sub.external ? "noopener noreferrer" : undefined}
                                    aria-current={activePath === sub.href ? "page" : undefined}
                                    className={`group flex items-start justify-between gap-4 px-3 py-2.5 rounded-xl transition-all duration-150 ${
                                      activePath === sub.href ? "bg-accent/60" : "hover:bg-accent/60"
                                    }`}
                                  >
                                    <span>
                                      <span className="block text-[13px] font-semibold text-foreground">
                                        {sub.label}
                                        {sub.external ? (
                                          <ExternalLink className="w-3 h-3 ml-1 inline -mt-0.5 text-muted-foreground" />
                                        ) : null}
                                      </span>
                                      {sub.desc ? (
                                        <span className="block text-xs text-muted-foreground mt-0.5 leading-snug">
                                          {sub.desc}
                                        </span>
                                      ) : null}
                                    </span>
                                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                      <div className="mt-5 pt-4 border-t border-border/40">
                        <Link
                          to="/products"
                          className="flex items-center gap-2 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                        >
                          View Product Overview
                          <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4.5 2.5L8 6L4.5 9.5" />
                          </svg>
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Right side */}
        <div className="hidden lg:flex items-center gap-2 justify-end">
          <Link
            to="/login"
            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 group px-2"
          >
            Sign In
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
          <Button
            onClick={openLeadCapture}
            variant="outline"
            className="rounded-pill px-5 border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all duration-200"
          >
            Get Free Audit
          </Button>
          <a href="https://calendly.com/sunil-anarix/30min" target="_blank" rel="noopener noreferrer">
            <Button
              className="rounded-pill px-6 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-strong active:translate-y-0 active:scale-[0.97] will-change-transform btn-shine"
            >
              Schedule Demo
            </Button>
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2 text-foreground justify-self-end"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden mt-2 overflow-hidden bg-surface-elevated rounded-2xl border border-border shadow-medium"
          >
            <div className="p-4 space-y-1">
              {navItems.map((item) => {
                const active = isActiveSection(item);
                return (
                  <div key={item.label}>
                    {item.href ? (
                      <Link
                        to={item.href}
                        aria-current={active ? "page" : undefined}
                        className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                          active ? "text-foreground bg-accent" : "text-foreground hover:bg-accent"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ) : item.megaMenu ? (
                      <>
                        <button
                          className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                            active ? "text-foreground bg-accent" : "text-foreground hover:bg-accent"
                          }`}
                          onClick={() =>
                            setMobileExpandedSection(
                              mobileExpandedSection === item.label ? null : item.label
                            )
                          }
                          aria-expanded={mobileExpandedSection === item.label}
                        >
                          {item.label}
                          <ChevronDown
                            className="w-4 h-4 transition-transform duration-200"
                            style={{
                              transform: mobileExpandedSection === item.label ? "rotate(180deg)" : "rotate(0deg)",
                            }}
                          />
                        </button>
                        <AnimatePresence>
                          {mobileExpandedSection === item.label && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden pl-4"
                            >
                              <div className="py-1 space-y-3">
                                {item.megaMenu.map((col) => (
                                  <div key={col.heading}>
                                    <h5 className="text-xs font-semibold text-foreground/60 uppercase tracking-wider px-3 mb-1">
                                      {col.heading}
                                    </h5>
                                    <ul className="space-y-0.5">
                                      {col.items.map((sub) => (
                                        <li key={sub.label}>
                                          <Link
                                            to={sub.href}
                                            target={sub.external ? "_blank" : undefined}
                                            rel={sub.external ? "noopener noreferrer" : undefined}
                                            aria-current={activePath === sub.href ? "page" : undefined}
                                            className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                                              activePath === sub.href
                                                ? "text-foreground bg-accent/60"
                                                : "text-muted-foreground hover:text-foreground"
                                            }`}
                                          >
                                            <span className="flex items-center">
                                              {sub.label}
                                              {sub.external ? (
                                                <ExternalLink className="w-3 h-3 ml-1 text-muted-foreground" />
                                              ) : null}
                                            </span>
                                            {sub.desc ? (
                                              <span className="block text-xs text-muted-foreground mt-0.5">
                                                {sub.desc}
                                              </span>
                                            ) : null}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <>
                        <button
                          className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                            active ? "text-foreground bg-accent" : "text-foreground hover:bg-accent"
                          }`}
                          onClick={() =>
                            item.dropdown &&
                            setOpenDropdown(openDropdown === item.label ? null : item.label)
                          }
                          aria-expanded={openDropdown === item.label}
                        >
                          {item.label}
                          {item.dropdown && (
                            <ChevronDown
                              className="w-4 h-4 transition-transform duration-200"
                              style={{
                                transform: openDropdown === item.label ? "rotate(180deg)" : "rotate(0deg)",
                              }}
                            />
                          )}
                        </button>
                        <AnimatePresence>
                          {item.dropdown && openDropdown === item.label && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden pl-4"
                            >
                              {item.dropdown.map((sub) => (
                                <Link
                                  key={sub.label}
                                  to={sub.href}
                                  aria-current={activePath === sub.href ? "page" : undefined}
                                  className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                                    activePath === sub.href
                                      ? "text-foreground bg-accent/60"
                                      : "text-muted-foreground hover:text-foreground"
                                  }`}
                                >
                                  {sub.label}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    )}
                  </div>
                );
              })}
              <div className="pt-3 border-t border-border space-y-2">
                <Link to="/login" className="flex items-center gap-1 px-3 py-2 text-sm text-muted-foreground">
                  Sign In <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Button onClick={openLeadCapture} variant="outline" className="w-full rounded-pill border-border text-muted-foreground">
                  Get Free Audit
                </Button>
                <a href="https://calendly.com/sunil-anarix/30min" target="_blank" rel="noopener noreferrer">
                  <Button className="w-full rounded-pill bg-primary text-primary-foreground">
                    Schedule Demo
                  </Button>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
