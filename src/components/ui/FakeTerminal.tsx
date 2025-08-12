import React from "react";

interface FakeTerminalProps {
  prompt?: string;       // "max@archlinux"
  command?: string;      // "fastfetch"
  ascii?: string;        // ASCII art (optional)
  children?: React.ReactNode; // terminal output (your info, logs, etc.)
}

export default function FakeTerminal({
  prompt = "user@host",
  command = "",
  ascii,
  children
}: FakeTerminalProps) {
  return (
    <div className="bg-[#0a0f1c] border border-slate-700 rounded-lg p-3 sm:p-4 font-mono text-[12px] sm:text-sm text-slate-200 shadow-lg overflow-hidden">

      {/* Prompt */}
      <div className="text-slate-500">
        <span className="text-emerald-400">{prompt}</span>
        <span className="text-white">:~$</span>{" "}
        {command}
      </div>

      {/* ASCII block */}
      {ascii && (
        <pre
          className="
            mt-2 whitespace-pre leading-none select-none
            text-emerald-400 text-[10px] sm:text-[12px]
            max-w-full
            overflow-x-auto md:overflow-x-visible overflow-y-hidden
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
        >
          {ascii}
        </pre>
      )}

      {/* Output */}
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}
