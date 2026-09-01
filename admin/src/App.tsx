import { useEffect, useState } from "react";

import { BlogList } from "./screens/BlogList";
import { Editor } from "./screens/Editor";
import { parseHash, type Route } from "./router";

export function App() {
  const [route, setRoute] = useState<Route>(parseHash());

  useEffect(() => {
    const onHashChange = () => setRoute(parseHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  if (route.name === "new") return <Editor key="new" mode="new" />;
  if (route.name === "edit") return <Editor key={route.id} mode="edit" articleId={route.id} />;
  return <BlogList />;
}
