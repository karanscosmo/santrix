"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API request
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setIsSent(true);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e2ee] font-sans antialiased flex items-center justify-center p-6 relative">
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-[420px] glass-panel p-8 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(86,141,255,0.05)] relative z-10 flex flex-col space-y-6">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6">
            <img
              src="/branding/Sanktrix_logo_transparent.png"
              className="h-8 w-auto object-contain brightness-110"
              alt="Sanktrix Logo"
            />
          </div>
          <h3 className="font-display text-2xl font-bold text-white tracking-tight">Recover Access</h3>
          <p className="text-[11px] text-on-surface-variant mt-1.5 font-light leading-relaxed max-w-xs">
            We will dispatch a secure validation key to your registered corporate email to reset your credentials.
          </p>
        </div>

        {isSent ? (
          <div className="space-y-6 text-center">
            <div className="bg-[#4edea3]/10 border border-[#4edea3]/20 p-4 rounded-xl flex flex-col items-center gap-2 text-xs text-[#4edea3]">
              <span className="material-symbols-outlined text-[24px]">mark_email_read</span>
              <span className="font-bold uppercase tracking-wider text-[10px]">Recovery Token Dispatched</span>
              <p className="text-on-surface-variant text-[11px] leading-relaxed mt-1 text-center">
                A verification link has been sent to <strong className="text-white">{email}</strong>. This token expires in 15 minutes.
              </p>
            </div>
            
            {/* Simulation Shortcut */}
            <div className="bg-white/5 border border-white/10 p-3 rounded-lg flex flex-col gap-2">
              <span className="text-[10px] uppercase font-bold text-primary tracking-wider font-mono">Developer Scenario Simulator</span>
              <Link
                href={`/reset-password?email=${encodeURIComponent(email)}`}
                className="text-xs text-white bg-primary/20 border border-primary/30 hover:bg-primary/30 py-1.5 rounded font-mono transition-colors"
              >
                Go to Reset Password screen →
              </Link>
            </div>

            <Link
              href="/login"
              className="w-full border border-white/10 hover:border-white/20 text-white font-semibold text-xs py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              <span>Back to Login</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="font-sans text-[10px] uppercase font-bold text-on-surface-variant tracking-wider block">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="executive@sanktrix.ai"
                className="w-full bg-[#1c1f28]/60 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-outline-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-sans"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-[#c2d6ff] disabled:bg-primary/50 text-[#001945] font-bold text-xs uppercase tracking-wider py-3 rounded-lg transition-all duration-300 shadow-[0_0_20px_rgba(176,198,255,0.2)] hover:scale-[1.01] cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#001945]/30 border-t-[#001945] rounded-full animate-spin"></div>
                  <span>Requesting Token...</span>
                </>
              ) : (
                <span>Dispatch Recovery Link</span>
              )}
            </button>

            <Link
              href="/login"
              className="w-full text-center text-xs text-on-surface-variant hover:text-white transition-colors block pt-2"
            >
              Cancel and Return
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
