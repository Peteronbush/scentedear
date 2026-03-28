"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { OnboardingData } from "@/types/fragrance";
import WeatherCard, { WeatherData } from "@/components/home/WeatherCard";
import RecommendedFragrances from "@/components/home/RecommendedFragrances";
import { FRAGRANCES_DB } from "@/data/fragrances";

type Tab = "home" | "explore" | "collection" | "profile";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "home",       label: "홈",     icon: "🏠" },
  { id: "explore",    label: "탐색",   icon: "🔍" },
  { id: "collection", label: "컬렉션", icon: "🧴" },
  { id: "profile",    label: "프로필", icon: "👤" },
];

export default function HomePage() {
  const [tab, setTab] = useState<Tab>("home");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("scentedeer_onboarding");
    if (raw) {
      try { setOnboardingData(JSON.parse(raw)); } catch { /* ignore */ }
    }
  }, []);

  const handleWeather = useCallback((w: WeatherData) => setWeather(w), []);

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col max-w-md mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-10 pb-4 bg-stone-50 sticky top-0 z-20">
        <Image src="/logo.png" alt="scentdear" width={100} height={40} className="object-contain" />
        <button className="w-9 h-9 rounded-full bg-white border border-stone-200 flex items-center justify-center text-lg shadow-sm">
          🔔
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto pb-24">
        {tab === "home" && (
          <div className="px-5 space-y-6 pt-2 pb-6">
            <WeatherCard onWeather={handleWeather} />
            <RecommendedFragrances weather={weather} onboardingData={onboardingData} />
          </div>
        )}

        {tab === "explore" && (
          <div className="px-5 pt-4 space-y-4">
            <h2 className="text-xl font-bold text-stone-800">향수 탐색</h2>
            <div className="grid grid-cols-2 gap-3">
              {FRAGRANCES_DB.slice(0, 20).map((f) => (
                <div key={f.id} className="bg-white rounded-2xl p-4 border border-stone-100 shadow-sm">
                  <span className="text-3xl">{f.icon}</span>
                  <p className="font-semibold text-stone-800 text-sm mt-2 truncate">{f.name}</p>
                  <p className="text-stone-400 text-xs truncate">{f.house}</p>
                  <p className="text-xs text-amber-600 mt-1">{f.family}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "collection" && (
          <div className="px-5 pt-4 space-y-4">
            <h2 className="text-xl font-bold text-stone-800">내 컬렉션</h2>
            {!onboardingData || onboardingData.collection.length === 0 ? (
              <div className="text-center py-16 text-stone-400">
                <p className="text-4xl mb-3">🧴</p>
                <p className="text-sm">아직 등록된 향수가 없어요</p>
              </div>
            ) : (
              <div className="space-y-3">
                {onboardingData.collection.map((f) => (
                  <div key={f.id} className={`flex items-center gap-4 bg-white rounded-2xl px-4 py-3 border shadow-sm ${
                    f.id === onboardingData.favoriteId ? "border-amber-300 bg-amber-50" : "border-stone-100"
                  }`}>
                    <span className="text-3xl">{f.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <p className="font-semibold text-stone-800 text-sm truncate">{f.name}</p>
                        {f.id === onboardingData.favoriteId && <span className="text-amber-500 text-sm">★</span>}
                      </div>
                      <p className="text-stone-400 text-xs">{f.house} · {f.concentration}</p>
                    </div>
                    <span className="text-xs text-stone-400 shrink-0">{f.family}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "profile" && (
          <div className="px-5 pt-4 space-y-6">
            <h2 className="text-xl font-bold text-stone-800">내 프로필</h2>
            {onboardingData ? (
              <>
                <div className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm space-y-4">
                  <div>
                    <p className="text-xs text-stone-400 font-medium mb-1">보유 향수</p>
                    <p className="font-semibold text-stone-700">{onboardingData.collection.length}개</p>
                  </div>
                  {onboardingData.favoriteHouses.length > 0 && (
                    <div>
                      <p className="text-xs text-stone-400 font-medium mb-2">좋아하는 브랜드</p>
                      <div className="flex flex-wrap gap-1.5">
                        {onboardingData.favoriteHouses.map((h) => (
                          <span key={h} className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">{h}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {onboardingData.dislikedCategories.length > 0 && (
                    <div>
                      <p className="text-xs text-stone-400 font-medium mb-2">싫어하는 향</p>
                      <div className="flex flex-wrap gap-1.5">
                        {onboardingData.dislikedCategories.map((c) => (
                          <span key={c} className="px-2.5 py-1 rounded-full bg-red-50 text-red-500 text-xs font-medium">{c}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <p className="text-stone-400 text-sm text-center py-10">온보딩을 완료하면 프로필이 생성돼요</p>
            )}
          </div>
        )}
      </main>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-stone-100 flex z-20 shadow-lg">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex flex-col items-center py-3 gap-0.5 transition-colors ${
              tab === t.id ? "text-amber-600" : "text-stone-400"
            }`}
          >
            <span className="text-xl">{t.icon}</span>
            <span className="text-[10px] font-medium">{t.label}</span>
            {tab === t.id && <span className="absolute bottom-1 w-1 h-1 bg-amber-500 rounded-full" />}
          </button>
        ))}
      </nav>
    </div>
  );
}
