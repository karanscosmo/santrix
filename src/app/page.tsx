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
  
  // States for Hero interactive cockpit
  const [activeAgentsCount, setActiveAgentsCount] = useState(12);
  const [liveTelemetry, setLiveTelemetry] = useState<string[]>([
    "System: Boot sequence complete. Wolfram connection open.",
    "Agent SDR-01: Scanning sector databases...",
    "Wolfram Kernel: Executed ARR Monte Carlo simulation.",
  ]);
  const [sparklineData, setSparklineData] = useState<number[]>([30, 45, 38, 52, 60, 55, 78, 85, 92]);

  // States for Section 4: Wolfram Interactive Calculator
  const [calcLoading, setCalcLoading] = useState(false);
  const [calcRun, setCalcRun] = useState(false);
  const [calcResult, setCalcResult] = useState({
    runway: "16.2 months",
    prob: "94.2%",
    rec: "No immediate budget action required."
  });

  const runWolframCalculator = () => {
    setCalcLoading(true);
    setCalcRun(false);
    setTimeout(() => {
      setCalcLoading(false);
      setCalcRun(true);
      setCalcResult({
        runway: "12.8 months",
        prob: "78.4%",
        rec: "WARNING: Margins compressed by 240 bps. Suggest reallocating $120K to search retention ads."
      });
    }, 1500);
  };

  // States for Section 5: Simulation Showcase
  const [activeSimId, setActiveSimId] = useState("arr");
  const simulationData: Record<string, { title: string, formula: string, preview: string }> = {
    arr: {
      title: "Revenue Forecasting",
      formula: "f(t) = BaseARR * (1 + CompoundRate)^t + WolframGrowthShift",
      preview: "ARR projected to scale from $41.2M to $42.8M by Q3. Trend volatility: 1.2%."
    },
    churn: {
      title: "Churn Prediction",
      formula: "P(c) = Logistic[Beta0 + Beta1*Activity + Beta2*CAC_Shift]",
      preview: "Calculated 15% retention drop likelihood inside accounts with inactive SDR logs."
    },
    hiring: {
      title: "Hiring Impact Analysis",
      formula: "MilestoneDev(t) = BaseVelocity + (headcount * EfficiencyCoeff)",
      preview: "Adding 3 developers reduces core launch timeline by 18 days. Incremental cost: $45K/mo."
    },
    expansion: {
      title: "Market Expansion Planning",
      formula: "ROI(m) = NetYield[InternationalSegment] - IntegrationCost",
      preview: "EU segment expansion yields 1.4x capital return under optimized local spend."
    },
    resources: {
      title: "Resource Optimization",
      formula: "Max z = Sum[Spend_i * Output_i] s.t. Budget <= TotalCapital",
      preview: "Reallocated marketing ad spend. Core conversion rate improved by +8.4%."
    },
    runway: {
      title: "Cash Runway Modeling",
      formula: "Runway(m) = TotalCapital / (BurnRate + NetExpansionMargin)",
      preview: "Baseline cash runway: 15.4 months. Optimized runway: 18.2 months."
    }
  };

  // States for Section 12: Product Preview Carousel
  const [carouselIdx, setCarouselIdx] = useState(0);
  const carouselItems = [
    { title: "Overview Dashboard", desc: "Executive dashboard showing ARR, cash burn, and live logs.", icon: "dashboard" },
    { title: "Simulations Sandbox", desc: "Run Monte Carlo models on runway under custom scenario variables.", icon: "model_training" },
    { title: "Executive Copilot", desc: "Interact with AI Chief of Staff and receive computed briefs.", icon: "smart_toy" },
    { title: "Agent Observatory", desc: "Inspect LLM trace trees and active agent coordinate loops.", icon: "visibility" },
    { title: "Wolfram Center", desc: "Execute math calculations and inspect kernel CPU health.", icon: "functions" },
    { title: "Digital Twin Graph", desc: "Trace operational node maps and departmental flows.", icon: "donut_large" },
  ];

  useEffect(() => {
    const telemetryInterval = setInterval(() => {
      const logs = [
        `Wolfram: Computed risk path volatility (${(Math.random() * 2 + 1).toFixed(2)}%)`,
        `Agent Risk-03: Audited compliance logs. Status: PASS`,
        `Fabric: Stream rate increased to ${(1200 + Math.floor(Math.random() * 200))} events/sec`,
        `Copilot: Generated hourly business briefing summary`,
        `System: Active memory optimization complete`,
      ];
      setLiveTelemetry(prev => [logs[Math.floor(Math.random() * logs.length)], prev[0], prev[1]].slice(0, 3));
      setActiveAgentsCount(prev => Math.max(8, Math.min(20, prev + (Math.random() > 0.5 ? 1 : -1))));
      setSparklineData(prev => [...prev.slice(1), 75 + Math.floor(Math.random() * 25)]);
    }, 4000);

    return () => clearInterval(telemetryInterval);
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

  return (
    <div className="bg-[#050505] text-[#e0e2ee] font-sans antialiased overflow-x-hidden min-h-screen selection:bg-primary/30 selection:text-white">
      {/* Navbar Logo */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 h-16 flex justify-between items-center px-6 md:px-12">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded border border-primary/20 overflow-hidden">
            <img src="/Santrix_logo.jpeg" className="w-full h-full object-cover" alt="Sanktrix Logo" />
          </div>
          <span className="font-display text-lg font-bold text-white tracking-tight">Sanktrix</span>
        </div>
        <nav className="hidden md:flex gap-8">
          <a href="#why-us" className="text-on-surface-variant hover:text-primary transition-colors text-[10px] font-bold uppercase tracking-widest">Why Us</a>
          <a href="#loop" className="text-on-surface-variant hover:text-primary transition-colors text-[10px] font-bold uppercase tracking-widest">Intelligence Loop</a>
          <a href="#wolfram" className="text-on-surface-variant hover:text-primary transition-colors text-[10px] font-bold uppercase tracking-widest">Wolfram</a>
          <a href="#agents" className="text-on-surface-variant hover:text-primary transition-colors text-[10px] font-bold uppercase tracking-widest">Agents</a>
          <a href="#security" className="text-on-surface-variant hover:text-primary transition-colors text-[10px] font-bold uppercase tracking-widest">Security</a>
        </nav>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary hover:bg-[#c2d6ff] text-[#001945] px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-[0_0_15px_rgba(176,198,255,0.2)] hover:scale-[1.02] cursor-pointer"
        >
          Login
        </button>
      </header>

      {/* SECTION 1 — HERO */}
      <section className="relative w-full min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 w-full h-full z-0 opacity-40 mix-blend-screen">
          <WebGLBackground />
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-[#050505]/60 to-[#050505]"></div>

        <div className="relative z-10 container mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-7xl">
          {/* Left copy */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-6">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_#b0c6ff]"></div>
              <span className="font-mono text-[9px] uppercase tracking-widest text-primary font-bold">System Status: Optimal</span>
            </div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-tight font-extrabold mb-6">
              <span className="bg-gradient-to-r from-white via-primary to-primary-fixed-dim bg-clip-text text-transparent">
                SANKTRIX
              </span>
              <span className="block text-xl md:text-2xl font-bold font-sans text-on-surface-variant mt-2 tracking-wide">
                Autonomous Computational Intelligence Platform
              </span>
            </h1>

            <p className="text-sm md:text-base text-on-surface-variant max-w-lg mb-10 leading-relaxed">
              Transform enterprise data into autonomous strategic intelligence using AI agents, Wolfram-powered computation, and real-time workflow orchestration.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
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
                Run Live Demo
                <span className="material-symbols-outlined text-sm">play_circle</span>
              </button>
            </div>
          </div>

          {/* Right cockpit visualizer */}
          <div className="lg:col-span-6">
            <div className="glass-panel w-full p-6 rounded-2xl border border-primary/20 relative shadow-[0_0_50px_rgba(86,141,255,0.1)] flex flex-col space-y-4">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-sweep"></div>
              
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping"></span>
                  <span className="font-mono text-[10px] tracking-wider text-primary uppercase font-bold">Intelligence Cockpit</span>
                </div>
                <span className="font-mono text-[9px] text-on-surface-variant">NODE: HOST_OS_9</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#050505]/40 border border-white/5 rounded-xl p-3 flex flex-col justify-between">
                  <span className="text-[10px] font-mono text-on-surface-variant uppercase">Active Workforce</span>
                  <span className="font-display text-2xl font-bold text-white mt-1">{activeAgentsCount} Agents</span>
                </div>
                <div className="bg-[#050505]/40 border border-white/5 rounded-xl p-3 flex flex-col justify-between">
                  <span className="text-[10px] font-mono text-on-surface-variant uppercase">Wolfram Load</span>
                  <span className="font-display text-2xl font-bold text-tertiary mt-1">14.1 Compute</span>
                </div>
              </div>

              <div className="bg-[#050505]/40 border border-white/5 rounded-xl p-3 flex flex-col space-y-2">
                <div className="flex justify-between items-center text-[10px] font-mono text-on-surface-variant">
                  <span>ARR Forecast Trend (Live Model)</span>
                  <span className="text-primary font-bold">+18.4%</span>
                </div>
                <div className="h-16 flex items-end gap-1.5 pt-4">
                  {sparklineData.map((val, idx) => (
                    <div
                      key={idx}
                      className="flex-1 bg-gradient-to-t from-primary/10 to-primary/60 border-t border-primary/50 rounded-t transition-all duration-500"
                      style={{ height: `${val}%` }}
                    ></div>
                  ))}
                </div>
              </div>

              <div className="bg-[#050505]/40 border border-white/5 rounded-xl p-3 flex flex-col space-y-1">
                <span className="text-[10px] font-mono text-on-surface-variant uppercase border-b border-white/5 pb-1 mb-1">Live Telemetry Feed</span>
                <div className="space-y-1.5 font-mono text-[10px] text-on-surface">
                  {liveTelemetry.map((log, idx) => (
                    <div key={idx} className="flex gap-2 items-center truncate">
                      <span className="text-[#4edea3] font-bold">{`>`}</span>
                      <span className="text-on-surface-variant">{log}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — WHY SANKTRIX */}
      <section className="py-24 bg-[#10131b]/25 border-t border-white/5" id="why-us">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl text-white font-bold">Why Traditional BI Fails</h2>
            <div className="h-1 w-16 bg-primary mb-4 mx-auto"></div>
            <p className="text-on-surface-variant text-sm max-w-2xl mx-auto mt-2">
              Standard data dashboards only look backward. Sanktrix introduces the transition to real-time predictive computation and autonomous execution.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Traditional BI */}
            <div className="glass-panel p-8 rounded-2xl border border-white/5 flex flex-col space-y-6">
              <h3 className="font-display text-xl text-[#ffb4ab] font-bold uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined">history</span>
                Traditional BI Systems
              </h3>
              <ul className="space-y-3 font-mono text-xs text-on-surface-variant">
                <li className="flex gap-2 items-center"><span className="text-red-400 font-bold">✖</span> Static data tables and retro-fitted layouts</li>
                <li className="flex gap-2 items-center"><span className="text-red-400 font-bold">✖</span> Reactive reports requiring human interpretation</li>
                <li className="flex gap-2 items-center"><span className="text-red-400 font-bold">✖</span> Historical logs that cannot predict CAC deviations</li>
              </ul>
            </div>
            {/* Sanktrix */}
            <div className="glass-panel p-8 rounded-2xl border border-primary/20 shadow-[0_0_30px_rgba(86,141,255,0.05)] flex flex-col space-y-6">
              <h3 className="font-display text-xl text-primary font-bold uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined">bolt</span>
                Sanktrix Autonomous OS
              </h3>
              <ul className="space-y-3 font-mono text-xs text-on-surface">
                <li className="flex gap-2 items-center"><span className="text-[#4edea3] font-bold">✔</span> Real-time predictive Monte Carlo computation</li>
                <li className="flex gap-2 items-center"><span className="text-[#4edea3] font-bold">✔</span> Powered by Wolfram Computational Engines</li>
                <li className="flex gap-2 items-center"><span className="text-[#4edea3] font-bold">✔</span> Autonomous agent swarms coordinating execution</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — THE INTELLIGENCE LOOP */}
      <section className="py-24 border-t border-white/5" id="loop">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl text-white font-bold">The Intelligence Loop</h2>
            <div className="h-1 w-16 bg-primary mb-4 mx-auto"></div>
            <p className="text-on-surface-variant text-sm max-w-2xl mx-auto mt-2">
              Trace the continuous computational pathway that converts raw noise into strategic business growth.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 relative">
            {[
              { id: "1", label: "Enterprise Data", icon: "database" },
              { id: "2", label: "AI Agents", icon: "support_agent" },
              { id: "3", label: "Wolfram Engine", icon: "functions" },
              { id: "4", label: "Simulations", icon: "model_training" },
              { id: "5", label: "Strategic Intel", icon: "verified" },
              { id: "6", label: "Recommendations", icon: "dashboard" },
            ].map((step, idx) => (
              <div key={idx} className="glass-panel p-5 rounded-2xl text-center flex flex-col items-center justify-between space-y-4 hover:border-primary/20 transition-all border border-white/5">
                <span className="font-mono text-2xl text-primary/30 font-bold">{step.id}</span>
                <span className="material-symbols-outlined text-primary text-3xl">{step.icon}</span>
                <span className="font-display text-xs text-white font-bold block">{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — WOLFRAM COMPUTATIONAL CORE */}
      <section className="py-24 bg-[#10131b]/15 border-t border-white/5" id="wolfram">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center font-sans">
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-full text-[10px] font-mono uppercase font-bold">
                Powered by Wolfram
              </div>
              <h2 className="font-display text-3xl md:text-4xl text-white font-bold leading-tight">
                Computational Core Over Generative Text
              </h2>
              <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
                Unlike traditional LLMs that speculate or guess values, Sanktrix connects queries directly to a host Wolfram Engine Kernel to run exact Monte Carlo simulations, solve strategic bounds, and optimize budget parameters.
              </p>
              
              {/* Interactive trigger widget */}
              <div className="bg-[#050505]/40 border border-white/5 p-4 rounded-xl space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono text-white font-bold">Run Test: &quot;What happens if churn increases 15%?&quot;</span>
                  <button
                    onClick={runWolframCalculator}
                    disabled={calcLoading}
                    className="bg-[#ffb955] text-[#291800] hover:bg-[#ffddb4] px-4 py-1.5 rounded text-[10px] uppercase font-mono font-bold cursor-pointer transition-colors"
                  >
                    {calcLoading ? "Computing..." : "Run Sim"}
                  </button>
                </div>
                
                {calcLoading && (
                  <div className="flex items-center gap-2 text-xs font-mono text-primary animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                    <span>Wolfram Kernel solving parametric differential probability curves...</span>
                  </div>
                )}

                {calcRun && (
                  <div className="space-y-2 font-mono text-[10px] text-on-surface bg-[#10131b]/50 p-3 rounded-lg border border-primary/20">
                    <div className="flex justify-between"><span>Projected Runway:</span><span className="text-[#ffb4ab] font-bold">{calcResult.runway}</span></div>
                    <div className="flex justify-between"><span>Confidence Bound:</span><span className="text-primary font-bold">{calcResult.prob}</span></div>
                    <div className="border-t border-white/5 pt-1.5 text-on-surface-variant">{calcResult.rec}</div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Probability curve display */}
            <div className="lg:col-span-7">
              <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden flex flex-col space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="font-mono text-[10px] text-primary uppercase font-bold">Monte Carlo Probability Curve</span>
                  <span className="text-[10px] text-on-surface-variant font-mono">16 ACTIVE KERNELS</span>
                </div>
                <div className="h-48 bg-[#050505]/40 border border-white/5 rounded-xl flex items-center justify-center p-4 relative overflow-hidden">
                  <svg className="w-full h-full text-primary" viewBox="0 0 500 200" fill="none">
                    <path d="M 0 160 Q 120 160, 200 60 T 400 160 T 500 160" stroke="#b0c6ff" strokeWidth="2" fill="none" />
                    <path d="M 0 160 Q 120 160, 200 60 T 400 160 T 500 160 L 500 200 L 0 200 Z" fill="url(#grad2)" opacity="0.1" />
                    <defs>
                      <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#b0c6ff" />
                        <stop offset="100%" stopColor="transparent" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute top-4 right-4 bg-[#050505]/60 border border-white/10 px-3 py-1.5 rounded font-mono text-[9px] text-[#4edea3]">
                    Powered by Wolfram Computational Intelligence
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — BUSINESS SIMULATION SHOWCASE */}
      <section className="py-24 border-t border-white/5">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl text-white font-bold">Business Simulations Sandbox</h2>
            <p className="text-on-surface-variant text-sm max-w-2xl mx-auto mt-2">
              Select a model profile to review the underlying formula and computed outputs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto">
            {/* Left buttons list */}
            <div className="lg:col-span-5 flex flex-col gap-2">
              {Object.keys(simulationData).map(key => (
                <button
                  key={key}
                  onClick={() => setActiveSimId(key)}
                  className={`w-full text-left p-4 rounded-xl border transition-all text-xs font-bold uppercase tracking-wider cursor-pointer ${
                    activeSimId === key
                      ? "bg-primary/5 text-primary border-primary"
                      : "bg-[#050505]/40 text-on-surface-variant border-white/5 hover:border-white/20"
                  }`}
                >
                  {simulationData[key].title}
                </button>
              ))}
            </div>

            {/* Right formula/preview card */}
            <div className="lg:col-span-7">
              <div className="glass-panel p-6 rounded-2xl border border-white/5 h-full flex flex-col justify-between space-y-6">
                <div>
                  <span className="font-mono text-[9px] text-primary uppercase font-bold tracking-widest">Active Simulation Profile</span>
                  <h3 className="font-display text-xl text-white font-bold mt-1">{simulationData[activeSimId].title}</h3>
                </div>
                <div className="space-y-4">
                  <div className="bg-[#050505]/40 border border-white/5 p-3 rounded-lg">
                    <span className="text-[9px] font-mono text-[#ffb955] uppercase block">Equation Model</span>
                    <p className="text-xs text-white font-mono mt-1 overflow-x-auto">{simulationData[activeSimId].formula}</p>
                  </div>
                  <div className="bg-[#050505]/40 border border-white/5 p-3 rounded-lg">
                    <span className="text-[9px] font-mono text-[#4edea3] uppercase block">Realtime Telemetry Forecast</span>
                    <p className="text-xs text-on-surface-variant leading-relaxed mt-1">{simulationData[activeSimId].preview}</p>
                  </div>
                </div>
                <div className="pt-3 border-t border-white/5 text-[9px] font-mono text-on-surface-variant">
                  COMPILED BY WOLFRAM HOST KERNEL // SYNCED
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 — AUTONOMOUS AGENT ECOSYSTEM */}
      <section className="py-24 bg-[#10131b]/10 border-t border-white/5" id="agents">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl text-white font-bold">Autonomous Agent Ecosystem</h2>
            <p className="text-on-surface-variant text-sm max-w-2xl mx-auto mt-2">
              Deploy specialized agents that analyze, compute, and execute operations inside secure sandboxes.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Finance Agent", status: "Active", tasks: "Monitor burn rates and run scenario alerts", score: "98" },
              { name: "Forecasting Agent", status: "Active", tasks: "Run Monte Carlo ARR models continuously", score: "99" },
              { name: "Strategy Agent", status: "Running", tasks: "Scan competitive vectors and price data", score: "94" },
              { name: "Risk Agent", status: "Idle", tasks: "Verify compliance and check directory uploads", score: "96" },
              { name: "Operations Agent", status: "Running", tasks: "Coordinate n8n and temporal workflow tasks", score: "95" },
              { name: "Wolfram Compute Agent", status: "Active", tasks: "Resolve symbolic integrals and math bounds", score: "100" }
            ].map((agent, idx) => (
              <div key={idx} className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col justify-between space-y-4 hover:border-primary/20 transition-all">
                <div className="flex justify-between items-center">
                  <span className="material-symbols-outlined text-primary text-2xl">support_agent</span>
                  <span className="font-mono text-[9px] text-[#4edea3] bg-[#4edea3]/10 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">{agent.status}</span>
                </div>
                <div>
                  <h4 className="font-display text-sm text-white font-bold">{agent.name}</h4>
                  <p className="text-[11px] text-on-surface-variant mt-1">{agent.tasks}</p>
                </div>
                <div className="pt-2 border-t border-white/5 flex justify-between items-center text-[9px] font-mono text-on-surface-variant font-bold">
                  <span>INTELLIGENCE CAPABILITY SCORE</span>
                  <span className="text-white">{agent.score}/100</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7 — ENTERPRISE DIGITAL TWIN */}
      <section className="py-24 border-t border-white/5">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl text-white font-bold">Enterprise Digital Twin</h2>
            <p className="text-on-surface-variant text-sm max-w-2xl mx-auto mt-2">
              A high-fidelity organizational graph tracing active relationships, parameters, and workflow integrations.
            </p>
          </div>
          <div className="glass-panel max-w-3xl mx-auto p-6 rounded-2xl border border-white/5 h-80 flex items-center justify-center relative overflow-hidden bg-[#050505]/40">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="absolute w-20 h-20 rounded-full border border-primary bg-primary/10 flex items-center justify-center font-mono text-[9px] uppercase tracking-wider text-white z-10 shadow-2xl">Sanktrix OS</div>
              <div className="absolute top-6 left-16 w-16 h-16 rounded-full border border-tertiary bg-tertiary/10 flex items-center justify-center font-mono text-[9px] uppercase text-white">Product</div>
              <div className="absolute bottom-6 right-16 w-16 h-16 rounded-full border border-secondary bg-secondary/10 flex items-center justify-center font-mono text-[9px] uppercase text-white">Finance</div>
              <div className="absolute top-6 right-20 w-16 h-16 rounded-full border border-primary bg-primary/10 flex items-center justify-center font-mono text-[9px] uppercase text-white">Marketing</div>
              <svg className="absolute inset-0 w-full h-full text-white/5" pointerEvents="none">
                <line x1="150" y1="80" x2="380" y2="160" stroke="currentColor" strokeWidth="1" />
                <line x1="380" y1="160" x2="600" y2="240" stroke="currentColor" strokeWidth="1" />
                <line x1="380" y1="160" x2="550" y2="80" stroke="currentColor" strokeWidth="1" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8 — LIVE INTELLIGENCE FEED */}
      <section className="py-16 bg-[#10131b]/20 border-t border-white/5">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h2 className="font-display text-2xl md:text-3xl text-white font-bold">Live Intelligence Telemetry</h2>
              <p className="text-xs text-on-surface-variant mt-1">Continuous live events streaming from active operations</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { time: "Just now", icon: "sync", txt: "ARR forecast model recalculated. Growth trend +14.2%" },
              { time: "2m ago", icon: "warning", txt: "CAC anomaly detected inside EU marketing channels. Mitigation triggered" },
              { time: "15m ago", icon: "check_circle", txt: "Wolfram parametric simulation completed successfully. Status: nominal" }
            ].map((feed, idx) => (
              <div key={idx} className="glass-panel p-5 rounded-xl border border-white/5 flex flex-col justify-between space-y-3 bg-[#050505]/40">
                <div className="flex justify-between items-center">
                  <span className="material-symbols-outlined text-primary text-lg">{feed.icon}</span>
                  <span className="text-[10px] text-on-surface-variant font-mono">{feed.time}</span>
                </div>
                <p className="text-xs text-on-surface leading-relaxed font-semibold">{feed.txt}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 9 — WHY WE ARE DIFFERENT */}
      <section className="py-24 border-t border-white/5">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl text-white font-bold">Why We Are Different</h2>
            <div className="h-1 w-16 bg-primary mb-4 mx-auto"></div>
            <p className="text-on-surface-variant text-sm max-w-2xl mx-auto mt-2">
               Sanktrix stands as a complete, autonomous computational operating system.
            </p>
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

      {/* SECTION 10 — ARCHITECTURE */}
      <section className="py-24 bg-[#10131b]/10 border-t border-white/5">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl text-white font-bold">Systems Architecture</h2>
            <div className="h-1 w-16 bg-primary mb-4 mx-auto"></div>
            <p className="text-on-surface-variant text-sm max-w-2xl mx-auto mt-2">
              Our technical flow pipelines, positioning Wolfram and AI Agents centrally.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 max-w-5xl mx-auto text-center font-mono">
            {[
              { id: "01", name: "Data Sources", desc: "Salesforce, Clickhouse, Kafka brokers" },
              { id: "02", name: "Workflows (n8n)", desc: "Trigger.dev pipeline orchestration" },
              { id: "03", name: "AI Core", desc: "LangGraph autonomous agents" },
              { id: "04", name: "Wolfram Engine", desc: "monte carlo & symbolic math" },
              { id: "05", name: "Executive Output", desc: "recommendations & dashboard" }
            ].map((node, idx) => (
              <div key={idx} className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col justify-between space-y-4 hover:border-primary/20 transition-all">
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
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl text-white font-bold">Enterprise Governance &amp; Security</h2>
            <div className="h-1 w-16 bg-primary mb-4 mx-auto"></div>
            <p className="text-on-surface-variant text-sm max-w-2xl mx-auto mt-2">
              Hardened protocols securing secret keys, access roles, uploads, and session rates.
            </p>
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

      {/* SECTION 12 — PRODUCT PREVIEW */}
      <section className="py-24 bg-[#10131b]/10 border-t border-white/5">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl text-white font-bold">Explore Sanktrix OS</h2>
            <div className="h-1 w-16 bg-primary mb-4 mx-auto"></div>
            <p className="text-on-surface-variant text-sm max-w-2xl mx-auto mt-2">
              Click through the slides below to review Sanktrix pages.
            </p>
          </div>
          <div className="glass-panel max-w-xl mx-auto p-6 rounded-2xl border border-white/5 flex flex-col justify-between h-56 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-[9px] text-primary uppercase font-bold tracking-widest">Interface View {carouselIdx + 1}/6</span>
                <h3 className="font-display text-lg text-white font-bold mt-1">{carouselItems[carouselIdx].title}</h3>
              </div>
              <span className="material-symbols-outlined text-primary text-2xl">{carouselItems[carouselIdx].icon}</span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">{carouselItems[carouselIdx].desc}</p>
            <div className="flex justify-between items-center pt-3 border-t border-white/5">
              <button
                onClick={() => setCarouselIdx(prev => (prev === 0 ? 5 : prev - 1))}
                className="text-[10px] font-bold uppercase tracking-wider text-primary hover:underline cursor-pointer"
              >
                Previous View
              </button>
              <button
                onClick={() => setCarouselIdx(prev => (prev === 5 ? 0 : prev + 1))}
                className="text-[10px] font-bold uppercase tracking-wider text-primary hover:underline cursor-pointer"
              >
                Next View
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 13 — FINAL CTA */}
      <section className="py-24 border-t border-white/5">
        <div className="container mx-auto px-6 md:px-12 max-w-5xl text-center">
          <div className="glass-panel p-12 rounded-3xl border border-primary/20 shadow-[0_0_50px_rgba(86,141,255,0.1)] flex flex-col items-center space-y-6 relative overflow-hidden bg-[#0A0F1E]/20">
            <div className="absolute top-0 right-0 w-44 h-44 rounded-full bg-primary/10 blur-3xl"></div>
            <h2 className="font-display text-4xl text-white font-bold tracking-tight">
              The Future of Enterprise Intelligence
            </h2>
            <p className="text-sm text-on-surface-variant max-w-lg leading-relaxed">
              While most AI systems generate answers, Sanktrix computes strategic intelligence. Get started today.
            </p>
            <div className="flex gap-4 flex-col sm:flex-row">
              <button
                onClick={() => setShowModal(true)}
                className="bg-primary hover:bg-[#c2d6ff] text-[#001945] px-10 py-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(176,198,255,0.3)] hover:scale-[1.03] cursor-pointer"
              >
                Launch Platform
              </button>
              <button
                onClick={() => router.push("/demo")}
                className="border border-white/10 hover:border-white/20 text-white px-10 py-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 bg-white/5 cursor-pointer"
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
