"use client";

import { useState } from "react";
import { OnboardingData } from "@/types/fragrance";

// What sections can be toggled visible in the collection
const COLLECTION_TOGGLES = [
  { key: "showFragrances", label: "보유 향수 목록", icon: "🧴" },
  { key: "showReviews",    label: "내 향수 리뷰",   icon: "✍️" },
  { key: "showJournal",    label: "착용 일지",       icon: "📓" },
  { key: "showHouseReviews", label: "하우스 리뷰",  icon: "🏛️" },
] as const;

interface Props {
  onboardingData: OnboardingData | null;
}

export default function ProfileTab({ onboardingData }: Props) {
  const [visibility, setVisibility] = useState<Record<string, boolean>>({
    showFragrances: true,
    showReviews: true,
    showJournal: false,
    showHouseReviews: true,
  });

  const toggle = (key: string) =>
    setVisibility((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="px-5 pt-4 pb-6 space-y-6">

      {/* Profile card */}
      <div className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-2xl">
            👤
          </div>
          <div>
            <p className="font-bold text-stone-800">닉네임</p>
            <p className="text-xs text-stone-400 mt-0.5">가입일 2025</p>
          </div>
        </div>

        {onboardingData && (
          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-stone-100">
            <div className="text-center">
              <p className="text-lg font-bold text-stone-800">{onboardingData.collection.length}</p>
              <p className="text-[10px] text-stone-400">보유 향수</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-stone-800">2</p>
              <p className="text-[10px] text-stone-400">리뷰</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-stone-800">{onboardingData.favoriteHouses.length}</p>
              <p className="text-[10px] text-stone-400">관심 하우스</p>
            </div>
          </div>
        )}
      </div>

      {/* Collection visibility */}
      <div>
        <h3 className="text-sm font-bold text-stone-700 mb-3">컬렉션 공개 설정</h3>
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm divide-y divide-stone-100">
          {COLLECTION_TOGGLES.map(({ key, label, icon }) => (
            <div key={key} className="flex items-center justify-between px-4 py-3.5">
              <div className="flex items-center gap-3">
                <span>{icon}</span>
                <span className="text-sm text-stone-700">{label}</span>
              </div>
              <button
                onClick={() => toggle(key)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  visibility[key] ? "bg-amber-500" : "bg-stone-200"
                }`}
              >
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
                  visibility[key] ? "left-5" : "left-0.5"
                }`} />
              </button>
            </div>
          ))}
        </div>
        <p className="text-xs text-stone-400 mt-2 px-1">다른 유저가 내 프로필을 볼 때 표시되는 항목을 설정해요</p>
      </div>

      {/* Preferences summary */}
      {onboardingData && (
        <div>
          <h3 className="text-sm font-bold text-stone-700 mb-3">내 향수 취향</h3>
          <div className="bg-white rounded-2xl p-4 border border-stone-100 shadow-sm space-y-4">
            {onboardingData.favoriteHouses.length > 0 && (
              <div>
                <p className="text-xs text-stone-400 font-medium mb-2">좋아하는 하우스</p>
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
        </div>
      )}

      {/* Settings */}
      <div>
        <h3 className="text-sm font-bold text-stone-700 mb-3">설정</h3>
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm divide-y divide-stone-100">
          <button className="w-full flex items-center justify-between px-4 py-3.5 text-sm text-stone-700 hover:bg-stone-50">
            <span>취향 다시 설정</span>
            <span className="text-stone-400">›</span>
          </button>
          <button className="w-full flex items-center justify-between px-4 py-3.5 text-sm text-stone-700 hover:bg-stone-50">
            <span>알림 설정</span>
            <span className="text-stone-400">›</span>
          </button>
          <button
            onClick={() => {
              sessionStorage.removeItem("scentedear_logged_in");
              window.location.href = "/login";
            }}
            className="w-full flex items-center justify-between px-4 py-3.5 text-sm text-red-500 hover:bg-red-50"
          >
            <span>로그아웃</span>
            <span>›</span>
          </button>
        </div>
      </div>
    </div>
  );
}
