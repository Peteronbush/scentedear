"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingData } from "@/types/fragrance";
import { saveOnboardingData } from "../../../../lib/supabase/userFragrances";

const PRIORITY_LABELS: Record<string, string> = {
  longevity:  "⏳ 지속력",
  projection: "💨 확산력",
  uniqueness: "💎 희소성",
  value:      "💰 가성비",
};

const CONFETTI_COLORS = ["#F59E0B", "#D97706", "#92400E", "#78716C", "#A8A29E", "#FCD34D"];

interface Props {
  data: OnboardingData;
}

export default function Step5Complete({ data }: Props) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const favorite = data.collection.find((f) => f.id === data.favoriteId);

  const [saving, setSaving] = useState(false);

  const handleStart = async () => {
    setSaving(true);
    // Always save to localStorage as fallback
    localStorage.setItem("scentedeer_onboarding", JSON.stringify(data));
    try {
      // Try to save to Supabase (no-op if not logged in / not configured)
      await saveOnboardingData(data);
    } catch {
      // Silently continue — localStorage is the source of truth until Supabase is connected
    }
    setSaving(false);
    router.push("/home");
  };

  return (
    <div className="space-y-6 text-center">
      {/* Animated checkmark */}
      <div className="flex justify-center py-4 relative">
        {/* Confetti dots */}
        {visible &&
          CONFETTI_COLORS.map((color, i) => (
            <span
              key={i}
              className="confetti-dot absolute w-3 h-3 rounded-full"
              style={{
                backgroundColor: color,
                top: `${10 + Math.sin(i * 60 * (Math.PI / 180)) * 30}px`,
                left: `${50 + Math.cos(i * 60 * (Math.PI / 180)) * 50}%`,
                animationDelay: `${i * 0.08}s`,
              }}
            />
          ))}

        <div className={`check-circle w-24 h-24 rounded-full bg-amber-500 flex items-center justify-center shadow-lg`}>
          <svg
            viewBox="0 0 52 52"
            className="w-12 h-12"
            fill="none"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path className="check-path" d="M14 27 L22 35 L38 17" />
          </svg>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-stone-800 mb-2">완료! 🦌</h2>
        <p className="text-stone-500 text-sm">
          당신만의 향수 프로필이 완성되었어요
        </p>
      </div>

      {/* Summary card */}
      <div className="rounded-2xl border border-stone-200 bg-white text-left divide-y divide-stone-100 overflow-hidden">
        <div className="px-5 py-4">
          <p className="text-xs text-stone-400 font-medium mb-1">보유 향수</p>
          <p className="font-semibold text-stone-800">
            {data.collection.length > 0
              ? `${data.collection.length}개 등록됨`
              : "미등록"}
          </p>
        </div>

        {favorite && (
          <div className="px-5 py-4">
            <p className="text-xs text-stone-400 font-medium mb-1">최애 향수</p>
            <p className="font-semibold text-stone-800">
              {favorite.icon} {favorite.name}
              <span className="text-stone-400 font-normal text-sm"> — {favorite.house}</span>
            </p>
          </div>
        )}

        {data.favoriteHouses.length > 0 && (
          <div className="px-5 py-4">
            <p className="text-xs text-stone-400 font-medium mb-2">좋아하는 하우스</p>
            <div className="flex flex-wrap gap-1.5">
              {data.favoriteHouses.slice(0, 5).map((h) => (
                <span
                  key={h}
                  className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium"
                >
                  {h}
                </span>
              ))}
              {data.favoriteHouses.length > 5 && (
                <span className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-500 text-xs">
                  +{data.favoriteHouses.length - 5}
                </span>
              )}
            </div>
          </div>
        )}

        {data.priorities.length > 0 && (
          <div className="px-5 py-4">
            <p className="text-xs text-stone-400 font-medium mb-2">선택 기준 순위</p>
            <div className="flex flex-col gap-1">
              {data.priorities.map((p, i) => (
                <p key={p} className="text-sm text-stone-700">
                  <span className="font-bold text-amber-600 mr-2">{i + 1}.</span>
                  {PRIORITY_LABELS[p] ?? p}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={handleStart}
        disabled={saving}
        className="w-full py-4 rounded-2xl bg-amber-600 text-white font-bold text-base hover:bg-amber-700 active:scale-[0.98] transition-all duration-150 shadow-md disabled:opacity-60"
      >
        {saving ? "저장 중..." : "향수 탐험 시작하기 →"}
      </button>
    </div>
  );
}
