import { FaRandom, FaTimes } from "react-icons/fa";

type Props = {
    query: string;
    setQuery: (v: string) => void;
    allTags: string[];
    activeTags: string[];
    setActiveTags: (fn: (prev: string[]) => string[]) => void;
    onShuffle: () => void;
};

export default function Toolbar({
    query,
    setQuery,
    allTags,
    activeTags,
    setActiveTags,
    onShuffle,
}: Props) {
    return (
        <>
            <div className="flex flex-col md:flex-row md:items-end gap-4">
                <h1 className="text-3xl font-bold text-slate-100 select-none">Projects</h1>

                <div className="flex-1" />

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <input
                            id="projects-search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search… (press /)"
                            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none
                         focus:border-[var(--arch)]/50 placeholder:text-slate-500"
                        />
                        {query && (
                            <button
                                onClick={() => setQuery("")}
                                className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-white/10"
                                aria-label="Clear"
                            >
                                <FaTimes size={12} className="text-slate-400" />
                            </button>
                        )}
                    </div>

                    <button
                        onClick={onShuffle}
                        className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-lg text-sm hover:border-[var(--arch)]/50"
                        title="Shuffle"
                    >
                        <FaRandom className="opacity-80" /> Shuffle
                    </button>
                </div>
            </div>

            {/* tag filter */}
            <div className="flex flex-wrap gap-2 mt-4">
                {allTags.map((t) => {
                    const active = activeTags.includes(t);
                    return (
                        <button
                            key={t}
                            onClick={() =>
                                setActiveTags((prev) =>
                                    prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
                                )
                            }
                            className={`px-2 py-1 rounded-md text-xs border ${active
                                    ? "bg-[var(--arch)]/20 border-[var(--arch)]/40 text-[var(--arch)]"
                                    : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                                }`}
                        >
                            {t}
                        </button>
                    );
                })}
                {activeTags.length > 0 && (
                    <button
                        onClick={() => setActiveTags(() => [])}
                        className="px-2 py-1 rounded-md text-xs bg-white/5 border border-white/10 hover:bg-white/10"
                    >
                        Clear
                    </button>
                )}
                <span className="ml-auto text-xs text-slate-500">
                    {activeTags.length > 0 ? "filtered" : "all"}
                </span>
            </div>
        </>
    );
}
