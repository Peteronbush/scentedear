"use client";

import { useEffect, useState } from "react";

interface WeatherData {
  code: number;
  temp: number;
  label: string;
  emoji: string;
  condition: "sunny" | "cloudy" | "rainy" | "snowy" | "foggy" | "stormy";
  bgFrom: string;
  bgTo: string;
}

function decodeWeather(code: number, temp: number): WeatherData {
  if (code === 0) return { code, temp, label: "맑음", emoji: "☀️", condition: "sunny", bgFrom: "from-amber-300", bgTo: "to-orange-200" };
  if (code <= 3)  return { code, temp, label: "구름 조금", emoji: "⛅", condition: "cloudy", bgFrom: "from-stone-300", bgTo: "to-slate-200" };
  if (code <= 48) return { code, temp, label: "안개", emoji: "🌫️", condition: "foggy", bgFrom: "from-stone-400", bgTo: "to-stone-200" };
  if (code <= 67) return { code, temp, label: "비", emoji: "🌧️", condition: "rainy", bgFrom: "from-slate-500", bgTo: "to-blue-300" };
  if (code <= 77) return { code, temp, label: "눈", emoji: "❄️", condition: "snowy", bgFrom: "from-sky-200", bgTo: "to-white" };
  if (code <= 82) return { code, temp, label: "소나기", emoji: "🌦️", condition: "rainy", bgFrom: "from-slate-400", bgTo: "to-blue-200" };
  if (code <= 86) return { code, temp, label: "눈 소나기", emoji: "🌨️", condition: "snowy", bgFrom: "from-sky-300", bgTo: "to-slate-100" };
  return { code, temp, label: "천둥번개", emoji: "⛈️", condition: "stormy", bgFrom: "from-slate-700", bgTo: "to-slate-400" };
}

function SunnyAnimation() {
  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      {/* Rays */}
      {[0,45,90,135,180,225,270,315].map((deg, i) => (
        <div
          key={deg}
          className="sun-ray absolute w-1 h-5 bg-amber-300 rounded-full origin-bottom"
          style={{ transform: `rotate(${deg}deg) translateY(-36px)`, animationDelay: `${i * 0.15}s` }}
        />
      ))}
      {/* Core */}
      <div className="sun-pulse w-14 h-14 rounded-full bg-amber-400 shadow-lg shadow-amber-300/60 z-10" />
    </div>
  );
}

function CloudyAnimation() {
  return (
    <div className="relative w-32 h-20 flex items-end justify-center">
      <div className="cloud-float absolute top-0 left-2 w-16 h-10 bg-white/70 rounded-full opacity-80" style={{ animationDelay: "0.5s" }} />
      <div className="cloud-float w-24 h-12 bg-white rounded-full shadow-md" />
    </div>
  );
}

function RainyAnimation() {
  return (
    <div className="relative w-28 h-24 overflow-hidden">
      {/* Cloud */}
      <div className="cloud-float absolute top-0 left-1/2 -translate-x-1/2 w-20 h-10 bg-slate-400 rounded-full" />
      {/* Drops */}
      {[10,30,50,70,90].map((x, i) => (
        <div
          key={i}
          className="rain-drop absolute w-0.5 h-3 bg-blue-300 rounded-full"
          style={{ left: `${x}%`, top: 0, animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  );
}

function SnowyAnimation() {
  return (
    <div className="relative w-28 h-24 overflow-hidden">
      <div className="cloud-float absolute top-0 left-1/2 -translate-x-1/2 w-20 h-10 bg-sky-200 rounded-full" />
      {["✦","❄","✦","❄","✦"].map((flake, i) => (
        <div
          key={i}
          className="snow-flake absolute text-sm text-sky-300"
          style={{ left: `${15 + i * 18}%`, top: 0, animationDelay: `${i * 0.35}s` }}
        >
          {flake}
        </div>
      ))}
    </div>
  );
}

function FoggyAnimation() {
  return (
    <div className="relative w-32 h-20 flex flex-col justify-center gap-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="fog-bar h-2 bg-stone-300/70 rounded-full"
          style={{ width: `${80 - i * 15}%`, animationDelay: `${i * 0.6}s` }}
        />
      ))}
    </div>
  );
}

function StormyAnimation() {
  return (
    <div className="relative w-28 h-24 overflow-hidden">
      <div className="cloud-float absolute top-0 left-1/2 -translate-x-1/2 w-24 h-12 bg-slate-600 rounded-full" />
      <div className="lightning absolute text-3xl" style={{ left: "42%", top: "30px" }}>⚡</div>
      {[20,60,80].map((x, i) => (
        <div key={i} className="rain-drop absolute w-0.5 h-3 bg-slate-300 rounded-full"
          style={{ left: `${x}%`, top: 0, animationDelay: `${i * 0.25}s` }} />
      ))}
    </div>
  );
}

const ANIMATIONS: Record<WeatherData["condition"], React.ReactNode> = {
  sunny:  <SunnyAnimation />,
  cloudy: <CloudyAnimation />,
  rainy:  <RainyAnimation />,
  snowy:  <SnowyAnimation />,
  foggy:  <FoggyAnimation />,
  stormy: <StormyAnimation />,
};

export type { WeatherData };

interface Props {
  onWeather: (w: WeatherData) => void;
}

export default function WeatherCard({ onWeather }: Props) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("위치 정보를 사용할 수 없어요");
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`
          );
          const json = await res.json();
          const cw = json.current_weather;
          const w = decodeWeather(cw.weathercode, Math.round(cw.temperature));
          setWeather(w);
          onWeather(w);
        } catch {
          setError("날씨 정보를 불러올 수 없어요");
        }
        setLoading(false);
      },
      () => {
        setError("위치 접근이 거부되었어요");
        setLoading(false);
      }
    );
  }, [onWeather]);

  if (loading) {
    return (
      <div className="rounded-3xl bg-gradient-to-br from-stone-200 to-stone-100 p-6 flex items-center justify-center h-40 animate-pulse">
        <p className="text-stone-400 text-sm">날씨 불러오는 중...</p>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="rounded-3xl bg-gradient-to-br from-stone-200 to-stone-100 p-6 flex items-center gap-3 h-40">
        <span className="text-4xl">🌡️</span>
        <p className="text-stone-500 text-sm">{error ?? "날씨 정보 없음"}</p>
      </div>
    );
  }

  return (
    <div className={`rounded-3xl bg-gradient-to-br ${weather.bgFrom} ${weather.bgTo} p-6 flex items-center justify-between overflow-hidden relative`}>
      {/* Text */}
      <div className="z-10">
        <p className="text-white/80 text-xs font-medium mb-1">지금 날씨</p>
        <p className="text-white text-4xl font-bold">{weather.temp}°</p>
        <p className="text-white/90 text-sm font-medium mt-1">{weather.label}</p>
      </div>
      {/* Animation */}
      <div className="z-10">
        {ANIMATIONS[weather.condition]}
      </div>
    </div>
  );
}
