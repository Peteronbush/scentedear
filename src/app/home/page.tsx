"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { OnboardingData } from "@/types/fragrance";
import WeatherCard, { WeatherData } from "@/components/home/WeatherCard";
import RecommendedFragrances from "@/components/home/RecommendedFragrances";
import FragranceDetailSheet from "@/components/home/FragranceDetailSheet";
import ExploreTab from "@/components/home/tabs/ExploreTab";
import BoardTab from "@/components/home/tabs/BoardTab";
import CollectionTab from "@/components/home/tabs/CollectionTab";
import ProfileTab from "@/components/home/tabs/ProfileTab";
import { FragranceDB } from "@/data/fragrances";

type Tab = "home" | "explore" | "board" | "collection" | "profile";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "home",       label: "홈",     icon: "🏠" },
  { id: "explore",    label: "탐색",   icon: "🔍" },
  { id: "board",      label: "게시판", icon: "📋" },
  { id: "collection", label: "컬렉션", icon: "🧴" },
  { id: "profile",    label: "프로필", icon: "👤" },
];

export default function HomePage() {
  const [tab, setTab] = useState<Tab>("home");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  const [selectedFragrance, setSelectedFragrance] = useState<FragranceDB | null>(null);

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
          <ExploreTab onSelectFragrance={setSelectedFragrance} />
        )}

        {tab === "board" && (
          <BoardTab />
        )}

        {tab === "collection" && (
          <CollectionTab
            onboardingData={onboardingData}
            onSelectFragrance={setSelectedFragrance}
          />
        )}

        {tab === "profile" && (
          <ProfileTab onboardingData={onboardingData} />
        )}
      </main>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-stone-100 flex z-20 shadow-lg">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex flex-col items-center py-3 gap-0.5 transition-colors relative ${
              tab === t.id ? "text-amber-600" : "text-stone-400"
            }`}
          >
            <span className="text-xl">{t.icon}</span>
            <span className="text-[10px] font-medium">{t.label}</span>
            {tab === t.id && (
              <span className="absolute bottom-1 w-1 h-1 bg-amber-500 rounded-full" />
            )}
          </button>
        ))}
      </nav>

      {/* Fragrance Detail Sheet */}
      <FragranceDetailSheet
        fragrance={selectedFragrance}
        onClose={() => setSelectedFragrance(null)}
      />
    </div>
  );
}
