"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import WebGLBackground from "@/components/WebGLBackground";

export default function DemoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEnd = searchParams.get("tour") === "end";

  useEffect(() => {
    if (isEnd) {
      const timer = setTimeout(() => {
        router.push("/login");
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        router.push("/dashboard?tour=1&auto=true");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isEnd, router]);

  return (
    <div className="bg-[#050505] min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <WebGLBackground />
      </div>
      <div className="relative z-10 text-center max-w-2xl px-6">
        <img
          src="/branding/Sanktrix_logo_transparent.png"
          className="w-[180px] md:w-[240px] mx-auto mb-8 filter drop-shadow-[0_0_20px_rgba(138,180,248,0.3)] animate-pulse"
          alt="Sanktrix Logo"
        />
        {isEnd ? (
          <div className="space-y-4 animate-fade-in-up">
            <h1 className="font-display text-3xl md:text-5xl font-bold text-white">
              Tour Complete
            </h1>
            <p className="text-gray-400 text-lg">
              Redirecting to secure login gateway...
            </p>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in-up">
            <h1 className="font-display text-3xl md:text-5xl font-bold text-white">
              Initializing Sanktrix OS
            </h1>
            <p className="text-gray-400 text-lg">
              Starting interactive executive product tour...
            </p>
            <div className="mt-8 flex justify-center">
              <div className="w-12 h-12 border-2 border-[#8ab4f8] border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
