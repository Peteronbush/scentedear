"use client";

import { useState } from "react";
import OnboardingLayout from "@/components/onboarding/OnboardingLayout";
import Step1Collection from "@/components/onboarding/steps/Step1Collection";
import Step2Houses from "@/components/onboarding/steps/Step2Houses";
import Step3Dislikes from "@/components/onboarding/steps/Step3Dislikes";
import Step4Priorities from "@/components/onboarding/steps/Step4Priorities";
import Step5Complete from "@/components/onboarding/steps/Step5Complete";
import { OnboardingData, Fragrance } from "@/types/fragrance";

const TOTAL_STEPS = 5;

const initialData: OnboardingData = {
  collection: [],
  favoriteId: null,
  dislikedFragrances: [],
  dislikedCategories: [],
  favoriteHouses: [],
  priorities: [],
};

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(initialData);

  const goNext = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  const nextLabel = step === TOTAL_STEPS - 1 ? "완료" : step === TOTAL_STEPS ? "완료" : "다음";

  return (
    <OnboardingLayout
      step={step}
      totalSteps={TOTAL_STEPS}
      onNext={goNext}
      onBack={goBack}
      nextLabel={nextLabel}
      canProceed={true}
    >
      {step === 1 && (
        <Step1Collection
          collection={data.collection}
          favoriteId={data.favoriteId}
          onChange={(collection: Fragrance[], favoriteId: string | null) =>
            setData((d) => ({ ...d, collection, favoriteId }))
          }
        />
      )}
      {step === 2 && (
        <Step2Houses
          favoriteHouses={data.favoriteHouses}
          onChange={(favoriteHouses: string[]) =>
            setData((d) => ({ ...d, favoriteHouses }))
          }
        />
      )}
      {step === 3 && (
        <Step3Dislikes
          dislikedFragrances={data.dislikedFragrances}
          dislikedCategories={data.dislikedCategories}
          onChange={(dislikedFragrances: Fragrance[], dislikedCategories: string[]) =>
            setData((d) => ({ ...d, dislikedFragrances, dislikedCategories }))
          }
        />
      )}
      {step === 4 && (
        <Step4Priorities
          priorities={data.priorities}
          onChange={(priorities: string[]) =>
            setData((d) => ({ ...d, priorities }))
          }
        />
      )}
      {step === 5 && <Step5Complete data={data} />}
    </OnboardingLayout>
  );
}
