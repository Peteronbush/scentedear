"use client";

import { useState } from "react";
import { Fragrance } from "@/types/fragrance";

const SAMPLE_FRAGRANCES: Fragrance[] = [
  { id: "1",  name: "Nishane Ege",        house: "Nishane",   icon: "🌿" },
  { id: "2",  name: "Baccarat Rouge 540", house: "MFK",       icon: "🌊" },
  { id: "3",  name: "Santal 33",          house: "Le Labo",   icon: "🪵" },
  { id: "4",  name: "Pegasus",            house: "PDM",       icon: "🐴" },
  { id: "5",  name: "Eau Givree",         house: "TdH",       icon: "❄️" },
  { id: "6",  name: "Sycomore",           house: "Chanel",    icon: "🌾" },
  { id: "7",  name: "Bois Imperial",      house: "Ex Nihilo", icon: "🌲" },
  { id: "8",  name: "Imagination",        house: "LV",        icon: "✨" },
  { id: "9",  name: "Hacivat",            house: "Nishane",   icon: "🎭" },
  { id: "10", name: "Encre Noire",        house: "Lalique",   icon: "🖤" },
];

const DISLIKE_CATEGORIES = [
  "너무 달콤한 향",
  "강한 스모키",
  "과한 플로럴",
  "동물성 무스크",
  "진한 오우드",
  "합성 느낌",
  "과한 시트러스",
  "파우더리",
];

interface Props {
  dislikedFragrances: Fragrance[];
  dislikedCategories: string[];
  onChange: (fragrances: Fragrance[], categories: string[]) => void;
}

export default function Step3Dislikes({
  dislikedFragrances,
  dislikedCategories,
  onChange,
}: Props) {
  const [query, setQuery] = useState("");

  const results = query.trim().length > 0
    ? SAMPLE_FRAGRANCES.filter(
        (f) =>
          !dislikedFragrances.find((d) => d.id === f.id) &&
          (f.name.toLowerCase().includes(query.toLowerCase()) ||
            f.house.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  const toggleCategory = (cat: string) => {
    if (dislikedCategories.includes(cat)) {
      onChange(dislikedFragrances, dislikedCategories.filter((c) => c !== cat));
    } else {
      onChange(dislikedFragrances, [...dislikedCategories, cat]);
    }
  };

  const addFragrance = (f: Fragrance) => {
    onChange([...dislikedFragrances, f], dislikedCategories);
    setQuery("");
  };

  const removeFragrance = (id: string) => {
    onChange(dislikedFragrances.filter((f) => f.id !== id), dislikedCategories);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-stone-800 mb-1">싫어하는 향</h2>
        <p className="text-stone-500 text-sm">피하고 싶은 향과 향수를 알려주세요</p>
      </div>

      {/* Category chips */}
      <div>
        <p className="text-sm font-semibold text-stone-600 mb-3">향 카테고리</p>
        <div className="flex flex-wrap gap-2">
          {DISLIKE_CATEGORIES.map((cat) => {
            const selected = dislikedCategories.includes(cat);
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-150 active:scale-95 ${
                  selected
                    ? "bg-red-50 border-red-400 text-red-600"
                    : "bg-white border-stone-200 text-stone-600 hover:border-red-200 hover:bg-red-50"
                }`}
              >
                {selected && <span className="mr-1">✕</span>}
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Specific fragrance search */}
      <div>
        <p className="text-sm font-semibold text-stone-600 mb-3">특정 향수</p>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">🔍</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="싫어하는 향수 검색..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent text-stone-800 placeholder:text-stone-400"
          />
        </div>

        {results.length > 0 && (
          <div className="mt-2 rounded-2xl border border-stone-200 bg-white overflow-hidden divide-y divide-stone-100">
            {results.map((f) => (
              <button
                key={f.id}
                onClick={() => addFragrance(f)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-left"
              >
                <span className="text-2xl">{f.icon}</span>
                <div>
                  <p className="font-medium text-stone-800 text-sm">{f.name}</p>
                  <p className="text-stone-400 text-xs">{f.house}</p>
                </div>
                <span className="ml-auto text-red-500 text-sm font-medium">+ 추가</span>
              </button>
            ))}
          </div>
        )}

        {dislikedFragrances.length > 0 && (
          <div className="mt-3 space-y-2">
            {dislikedFragrances.map((f) => (
              <div
                key={f.id}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-red-200 bg-red-50"
              >
                <span className="text-2xl">{f.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-stone-800 text-sm truncate">{f.name}</p>
                  <p className="text-stone-400 text-xs">{f.house}</p>
                </div>
                <button
                  onClick={() => removeFragrance(f.id)}
                  className="text-red-400 hover:text-red-600 transition-colors text-sm"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {dislikedCategories.length === 0 && dislikedFragrances.length === 0 && (
        <p className="text-center text-stone-400 text-xs pt-2">
          건너뛰어도 괜찮아요 — 모든 향을 좋아하는 분도 있어요!
        </p>
      )}
    </div>
  );
}
