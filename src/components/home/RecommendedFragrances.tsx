"use client";

import { useMemo } from "react";
import { FRAGRANCES_DB, FragranceDB } from "@/data/fragrances";
import { OnboardingData } from "@/types/fragrance";
import { WeatherData } from "./WeatherCard";

// Weather → preferred fragrance families
const WEATHER_FAMILIES: Record<string, string[]> = {
  sunny:  ["Aromatic Citrus", "Aquatic", "Floral", "Aromatic Aquatic", "Floral Fruity", "Aromatic Fresh"],
  cloudy: ["Woody", "Chypre", "Floral Woody", "Woody Aromatic", "Woody Floral"],
  rainy:  ["Woody", "Earthy", "Woody Earthy", "Oriental Woody", "Leather Woody", "Aromatic Woody"],
  snowy:  ["Oriental", "Gourmand", "Oriental Gourmand", "Amber", "Floral Amber", "Oriental Amber"],
  foggy:  ["Woody", "Aromatic", "Chypre Floral", "Woody Spicy"],
  stormy: ["Oriental", "Woody Oriental", "Leather", "Smoky", "Resinous"],
};

const WEATHER_MSG: Record<string, string> = {
  sunny:  "맑은 날엔 상쾌한 향이 잘 어울려요",
  cloudy: "흐린 날엔 따뜻한 우디 향이 딱이에요",
  rainy:  "비 오는 날엔 묵직한 향이 빛납니다",
  snowy:  "추운 날엔 달콤한 오리엔탈 계열을 추천해요",
  foggy:  "안개 낀 날엔 신비로운 향이 어울려요",
  stormy: "거친 날씨엔 가죽·스모키 향이 잘 맞아요",
};

function scoreFragrance(f: FragranceDB, data: OnboardingData, weatherFamilies: string[]): number {
  let score = 0;

  // Weather family match
  const familyMatch = weatherFamilies.some((wf) =>
    f.family.toLowerCase().includes(wf.toLowerCase()) ||
    wf.toLowerCase().includes(f.family.toLowerCase())
  );
  if (familyMatch) score += 30;

  // Preferred house match
  if (data.favoriteHouses.includes(f.house)) score += 20;

  // Not in collection already
  if (data.collection.find((c) => c.id === f.id)) score -= 50;

  // Priority scoring
  if (data.priorities[0] === "longevity") score += (f.longevityAvg ?? 0) * 3;
  else if (data.priorities[0] === "projection") score += (f.projectionAvg ?? 0) * 3;
  else score += (f.longevityAvg ?? 0) + (f.projectionAvg ?? 0);

  // Disliked categories (family-based)
  const dislikedKeywords: Record<string, string[]> = {
    "너무 달콤한 향": ["gourmand", "vanilla", "caramel"],
    "강한 스모키":    ["smoky", "tobacco"],
    "과한 플로럴":    ["floral"],
    "동물성 무스크":  ["musk"],
    "진한 오우드":    ["oud"],
    "과한 시트러스":  ["citrus"],
    "파우더리":       ["powdery"],
  };
  for (const cat of data.dislikedCategories) {
    const keywords = dislikedKeywords[cat] ?? [];
    if (keywords.some((k) => f.family.toLowerCase().includes(k))) score -= 25;
  }

  // Small deterministic variance by id
  score += (parseInt(f.id, 10) % 5) * 0.1;

  return score;
}

interface Props {
  weather: WeatherData | null;
  onboardingData: OnboardingData | null;
}

export default function RecommendedFragrances({ weather, onboardingData }: Props) {
  const recommendations = useMemo(() => {
    const weatherFamilies = weather ? (WEATHER_FAMILIES[weather.condition] ?? []) : [];
    const data = onboardingData ?? {
      collection: [], favoriteId: null, dislikedFragrances: [],
      dislikedCategories: [], favoriteHouses: [], priorities: [],
    };

    return FRAGRANCES_DB
      .map((f) => ({ f, score: scoreFragrance(f, data, weatherFamilies) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((x) => x.f);
  }, [weather, onboardingData]);

  const msg = weather ? WEATHER_MSG[weather.condition] : "오늘의 추천 향수";

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-bold text-stone-800">오늘의 추천</h3>
        <p className="text-xs text-stone-400 mt-0.5">{msg}</p>
      </div>
      <div className="space-y-3">
        {recommendations.map((f) => (
          <div
            key={f.id}
            className="flex items-center gap-4 bg-white rounded-2xl px-4 py-3 border border-stone-100 shadow-sm"
          >
            <span className="text-3xl">{f.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-stone-800 text-sm truncate">{f.name}</p>
              <p className="text-stone-400 text-xs">{f.house}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-stone-400">{f.family}</p>
              <div className="flex gap-1 mt-1 justify-end">
                <span className="text-xs bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded-full">지속 {f.longevityAvg}</span>
                <span className="text-xs bg-stone-50 text-stone-500 px-1.5 py-0.5 rounded-full">확산 {f.projectionAvg}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
