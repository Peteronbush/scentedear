"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface OnboardingLayoutProps {
  step: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  nextLabel?: string;
  canProceed?: boolean;
  children: React.ReactNode;
}

export default function OnboardingLayout({
  step,
  totalSteps,
  onNext,
  onBack,
  nextLabel = "다음",
  canProceed = true,
  children,
}: OnboardingLayoutProps) {
  const [animating, setAnimating] = useState(false);
  const [displayStep, setDisplayStep] = useState(step);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const prevStepRef = useRef(step);

  useEffect(() => {
    if (step !== prevStepRef.current) {
      setDirection(step > prevStepRef.current ? "forward" : "back");
      setAnimating(true);
      const t = setTimeout(() => {
        setDisplayStep(step);
        setAnimating(false);
        prevStepRef.current = step;
      }, 220);
      return () => clearTimeout(t);
    }
  }, [step]);

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-stone-50/90 backdrop-blur-sm border-b border-stone-200">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <Image src="/logo.png" alt="Scentdear" width={120} height={40} className="object-contain" />
          <span className="text-xs text-stone-400 font-medium">
            {step} / {totalSteps}
          </span>
        </div>

        {/* Progress bar */}
        <div className="max-w-lg mx-auto px-4 pb-3">
          <div className="flex gap-1.5">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className="h-1.5 flex-1 rounded-full transition-all duration-500"
                style={{
                  backgroundColor:
                    i < step
                      ? "rgb(217 119 6)" // amber-600
                      : "rgb(231 229 228)", // stone-200
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 py-6">
          <div
            key={displayStep}
            className="transition-all duration-220"
            style={{
              animation: animating
                ? direction === "forward"
                  ? "slideIn 0.22s ease forwards"
                  : "slideInReverse 0.22s ease forwards"
                : undefined,
            }}
          >
            {children}
          </div>
        </div>
      </div>

      {/* Footer nav */}
      <div className="sticky bottom-0 bg-stone-50/90 backdrop-blur-sm border-t border-stone-200">
        <div className="max-w-lg mx-auto px-4 py-4 flex gap-3">
          {step > 1 && (
            <button
              onClick={onBack}
              className="flex-none px-5 py-3 rounded-2xl border border-stone-300 text-stone-600 font-medium hover:bg-stone-100 transition-colors"
            >
              ← 뒤로
            </button>
          )}
          <button
            onClick={onNext}
            disabled={!canProceed}
            className={`flex-1 py-3 rounded-2xl font-semibold transition-all duration-200 ${
              canProceed
                ? "bg-amber-600 text-white hover:bg-amber-700 active:scale-95"
                : "bg-stone-200 text-stone-400 cursor-not-allowed"
            }`}
          >
            {nextLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
