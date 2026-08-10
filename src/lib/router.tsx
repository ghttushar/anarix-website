import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from "react";
import {
  Link as RouterLink,
  useLocation as useRouterLocation,
  useNavigate as useRouterNavigate,
} from "@tanstack/react-router";

import { cn } from "@/lib/utils";

/**
 * Routing facade.
 *
 * The site links to a fixed set of marketing paths that are known at author
 * time but are written as plain strings throughout the pages. These wrappers
 * keep TanStack Router as the single routing implementation while accepting a
 * `string` href, and they split a trailing `#hash` into the router's own hash
 * option so anchor links keep working.
 */

type Href = { to: string; hash?: string };

function parseHref(href: string): Href {
  const [to, hash] = href.split("#");
  return hash ? { to: to || ".", hash } : { to: href };
}

export type SiteLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  to: string;
  replace?: boolean;
  children?: ReactNode;
};

export const Link = forwardRef<HTMLAnchorElement, SiteLinkProps>(function Link(
  { to, replace, ...rest },
  ref,
) {
  const target = parseHref(to);
  return (
    <RouterLink
      ref={ref}
      to={target.to as never}
      {...(target.hash ? { hash: target.hash } : {})}
      {...(replace ? { replace: true } : {})}
      {...rest}
    />
  );
});

export type NavLinkProps = SiteLinkProps & {
  activeClassName?: string;
  exact?: boolean;
};

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(function NavLink(
  { to, className, activeClassName, exact = false, ...rest },
  ref,
) {
  const target = parseHref(to);
  return (
    <RouterLink
      ref={ref}
      to={target.to as never}
      {...(target.hash ? { hash: target.hash } : {})}
      className={className}
      activeOptions={{ exact }}
      {...(activeClassName ? { activeProps: { className: cn(className, activeClassName) } } : {})}
      {...rest}
    />
  );
});

/** Navigate to any site path, mirroring the ergonomics of a plain `push`. */
export function useNavigate() {
  const navigate = useRouterNavigate();
  return (href: string, options?: { replace?: boolean }) => {
    const target = parseHref(href);
    void navigate({
      to: target.to as never,
      ...(target.hash ? { hash: target.hash } : {}),
      ...(options?.replace ? { replace: true } : {}),
    });
  };
}

/** Current location, narrowed to the fields the site reads. */
export function useLocation(): { pathname: string; hash: string } {
  const location = useRouterLocation();
  return { pathname: location.pathname, hash: location.hash };
}
