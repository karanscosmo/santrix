"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSecurity } from "@/context/SecurityContext";

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated } = useSecurity();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // If user is logged in, we let them enter the platform directly
    }
  }, [isAuthenticated]);

  // States for Section 4: Interactive Wolfram Simulation
  const [activeScenario, setActiveScenario] = useState("churn");
  const [simulationVal, setSimulationVal] = useState(15);
  const [isSimulating, setIsSimulating] = useState(false);

  // States for Section 12: Product Preview Carousel
  const [carouselIdx, setCarouselIdx] = useState(0);
  
  const carouselItems = [
    { 
      title: "Executive Copilot", 
      desc: "Interact with your AI Chief of Staff to query company health, generate board memos, and receive computed strategic recommendation briefs.", 
      icon: "smart_toy",
      accent: "text-primary"
    },
    { 
      title: "Agent Observatory", 
      desc: "Inspect prompt structures, monitor autonomous worker coordinate logs, and audit LLM decision trees across operations.", 
      icon: "visibility",
      accent: "text-[#4edea3]"
    },
    { 
      title: "Business Simulation Engine", 
      desc: "Run parametric Monte Carlo models on runway, CAC excess trigger limits, and hiring speed constraints in stress scenarios.", 
      icon: "model_training",
      accent: "text-tertiary"
    },
    { 
      title: "Knowledge Graph", 
      desc: "Trace unified semantic connections, file vector indexes, and cross-departmental documentation databases in a structured graph.", 
      icon: "hub",
      accent: "text-primary"
    },
    { 
      title: "Digital Twin", 
      desc: "Visualize real-time departmental nodes, project dependencies, and operational KPI progress indicators dynamically.", 
      icon: "donut_large",
      accent: "text-[#4edea3]"
    },
    { 
      title: "Intelligence Feed", 
      desc: "Subscribe to continuous system tickers, agent event logs, and active Wolfram computational telemetry streams.", 
      icon: "dynamic_feed",
      accent: "text-tertiary"
    },
  ];

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 1200);
  };

  return (
    <div className="bg-[#050505] text-[#e0e2ee] font-sans antialiased overflow-x-hidden min-h-screen selection:bg-primary/30 selection:text-white flex flex-col">
      {/* Global Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-25 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-[1200px] left-1/4 w-[500px] h-[500px] bg-tertiary/5 rounded-full blur-[120px]"></div>
      </div>

      {/* Global Navigation Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 h-16 flex justify-between items-center px-6 md:px-12">
        <div className="flex items-center">
          <div className="relative w-36 h-10 overflow-hidden border border-white/5 rounded-lg bg-black/40 p-1">
            <img 
              src="/Santrix_logo.jpeg" 
              className="w-full h-full object-contain filter brightness-110" 
              alt="Sanktrix Logo" 
            />
          </div>
        </div>
        <nav className="hidden md:flex gap-8">
          <a href="#features" className="text-on-surface-variant hover:text-primary transition-colors text-[10px] font-bold uppercase tracking-widest">Core Loop</a>
          <a href="#wolfram" className="text-on-surface-variant hover:text-primary transition-colors text-[10px] font-bold uppercase tracking-widest">Wolfram Math</a>
          <a href="#showcase" className="text-on-surface-variant hover:text-primary transition-colors text-[10px] font-bold uppercase tracking-widest">Showcase</a>
          <a href="#security" className="text-on-surface-variant hover:text-primary transition-colors text-[10px] font-bold uppercase tracking-widest">Security</a>
        </nav>
        <button
          onClick={() => router.push("/login")}
          className="bg-primary hover:bg-[#c2d6ff] text-[#001945] px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-[0_0_15px_rgba(176,198,255,0.2)] hover:scale-[1.02] cursor-pointer"
        >
          Login
        </button>
      </header>

      {/* SECTION 1 — CENTERED HERO */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center pt-28 pb-16 px-6 text-center z-10 overflow-hidden">
        {/* Animated grid lines in background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-40 z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/40 to-[#050505] z-0"></div>

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center space-y-8">
          {/* Logo Centerpiece */}
          <div className="relative w-52 h-16 overflow-hidden border border-white/10 rounded-2xl bg-black/60 p-2 shadow-[0_0_30px_rgba(86,141,255,0.1)] hover:border-primary/30 transition-all duration-500">
            <img 
              src="/Santrix_logo.jpeg" 
              className="w-full h-full object-contain filter brightness-125" 
              alt="Sanktrix Wordmark" 
            />
          </div>

          {/* Tag status */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#b0c6ff]"></div>
            <span className="font-mono text-[9px] uppercase tracking-widest text-primary font-bold">Computational OS v1.0 Enabled</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-white leading-tight tracking-tight max-w-3xl">
            The Operating System for <span className="bg-gradient-to-r from-primary via-white to-tertiary bg-clip-text text-transparent">Autonomous Enterprises</span>
          </h1>

          {/* Subheadline */}
          <p className="text-sm sm:text-base text-on-surface-variant max-w-2xl leading-relaxed font-light">
            AI agents reason. Wolfram computes. Sanktrix predicts, simulates, optimizes, and recommends strategic decisions in real time.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto justify-center">
            <button
              onClick={() => router.push("/login")}
              className="bg-primary hover:bg-[#c2d6ff] text-[#001945] px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(176,198,255,0.2)] hover:scale-[1.03] cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Launch Platform</span>
              <span className="material-symbols-outlined text-sm">rocket_launch</span>
            </button>
            <button
              onClick={() => router.push("/demo")}
              className="border border-white/10 hover:border-primary/50 text-[#e0e2ee] hover:text-white px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 bg-white/5 hover:bg-white/10 backdrop-blur-sm flex items-center justify-center gap-2 hover:scale-[1.03] cursor-pointer"
            >
              <span>Run Live Simulation</span>
              <span className="material-symbols-outlined text-sm">play_circle</span>
            </button>
            <a
              href="#showcase"
              className="border border-white/10 hover:border-white/20 text-[#e0e2ee] px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 bg-white/5 hover:bg-white/10 flex items-center justify-center gap-2 hover:scale-[1.03]"
            >
              <span>Watch Product Tour</span>
              <span className="material-symbols-outlined text-sm">visibility</span>
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 2 — HERO VISUAL: ANIMATED INTELLIGENCE SYSTEM VISUAL */}
      <section className="py-16 border-t border-white/5 relative z-10" id="features">
        <div className="container mx-auto px-6 md:px-12 max-w-6xl">
          <div className="text-center mb-12">
            <span className="font-mono text-[9px] text-primary uppercase font-bold tracking-widest">Enterprise Core Pipeline</span>
            <h2 className="font-display text-2xl md:text-3xl text-white font-bold mt-1">The Autonomous Decision Loop</h2>
          </div>

          <div className="bg-[#0a0d16]/40 border border-white/5 rounded-3xl p-8 shadow-[0_0_50px_rgba(86,141,255,0.02)] relative overflow-hidden">
            {/* Ambient glows inside layout */}
            <div className="absolute -top-20 -left-20 w-44 h-44 bg-primary/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-20 -right-20 w-44 h-44 bg-tertiary/10 rounded-full blur-2xl"></div>

            {/* Responsive connected cards */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4 relative z-10 w-full">
              {[
                { name: "Enterprise Data", icon: "database", desc: "Telemetry Ingestion", color: "text-primary border-primary/20 bg-primary/5" },
                { name: "AI Agents", icon: "support_agent", desc: "Reasoning Swarms", color: "text-purple-400 border-purple-500/20 bg-purple-500/5" },
                { name: "Wolfram Core", icon: "functions", desc: "Symbolic Computing", color: "text-red-400 border-red-500/20 bg-red-500/5" },
                { name: "Simulation Engine", icon: "model_training", desc: "Monte Carlo Sandbox", color: "text-[#4edea3] border-[#4edea3]/20 bg-[#4edea3]/5" },
                { name: "Strategic Intel", icon: "insights", desc: "Predictive vol path", color: "text-amber-400 border-amber-500/20 bg-amber-500/5" },
                { name: "Recommendations", icon: "verified", desc: "Autonomous Action", color: "text-cyan-400 border-cyan-500/20 bg-cyan-500/5" }
              ].map((step, idx) => (
                <React.Fragment key={idx}>
                  <div className={`w-full lg:w-[15%] border rounded-2xl p-4 flex flex-col items-center text-center space-y-3 hover:scale-[1.03] transition-all duration-300 ${step.color}`}>
                    <span className="material-symbols-outlined text-2xl">{step.icon}</span>
                    <div>
                      <h4 className="text-white text-xs font-bold uppercase tracking-wider">{step.name}</h4>
                      <p className="text-[9px] text-on-surface-variant/70 font-mono mt-1">{step.desc}</p>
                    </div>
                  </div>
                  {idx < 5 && (
                    <div className="flex items-center justify-center py-2 lg:py-0">
                      {/* Horizontal animated arrow on large screen, vertical on mobile */}
                      <div className="hidden lg:block w-8 h-1 relative overflow-hidden">
                        <svg className="w-full h-full" viewBox="0 0 32 4" fill="none">
                          <line x1="0" y1="2" x2="32" y2="2" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="text-white/20" />
                          <circle cx="0" cy="2" r="2" fill="#b0c6ff">
                            <animate attributeName="cx" values="0;32" dur="1.5s" repeatCount="indefinite" />
                          </circle>
                        </svg>
                      </div>
                      <div className="lg:hidden text-on-surface-variant/30 animate-bounce">
                        <span className="material-symbols-outlined">arrow_downward</span>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Simulation ticker logs */}
            <div className="mt-8 pt-6 border-t border-white/5 bg-[#050505]/40 rounded-xl p-4 font-mono text-[10px] text-on-surface-variant flex flex-col space-y-1 select-none">
              <span className="uppercase text-primary font-bold tracking-widest text-[9px] mb-1">Active Intelligence stream</span>
              <div className="flex gap-2 items-center"><span className="text-[#4edea3] font-bold">&gt;</span> Ingesting DB telemetry: node_cluster_04 sync SUCCESS</div>
              <div className="flex gap-2 items-center"><span className="text-[#4edea3] font-bold">&gt;</span> Dispatching LangGraph swarms: audit query compiled</div>
              <div className="flex gap-2 items-center"><span className="text-[#4edea3] font-bold">&gt;</span> Wolfram Kernel: NIntegrate path variance: 0.12948</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — WHY SANKTRIX VS TRADITIONAL BI */}
      <section className="py-20 bg-[#10131b]/25 border-t border-white/5">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl text-white font-bold">Why Traditional BI Fails</h2>
            <div className="h-0.5 w-12 bg-primary mt-3 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Traditional BI */}
            <div className="glass-panel p-8 rounded-2xl border border-white/5 flex flex-col space-y-6">
              <h3 className="font-display text-base text-[#ffb4ab] font-bold uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined">history</span>
                Traditional BI Systems
              </h3>
              <ul className="space-y-3 font-mono text-xs text-on-surface-variant">
                <li className="flex gap-2.5 items-start"><span className="text-red-400 font-bold">✖</span> Static data tables and legacy pivot visualizers</li>
                <li className="flex gap-2.5 items-start"><span className="text-red-400 font-bold">✖</span> Reactive reports requiring hours of manual synthesis</li>
                <li className="flex gap-2.5 items-start"><span className="text-red-400 font-bold">✖</span> Historical logs incapable of projecting cash runaways</li>
              </ul>
            </div>
            {/* Sanktrix */}
            <div className="glass-panel p-8 rounded-2xl border border-primary/20 shadow-[0_0_30px_rgba(86,141,255,0.05)] flex flex-col space-y-6">
              <h3 className="font-display text-base text-primary font-bold uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined">bolt</span>
                Sanktrix Autonomous OS
              </h3>
              <ul className="space-y-3 font-mono text-xs text-on-surface">
                <li className="flex gap-2.5 items-start"><span className="text-[#4edea3] font-bold">✔</span> Real-time predictive Monte Carlo simulations</li>
                <li className="flex gap-2.5 items-start"><span className="text-[#4edea3] font-bold">✔</span> Integrated Wolfram symbolic computation core</li>
                <li className="flex gap-2.5 items-start"><span className="text-[#4edea3] font-bold">✔</span> Autonomous agent swarms trigger corrective actions</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — DEDICATED WOLFRAM SECTION */}
      <section className="py-24 border-t border-white/5 relative" id="wolfram">
        <div className="container mx-auto px-6 md:px-12 max-w-6xl">
          <div className="text-center mb-16 space-y-3">
            <span className="font-mono text-[9px] text-[#ffb4ab] uppercase font-bold tracking-widest bg-red-950/20 border border-red-900/30 px-3 py-1 rounded-full">
              Computational Differentiator
            </span>
            <h2 className="font-display text-3xl md:text-4xl text-white font-extrabold">
              Powered by Wolfram Computational Intelligence
            </h2>
            <p className="text-sm text-on-surface-variant max-w-xl mx-auto leading-relaxed font-light">
              We connect directly to the Wolfram Cloud kernel, converting raw semantic LLM outputs into exact symbolic and mathematical computations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cap 1: Monte Carlo Simulation */}
            <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between space-y-4 hover:border-red-900/30 transition-all duration-300 group">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-red-950/20 border border-red-900/30 flex items-center justify-center text-[#ffb4ab]">
                  <span className="material-symbols-outlined text-xl">query_stats</span>
                </div>
                <h4 className="text-white font-bold text-sm uppercase tracking-wider">Monte Carlo Simulation</h4>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  Project cash runways under 10,000 distinct market stress variables. Computes upper and lower confidence intervals dynamically.
                </p>
              </div>
              {/* Graphic mini preview */}
              <div className="h-16 w-full bg-[#050505]/40 rounded-lg border border-white/5 p-2 flex items-end gap-1 overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-[8px] font-mono text-red-500/20">CONFIDENCE INTERVALS</div>
                {Array.from({ length: 24 }).map((_, idx) => {
                  const ht = (20 + Math.sin(idx * 0.4) * 15 + (idx % 3) * 6).toFixed(1);
                  return (
                    <div key={idx} className="flex-1 bg-red-500/10 border-t border-red-500/25 rounded-t" style={{ height: `${ht}%` }}></div>
                  );
                })}
              </div>
            </div>

            {/* Cap 2: Forecasting */}
            <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between space-y-4 hover:border-red-900/30 transition-all duration-300 group">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-red-950/20 border border-red-900/30 flex items-center justify-center text-[#ffb4ab]">
                  <span className="material-symbols-outlined text-xl">functions</span>
                </div>
                <h4 className="text-white font-bold text-sm uppercase tracking-wider">Forecasting</h4>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  Calculate symbolic regressions on customer acquisition costs (CAC) and compute ARR projections without LLM hallucination.
                </p>
              </div>
              <div className="h-16 w-full bg-[#050505]/40 rounded-lg border border-white/5 p-2 flex items-end gap-1.5 overflow-hidden">
                {Array.from({ length: 14 }).map((_, idx) => {
                  const ht = (30 + idx * 4 + (idx > 9 ? (idx % 4) * 5 : 0)).toFixed(1);
                  return (
                    <div key={idx} className={`flex-1 rounded-t border-t ${idx > 9 ? 'bg-[#ffb4ab]/30 border-[#ffb4ab]' : 'bg-white/5 border-white/10'}`} style={{ height: `${ht}%` }}></div>
                  );
                })}
              </div>
            </div>

            {/* Cap 3: Optimization */}
            <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between space-y-4 hover:border-red-900/30 transition-all duration-300 group">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-red-950/20 border border-red-900/30 flex items-center justify-center text-[#ffb4ab]">
                  <span className="material-symbols-outlined text-xl">network_node</span>
                </div>
                <h4 className="text-white font-bold text-sm uppercase tracking-wider">Optimization</h4>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  Solve multi-variable capital allocation constraints using Wolfram’s global optimization algorithms (e.g. NMinimize).
                </p>
              </div>
              <div className="h-16 w-full bg-[#050505]/40 rounded-lg border border-white/5 p-3 flex items-center justify-center gap-4 relative overflow-hidden">
                <svg className="w-full h-full text-red-500/40" viewBox="0 0 100 30" fill="none">
                  <path d="M10 15 L30 5 L60 25 L90 15" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
                  <circle cx="10" cy="15" r="3" fill="#ffb4ab" />
                  <circle cx="30" cy="5" r="3" fill="#ffb4ab" />
                  <circle cx="60" cy="25" r="3" fill="#ffb4ab" />
                  <circle cx="90" cy="15" r="3" fill="#ffb4ab" />
                </svg>
              </div>
            </div>

            {/* Cap 4: Scenario Planning */}
            <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between space-y-4 hover:border-red-900/30 transition-all duration-300 group">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-red-950/20 border border-red-900/30 flex items-center justify-center text-[#ffb4ab]">
                  <span className="material-symbols-outlined text-xl">tune</span>
                </div>
                <h4 className="text-white font-bold text-sm uppercase tracking-wider">Scenario Planning</h4>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  Toggle variables dynamically to inspect projected cash runway. Simulates decisions like scaling marketing or hiring budgets.
                </p>
              </div>
              <div className="bg-[#050505]/40 rounded-lg border border-white/5 p-3 flex flex-col justify-center space-y-2">
                <div className="flex justify-between text-[8px] font-mono">
                  <span>RUNWAY MULTIPLIER</span>
                  <span className="text-[#ffb4ab] font-bold">1.4x</span>
                </div>
                <div className="h-1 bg-white/10 rounded overflow-hidden relative">
                  <div className="h-full bg-red-500 w-[70%]"></div>
                </div>
              </div>
            </div>

            {/* Cap 5: Risk Modeling */}
            <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between space-y-4 hover:border-red-900/30 transition-all duration-300 group">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-red-950/20 border border-red-900/30 flex items-center justify-center text-[#ffb4ab]">
                  <span className="material-symbols-outlined text-xl">gavel</span>
                </div>
                <h4 className="text-white font-bold text-sm uppercase tracking-wider">Risk Modeling</h4>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  Evaluate operational vulnerabilities by feeding trace variables into mathematical model cells.
                </p>
              </div>
              <div className="h-16 w-full bg-[#050505]/40 rounded-lg border border-white/5 p-2 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-2 border-red-500/20 flex items-center justify-center relative">
                  <div className="absolute top-0 w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
                  <span className="font-mono text-[9px] text-[#ffb4ab] font-bold">HIGH</span>
                </div>
              </div>
            </div>

            {/* Cap 6: Probability Analysis */}
            <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between space-y-4 hover:border-red-900/30 transition-all duration-300 group">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-red-950/20 border border-red-900/30 flex items-center justify-center text-[#ffb4ab]">
                  <span className="material-symbols-outlined text-xl">donut_large</span>
                </div>
                <h4 className="text-white font-bold text-sm uppercase tracking-wider">Probability Analysis</h4>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  Map potential future outcomes to standard probability distributions to identify outliers and forecast anomalies.
                </p>
              </div>
              <div className="h-16 w-full bg-[#050505]/40 rounded-lg border border-white/5 p-3 flex items-end justify-center relative">
                {/* Bell curve approximation SVG */}
                <svg className="w-full h-full text-red-500/30" viewBox="0 0 100 30" fill="none">
                  <path d="M 0 30 Q 30 30 50 5 Q 70 30 100 30" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — DETAILED WOLFRAM SIMULATOR */}
      <section className="py-20 bg-[#10131b]/10 border-t border-white/5">
        <div className="container mx-auto px-6 md:px-12 max-w-6xl">
          <div className="glass-panel p-8 rounded-3xl border border-primary/20 shadow-[0_0_50px_rgba(86,141,255,0.05)] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Control panel */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="font-mono text-[9px] text-primary uppercase font-bold tracking-widest">Interactive Calculator</span>
                <h3 className="font-display text-2xl text-white font-bold mt-1">Wolfram Monte Carlo Engine</h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-on-surface-variant uppercase font-mono text-[10px]">Chose variable</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => { setActiveScenario("churn"); setSimulationVal(15); }} 
                      className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-all ${activeScenario === "churn" ? "bg-primary text-[#001945]" : "bg-white/5 text-on-surface-variant hover:text-white"}`}
                    >
                      Churn
                    </button>
                    <button 
                      onClick={() => { setActiveScenario("hiring"); setSimulationVal(20); }} 
                      className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-all ${activeScenario === "hiring" ? "bg-primary text-[#001945]" : "bg-white/5 text-on-surface-variant hover:text-white"}`}
                    >
                      Hiring
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-on-surface-variant">Adjust variance</span>
                    <span className="text-white font-bold">{simulationVal}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="50" 
                    value={simulationVal}
                    onChange={(e) => setSimulationVal(Number(e.target.value))}
                    className="w-full accent-primary bg-white/5 rounded-lg appearance-none h-1.5 cursor-pointer"
                  />
                </div>

                <button
                  onClick={handleRunSimulation}
                  disabled={isSimulating}
                  className="w-full bg-primary hover:bg-[#c2d6ff] text-[#001945] font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(176,198,255,0.15)]"
                >
                  <span className="material-symbols-outlined text-sm">rotate_left</span>
                  <span>{isSimulating ? "Computing paths..." : "Compute Forecast"}</span>
                </button>
              </div>
            </div>

            {/* Simulated output display */}
            <div className="lg:col-span-7 bg-[#050505]/60 border border-white/5 rounded-2xl p-6 relative flex flex-col justify-between min-h-[260px]">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#4edea3] font-bold">Simulator Output</span>
                <span className="font-mono text-[9px] text-on-surface-variant">KERNEL STATUS: ONLINE</span>
              </div>

              {isSimulating ? (
                <div className="flex flex-col items-center justify-center my-auto space-y-4">
                  <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                  <span className="font-mono text-[10px] text-on-surface-variant animate-pulse">Querying Wolfram APIs...</span>
                </div>
              ) : (
                <div className="my-auto space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border border-white/5 bg-[#0a0d16]/30 p-4 rounded-xl">
                      <span className="text-[9px] font-mono text-on-surface-variant uppercase block">Projected Runway</span>
                      <span className="font-display text-2xl font-bold text-white mt-1">
                        {activeScenario === "churn" 
                          ? (24.5 - simulationVal * 0.45).toFixed(1)
                          : (24.5 - simulationVal * 0.3).toFixed(1)} months
                      </span>
                    </div>
                    <div className="border border-white/5 bg-[#0a0d16]/30 p-4 rounded-xl">
                      <span className="text-[9px] font-mono text-on-surface-variant uppercase block">Standard Deviation</span>
                      <span className="font-display text-2xl font-bold text-tertiary mt-1">
                        {(1.1 + simulationVal * 0.02).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-on-surface-variant leading-relaxed">
                    <strong className="text-white">Wolfram Core Recommendation:</strong> Based on the simulated variance, there is a <span className="text-[#4edea3]">92.8%</span> probability that cash runway remains stable above 12 months. Recommendation: maintain current marketing spend.
                  </p>
                </div>
              )}

              <div className="flex justify-between items-center border-t border-white/5 pt-2 text-[9px] font-mono text-on-surface-variant">
                <span>FORMULA: NIntegrate[Runway[v], {`{v, 0, ${simulationVal}}`}]</span>
                <span className="text-[#4edea3] flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span> SYNCED
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 6 — SHOWCASE CAROUSEL (DEDICATED SECTION) */}
      <section className="py-24 border-t border-white/5" id="showcase">
        <div className="container mx-auto px-6 md:px-12 max-w-6xl">
          <div className="text-center mb-16">
            <span className="font-mono text-[9px] text-primary uppercase font-bold tracking-widest">Interactive Showroom</span>
            <h2 className="font-display text-3xl md:text-4xl text-white font-extrabold mt-1">Explore Sanktrix OS</h2>
            <p className="text-sm text-on-surface-variant max-w-xl mx-auto mt-2 font-light">
              Review live pages and modules built into the dashboard command core.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Tabs Selector on left */}
            <div className="lg:col-span-4 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0">
              {carouselItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setCarouselIdx(idx)}
                  className={`w-full text-left px-5 py-3 rounded-xl border transition-all duration-300 flex items-center gap-3 cursor-pointer ${
                    carouselIdx === idx
                      ? "border-primary/20 bg-primary/5 text-primary font-bold shadow-[0_0_15px_rgba(86,141,255,0.05)]"
                      : "border-white/5 bg-transparent text-on-surface-variant hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">{item.icon}</span>
                  <span className="text-xs uppercase tracking-wider font-semibold whitespace-nowrap">{item.title}</span>
                </button>
              ))}
            </div>

            {/* Showcase Visual/Description Frame */}
            <div className="lg:col-span-8 glass-panel p-8 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(86,141,255,0.05)] flex flex-col justify-between min-h-[380px] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-primary/5 rounded-full blur-3xl"></div>

              {/* Title & Icon */}
              <div className="flex justify-between items-start border-b border-white/5 pb-4">
                <div>
                  <span className="font-mono text-[9px] text-primary uppercase font-bold tracking-widest">Sanktrix Module Preview {carouselIdx + 1}/6</span>
                  <h3 className="font-display text-xl text-white font-bold mt-1">{carouselItems[carouselIdx].title}</h3>
                </div>
                <span className={`material-symbols-outlined text-3xl ${carouselItems[carouselIdx].accent}`}>
                  {carouselItems[carouselIdx].icon}
                </span>
              </div>

              {/* Slide Mock Preview Visual */}
              <div className="bg-[#050505]/60 border border-white/5 rounded-xl p-4 my-6 flex-grow flex flex-col justify-center min-h-[160px]">
                {carouselIdx === 0 && (
                  <div className="space-y-3 font-mono text-[10px]">
                    <div className="text-primary font-bold flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                      <span>EXECUTIVE COPILOT AGENT INSTRUCTIONS</span>
                    </div>
                    <p className="text-on-surface-variant leading-relaxed">
                      &quot;Summarize our CAC status and generate a brief highlighting runway under simulated churn growth.&quot;
                    </p>
                    <div className="bg-[#0a0d16]/40 p-2.5 rounded border border-white/5 text-white">
                      <strong>AI Briefing Output:</strong> Cash runway projected at 18.2 months. Churn is mitigated by Finance Swarms. No immediate budget reallocation required.
                    </div>
                  </div>
                )}
                {carouselIdx === 1 && (
                  <div className="space-y-3 font-mono text-[10px]">
                    <div className="text-[#4edea3] font-bold flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
                      <span>AGENT DEPLOYMENT TREE</span>
                    </div>
                    <div className="flex flex-col gap-1.5 pl-3 border-l border-white/10 text-on-surface-variant">
                      <div>├─ <span className="text-white">Finance Agent</span> (Active, Status: PASS, Score: 98.4%)</div>
                      <div>├─ <span className="text-white">SDR Swarm</span> (Active, Executing LinkedIn outreach, Rate: 1.2 req/s)</div>
                      <div>└─ <span className="text-white">Risk Analyst</span> (Awaiting trigger, Awaiting event fabric logs)</div>
                    </div>
                  </div>
                )}
                {carouselIdx === 2 && (
                  <div className="space-y-3 font-mono text-[10px]">
                    <div className="text-tertiary font-bold flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
                      <span>PARAMETRIC SCENARIOS RUNNING</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-2 border border-white/5 rounded bg-white/5">
                        <span className="text-on-surface-variant block text-[8px]">RUNWAY CRISIS</span>
                        <span className="text-white font-bold">11.4 Months</span>
                      </div>
                      <div className="p-2 border border-[#ffb4ab]/20 rounded bg-red-950/10">
                        <span className="text-on-surface-variant block text-[8px]">CHURN SPIKE</span>
                        <span className="text-[#ffb4ab] font-bold">HIGH RISK</span>
                      </div>
                      <div className="p-2 border border-[#4edea3]/20 rounded bg-emerald-950/10">
                        <span className="text-on-surface-variant block text-[8px]">HIRING SPEED</span>
                        <span className="text-[#4edea3] font-bold">OPTIMIZED</span>
                      </div>
                    </div>
                  </div>
                )}
                {carouselIdx === 3 && (
                  <div className="space-y-3 font-mono text-[10px]">
                    <div className="text-primary font-bold flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                      <span>SEMANTIC EMBEDDINGS INDEX</span>
                    </div>
                    <div className="p-2.5 rounded border border-white/5 bg-[#0a0d16]/30 text-on-surface-variant">
                      Matched: <span className="text-white">&quot;Securities compliance guidelines&quot;</span> in vector space. Score: 0.941. References: SEC_REPORT_2026.pdf
                    </div>
                  </div>
                )}
                {carouselIdx === 4 && (
                  <div className="space-y-2 font-mono text-[10px] text-on-surface-variant">
                    <div className="text-[#4edea3] font-bold flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
                      <span>DIGITAL TWIN MAPPINGS</span>
                    </div>
                    <div className="flex gap-4 justify-around py-2">
                      <div className="text-center">
                        <div className="text-white font-bold text-xs">84%</div>
                        <div className="text-[8px] uppercase">Finance Node</div>
                      </div>
                      <div className="text-center">
                        <div className="text-white font-bold text-xs">92%</div>
                        <div className="text-[8px] uppercase">SDR Pipeline</div>
                      </div>
                      <div className="text-center">
                        <div className="text-white font-bold text-xs">79%</div>
                        <div className="text-[8px] uppercase">Compliance</div>
                      </div>
                    </div>
                  </div>
                )}
                {carouselIdx === 5 && (
                  <div className="space-y-2 font-mono text-[10px] text-on-surface-variant">
                    <div className="text-tertiary font-bold flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
                      <span>LOG COMPILATION FEED</span>
                    </div>
                    <div className="space-y-1 text-on-surface-variant/80">
                      <div>[10:14:02] n8n routing sync initialized successfully</div>
                      <div className="text-white">[10:14:05] LangGraph swarms: SDR Agent triggered outreach seq</div>
                      <div>[10:14:12] audit log: system.login registered for usr_1001</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Description & Navigation */}
              <div className="space-y-4">
                <p className="text-xs text-on-surface-variant leading-relaxed">{carouselItems[carouselIdx].desc}</p>
                
                <div className="flex justify-between items-center pt-3 border-t border-white/5">
                  <button
                    onClick={() => setCarouselIdx(prev => (prev === 0 ? 5 : prev - 1))}
                    className="text-[10px] font-bold uppercase tracking-wider text-primary hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-xs">chevron_left</span>
                    <span>Previous View</span>
                  </button>
                  <button
                    onClick={() => setCarouselIdx(prev => (prev === 5 ? 0 : prev + 1))}
                    className="text-[10px] font-bold uppercase tracking-wider text-primary hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>Next View</span>
                    <span className="material-symbols-outlined text-xs">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9 — WHY WE ARE DIFFERENT MATRIX */}
      <section className="py-24 bg-[#10131b]/10 border-t border-white/5">
        <div className="container mx-auto px-6 md:px-12 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl text-white font-bold">Comparison Matrix</h2>
            <div className="h-0.5 w-12 bg-primary mt-3 mx-auto"></div>
          </div>
          <div className="overflow-x-auto max-w-4xl mx-auto glass-panel rounded-2xl border border-white/5">
            <table className="w-full text-left font-mono text-xs text-on-surface-variant min-w-[600px]">
              <thead>
                <tr className="border-b border-white/10 text-white bg-[#10131b]/50">
                  <th className="p-4 font-normal">Capability Matrix</th>
                  <th className="p-4 font-normal text-center">Power BI / Tableau</th>
                  <th className="p-4 font-normal text-center">ChatGPT / LLMs</th>
                  <th className="p-4 font-normal text-center text-primary font-bold">SANKTRIX OS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { feature: "AI Agent Workforce Swarms", bi: "✖ None", llm: "✖ Chat only", sanktrix: "✔ Autonomous swarms" },
                  { feature: "Wolfram Mathematical Core", bi: "✖ None", llm: "✖ Speculative", sanktrix: "✔ Real Kernels" },
                  { feature: "Risk & Churn Simulations", bi: "✖ Manual pivot tables", llm: "✖ Text summaries", sanktrix: "✔ Monte Carlo engines" },
                  { feature: "Autonomous Actions", bi: "✖ Read-only visuals", llm: "✖ API code outputs", sanktrix: "✔ Workflow triggers" }
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 text-white font-semibold">{row.feature}</td>
                    <td className="p-4 text-center text-on-surface-variant/70">{row.bi}</td>
                    <td className="p-4 text-center text-on-surface-variant/70">{row.llm}</td>
                    <td className="p-4 text-center text-primary font-bold">{row.sanktrix}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION 10 — PLATFORM ARCHITECTURE */}
      <section className="py-24 border-t border-white/5">
        <div className="container mx-auto px-6 md:px-12 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl text-white font-bold">Systems Architecture</h2>
            <div className="h-0.5 w-12 bg-primary mt-3 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 max-w-5xl mx-auto text-center font-mono">
            {[
              { id: "01", name: "Data Sources", desc: "Salesforce, Clickhouse, Kafka brokers" },
              { id: "02", name: "Workflows (n8n)", desc: "Trigger.dev pipeline orchestration" },
              { id: "03", name: "AI Core", desc: "LangGraph autonomous agents" },
              { id: "04", name: "Wolfram Engine", desc: "monte carlo & symbolic math" },
              { id: "05", name: "Executive Output", desc: "recommendations & dashboard" }
            ].map((node, idx) => (
              <div key={idx} className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col justify-between space-y-4 hover:border-primary/20 transition-all duration-300">
                <span className="text-2xl text-primary/30 font-bold">{node.id}</span>
                <div>
                  <h4 className="text-white font-bold text-xs uppercase tracking-wider">{node.name}</h4>
                  <p className="text-[10px] text-on-surface-variant mt-1 leading-normal">{node.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 11 — ENTERPRISE SECURITY */}
      <section className="py-24 border-t border-white/5" id="security">
        <div className="container mx-auto px-6 md:px-12 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl text-white font-bold">Enterprise Governance &amp; Security</h2>
            <div className="h-0.5 w-12 bg-primary mt-3 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { title: "Role-Based Gating", desc: "Strict RBAC constraints restricting Viewer access to read-only." },
              { title: "Validation & Upload Guards", desc: "Secure file validation limits uploads to sanitized document structures." },
              { title: "Telemetry Audit Logs", desc: "All system and user modifications are registered instantly inside audit feeds." }
            ].map((sec, idx) => (
              <div key={idx} className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col space-y-3">
                <h3 className="font-display text-base text-white font-bold">{sec.title}</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">{sec.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 13 — FINAL CALL TO ACTION */}
      <section className="py-24 border-t border-white/5 relative z-10">
        <div className="container mx-auto px-6 md:px-12 max-w-5xl text-center">
          <div className="glass-panel p-12 rounded-3xl border border-primary/20 shadow-[0_0_50px_rgba(86,141,255,0.1)] flex flex-col items-center space-y-6 relative overflow-hidden bg-[#0A0F1E]/20">
            <div className="absolute top-0 right-0 w-44 h-44 rounded-full bg-primary/10 blur-3xl"></div>
            
            <h2 className="font-display text-4xl text-white font-bold tracking-tight">
              The Future of Enterprise Intelligence
            </h2>
            <p className="text-sm text-on-surface-variant max-w-lg leading-relaxed font-light">
              While most AI systems generate answers, Sanktrix computes strategic intelligence. Get started today.
            </p>
            <div className="flex gap-4 flex-col sm:flex-row">
              <button
                onClick={() => router.push("/login")}
                className="bg-primary hover:bg-[#c2d6ff] text-[#001945] px-10 py-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(176,198,255,0.3)] hover:scale-[1.03] cursor-pointer"
              >
                Launch Platform
              </button>
              <button
                onClick={() => router.push("/demo")}
                className="border border-white/10 hover:border-white/20 text-white px-10 py-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 bg-white/5 hover:bg-white/10 cursor-pointer"
              >
                Run Demo Scenario
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#050505] border-t border-white/5 py-8 relative z-10">
        <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded border border-white/10 overflow-hidden">
              <img src="/Santrix_logo.jpeg" className="w-full h-full object-cover" alt="Sanktrix Logo" />
            </div>
            <span className="font-mono text-xs text-outline">© 2026 Sanktrix. All rights reserved.</span>
          </div>
          <div className="font-mono text-xs text-outline flex gap-6">
            <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
            <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
