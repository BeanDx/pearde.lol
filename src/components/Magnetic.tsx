import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { useRef, useCallback, useEffect } from "react";

type MagneticProps = {
  children: React.ReactNode;
  radius?: number;
  strength?: number;
  className?: string;
};

export default function Magnetic({
  children,
  radius = 120,
  strength = 0.4,
  className = "",
}: MagneticProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 500, damping: 28, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 500, damping: 28, mass: 0.6 });

  const reduce = useReducedMotion();
  const isTouch =
    typeof window !== "undefined" && matchMedia?.("(pointer: coarse)")?.matches;

  const reset = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      if (reduce || isTouch) return reset();

      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;

      const dist = Math.hypot(dx, dy);
      if (dist < radius) {
        const factor = (1 - dist / radius) * strength;
        x.set(dx * factor);
        y.set(dy * factor);
      } else {
        reset();
      }
    },
    [reduce, isTouch, radius, strength, x, y, reset]
  );

  useEffect(() => {
    const leave = () => reset();
    window.addEventListener("mouseleave", leave);
    return () => window.removeEventListener("mouseleave", leave);
  }, [reset]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={reset}
      style={{ x: springX, y: springY }}
      className={`inline-block will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
}
