"use client";

const PRIORITY_OPTIONS = [
  { id: "longevity",  label: "지속력",  sublabel: "Longevity",  icon: "⏳" },
  { id: "projection", label: "확산력",  sublabel: "Projection", icon: "💨" },
  { id: "uniqueness", label: "희소성",  sublabel: "Uniqueness", icon: "💎" },
  { id: "value",      label: "가성비",  sublabel: "Value",      icon: "💰" },
];

interface Props {
  priorities: string[];
  onChange: (priorities: string[]) => void;
}

export default function Step4Priorities({ priorities, onChange }: Props) {
  const handleTap = (id: string) => {
    if (priorities.includes(id)) {
      // Deselect: remove and compact
      onChange(priorities.filter((p) => p !== id));
    } else {
      // Select next rank
      onChange([...priorities, id]);
    }
  };

  const getRank = (id: string) => {
    const idx = priorities.indexOf(id);
    return idx >= 0 ? idx + 1 : null;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-stone-800 mb-1">향수 선택 기준</h2>
        <p className="text-stone-500 text-sm">
          향수를 고를 때 가장 중요한 것은 무엇인가요?
        </p>
        <p className="text-stone-400 text-xs mt-1">
          중요한 순서대로 탭해서 순위를 매겨보세요
        </p>
      </div>

      <div className="space-y-3">
        {PRIORITY_OPTIONS.map((opt) => {
          const rank = getRank(opt.id);
          const isSelected = rank !== null;
          return (
            <button
              key={opt.id}
              onClick={() => handleTap(opt.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 transition-all duration-150 active:scale-[0.98] text-left ${
                isSelected
                  ? "bg-amber-50 border-amber-400"
                  : "bg-white border-stone-200 hover:border-amber-200 hover:bg-amber-50/40"
              }`}
            >
              {/* Rank badge */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-none transition-colors ${
                  isSelected
                    ? "bg-amber-500 text-white"
                    : "bg-stone-100 text-stone-400"
                }`}
              >
                {isSelected ? rank : "·"}
              </div>

              {/* Icon */}
              <span className="text-2xl">{opt.icon}</span>

              {/* Labels */}
              <div className="flex-1">
                <p className={`font-semibold ${isSelected ? "text-amber-800" : "text-stone-700"}`}>
                  {opt.label}
                </p>
                <p className="text-xs text-stone-400">{opt.sublabel}</p>
              </div>

              {isSelected && (
                <span className="text-amber-500 text-lg">✓</span>
              )}
            </button>
          );
        })}
      </div>

      {priorities.length > 0 && (
        <div className="rounded-2xl bg-stone-100 px-4 py-3">
          <p className="text-xs font-semibold text-stone-500 mb-2">현재 순위</p>
          <div className="flex gap-2 flex-wrap">
            {priorities.map((id, i) => {
              const opt = PRIORITY_OPTIONS.find((o) => o.id === id)!;
              return (
                <span
                  key={id}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium border border-amber-200"
                >
                  <span className="font-bold">{i + 1}.</span>
                  {opt.icon} {opt.label}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {priorities.length === 0 && (
        <p className="text-center text-stone-400 text-xs">
          건너뛰어도 괜찮아요
        </p>
      )}
    </div>
  );
}
