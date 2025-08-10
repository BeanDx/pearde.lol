import { motion, type Variants } from "framer-motion";

const variants: Variants = {
  initial: { opacity: 0, y: 12, filter: "blur(2px)" },
  animate: { opacity: 1, y: 0,  filter: "blur(0px)" },
  exit:    { opacity: 0, y: -8, filter: "blur(2px)" },
};

export default function Page({
  children,
  className = "",
}: { children: React.ReactNode; className?: string }) {
  return (
    <motion.section
      className={`space-y-8 will-change-transform ${className}`}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {children}
    </motion.section>
  );
}
