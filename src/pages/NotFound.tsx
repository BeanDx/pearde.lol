import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const TUX = String.raw`
      .--.
     |o_o |
     |:_/ |
    //   \ \
   (|     | )
  /'\_   _/` + `\\
` + String.raw`\___)=(___/`;

const DMESG = [
  "[  0.000000] beand: tried to open /404 ... nope.",
  "[  0.000133] archbtw: btw, i use arch.",
  "[  0.004200] pacman: resolving dependencies... 0 found.",
  "[  1.337000] osu!: pp not found (skill issue?)",
  "[  9.999999] kernel: attempted to kill the idle task!",
];

export default function NotFound() {
  const nav = useNavigate();

  const header = useMemo(
    () => [
      "KERNEL PANIC!",
      "Please reboot your computer.",
      "Attempted to kill the idle task!",
      "",
    ],
    []
  );

  const [lines, setLines] = useState<string[]>([]);
  const [printing, setPrinting] = useState<string>("");
  const [typedDone, setTypedDone] = useState(false);

  // печать хедера (тайпрайтер)
  useEffect(() => {
    let i = 0, j = 0;
    const tick = () => {
      if (i >= header.length) {
        setTypedDone(true);
        return;
      }
      const line = header[i];
      if (j <= line.length) {
        setPrinting(line.slice(0, j++));
        timer = window.setTimeout(tick, 18);
      } else {
        setLines((l) => [...l, line]);
        j = 0; i++;
        timer = window.setTimeout(tick, 120);
      }
    };
    let timer = window.setTimeout(tick, 150);
    return () => window.clearTimeout(timer);
  }, [header]);

  // стрим логов по одной строке
    const dumpDmesg = () => {
    let k = 0;
    const push = () => {
        setLines(l => [...l, DMESG[k]]);
        k++;
        if (k < DMESG.length) {
        window.setTimeout(push, 90);
        }
    };
  // пустая строка-разделитель
  setLines(l => [...l, ""]);
  window.setTimeout(push, 60);
};

  // хоткеи — раскладка-независимо через e.code
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      switch (e.code) {
        case "KeyR": nav("/", { replace: true }); break;
        case "KeyD": dumpDmesg(); break;
        case "KeyH":
          setLines((l) => [
            ...l,
            "",
            "keys: [R] reboot   [D] dmesg   [H] help",
          ]);
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nav]);

  return (
    <section className="min-h-[70vh] grid place-items-center">
      <div className="crt w-full max-w-4xl rounded-2xl border border-white/10 bg-[#0b0f14] p-8">
        <div className="grid md:grid-cols-[1fr_auto] gap-8">
          {/* text */}
          <div className="font-mono text-slate-200">
            {lines.map((l, idx) => (
              <div key={idx} className={idx === 0 ? "text-red-400" : ""}>
                {l}
              </div>
            ))}
            {/* печатаемая сейчас строка */}
            {!typedDone && (
              <div className="text-red-400">
                {printing}
                <span className="caret" />
              </div>
            )}

            <div className="mt-6 text-xs text-slate-400 whitespace-pre-wrap">
              PID: 404   TASK: beand@arch   COMM: "pearde.lol"
              {"\n"}Call Trace: [&lt;ffffffff&gt;] try_to_open(/404) → nope() → go_home()
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <button
                onClick={() => nav("/", { replace: true })}
                className="inline-flex items-center gap-2 rounded-md bg-[#1793D1]/20 px-3 py-1.5 text-[#1793D1] ring-1 ring-[#1793D1]/40 hover:bg-[#1793D1]/30 transition"
                title="R"
              >
                ↩︎ Back to Home <span className="text-xs text-slate-400">(R)</span>
              </button>
              <button
                onClick={dumpDmesg}
                className="inline-flex items-center gap-2 rounded-md bg-white/5 px-3 py-1.5 text-slate-300 hover:bg-white/10 transition"
                title="D"
              >
                 Dump dmesg <span className="text-xs text-slate-500">(D)</span>
              </button>
              <button
                onClick={() =>
                  setLines((l) => [...l, "", "keys: [R] reboot   [D] dmesg   [H] help"])
                }
                className="inline-flex items-center gap-2 rounded-md bg-white/5 px-3 py-1.5 text-slate-300 hover:bg-white/10 transition"
                title="H"
              >
                ? Help <span className="text-xs text-slate-500">(H)</span>
              </button>
            </div>
          </div>

          {/* tux */}
          <div className="hidden md:flex items-center justify-center">
            <pre className="select-none text-[11px] leading-[11px] text-slate-300">
{TUX}
            </pre>
            <div className="ml-4 text-6xl font-mono text-slate-200">!</div>
          </div>
        </div>
      </div>
    </section>
  );
}
