"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id.trim() || !pw.trim()) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }
    localStorage.setItem("scentedear_logged_in", "true");
    router.push("/home");
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm flex flex-col items-center gap-10">

        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <Image src="/logo.png" alt="Scentedear" width={120} height={120} className="rounded-2xl" />
          <p className="text-sm text-stone-400">나의 향수 기록</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-stone-500 ml-1">이메일</label>
            <input
              type="email"
              value={id}
              onChange={(e) => { setId(e.target.value); setError(""); }}
              placeholder="이메일을 입력하세요"
              className="w-full px-4 py-3.5 rounded-2xl border border-stone-200 bg-white text-stone-800 placeholder-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition"
              autoComplete="email"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-stone-500 ml-1">비밀번호</label>
            <input
              type="password"
              value={pw}
              onChange={(e) => { setPw(e.target.value); setError(""); }}
              placeholder="비밀번호를 입력하세요"
              className="w-full px-4 py-3.5 rounded-2xl border border-stone-200 bg-white text-stone-800 placeholder-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 ml-1">{error}</p>
          )}

          <button
            type="submit"
            className="w-full mt-1 py-3.5 rounded-2xl bg-stone-800 text-white text-sm font-semibold hover:bg-stone-700 active:scale-95 transition-all"
          >
            로그인
          </button>
        </form>

        {/* Spacer + Register */}
        <div className="w-full flex flex-col items-center gap-3 -mt-2">
          <div className="flex items-center gap-3 w-full">
            <div className="flex-1 h-px bg-stone-200" />
            <span className="text-xs text-stone-300">또는</span>
            <div className="flex-1 h-px bg-stone-200" />
          </div>

          <button
            onClick={() => router.push("/signup")}
            className="w-full py-3.5 rounded-2xl border-2 border-stone-200 text-stone-600 text-sm font-semibold hover:border-stone-300 hover:bg-stone-100 active:scale-95 transition-all"
          >
            회원가입
          </button>
        </div>

      </div>
    </div>
  );
}
