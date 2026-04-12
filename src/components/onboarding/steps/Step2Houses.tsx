"use client";

import { useState } from "react";
import { FRAGRANCES_DB } from "@/data/fragrances";
import { matchesString } from "@/lib/search";

const DB_HOUSES = Array.from(new Set(FRAGRANCES_DB.map((f) => f.house))).sort();

interface Props {
  favoriteHouses: string[];
  onChange: (houses: string[]) => void;
}

export default function Step2Houses({ favoriteHouses, onChange }: Props) {
  const [query, setQuery] = useState("");

  const toggle = (house: string) => {
    if (favoriteHouses.includes(house)) {
      onChange(favoriteHouses.filter((h) => h !== house));
    } else {
      onChange([...favoriteHouses, house]);
    }
  };

  const filteredHouses = query.trim()
    ? DB_HOUSES.filter((h) => matchesString(h, query))
    : DB_HOUSES;

  const addCustom = () => {
    const trimmed = query.trim();
    if (trimmed && !favoriteHouses.includes(trimmed)) {
      onChange([...favoriteHouses, trimmed]);
    }
    setQuery("");
  };

  const isCustom = (h: string) => !DB_HOUSES.includes(h);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-stone-800 mb-1">좋아하는 향수 하우스</h2>
        <p className="text-stone-500 text-sm">마음에 드는 브랜드를 모두 선택해주세요</p>
      </div>

      {/* Search/filter */}
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addCustom()}
          placeholder="브랜드 검색 또는 직접 입력..."
          className="flex-1 px-4 py-2.5 rounded-2xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-stone-800 placeholder:text-stone-400 text-sm"
        />
        {query.trim() && !DB_HOUSES.some((h) => h.toLowerCase() === query.toLowerCase()) && (
          <button
            onClick={addCustom}
            className="px-4 py-2.5 rounded-2xl bg-amber-600 text-white font-medium text-sm hover:bg-amber-700 transition-colors"
          >
            추가
          </button>
        )}
      </div>

      {/* House grid */}
      <div className="flex flex-wrap gap-2">
        {filteredHouses.map((house) => {
          const selected = favoriteHouses.includes(house);
          return (
            <button
              key={house}
              onClick={() => toggle(house)}
              className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-150 active:scale-95 ${
                selected
                  ? "bg-amber-100 border-amber-500 text-amber-700"
                  : "bg-white border-stone-200 text-stone-600 hover:border-amber-300 hover:bg-amber-50"
              }`}
            >
              {selected && <span className="mr-1">✓</span>}
              {house}
            </button>
          );
        })}
      </div>

      {/* Custom selected */}
      {favoriteHouses.filter(isCustom).length > 0 && (
        <div>
          <p className="text-xs font-semibold text-stone-500 mb-2">직접 추가한 브랜드</p>
          <div className="flex flex-wrap gap-2">
            {favoriteHouses.filter(isCustom).map((h) => (
              <span
                key={h}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-100 border border-amber-400 text-amber-700 text-sm font-medium"
              >
                {h}
                <button
                  onClick={() => toggle(h)}
                  className="text-amber-500 hover:text-amber-700 ml-0.5"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {favoriteHouses.length > 0 && (
        <p className="text-xs text-stone-400 text-center">
          {favoriteHouses.length}개 선택됨
        </p>
      )}
    </div>
  );
}
