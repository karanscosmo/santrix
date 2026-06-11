"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    // Simulate password updates
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setIsDone(true);
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
              src="/branding/sanktrix-logo.png"
              className="h-8 w-auto object-contain brightness-110"
              alt="Sanktrix Logo"
            />
          </div>
          <h3 className="font-display text-2xl font-bold text-white tracking-tight">Reset Credentials</h3>
          <p className="text-[11px] text-on-surface-variant mt-1.5 font-light leading-relaxed max-w-xs">
            Establish a new passcode node for your corporate account.
          </p>
        </div>

        {isDone ? (
          <div className="space-y-6 text-center">
            <div className="bg-[#4edea3]/10 border border-[#4edea3]/20 p-4 rounded-xl flex flex-col items-center gap-2 text-xs text-[#4edea3]">
              <span className="material-symbols-outlined text-[24px]">task_alt</span>
              <span className="font-bold uppercase tracking-wider text-[10px]">Credentials Reset Complete</span>
              <p className="text-on-surface-variant text-[11px] leading-relaxed mt-1 text-center">
                Your new security passcode has been compiled and synced globally. You can now authenticate using your new credentials.
              </p>
            </div>

            <button
              onClick={() => router.push("/login")}
              className="w-full bg-primary hover:bg-[#c2d6ff] text-[#001945] font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(176,198,255,0.15)] hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Sign In to Platform</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-950/20 border border-red-900/40 p-3 rounded-lg flex items-center gap-2 text-xs text-[#ffb4ab]">
                <span className="material-symbols-outlined text-sm">error</span>
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="font-sans text-[10px] uppercase font-bold text-on-surface-variant tracking-wider block">New Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#1c1f28]/60 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-outline-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-sans text-[10px] uppercase font-bold text-on-surface-variant tracking-wider block">Confirm Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#1c1f28]/60 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-outline-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
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
                  <span>Saving Passcode...</span>
                </>
              ) : (
                <span>Reset Password</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
