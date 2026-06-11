"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSecurity } from "@/context/SecurityContext";
import WebGLBackground from "@/components/WebGLBackground";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useSecurity();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [org, setOrg] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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

    try {
      const success = await signup(name, email, org, password);
      if (success) {
        router.push("/dashboard");
      }
    } catch {
      setError("Failed to create account. Please contact system support.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    setError("");
    try {
      await signup("New User", "new.user@sanktrix.ai", "Self");
      router.push("/dashboard");
    } catch {
      setError("Failed to sign up with Google.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e2e1] font-sans antialiased overflow-hidden flex flex-col md:flex-row relative">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none z-0"></div>

      {/* Left Column: Product pitch & Trust indicators */}
      <div className="hidden md:flex md:flex-1 md:w-1/2 bg-[#0a0a0f] border-r border-white/5 flex-col justify-between p-12 relative z-10 overflow-hidden shrink-0">
        {/* Animated shader background */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <WebGLBackground />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/20 via-[#0a0a0f]/60 to-[#0a0a0f] z-0"></div>

        {/* Top Header Logo */}
        <Link href="/" className="flex items-center group relative z-10">
          <img
            src="/branding/sanktrix-logo.png"
            className="h-8 w-auto object-contain brightness-110"
            alt="Sanktrix Logo"
          />
        </Link>

        {/* Value Proposition */}
        <div className="my-auto space-y-8 max-w-lg relative z-10">
          <h2 className="font-display text-4xl font-extrabold text-white leading-tight tracking-tight text-glow">
            Provision Sandbox Access.
          </h2>
          <p className="text-on-surface-variant text-base leading-relaxed font-light">
            Set up an isolated administrative cell inside Sanktrix. Integrate operational telemetry databases and activate autonomous reasoning swarms securely.
          </p>

          {/* Trust Indicators */}
          <div className="border border-white/10 bg-[#050505]/40 rounded-lg p-5 space-y-4 glass-panel">
            <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2">
              Sanktrix Security Guardrails
            </h4>
            <div className="grid grid-cols-2 gap-4 font-mono text-[9px]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm">lock</span>
                <span className="uppercase font-bold tracking-wider text-on-surface-variant">Encrypted Data</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary-fixed-dim text-sm">shield</span>
                <span className="uppercase font-bold tracking-wider text-on-surface-variant">SOC 2 compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary text-sm">assignment_ind</span>
                <span className="uppercase font-bold tracking-wider text-on-surface-variant">RBAC Controls</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-outline text-sm">list_alt</span>
                <span className="uppercase font-bold tracking-wider text-on-surface-variant">Audit Logging</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-[10px] text-on-surface-variant/60 font-mono relative z-10">
          SECURE ENCRYPTED NODE // SANKTRIX OS v1.0
        </div>
      </div>

      {/* Right Column: Sign Up Form */}
      <div className="w-full md:flex-1 md:w-1/2 flex items-center justify-center p-6 md:p-12 relative z-10 shrink-0">
        <div className="w-full max-w-[420px] glass-panel p-8 rounded-xl border border-white/10 shadow-[0_0_50px_rgba(0,219,231,0.03)] relative flex flex-col space-y-5">
          <div className="flex flex-col items-center text-center">
            {/* Small responsive logo for mobile */}
            <div className="md:hidden mb-6">
              <img
                src="/branding/sanktrix-logo.png"
                className="h-8 w-auto object-contain brightness-110"
                alt="Sanktrix Logo"
              />
            </div>
            <h3 className="font-display text-2xl font-bold text-white tracking-tight">Create Workspace</h3>
            <p className="text-xs text-on-surface-variant mt-1 font-light">
              Register to deploy autonomous enterprise nodes.
            </p>
          </div>

          {error && (
            <div className="bg-red-950/20 border border-red-900/40 p-3 rounded flex items-center gap-2 text-xs text-[#ffb4ab]">
              <span className="material-symbols-outlined text-sm">error</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] uppercase font-bold text-on-surface-variant tracking-wider block">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Karan Sharma"
                className="w-full bg-[#0a0a0f]/60 border border-white/10 rounded px-4 py-2 text-xs text-white placeholder:text-outline-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-[10px] uppercase font-bold text-on-surface-variant tracking-wider block">Corporate Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="karan@company.com"
                className="w-full bg-[#0a0a0f]/60 border border-white/10 rounded px-4 py-2 text-xs text-white placeholder:text-outline-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-[10px] uppercase font-bold text-on-surface-variant tracking-wider block">Organization</label>
              <input
                type="text"
                required
                value={org}
                onChange={(e) => setOrg(e.target.value)}
                placeholder="Santrix Inc."
                className="w-full bg-[#0a0a0f]/60 border border-white/10 rounded px-4 py-2 text-xs text-white placeholder:text-outline-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-sans"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] uppercase font-bold text-on-surface-variant tracking-wider block">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0a0a0f]/60 border border-white/10 rounded px-4 py-2 text-xs text-white placeholder:text-outline-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] uppercase font-bold text-on-surface-variant tracking-wider block">Confirm</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0a0a0f]/60 border border-white/10 rounded px-4 py-2 text-xs text-white placeholder:text-outline-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-[#c2d6ff] disabled:bg-primary/50 text-[#001945] font-bold text-xs uppercase tracking-wider py-3 rounded transition-all duration-300 shadow-[0_0_20px_rgba(176,198,255,0.2)] hover:scale-[1.01] cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#001945]/30 border-t-[#001945] rounded-full animate-spin"></div>
                  <span>Provisioning Workspace...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>

          {/* Social Sign-in Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-white/5"></div>
            <span className="flex-shrink mx-3 text-[10px] text-on-surface-variant/40 font-bold uppercase tracking-widest font-mono">or</span>
            <div className="flex-grow border-t border-white/5"></div>
          </div>

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={isLoading}
            className="w-full border border-white/10 hover:border-white/20 text-white font-semibold text-xs py-2.5 rounded bg-white/5 hover:bg-white/10 transition-all cursor-pointer flex items-center justify-center gap-2.5 font-mono"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.57 15.02 1 12 1 7.35 1 3.4 3.65 1.48 7.5l3.86 3C6.26 7.54 8.89 5.04 12 5.04z" />
              <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.43h6.43c-.28 1.48-1.11 2.73-2.37 3.58l3.69 2.87c2.16-1.99 3.4-4.91 3.4-8.54z" />
              <path fill="#FBBC05" d="M5.34 14.5c-.24-.72-.38-1.49-.38-2.3s.14-1.58.38-2.3L1.48 6.9C.54 8.79 0 10.9 0 13.1s.54 4.31 1.48 6.2l3.86-3.04z" />
              <path fill="#34A853" d="M12 23c3.24 0 5.95-1.08 7.93-2.91l-3.69-2.87c-1.02.68-2.33 1.09-4.24 1.09-3.11 0-5.74-2.5-6.68-5.46l-3.86 3C3.4 20.35 7.35 23 12 23z" />
            </svg>
            <span>Sign Up with Google</span>
          </button>

          {/* Login Link */}
          <p className="text-center text-xs text-on-surface-variant font-light">
            Already have a cell?{" "}
            <Link href="/login" className="text-primary hover:underline font-bold uppercase tracking-wider text-[10px] ml-1 font-mono">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
