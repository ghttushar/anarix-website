import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

import logoDark from "@/assets/brand/anarix-logo-dark.svg";
import logoLight from "@/assets/brand/anarix-logo-light.svg";

interface BrandLogoProps {
  /** Height utility class, e.g. "h-8". Width scales automatically. */
  className?: string;
}

/**
 * Official Anarix wordmark. Serves the colour variation on light themes and the
 * all-white variation on dark themes.
 */
export function BrandLogo({ className }: BrandLogoProps) {
  const { resolvedTheme } = useTheme();

  return (
    <img
      src={resolvedTheme === "dark" ? logoDark : logoLight}
      alt="Anarix"
      className={cn("w-auto select-none", className)}
      draggable={false}
    />
  );
}

export default BrandLogo;
