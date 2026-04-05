"use client";

import { useState } from "react";
import { OnboardingData } from "@/types/fragrance";
import { FragranceDB } from "@/data/fragrances";

type ViewMode = "fragrances" | "reviews" | "journal";

// Mock reviews for demo
const MOCK_REVIEWS = [
  { id: "1", fragranceName: "Baccarat Rouge 540", house: "MFK", rating: 5, text: "달콤하고 우디한 향이 정말 독보적이에요. 시간이 지나도 유지력이 굉장해요.", occasion: "Date", season: "Fall", showInCollection: true },
  { id: "2", fragranceName: "Ege", house: "Nishane", rating: 4, text: "지중해 바다향이 생생해요. 여름에 딱이에요.", occasion: "Casual", season: "Summer", showInCollection: true },
];

interface Props {
  onboardingData: OnboardingData | null;
  onSelectFragrance: (f: FragranceDB) => void;
}

export default function CollectionTab({ onboardingData, onSelectFragrance }: Props) {
  const [view, setView] = useState<ViewMode>("fragrances");

  const collection = onboardingData?.collection ?? [];
  const favoriteId = onboardingData?.favoriteId;

  return (
    <div className="pb-6">
      {/* View switcher */}
      <div className="sticky top-0 bg-stone-50 z-10 px-5 pt-4 pb-3">
        <div className="flex gap-2">
          {(["fragrances", "reviews", "journal"] as ViewMode[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                view === v
                  ? "bg-stone-800 text-white"
                  : "bg-white border border-stone-200 text-stone-500"
              }`}
            >
              {v === "fragrances" ? `향수 ${collection.length}` : v === "reviews" ? `리뷰 ${MOCK_REVIEWS.length}` : "착용 일지"}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 space-y-3">
        {/* Fragrances */}
        {view === "fragrances" && (
          collection.length === 0 ? (
            <div className="text-center py-16 text-stone-400">
              <p className="text-4xl mb-3">🧴</p>
              <p className="text-sm">아직 등록된 향수가 없어요</p>
            </div>
          ) : (
            collection.map((f) => (
              <button
                key={f.id}
                onClick={() => onSelectFragrance(f as unknown as FragranceDB)}
                className={`w-full flex items-center gap-4 bg-white rounded-2xl px-4 py-3 border shadow-sm text-left hover:border-amber-300 transition-colors ${
                  f.id === favoriteId ? "border-amber-300 bg-amber-50" : "border-stone-100"
                }`}
              >
                <span className="text-3xl">{(f as { icon?: string }).icon ?? "🌸"}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="font-semibold text-stone-800 text-sm truncate">{f.name}</p>
                    {f.id === favoriteId && <span className="text-amber-500 text-sm">★</span>}
                  </div>
                  <p className="text-stone-400 text-xs">{f.house} · {f.concentration}</p>
                </div>
                <span className="text-xs text-stone-400 shrink-0">{f.family}</span>
                <span className="text-stone-300 text-sm">›</span>
              </button>
            ))
          )
        )}

        {/* Reviews */}
        {view === "reviews" && (
          MOCK_REVIEWS.length === 0 ? (
            <div className="text-center py-16 text-stone-400">
              <p className="text-4xl mb-3">✍️</p>
              <p className="text-sm">아직 작성한 리뷰가 없어요</p>
            </div>
          ) : (
            MOCK_REVIEWS.map((r) => (
              <div key={r.id} className="bg-white rounded-2xl px-4 py-4 border border-stone-100 shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-stone-800 text-sm">{r.fragranceName}</p>
                    <p className="text-xs text-stone-400">{r.house}</p>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={`text-sm ${i < r.rating ? "text-amber-400" : "text-stone-200"}`}>★</span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed mb-3">{r.text}</p>
                <div className="flex gap-1.5 flex-wrap">
                  {r.occasion && <span className="text-[10px] bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full">{r.occasion}</span>}
                  {r.season && <span className="text-[10px] bg-sky-50 text-sky-600 px-2 py-0.5 rounded-full">{r.season}</span>}
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${r.showInCollection ? "bg-emerald-50 text-emerald-600" : "bg-stone-100 text-stone-400"}`}>
                    {r.showInCollection ? "컬렉션 공개" : "비공개"}
                  </span>
                </div>
              </div>
            ))
          )
        )}

        {/* Journal */}
        {view === "journal" && (
          <div className="text-center py-16 text-stone-400">
            <p className="text-4xl mb-3">📓</p>
            <p className="text-sm">착용 일지를 기록해보세요</p>
            <button className="mt-4 px-5 py-2.5 bg-stone-800 text-white rounded-2xl text-sm font-semibold hover:bg-stone-700 transition-colors">
              + 오늘의 향수 기록
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
