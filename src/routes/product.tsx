import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy path kept alive so existing links and search results keep working. */
export const Route = createFileRoute("/product")({
  beforeLoad: () => {
    throw redirect({ to: "/products/platform", replace: true });
  },
});
