import { useEffect, useMemo, useRef } from "react";

type Props = {
  color?: string;
  fadeAlpha?: number;
  fontSize?: number;
  speed?: number;
  columnStride?: number;
  charset?: string;
  disableOnTouch?: boolean;
  minWidth?: number;
  /** z-index */
  zIndex?: number;
};

export default function AsciiMatrix({
  color,
  fadeAlpha = 0.08,
  fontSize = 16,
  speed = 1.0,
  columnStride = 1,
  charset = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&*+-;:<>[]{}",
  disableOnTouch = true,
  minWidth = 768,
  zIndex = 0,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const rafRef = useRef<number | null>(null);
  const dropsRef = useRef<number[]>([]);
  const widthRef = useRef(0);
  const heightRef = useRef(0);
  const fontRef = useRef(fontSize);

  const archColor = useMemo(
    () =>
      color ||
      (getComputedStyle(document.documentElement).getPropertyValue("--arch")?.trim() ||
        "#1793D1"),
    [color]
  );

  const reducedMotion = useMemo(() => {
    if (typeof window === "undefined" || typeof matchMedia === "undefined") return false;
    return matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const isTouchish = useMemo(() => {
    if (typeof window === "undefined" || typeof matchMedia === "undefined") return false;
    const noHover = matchMedia("(hover: none)").matches;
    const coarse = matchMedia("(pointer: coarse)").matches;
    const narrow = window.innerWidth < minWidth;
    return disableOnTouch && (noHover || coarse || narrow);
  }, [disableOnTouch, minWidth]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    ctxRef.current = ctx;

    const setup = () => {
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      const w = window.innerWidth;
      const h = window.innerHeight;
      widthRef.current = w;
      heightRef.current = h;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);

      fontRef.current = fontSize * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      ctx.font = `${fontSize}px JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`;
      ctx.textBaseline = "top";

      const columns = Math.floor(w / (fontSize * columnStride));
      dropsRef.current = Array.from({ length: columns }, () => Math.floor(Math.random() * -50));
    };

    setup();
    const onResize = () => {
      cancel();
      setup();
      loop(); 
    };

    const cancel = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    const loop = () => {
      if (!ctxRef.current) return;


      ctx.globalAlpha = fadeAlpha;
      ctx.fillStyle = "#0b1220";
      ctx.fillRect(0, 0, widthRef.current, heightRef.current);
      ctx.globalAlpha = 1;


      ctx.fillStyle = archColor;

    //   const stepY = fontSize * speed;
      const cols = dropsRef.current.length;

      for (let i = 0; i < cols; i++) {
        const x = i * fontSize * columnStride;
        const y = dropsRef.current[i] * fontSize;


        const ch = charset.charAt(Math.floor(Math.random() * charset.length));
        ctx.fillText(ch, x, y);


        if (y > heightRef.current && Math.random() > 0.975) {
          dropsRef.current[i] = Math.floor(Math.random() * -20);
        } else {
          dropsRef.current[i] += speed; // чем больше, тем быстрее "дождь"
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    // если нельзя/не нужно анимировать — не запускаем цикл
    if (!(reducedMotion || isTouchish)) {
      loop();
      window.addEventListener("resize", onResize);
    } else {
      // статичный фон, один кадр
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      const w = window.innerWidth;
      const h = window.innerHeight;
      widthRef.current = w;
      heightRef.current = h;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.scale(dpr, dpr);
      ctx.fillStyle = "#0b1220";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = archColor + "80";
      ctx.font = `${fontSize}px JetBrains Mono, ui-monospace, monospace`;
      ctx.fillText("Matrix rain disabled", 24, 24);
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [archColor, charset, columnStride, fadeAlpha, fontSize, speed, reducedMotion, isTouchish]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex,
        pointerEvents: "none",
        opacity: 0.8, // можно подрегулировать
      }}
    />
  );
}
