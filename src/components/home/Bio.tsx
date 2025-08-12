export default function Bio() {
  return (
    <section className="max-w-6xl mx-auto space-y-6">
      {/* Terminal block — mobile friendly */}
      <div className="bg-[#0a0f1c] border border-slate-700 rounded-lg p-3 sm:p-4 font-mono text-[12px] sm:text-sm text-green-400 shadow-lg overflow-hidden">
        {/* Prompt */}
        <div className="text-slate-500">
          <span className="text-emerald-400">max@archlinux</span>
          <span className="text-white">:~$</span> fastfetch
        </div>

        {/* ASCII: не рвёт макет, скроллится по X на узких экранах */}
<pre
  className="
    mt-2 whitespace-pre leading-none select-none
    text-emerald-400 text-[10px] sm:text-[12px]
    max-w-full
    overflow-x-auto md:overflow-x-visible overflow-y-hidden
    [scrollbar-width:none]                 /* Firefox */
    [&::-webkit-scrollbar]:hidden          /* WebKit */
  "
>
{String.raw`
    ____  _________    ____  ____  ______
   / __ \/ ____/   |  / __ \/ __ \/ ____/
  / /_/ / __/ / /| | / /_/ / / / / __/   
 / ____/ /___/ ___ |/ _, _/ /_/ / /___   
/_/   /_____/_/  |_/_/ |_/_____/_____/   
`}
</pre>

        {/* Info (две колонки на десктопе, одна на мобиле) */}
        <dl
  className="mt-3 grid gap-x-4 gap-y-1 break-words"
  style={{ gridTemplateColumns: "max-content 1fr" }}
>
  <dt className="text-yellow-300">Name</dt><dd>Max</dd>
  <dt className="text-yellow-300">Age</dt><dd>19</dd>
  <dt className="text-yellow-300">Location</dt><dd>Cologne, Germany</dd>
  <dt className="text-yellow-300">OS</dt><dd>Arch Linux (bspwm)</dd>
  <dt className="text-yellow-300">Languages</dt><dd>C++, C#, JavaScript</dd>
  <dt className="text-yellow-300">Info</dt>
  <dd className="text-green-300/90 leading-relaxed">
    Frontend enjoyer, React clicker, ex-C# sorcerer, C++ pointer tamer,
    touched Kotlin once and survived. Knows enough code to make things
    work (and sometimes even look pretty).
  </dd>
</dl>


      </div>
    </section>
  );
}
