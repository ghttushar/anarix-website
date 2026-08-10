import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy path kept alive so existing links and search results keep working. */
export const Route = createFileRoute("/company/")({
  beforeLoad: () => {
    throw redirect({ to: "/company/about", replace: true });
  },
});
