"use client";

import { useEffect } from "react";
import { FragranceDB } from "@/data/fragrances";

interface Props {
  fragrance: FragranceDB | null;
  onClose: () => void;
}

function NoteBar({ label, notes }: { label: string; notes: string[] }) {
  if (notes.length === 0) return null;
  return (
    <div className="flex gap-3">
      <span className="text-xs text-stone-400 w-12 shrink-0 pt-0.5">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {notes.map((n) => (
          <span key={n} className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 text-xs">
            {n}
          </span>
        ))}
      </div>
    </div>
  );
}

function ScoreBar({ label, value, color }: { label: string; value: number | null; color: string }) {
  if (value == null) return null;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-stone-500">{label}</span>
        <span className="font-semibold text-stone-700">{value}/10</span>
      </div>
      <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-700`}
          style={{ width: `${value * 10}%` }}
        />
      </div>
    </div>
  );
}

const GENDER_LABEL: Record<string, string> = {
  Male: "남성",
  Female: "여성",
  Unisex: "유니섹스",
};

const SEASON_LABEL: Record<string, string> = {
  Spring: "봄", Summer: "여름", Fall: "가을", Winter: "겨울",
};

const OCCASION_LABEL: Record<string, string> = {
  Casual: "캐주얼", Office: "오피스", Date: "데이트",
  Evening: "이브닝", Formal: "포멀", Sport: "스포츠",
};

const PRICE_LABEL: Record<string, string> = {
  Budget: "저가", Mid: "중가", Luxury: "럭셔리", Ultra: "울트라럭셔리",
};

export default function FragranceDetailSheet({ fragrance: f, onClose }: Props) {
  useEffect(() => {
    if (f) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [f]);

  if (!f) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-40 rounded-t-3xl bg-white shadow-2xl overflow-hidden animate-slide-up">
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-stone-200 rounded-full" />
        </div>

        <div className="overflow-y-auto max-h-[80vh] pb-10">
          {/* Hero */}
          <div className="px-6 pt-4 pb-6 border-b border-stone-100">
            <div className="flex items-start gap-4">
              <span className="text-5xl">{f.icon}</span>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-stone-800 leading-tight">{f.name}</h2>
                <p className="text-stone-500 text-sm mt-0.5">{f.house}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                    {f.family}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 text-xs">
                    {f.concentration}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 text-xs">
                    {GENDER_LABEL[f.gender] ?? f.gender}
                  </span>
                  {f.year && (
                    <span className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 text-xs">
                      {f.year}년
                    </span>
                  )}
                  {f.priceTier && (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs">
                      {PRICE_LABEL[f.priceTier] ?? f.priceTier}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Rating */}
            {f.ratingAvg != null && (
              <div className="mt-4 flex items-center gap-2">
                <span className="text-yellow-400 text-sm">★</span>
                <span className="text-sm font-semibold text-stone-800">{f.ratingAvg.toFixed(1)}</span>
                <span className="text-xs text-stone-400">/ 5.0</span>
              </div>
            )}

            {/* Korean description */}
            {f.descriptionKo && (
              <p className="mt-3 text-sm text-stone-600 leading-relaxed">{f.descriptionKo}</p>
            )}
          </div>

          {/* Notes */}
          <div className="px-6 py-5 border-b border-stone-100 space-y-3">
            <h3 className="text-sm font-bold text-stone-700">향 노트</h3>
            <NoteBar label="탑" notes={f.topNotes} />
            <NoteBar label="미들" notes={f.middleNotes} />
            <NoteBar label="베이스" notes={f.baseNotes} />
          </div>

          {/* Accords */}
          {f.accords.length > 0 && (
            <div className="px-6 py-5 border-b border-stone-100">
              <h3 className="text-sm font-bold text-stone-700 mb-3">어코드</h3>
              <div className="flex flex-wrap gap-1.5">
                {f.accords.map((a) => (
                  <span key={a} className="px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 text-xs">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Season & Occasion */}
          {(f.season.length > 0 || f.occasion.length > 0) && (
            <div className="px-6 py-5 border-b border-stone-100 space-y-3">
              {f.season.length > 0 && (
                <div className="flex gap-3 items-start">
                  <span className="text-xs text-stone-400 w-12 shrink-0 pt-0.5">계절</span>
                  <div className="flex flex-wrap gap-1.5">
                    {f.season.map((s) => (
                      <span key={s} className="px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 text-xs">
                        {SEASON_LABEL[s] ?? s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {f.occasion.length > 0 && (
                <div className="flex gap-3 items-start">
                  <span className="text-xs text-stone-400 w-12 shrink-0 pt-0.5">상황</span>
                  <div className="flex flex-wrap gap-1.5">
                    {f.occasion.map((o) => (
                      <span key={o} className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-xs">
                        {OCCASION_LABEL[o] ?? o}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Performance */}
          <div className="px-6 py-5 space-y-4">
            <h3 className="text-sm font-bold text-stone-700">퍼포먼스</h3>
            <ScoreBar label="지속력" value={f.longevityAvg} color="bg-amber-400" />
            <ScoreBar label="확산력" value={f.projectionAvg} color="bg-stone-400" />
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200 transition-colors"
        >
          ✕
        </button>
      </div>
    </>
  );
}
