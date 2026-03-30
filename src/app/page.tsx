"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Root() {
  const router = useRouter();

  useEffect(() => {
    const loggedIn = localStorage.getItem("scentedear_logged_in");
    if (loggedIn) {
      const hasOnboarding = localStorage.getItem("scentedear_onboarding");
      router.replace(hasOnboarding ? "/home" : "/onboarding");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return null;
}
