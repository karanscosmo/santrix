"use client";

import React from "react";
import Link from "next/link";

export default function LogoutPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e2e1] font-sans antialiased flex flex-col items-center justify-center p-6 relative">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none z-0"></div>

      <div className="w-full max-w-[420px] glass-panel p-10 rounded-xl border border-white/10 shadow-[0_0_50px_rgba(0,219,231,0.03)] text-center relative z-10 flex flex-col items-center space-y-8 bg-[#0a0a0f]/40">
        {/* Brand Logo (Standalone wordmark logo, direct image render) */}
        <img
          src="/branding/sanktrix-logo.png"
          className="h-9 w-auto object-contain brightness-110"
          alt="Sanktrix Logo"
        />

        {/* Lock Icon */}
        <div className="w-16 h-16 rounded-full bg-[#ffb4ab]/10 border border-[#ffb4ab]/20 flex items-center justify-center text-[#ffb4ab]">
          <span className="material-symbols-outlined text-[32px]">lock</span>
        </div>

        {/* Messaging */}
        <div className="space-y-2">
          <h3 className="font-display text-2xl font-bold text-white tracking-tight text-glow">Successfully signed out.</h3>
          <p className="text-xs text-on-surface-variant font-light leading-relaxed max-w-xs">
            You have securely signed out of the Sanktrix OS Command Center. All cached authentication tokens have been destroyed.
          </p>
        </div>

        {/* Redirect Buttons */}
        <div className="flex flex-col w-full gap-3 font-mono">
          <Link
            href="/login"
            className="w-full bg-primary hover:bg-[#c2d6ff] text-[#001945] font-bold text-xs uppercase tracking-wider py-3.5 rounded transition-all duration-300 shadow-[0_0_20px_rgba(176,198,255,0.15)] hover:scale-[1.01] flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">login</span>
            <span>Sign In Again</span>
          </Link>
          <Link
            href="/"
            className="w-full border border-white/10 hover:border-white/20 text-white font-semibold text-xs py-3.5 rounded bg-white/5 hover:bg-white/10 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">home</span>
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
