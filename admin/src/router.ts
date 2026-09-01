export type Route = { name: "list" } | { name: "new" } | { name: "edit"; id: string };

export function parseHash(): Route {
  const hash = window.location.hash.replace(/^#\/?/, "");
  if (hash === "new") return { name: "new" };
  const editMatch = hash.match(/^edit\/(.+)$/);
  if (editMatch) return { name: "edit", id: editMatch[1] };
  return { name: "list" };
}

export function navigate(to: "" | "new" | `edit/${string}`) {
  window.location.hash = `#/${to}`;
}
