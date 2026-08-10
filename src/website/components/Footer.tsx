import { Link } from "@/lib/router";
import { BrandLogo } from "@/website/components/BrandLogo";

const productHref = "/products/platform";
const aanHref = "/products/aan-ai";
const mcpHref = "/products/mcp";
const signalsHref = "/products/signals";

const footerLinks: Record<string, { label: string; href: string; external?: boolean }[]> = {
  Product: [
    { label: "Product Overview", href: "/products" },
    { label: "Advertising", href: productHref },
    { label: "Campaign", href: productHref },
    { label: "Rules", href: productHref },
    { label: "Profitability", href: productHref },
    { label: "Jiva (AI)", href: aanHref },
    { label: "Signals", href: signalsHref },
    { label: "MCP", href: mcpHref },
  ],
  Resources: [
    { label: "Documentation", href: "/documentation" },
    { label: "Listing Optimization", href: "/listing-optimization" },
    { label: "Case Studies", href: "/case-studies" },
    { label: "Contact", href: "/company/contact" },
  ],
  Account: [
    { label: "Sign In", href: "/login" },
    { label: "Schedule Demo", href: "https://calendly.com/sunil-anarix/30min", external: true },
  ],
};

const Footer = () => {
  return (
    <footer className="px-6 pb-6">
      <div className="container-wide mx-auto bg-card rounded-3xl border border-border shadow-soft p-10 sm:p-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-flex items-center" aria-label="Anarix home">
              <BrandLogo className="h-7" />
            </Link>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              Expert-managed marketplace growth powered by the Anarix Insight Engine.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Anarix. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link to="/privacy-policy" className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-300">
              Privacy
            </Link>
            <Link to="/terms-and-conditions" className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-300">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
