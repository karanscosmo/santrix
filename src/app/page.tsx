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
    <div className="bg-surface-lowest text-on-surface font-sans antialiased overflow-x-hidden min-h-screen">
      {/* Global Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-surface-lowest/80 backdrop-blur-xl border-b border-outline-variant h-16 flex justify-between items-center px-lg">
        <div className="flex items-center gap-sm">
          <img
            src="/Santrix_logo.jpeg"
            className="w-8 h-8 rounded border border-primary/30 object-cover"
            alt="Sanktrix Logo"
          />
          <span className="font-display text-lg font-bold text-on-surface tracking-tight">Sanktrix</span>
        </div>
        <nav className="hidden md:flex gap-lg">
          <a
            href="#platform"
            className="text-on-surface-variant hover:text-primary transition-colors text-xs font-semibold uppercase tracking-wider"
          >
            Platform
          </a>
          <a
            href="#architecture"
            className="text-on-surface-variant hover:text-primary transition-colors text-xs font-semibold uppercase tracking-wider"
          >
            Architecture
          </a>
        </nav>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary text-on-primary px-md py-sm rounded text-xs font-semibold uppercase tracking-wider hover:bg-primary-container transition-colors cursor-pointer"
        >
          Login
        </button>
      </header>

      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Interactive WebGL Backdrop */}
        <div className="absolute inset-0 w-full h-full z-0 opacity-60 mix-blend-screen">
          <WebGLBackground />
        </div>

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-surface-lowest/30 via-surface-lowest/70 to-surface-lowest"></div>

        {/* Hero Copy */}
        <div className="relative z-10 container mx-auto px-lg text-center flex flex-col items-center">
          <div
            className={`inline-flex items-center gap-2 px-md py-sm rounded-full border border-primary/30 bg-primary/10 mb-lg transition-all duration-700 ${
              isVisible("hero-badge") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            id="hero-badge"
          >
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse glow-active"></div>
            <span className="font-mono text-xs text-primary">System Status: Optimal Processing</span>
          </div>

          <img
            src="/Santrix_logo.jpeg"
            className={`w-24 h-24 rounded-xl object-cover border-2 border-primary/40 shadow-[0_0_30px_rgba(86,141,255,0.4)] mb-md transition-all duration-700 delay-75 ${
              isVisible("hero-logo") ? "opacity-100 scale-100" : "opacity-0 scale-90"
            }`}
            alt="Sanktrix Logo"
          />

          <h1
            className={`font-display text-6xl md:text-[80px] lg:text-[100px] leading-none tracking-tighter text-on-surface mb-md transition-all duration-1000 ${
              isVisible("hero-title") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            SANKTRIX
          </h1>

          <p
            className={`text-lg md:text-2xl text-on-surface-variant max-w-3xl mb-xl transition-all duration-1000 delay-150 ${
              isVisible("hero-desc") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Autonomous Computational Intelligence for Enterprise Decision-Making
          </p>

          <div
            className={`flex flex-col sm:flex-row gap-md transition-all duration-1000 delay-300 ${
              isVisible("hero-buttons") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <button
              onClick={() => setShowModal(true)}
              className="bg-primary text-on-primary px-xl py-md rounded font-semibold text-xs uppercase tracking-wider hover:bg-primary-container transition-all glow-active flex items-center justify-center gap-sm cursor-pointer"
            >
              Launch Platform
              <span className="material-symbols-outlined text-sm">rocket_launch</span>
            </button>
            <button
              onClick={() => router.push("/demo")}
              className="border border-outline hover:border-primary text-on-surface hover:text-primary px-xl py-md rounded font-semibold text-xs uppercase tracking-wider transition-all bg-surface-container/30 backdrop-blur-sm flex items-center justify-center gap-sm cursor-pointer"
            >
              Watch Demo
              <span className="material-symbols-outlined text-sm">play_circle</span>
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative z-10 bg-surface-lowest" id="platform">
        <div className="container mx-auto px-lg">
          <div className="mb-16">
            <h2 className="font-display text-4xl text-on-surface mb-xs">Intelligence Modules</h2>
            <div className="h-1 w-16 bg-primary mb-md"></div>
            <p className="text-on-surface-variant text-base max-w-2xl">
              High-fidelity computational modules engineered for absolute structural dominance over complex data topographies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
            {/* Feature Cards */}
            <div className="card-glass p-lg rounded-xl group relative overflow-hidden">
              <div className="streaming-pulse group-hover:block hidden"></div>
              <div className="mb-md flex items-center justify-between">
                <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  support_agent
                </span>
                <span className="font-mono text-[10px] text-tertiary bg-tertiary/10 px-2 py-1 rounded">Active</span>
              </div>
              <h3 className="font-display text-xl text-on-surface mb-sm">AI Agent Teams</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Deploy swarms of specialized autonomous agents to research, synthesize, and execute multi-step workflows concurrently.
              </p>
            </div>

            <div className="card-glass p-lg rounded-xl group relative overflow-hidden">
              <div className="streaming-pulse group-hover:block hidden"></div>
              <div className="mb-md flex items-center justify-between">
                <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  model_training
                </span>
              </div>
              <h3 className="font-display text-xl text-on-surface mb-sm">Wolfram Simulations</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Integrate deep computational mathematics and physics-based models to simulate market trajectories and stress-test strategies.
              </p>
            </div>

            <div className="card-glass p-lg rounded-xl group relative overflow-hidden">
              <div className="streaming-pulse group-hover:block hidden"></div>
              <div className="mb-md flex items-center justify-between">
                <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  dynamic_feed
                </span>
              </div>
              <h3 className="font-display text-xl text-on-surface mb-sm">Predictive Intelligence</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Harness live macroeconomic and sector-specific datastreams to surface leading indicators ahead of market consensus.
              </p>
            </div>

            <div className="card-glass p-lg rounded-xl group relative overflow-hidden">
              <div className="streaming-pulse group-hover:block hidden"></div>
              <div className="mb-md flex items-center justify-between">
                <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  account_tree
                </span>
              </div>
              <h3 className="font-display text-xl text-on-surface mb-sm">Enterprise Automation</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Translate complex strategic directives into deterministically executed pipelines via internal robotic process automation.
              </p>
            </div>

            <div className="card-glass p-lg rounded-xl group relative overflow-hidden">
              <div className="streaming-pulse group-hover:block hidden"></div>
              <div className="mb-md flex items-center justify-between">
                <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  notifications_active
                </span>
                <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
              </div>
              <h3 className="font-display text-xl text-on-surface mb-sm">Realtime Monitoring</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Continuous telemetry of competitive landscapes, instantly highlighting anomalous behavior through our bespoke neural heuristics.
              </p>
            </div>

            <div className="card-glass p-lg rounded-xl group relative overflow-hidden">
              <div className="streaming-pulse group-hover:block hidden"></div>
              <div className="mb-md flex items-center justify-between">
                <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  smart_toy
                </span>
              </div>
              <h3 className="font-display text-xl text-on-surface mb-sm">Executive Copilot</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                A dedicated conversational interface acting as your Chief of Staff, synthesizing all platform data into actionable briefings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Systems Architecture */}
      <section className="py-24 relative z-10 bg-surface-dim border-t border-outline-variant/30" id="architecture">
        <div className="container mx-auto px-lg">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl text-on-surface mb-xs">Systems Architecture</h2>
            <p className="text-on-surface-variant text-base max-w-2xl mx-auto">
              The deterministic pipeline transforming raw noise into strategic alpha.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-lg relative max-w-5xl mx-auto">
            {/* Steps */}
            <div className="card-glass w-full lg:w-1/4 p-md rounded-xl text-center relative z-10" id="flow-step-1">
              <div className="w-12 h-12 rounded-full bg-surface-container-highest border border-outline flex items-center justify-center mx-auto mb-md">
                <span className="material-symbols-outlined text-on-surface">database</span>
              </div>
              <h4 className="font-display text-base text-on-surface mb-xs">Ingestion</h4>
              <p className="text-xs text-on-surface-variant font-mono">Raw global datastreams</p>
            </div>

            <span className="material-symbols-outlined lg:hidden text-outline-variant">arrow_downward</span>

            <div className="card-glass w-full lg:w-1/4 p-md rounded-xl text-center relative z-10" id="flow-step-2">
              <div className="w-12 h-12 rounded-full bg-surface-container-highest border border-primary flex items-center justify-center mx-auto mb-md glow-active">
                <span className="material-symbols-outlined text-primary">support_agent</span>
              </div>
              <h4 className="font-display text-base text-on-surface mb-xs">Agents</h4>
              <p className="text-xs text-on-surface-variant font-mono">Parsing &amp; Synthesis</p>
            </div>

            <span className="material-symbols-outlined lg:hidden text-outline-variant">arrow_downward</span>

            <div className="card-glass w-full lg:w-1/4 p-md rounded-xl text-center relative z-10" id="flow-step-3">
              <div className="w-12 h-12 rounded-full bg-surface-container-highest border border-tertiary flex items-center justify-center mx-auto mb-md">
                <span className="material-symbols-outlined text-tertiary">functions</span>
              </div>
              <h4 className="font-display text-base text-on-surface mb-xs">Computation</h4>
              <p className="text-xs text-on-surface-variant font-mono">Wolfram evaluation models</p>
            </div>

            <span className="material-symbols-outlined lg:hidden text-outline-variant">arrow_downward</span>

            <div className="card-glass w-full lg:w-1/4 p-md rounded-xl text-center relative z-10 bg-primary/10 border border-primary" id="flow-step-4">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mx-auto mb-md glow-active">
                <span className="material-symbols-outlined text-on-primary">dashboard</span>
              </div>
              <h4 className="font-display text-base text-primary mb-xs">Intelligence</h4>
              <p className="text-xs text-primary-fixed-dim font-mono">Strategic HUD &amp; Alpha</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-lowest border-t border-outline-variant/30 py-xl relative z-10">
        <div className="container mx-auto px-lg flex flex-col md:flex-row items-center justify-between gap-md">
          <div className="flex items-center gap-sm">
            <span className="material-symbols-outlined text-outline">terminal</span>
            <span className="font-mono text-xs text-outline">© 2026 Sanktrix. All rights reserved.</span>
          </div>
          <div className="font-mono text-xs text-outline flex gap-md">
            <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
            <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* Login Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-[100] bg-surface-lowest/80 backdrop-blur-xl flex items-center justify-center p-md">
          <form
            onSubmit={handleLogin}
            className="card-glass w-full max-w-md p-lg rounded-xl flex flex-col justify-between border border-primary/20 relative shadow-[0_0_50px_rgba(86,141,255,0.15)]"
          >
            <div className="flex flex-col items-center text-center mb-md">
              <img src="/Santrix_logo.jpeg" className="w-16 h-16 rounded-lg object-cover border border-primary/30 mb-sm" alt="Sanktrix Logo" />
              <h2 className="font-display text-xl text-on-surface">Sign In to Sanktrix</h2>
              <p className="font-mono text-[10px] text-on-surface-variant mt-1">AUTONOMOUS COMPUTATIONAL OS</p>
            </div>
            <div className="space-y-md">
              <div className="space-y-xs">
                <label className="font-sans text-[10px] uppercase font-bold text-on-surface-variant block">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="executive@company.com"
                  defaultValue="executive@sanktrix.ai"
                  className="w-full bg-surface-container border border-outline-variant/60 rounded px-md py-sm text-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-xs">
                <label className="font-sans text-[10px] uppercase font-bold text-on-surface-variant block">Access Credentials</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  defaultValue="password123"
                  className="w-full bg-surface-container border border-outline-variant/60 rounded px-md py-sm text-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-on-primary font-sans text-xs uppercase font-bold py-sm rounded hover:bg-primary-container transition-all flex items-center justify-center gap-sm shadow-[0_0_15px_rgba(176,198,255,0.3)] cursor-pointer"
              >
                Authenticate
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-sm right-sm text-on-surface-variant hover:text-on-surface cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </form>
        </div>
      )}

      {/* Login Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-[150] bg-[#0b0e16]/95 backdrop-blur-xl flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(86,141,255,0.3)]"></div>
          <h3 className="font-display text-2xl text-on-surface mt-lg">Loading Sanktrix OS...</h3>
          <p className="font-mono text-on-surface-variant text-xs mt-sm">Connecting to Wolfram Computations Server...</p>
        </div>
      )}
    </div>
  );
}
