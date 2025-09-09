import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useRef } from "react";

export default function TiltCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const rotateX = useTransform(my, (v) => (v - 0.5) * -8);
  const rotateY = useTransform(mx, (v) => (v - 0.5) * 8);

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };

  const onLeave = () => {
    animate(mx, 0.5, { duration: 0.18 });
    animate(my, 0.5, { duration: 0.18 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" as any }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
