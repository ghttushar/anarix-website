import { motion, useScroll } from "framer-motion";

/** Thin bar pinned under the fixed nav, fills as the reader scrolls through the article. */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  return <motion.div className="ws-reading-progress" style={{ scaleX: scrollYProgress }} />;
}
