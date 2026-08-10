import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy path kept alive so existing links and search results keep working. */
export const Route = createFileRoute("/signals")({
  beforeLoad: () => {
    throw redirect({ to: "/products/signals", replace: true });
  },
});
