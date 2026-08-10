import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy path kept alive so existing links and search results keep working. */
export const Route = createFileRoute("/platform")({
  beforeLoad: () => {
    throw redirect({ to: "/products/platform", replace: true });
  },
});
