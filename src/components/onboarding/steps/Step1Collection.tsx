"use client";

import { useState } from "react";
import { Fragrance } from "@/types/fragrance";
import { FRAGRANCES_DB } from "@/data/fragrances";

interface Props {
  collection: Fragrance[];
  favoriteId: string | null;
  onChange: (collection: Fragrance[], favoriteId: string | null) => void;
}

export default function Step1Collection({ collection, favoriteId, onChange }: Props) {
  const [query, setQuery] = useState("");

  const results = query.trim().length > 0
    ? FRAGRANCES_DB.filter(
        (f) =>
          !collection.find((c) => c.id === f.id) &&
          (f.name.toLowerCase().includes(query.toLowerCase()) ||
            f.house.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 10)
    : [];

  const addFragrance = (f: Fragrance) => {
    onChange([...collection, f], favoriteId);
    setQuery("");
  };

  const removeFragrance = (id: string) => {
    const newCollection = collection.filter((f) => f.id !== id);
    const newFav = favoriteId === id ? null : favoriteId;
    onChange(newCollection, newFav);
  };

  const toggleFavorite = (id: string) => {
    onChange(collection, favoriteId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-stone-800 mb-1">보유 향수 등록</h2>
        <p className="text-stone-500 text-sm">현재 갖고 있는 향수를 추가해보세요</p>
      </div>

      {/* Search */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">🔍</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="향수 이름 또는 브랜드 검색..."
          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-stone-800 placeholder:text-stone-400"
        />
      </div>

      {/* Search results */}
      {results.length > 0 && (
        <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden divide-y divide-stone-100">
          {results.map((f) => (
            <button
              key={f.id}
              onClick={() => addFragrance(f)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-amber-50 transition-colors text-left"
            >
              <span className="text-2xl">{f.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-stone-800 text-sm">{f.name}</p>
                <p className="text-stone-400 text-xs">{f.house} · {f.family}</p>
              </div>
              <span className="ml-auto text-amber-600 text-sm font-medium shrink-0">+ 추가</span>
            </button>
          ))}
        </div>
      )}

      {query.trim().length > 0 && results.length === 0 && (
        <p className="text-center text-stone-400 text-sm py-2">검색 결과가 없습니다</p>
      )}

      {/* Added collection */}
      {collection.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-stone-600">
            내 컬렉션 ({collection.length})
          </p>
          <div className="space-y-2">
            {collection.map((f) => (
              <div
                key={f.id}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-colors ${
                  favoriteId === f.id
                    ? "bg-amber-50 border-amber-300"
                    : "bg-white border-stone-200"
                }`}
              >
                <span className="text-2xl">{f.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-stone-800 text-sm truncate">{f.name}</p>
                  <p className="text-stone-400 text-xs">{f.house} · {f.concentration}</p>
                </div>
                <button
                  onClick={() => toggleFavorite(f.id)}
                  title="즐겨찾기"
                  className={`text-lg transition-transform active:scale-110 ${
                    favoriteId === f.id
                      ? "text-amber-500"
                      : "text-stone-300 hover:text-amber-400"
                  }`}
                >
                  ★
                </button>
                <button
                  onClick={() => removeFragrance(f.id)}
                  className="text-stone-300 hover:text-red-400 transition-colors ml-1 text-sm"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          {collection.length > 0 && (
            <p className="text-xs text-stone-400 text-center">
              ★ 를 눌러 가장 좋아하는 향수를 선택하세요
            </p>
          )}
        </div>
      )}

      {collection.length === 0 && query.trim().length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-stone-200 py-10 text-center text-stone-400">
          <p className="text-3xl mb-2">🧴</p>
          <p className="text-sm">향수를 검색해서 추가해보세요</p>
          <p className="text-xs mt-1 text-stone-300">건너뛰어도 괜찮아요</p>
        </div>
      )}
    </div>
  );
}
