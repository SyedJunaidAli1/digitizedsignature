import { CurveType } from "@/src/lib/util/constant";

export function CurveSelector({
  value,
  onChange,
}: {
  value: CurveType;
  onChange: (v: CurveType) => void;
}) {
  const types: CurveType[] = [
    "linear",
    "catmull-rom",
    "quadratic-bezier",
    "cubic-bezier",
    "simple-curve",
  ];

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
        Signature Style
      </label>
      <div className="flex gap-2">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => onChange(t)}
            className={`px-3 py-1 text-xs rounded-full border transition-all ${
              value === t
                ? "bg-indigo-600 border-indigo-500 text-white"
                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600"
            }`}
          >
            {t.replace("-", " ")}
          </button>
        ))}
      </div>
    </div>
  );
}
