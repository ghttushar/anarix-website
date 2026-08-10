import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy path kept alive so existing links and search results keep working. */
export const Route = createFileRoute("/aan-ai")({
  beforeLoad: () => {
    throw redirect({ to: "/products/aan-ai", replace: true });
  },
});
