"use client";

import React from "react";
import Link from "next/link";

export default function LogoutPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e2ee] font-sans antialiased flex flex-col items-center justify-center p-6 relative">
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-[420px] glass-panel p-10 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(86,141,255,0.05)] text-center relative z-10 flex flex-col items-center space-y-8">
        {/* Brand Logo */}
        <div className="relative w-40 h-12 overflow-hidden border border-white/5 rounded-xl bg-black/40 p-1">
          <img
            src="/Santrix_logo.jpeg"
            className="w-full h-full object-contain filter brightness-110"
            alt="Sanktrix Logo"
          />
        </div>

        {/* Lock Icon */}
        <div className="w-16 h-16 rounded-full bg-[#ffb4ab]/10 border border-[#ffb4ab]/20 flex items-center justify-center text-[#ffb4ab] animate-pulse-slow">
          <span className="material-symbols-outlined text-[32px]">lock</span>
        </div>

        {/* Messaging */}
        <div className="space-y-2">
          <h3 className="font-display text-2xl font-bold text-white tracking-tight">Secure Session Terminated</h3>
          <p className="text-xs text-on-surface-variant font-light leading-relaxed max-w-xs">
            You have securely signed out of the Sanktrix OS Command Center. All cached authentication tokens have been destroyed.
          </p>
        </div>

        {/* Redirect Buttons */}
        <div className="flex flex-col w-full gap-3">
          <Link
            href="/login"
            className="w-full bg-primary hover:bg-[#c2d6ff] text-[#001945] font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(176,198,255,0.15)] hover:scale-[1.01] flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">login</span>
            <span>Return to Platform</span>
          </Link>
          <Link
            href="/"
            className="w-full border border-white/10 hover:border-white/20 text-white font-semibold text-xs py-3.5 rounded-xl bg-white/5 hover:bg-white/10 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">home</span>
            <span>Back to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
