"use client";

import { useState } from "react";
import { FRAGRANCES_DB, FragranceDB } from "@/data/fragrances";

type SearchMode = "fragrance" | "house" | "user";

const ALL_HOUSES = Array.from(new Set(FRAGRANCES_DB.map((f) => f.house))).sort();

// Mock users for now
const MOCK_USERS = [
  { id: "1", nickname: "향수덕후", count: 12 },
  { id: "2", nickname: "플로럴러버", count: 8 },
  { id: "3", nickname: "우디마니아", count: 15 },
  { id: "4", nickname: "씨트러스킹", count: 6 },
];

interface Props {
  onSelectFragrance: (f: FragranceDB) => void;
}

export default function ExploreTab({ onSelectFragrance }: Props) {
  const [mode, setMode] = useState<SearchMode>("fragrance");
  const [query, setQuery] = useState("");

  const fragranceResults = query.trim()
    ? FRAGRANCES_DB.filter((f) =>
        f.name.toLowerCase().includes(query.toLowerCase()) ||
        f.house.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 30)
    : [];

  const houseResults = query.trim()
    ? ALL_HOUSES.filter((h) => h.toLowerCase().includes(query.toLowerCase()))
    : ALL_HOUSES;

  const userResults = query.trim()
    ? MOCK_USERS.filter((u) => u.nickname.toLowerCase().includes(query.toLowerCase()))
    : MOCK_USERS;

  const PLACEHOLDER: Record<SearchMode, string> = {
    fragrance: "향수 이름 또는 브랜드 검색...",
    house:     "하우스 이름 검색...",
    user:      "유저 닉네임 검색...",
  };

  return (
    <div className="pt-4 pb-6">
      {/* Search bar */}
      <div className="sticky top-0 bg-stone-50 z-10 px-5 pb-3 space-y-3">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">🔍</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={PLACEHOLDER[mode]}
            className="w-full pl-10 pr-10 py-3 rounded-2xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-stone-800 placeholder:text-stone-400 text-sm shadow-sm"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >✕</button>
          )}
        </div>

        {/* Mode selector */}
        <div className="flex gap-2">
          {(["fragrance", "house", "user"] as SearchMode[]).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setQuery(""); }}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                mode === m
                  ? "bg-stone-800 text-white"
                  : "bg-white border border-stone-200 text-stone-500"
              }`}
            >
              {m === "fragrance" ? "향수" : m === "house" ? "하우스" : "유저"}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="px-5">
        {/* Fragrance results */}
        {mode === "fragrance" && (
          query.trim().length === 0 ? (
            <div className="text-center py-16 text-stone-400">
              <p className="text-4xl mb-3">🌸</p>
              <p className="text-sm">향수 이름이나 브랜드를 검색해보세요</p>
              <p className="text-xs mt-1 text-stone-300">{FRAGRANCES_DB.length}개 향수 수록</p>
            </div>
          ) : fragranceResults.length === 0 ? (
            <div className="text-center py-16 text-stone-400">
              <p className="text-3xl mb-2">😕</p>
              <p className="text-sm">검색 결과가 없어요</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-stone-400 mb-2">{fragranceResults.length}개 결과</p>
              {fragranceResults.map((f) => (
                <button
                  key={f.id}
                  onClick={() => onSelectFragrance(f)}
                  className="w-full flex items-center gap-4 bg-white rounded-2xl px-4 py-3 border border-stone-100 shadow-sm hover:border-amber-300 hover:bg-amber-50 transition-colors text-left"
                >
                  <span className="text-3xl">{f.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-stone-800 text-sm truncate">{f.name}</p>
                    <p className="text-stone-400 text-xs">{f.house} · {f.concentration}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-amber-600">{f.family}</p>
                    <p className="text-xs text-stone-400 mt-0.5">{f.year}</p>
                  </div>
                  <span className="text-stone-300 text-sm">›</span>
                </button>
              ))}
            </div>
          )
        )}

        {/* House results */}
        {mode === "house" && (
          <div className="space-y-2">
            {houseResults.length === 0 ? (
              <div className="text-center py-16 text-stone-400">
                <p className="text-3xl mb-2">😕</p>
                <p className="text-sm">검색 결과가 없어요</p>
              </div>
            ) : (
              <>
                {!query.trim() && <p className="text-xs text-stone-400 mb-2">전체 {houseResults.length}개 하우스</p>}
                {houseResults.map((house) => {
                  const frags = FRAGRANCES_DB.filter((f) => f.house === house);
                  return (
                    <div
                      key={house}
                      className="bg-white rounded-2xl px-4 py-3.5 border border-stone-100 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-stone-800 text-sm">{house}</p>
                          <p className="text-xs text-stone-400 mt-0.5">향수 {frags.length}개</p>
                        </div>
                        <div className="flex gap-1 flex-wrap justify-end max-w-[140px]">
                          {frags.slice(0, 3).map((f) => (
                            <span key={f.id} className="text-xs bg-stone-50 text-stone-500 px-2 py-0.5 rounded-full border border-stone-100">
                              {f.name}
                            </span>
                          ))}
                          {frags.length > 3 && (
                            <span className="text-xs text-stone-400">+{frags.length - 3}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}

        {/* User results */}
        {mode === "user" && (
          <div className="space-y-2">
            {userResults.length === 0 ? (
              <div className="text-center py-16 text-stone-400">
                <p className="text-3xl mb-2">😕</p>
                <p className="text-sm">유저를 찾을 수 없어요</p>
              </div>
            ) : (
              <>
                {!query.trim() && <p className="text-xs text-stone-400 mb-2">유저 검색</p>}
                {userResults.map((u) => (
                  <div key={u.id} className="flex items-center gap-4 bg-white rounded-2xl px-4 py-3.5 border border-stone-100 shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-lg">
                      👤
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-stone-800 text-sm">{u.nickname}</p>
                      <p className="text-xs text-stone-400">컬렉션 {u.count}개</p>
                    </div>
                    <span className="text-stone-300 text-sm">›</span>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
