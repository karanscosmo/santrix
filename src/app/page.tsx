"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import WebGLBackground from "@/components/WebGLBackground";
import { useSecurity } from "@/context/SecurityContext";

export default function Home() {
  const router = useRouter();
  const { addAuditLog } = useSecurity();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());

  // Handle scroll reveals and initial fade-ins
  useEffect(() => {
    // Initial fade in for hero elements
    const timer = setTimeout(() => {
      setVisibleElements(prev => {
        const next = new Set(prev);
        next.add("hero-badge");
        next.add("hero-title");
        next.add("hero-desc");
        next.add("hero-buttons");
        next.add("hero-logo");
        return next;
      });
    }, 100);

    // Intersection observer for section reveals
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements(prev => {
              const next = new Set(prev);
              next.add(entry.target.id);
              return next;
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    const targetSections = ["platform", "architecture", "flow-step-1", "flow-step-2", "flow-step-3", "flow-step-4"];
    targetSections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(false);
    setLoading(true);
    addAuditLog("system.auth_request", "Authentication sequence initialized", "SUCCESS");

    setTimeout(() => {
      setLoading(false);
      addAuditLog("system.auth_success", "User executive@sanktrix.ai successfully authenticated", "SUCCESS");
      router.push("/dashboard");
    }, 1800);
  };

  const isVisible = (id: string) => visibleElements.has(id);

  return (
    <div className="bg-[#050505] text-[#e0e2ee] font-sans antialiased overflow-x-hidden min-h-screen selection:bg-primary/30 selection:text-white">
      {/* Global Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 h-16 flex justify-between items-center px-6 md:px-12">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded border border-primary/20 overflow-hidden">
            <img
              src="/Santrix_logo.jpeg"
              className="w-full h-full object-cover"
              alt="Sanktrix Logo"
            />
          </div>
          <span className="font-display text-lg font-bold text-white tracking-tight">Sanktrix</span>
        </div>
        <nav className="hidden md:flex gap-8">
          <a
            href="#platform"
            className="text-on-surface-variant hover:text-primary transition-colors text-[10px] font-bold uppercase tracking-widest"
          >
            Platform
          </a>
          <a
            href="#architecture"
            className="text-on-surface-variant hover:text-primary transition-colors text-[10px] font-bold uppercase tracking-widest"
          >
            Architecture
          </a>
        </nav>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary hover:bg-[#c2d6ff] text-[#001945] px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-[0_0_15px_rgba(176,198,255,0.2)] hover:scale-[1.02] cursor-pointer"
        >
          Login
        </button>
      </header>

      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Interactive WebGL Backdrop */}
        <div className="absolute inset-0 w-full h-full z-0 opacity-40 mix-blend-screen">
          <WebGLBackground />
        </div>

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-[#050505]/60 to-[#050505]"></div>

        {/* Hero Copy */}
        <div className="relative z-10 container mx-auto px-6 text-center flex flex-col items-center max-w-4xl">
          {/* System Status Badge */}
          <div
            className={`inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-8 transition-all duration-1000 ${
              isVisible("hero-badge") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            id="hero-badge"
          >
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse glow-active"></div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-primary">System Status: Optimal Processing</span>
          </div>

          {/* Glowing Logo Container */}
          <div
            className={`relative mb-6 group transition-all duration-1000 delay-100 ${
              isVisible("hero-logo") ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
            id="hero-logo"
          >
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary via-secondary to-tertiary opacity-50 blur-xl group-hover:opacity-85 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
            <img
              src="/Santrix_logo.jpeg"
              className="relative w-24 h-24 rounded-2xl object-cover border border-white/10 shadow-2xl"
              alt="Sanktrix Logo"
            />
          </div>

          {/* Title */}
          <h1
            className={`font-display text-5xl md:text-7xl lg:text-8xl leading-none tracking-tight font-extrabold mb-6 transition-all duration-1000 delay-200 ${
              isVisible("hero-title") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <span className="bg-gradient-to-r from-white via-primary to-primary-fixed-dim bg-clip-text text-transparent">
              SANKTRIX
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className={`text-base md:text-xl text-on-surface-variant max-w-2xl mb-12 leading-relaxed transition-all duration-1000 delay-300 ${
              isVisible("hero-desc") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Autonomous Computational Intelligence Platform for Enterprise Decision-Making
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-400 ${
              isVisible("hero-buttons") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <button
              onClick={() => setShowModal(true)}
              className="bg-primary hover:bg-[#c2d6ff] text-[#001945] px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 glow-active flex items-center justify-center gap-2 hover:scale-[1.03] cursor-pointer"
            >
              Launch Platform
              <span className="material-symbols-outlined text-sm">rocket_launch</span>
            </button>
            <button
              onClick={() => router.push("/demo")}
              className="border border-white/10 hover:border-primary/50 text-[#e0e2ee] hover:text-white px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 bg-white/5 hover:bg-white/10 backdrop-blur-sm flex items-center justify-center gap-2 hover:scale-[1.03] cursor-pointer"
            >
              Watch Demo
              <span className="material-symbols-outlined text-sm">play_circle</span>
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative z-10 bg-[#050505] border-t border-white/5" id="platform">
        <div className="container mx-auto px-6 md:px-12 max-w-6xl">
          <div className="mb-16 text-center md:text-left">
            <h2 className="font-display text-3xl md:text-4xl text-white font-bold mb-3">Intelligence Modules</h2>
            <div className="h-1 w-16 bg-primary mb-4 mx-auto md:mx-0"></div>
            <p className="text-on-surface-variant text-sm md:text-base max-w-2xl">
              High-fidelity computational modules engineered for absolute structural dominance over complex data topographies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Bento-style Feature Cards */}
            {[
              {
                icon: "support_agent",
                title: "AI Agent Teams",
                desc: "Deploy swarms of specialized autonomous agents to research, synthesize, and execute multi-step workflows concurrently.",
                tag: "Active",
              },
              {
                icon: "model_training",
                title: "Wolfram Simulations",
                desc: "Integrate deep computational mathematics and physics-based models to simulate market trajectories and stress-test strategies.",
              },
              {
                icon: "dynamic_feed",
                title: "Predictive Intelligence",
                desc: "Harness live macroeconomic and sector-specific datastreams to surface leading indicators ahead of market consensus.",
              },
              {
                icon: "account_tree",
                title: "Enterprise Automation",
                desc: "Translate complex strategic directives into deterministically executed pipelines via internal robotic process automation.",
              },
              {
                icon: "notifications_active",
                title: "Realtime Monitoring",
                desc: "Continuous telemetry of competitive landscapes, instantly highlighting anomalous behavior through our bespoke neural heuristics.",
                tag: "Live",
              },
              {
                icon: "smart_toy",
                title: "Executive Copilot",
                desc: "A dedicated conversational interface acting as your Chief of Staff, synthesizing all platform data into actionable briefings.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="glass-panel p-6 rounded-2xl group relative overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_30px_rgba(86,141,255,0.08)] hover:-translate-y-1"
              >
                <div className="streaming-pulse group-hover:block hidden"></div>
                <div className="mb-4 flex items-center justify-between">
                  <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {feature.icon}
                  </span>
                  {feature.tag && (
                    <span className="font-mono text-[9px] text-[#4edea3] bg-[#4edea3]/10 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                      {feature.tag}
                    </span>
                  )}
                </div>
                <h3 className="font-display text-lg text-white font-bold mb-2">{feature.title}</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Systems Architecture */}
      <section className="py-24 relative z-10 bg-[#10131b]/35 border-t border-white/5" id="architecture">
        <div className="container mx-auto px-6 md:px-12 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl text-white font-bold mb-3">Systems Architecture</h2>
            <p className="text-on-surface-variant text-sm md:text-base max-w-2xl mx-auto">
              The deterministic pipeline transforming raw noise into strategic alpha.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="glass-panel w-full lg:w-1/4 p-6 rounded-2xl text-center relative z-10 hover:border-white/20 transition-all duration-300" id="flow-step-1">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-white">database</span>
              </div>
              <h4 className="font-display text-sm text-white font-bold mb-1">Ingestion</h4>
              <p className="text-[11px] text-on-surface-variant font-mono">Raw global datastreams</p>
            </div>

            <span className="material-symbols-outlined lg:hidden text-white/20">arrow_downward</span>

            {/* Step 2 */}
            <div className="glass-panel w-full lg:w-1/4 p-6 rounded-2xl text-center relative z-10 border-primary/30 shadow-[0_0_20px_rgba(86,141,255,0.05)] hover:border-primary/50 transition-all duration-300" id="flow-step-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary flex items-center justify-center mx-auto mb-4 glow-active">
                <span className="material-symbols-outlined text-primary">support_agent</span>
              </div>
              <h4 className="font-display text-sm text-primary font-bold mb-1">Agents</h4>
              <p className="text-[11px] text-primary/70 font-mono">Parsing &amp; Synthesis</p>
            </div>

            <span className="material-symbols-outlined lg:hidden text-white/20">arrow_downward</span>

            {/* Step 3 */}
            <div className="glass-panel w-full lg:w-1/4 p-6 rounded-2xl text-center relative z-10 hover:border-white/20 transition-all duration-300" id="flow-step-3">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-tertiary">functions</span>
              </div>
              <h4 className="font-display text-sm text-white font-bold mb-1">Computation</h4>
              <p className="text-[11px] text-on-surface-variant font-mono">Wolfram evaluation models</p>
            </div>

            <span className="material-symbols-outlined lg:hidden text-white/20">arrow_downward</span>

            {/* Step 4 */}
            <div className="glass-panel w-full lg:w-1/4 p-6 rounded-2xl text-center relative z-10 bg-primary/5 border border-primary/30 shadow-[0_0_20px_rgba(86,141,255,0.05)] hover:border-primary/50 transition-all duration-300" id="flow-step-4">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mx-auto mb-4 glow-active">
                <span className="material-symbols-outlined text-[#001945]">dashboard</span>
              </div>
              <h4 className="font-display text-sm text-primary font-bold mb-1">Intelligence</h4>
              <p className="text-[11px] text-primary-fixed-dim font-mono">Strategic HUD &amp; Alpha</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#050505] border-t border-white/5 py-8 relative z-10">
        <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-outline text-sm">terminal</span>
            <span className="font-mono text-xs text-outline">© 2026 Sanktrix. All rights reserved.</span>
          </div>
          <div className="font-mono text-xs text-outline flex gap-6">
            <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
            <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* Login Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-[100] bg-[#050505]/80 backdrop-blur-xl flex items-center justify-center p-4">
          <form
            onSubmit={handleLogin}
            className="glass-panel w-full max-w-[420px] p-6 rounded-2xl flex flex-col border border-primary/20 relative shadow-[0_0_50px_rgba(86,141,255,0.2)] space-y-6"
          >
            <div className="flex flex-col items-center text-center">
              <img src="/Santrix_logo.jpeg" className="w-16 h-16 rounded-xl object-cover border border-primary/30 mb-3" alt="Sanktrix Logo" />
              <h2 className="font-display text-2xl text-white font-bold tracking-tight">Sign In to Sanktrix</h2>
              <p className="font-mono text-[10px] text-primary tracking-widest mt-1 uppercase">Autonomous Computational OS</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-sans text-[10px] uppercase font-bold text-on-surface-variant tracking-wider block">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="executive@company.com"
                  defaultValue="executive@sanktrix.ai"
                  className="w-full bg-[#1c1f28]/60 border border-outline-variant/60 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-outline-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-sans text-[10px] uppercase font-bold text-on-surface-variant tracking-wider block">Access Credentials</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  defaultValue="password123"
                  className="w-full bg-[#1c1f28]/60 border border-outline-variant/60 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-outline-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-on-primary font-sans text-xs uppercase font-bold py-3 rounded-lg hover:bg-primary-container transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(176,198,255,0.3)] cursor-pointer mt-2"
              >
                Authenticate
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </form>
        </div>
      )}

      {/* Login Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-[150] bg-[#0b0e16]/95 backdrop-blur-xl flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(86,141,255,0.3)]"></div>
          <h3 className="font-display text-2xl text-white font-bold mt-8">Loading Sanktrix OS...</h3>
          <p className="font-mono text-on-surface-variant text-xs mt-2">Connecting to Wolfram Computations Server...</p>
        </div>
      )}
    </div>
  );
}
