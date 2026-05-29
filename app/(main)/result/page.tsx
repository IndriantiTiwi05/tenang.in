"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ResultRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const latestId = localStorage.getItem("latestPredictionId");

    if (latestId) {
      router.replace(`/result/${latestId}`);
    } else {
      router.replace("/dashboard");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f0f14] text-white space-y-4">
      {/* Spinner sederhana untuk indikator loading */}
      <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-400 font-medium animate-pulse">Menyiapkan hasil...</p>
    </div>
  );
}