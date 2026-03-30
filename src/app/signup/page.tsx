"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    emailConfirm: "",
    password: "",
    nickname: "",
    birthDate: "",
    gender: "" as "male" | "female" | "",
  });
  const [errors, setErrors] = useState<Partial<typeof form & { general: string }>>({});
  const [loading, setLoading] = useState(false);

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const errs: typeof errors = {};
    if (!form.email.trim()) errs.email = "이메일을 입력해주세요.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "올바른 이메일 형식이 아닙니다.";
    if (!form.emailConfirm.trim()) errs.emailConfirm = "이메일 확인을 입력해주세요.";
    else if (form.email !== form.emailConfirm) errs.emailConfirm = "이메일이 일치하지 않습니다.";
    if (!form.password.trim()) errs.password = "비밀번호를 입력해주세요.";
    else if (form.password.length < 6) errs.password = "비밀번호는 6자 이상이어야 합니다.";
    if (!form.nickname.trim()) errs.nickname = "닉네임을 입력해주세요.";
    if (!form.birthDate.trim()) errs.birthDate = "생년월일을 입력해주세요.";
    else if (!/^\d{6}$/.test(form.birthDate)) errs.birthDate = "6자리 숫자로 입력해주세요. (예: 950101)";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    try {
      // Placeholder — wire up Supabase signUp() here
      sessionStorage.setItem("scentedear_logged_in", "true");
      router.push("/onboarding");
    } catch {
      setErrors({ general: "회원가입 중 오류가 발생했습니다. 다시 시도해주세요." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-start px-6 py-12">
      <div className="w-full max-w-sm flex flex-col items-center gap-8">

        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <Image src="/logo.png" alt="Scentedear" width={80} height={80} className="rounded-2xl" />
          <p className="text-xs text-stone-400">나의 향수 기록</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">

          {/* 이메일 */}
          <Field label="이메일" required error={errors.email}>
            <input
              type="email"
              value={form.email}
              onChange={set("email")}
              placeholder="example@email.com"
              className={inputClass(!!errors.email)}
              autoComplete="email"
            />
          </Field>

          {/* 이메일 확인 */}
          <Field label="이메일 확인" required error={errors.emailConfirm}>
            <input
              type="email"
              value={form.emailConfirm}
              onChange={set("emailConfirm")}
              placeholder="이메일을 다시 입력하세요"
              className={inputClass(!!errors.emailConfirm)}
              autoComplete="email"
            />
          </Field>

          {/* 비밀번호 */}
          <Field label="비밀번호" required error={errors.password}>
            <input
              type="password"
              value={form.password}
              onChange={set("password")}
              placeholder="6자 이상 입력하세요"
              className={inputClass(!!errors.password)}
              autoComplete="new-password"
            />
          </Field>

          {/* 닉네임 */}
          <Field label="닉네임" required error={errors.nickname}>
            <div className="relative">
              <input
                type="text"
                value={form.nickname}
                onChange={set("nickname")}
                placeholder="12글자까지 가능합니다"
                maxLength={12}
                className={inputClass(!!errors.nickname) + " pr-14"}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-stone-300">
                {form.nickname.length}/12
              </span>
            </div>
          </Field>

          {/* 생년월일 */}
          <Field label="생년월일" required error={errors.birthDate}>
            <input
              type="text"
              value={form.birthDate}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "").slice(0, 6);
                setForm((prev) => ({ ...prev, birthDate: v }));
                setErrors((prev) => ({ ...prev, birthDate: "" }));
              }}
              placeholder="예 : 950101"
              maxLength={6}
              inputMode="numeric"
              className={inputClass(!!errors.birthDate)}
            />
          </Field>

          {/* 성별 (선택) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-stone-500 ml-1">
              성별 <span className="text-stone-300 font-normal">(선택)</span>
            </label>
            <div className="flex gap-3">
              {(["male", "female"] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, gender: prev.gender === g ? "" : g }))}
                  className={`flex-1 py-3 rounded-2xl text-sm font-medium border-2 transition-all ${
                    form.gender === g
                      ? "border-stone-800 bg-stone-800 text-white"
                      : "border-stone-200 bg-white text-stone-500 hover:border-stone-300"
                  }`}
                >
                  {g === "male" ? "남성" : "여성"}
                </button>
              ))}
            </div>
          </div>

          {errors.general && (
            <p className="text-xs text-red-400 ml-1">{errors.general}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 rounded-2xl bg-stone-800 text-white text-sm font-semibold hover:bg-stone-700 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? "처리 중..." : "회원가입"}
          </button>
        </form>

        <button
          onClick={() => router.push("/login")}
          className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
        >
          이미 계정이 있으신가요? <span className="underline">로그인</span>
        </button>

      </div>
    </div>
  );
}

function Field({
  label, required, error, children,
}: {
  label: string; required?: boolean; error?: string; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-stone-500 ml-1">
        {label}{required && <span className="text-amber-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-400 ml-1">{error}</p>}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return `w-full px-4 py-3.5 rounded-2xl border text-stone-800 placeholder-stone-300 text-sm focus:outline-none focus:ring-2 transition ${
    hasError
      ? "border-red-300 bg-red-50 focus:ring-red-200"
      : "border-stone-200 bg-white focus:ring-amber-300 focus:border-transparent"
  }`;
}
