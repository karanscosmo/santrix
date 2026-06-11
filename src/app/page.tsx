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
  
  // Real-time states for the Interactive Hero Visualization
  const [activeAgentsCount, setActiveAgentsCount] = useState(12);
  const [liveTelemetry, setLiveTelemetry] = useState<string[]>([
    "System: Boot sequence complete. Wolfram connection open.",
    "Agent SDR-01: Scanning sector databases...",
    "Wolfram Kernel: Executed ARR Monte Carlo simulation.",
  ]);
  const [sparklineData, setSparklineData] = useState<number[]>([30, 45, 38, 52, 60, 55, 78, 85, 92]);

  // Handle scroll reveals and initial fade-ins
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());

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
        next.add("hero-visual");
        return next;
      });
    }, 100);

    // Simulated real-time updates for Hero visual cockpit
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

    return () => {
      clearTimeout(timer);
      clearInterval(telemetryInterval);
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
      {/* 1. Global Header */}
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
          <a href="#platform" className="text-on-surface-variant hover:text-primary transition-colors text-[10px] font-bold uppercase tracking-widest">Modules</a>
          <a href="#architecture" className="text-on-surface-variant hover:text-primary transition-colors text-[10px] font-bold uppercase tracking-widest">Architecture</a>
          <a href="#security" className="text-on-surface-variant hover:text-primary transition-colors text-[10px] font-bold uppercase tracking-widest">Security</a>
        </nav>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary hover:bg-[#c2d6ff] text-[#001945] px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-[0_0_15px_rgba(176,198,255,0.2)] hover:scale-[1.02] cursor-pointer"
        >
          Login
        </button>
      </header>

      {/* 2. Hero Section (Split-Screen layout) */}
      <section className="relative w-full min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
        {/* Interactive WebGL Backdrop */}
        <div className="absolute inset-0 w-full h-full z-0 opacity-40 mix-blend-screen">
          <WebGLBackground />
        </div>

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-[#050505]/60 to-[#050505]"></div>

        <div className="relative z-10 container mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-7xl">
          {/* Left Side: Title, Desc, CTAs */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            <div
              className={`inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-6 transition-all duration-1000 ${
                isVisible("hero-badge") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              id="hero-badge"
            >
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_#b0c6ff]"></div>
              <span className="font-mono text-[9px] uppercase tracking-widest text-primary font-bold">System Status: Optimal</span>
            </div>

            <h1
              className={`font-display text-5xl md:text-6xl lg:text-7xl leading-tight font-extrabold mb-6 transition-all duration-1000 delay-100 ${
                isVisible("hero-title") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <span className="bg-gradient-to-r from-white via-primary to-primary-fixed-dim bg-clip-text text-transparent">
                SANKTRIX
              </span>
              <span className="block text-xl md:text-2xl font-bold font-sans text-on-surface-variant mt-2 tracking-wide">
                Autonomous Computational Intelligence Platform
              </span>
            </h1>

            <p
              className={`text-sm md:text-base text-on-surface-variant max-w-lg mb-10 leading-relaxed transition-all duration-1000 delay-200 ${
                isVisible("hero-desc") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              Transform enterprise data into autonomous strategic intelligence using AI agents, Wolfram-powered computation, and real-time workflow automation.
            </p>

            <div
              className={`flex flex-col sm:flex-row gap-4 w-full sm:w-auto transition-all duration-1000 delay-300 ${
                isVisible("hero-buttons") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <button
                onClick={() => setShowModal(true)}
                className="bg-primary hover:bg-[#c2d6ff] text-[#001945] px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 glow-active flex items-center justify-center gap-2 hover:scale-[1.03] cursor-pointer"
              >
                Access Platform
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

          {/* Right Side: Interactive Computational Visualization Dashboard */}
          <div
            className={`lg:col-span-6 transition-all duration-1000 delay-400 ${
              isVisible("hero-visual") ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
            id="hero-visual"
          >
            <div className="glass-panel w-full p-6 rounded-2xl border border-primary/20 relative shadow-[0_0_50px_rgba(86,141,255,0.1)] flex flex-col space-y-4">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-sweep"></div>
              
              {/* Header section of visual */}
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping"></span>
                  <span className="font-mono text-[10px] tracking-wider text-primary uppercase font-bold">Intelligence Cockpit</span>
                </div>
                <span className="font-mono text-[9px] text-on-surface-variant">NODE: HOST_OS_9</span>
              </div>

              {/* Grid block inside cockpit */}
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

              {/* Sparkline visualization */}
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

              {/* Active logging feed */}
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

      {/* 3. Live Intelligence Feed Section */}
      <section className="py-16 bg-[#10131b]/20 border-t border-white/5">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h2 className="font-display text-2xl md:text-3xl text-white font-bold">Realtime Intelligence Fabric</h2>
              <p className="text-xs text-on-surface-variant mt-1">Continuous global telemetry stream syncing events</p>
            </div>
            <div className="flex items-center gap-2 bg-[#ffb955]/10 border border-[#ffb955]/30 text-[#ffb955] px-3.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffb955] animate-ping"></span> Live Market Sync
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { time: "Just now", type: "MACRO_EVENT", title: "Federal Interest Rate Shift", desc: "Wolfram Engine evaluated 0.25% variance impact on cash assets." },
              { time: "2m ago", type: "AGENT_LOG", title: "Competitor Price Change", desc: "Lead agent tracked 8% price cuts in competitive platform matrix." },
              { time: "15m ago", type: "COMPUTE_SUCCESS", title: "Monte Carlo Re-optimization", desc: "Reallocated operational spend to maximize runway longevity." }
            ].map((feed, idx) => (
              <div key={idx} className="glass-panel p-5 rounded-xl border border-white/5 flex flex-col justify-between space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[9px] text-primary uppercase font-bold tracking-wider">{feed.type}</span>
                  <span className="text-[10px] text-on-surface-variant">{feed.time}</span>
                </div>
                <h3 className="font-display text-sm text-white font-bold">{feed.title}</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">{feed.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. AI Agent Ecosystem Section */}
      <section className="py-24 border-t border-white/5" id="platform">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl text-white font-bold">AI Agent Workforce</h2>
            <p className="text-on-surface-variant text-sm max-w-2xl mx-auto mt-2">
              Deploy autonomous swarms coordination routines concurrently to execute complex operations.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { role: "SDR Swarm Coordinator", status: "Active", tasks: "Lead generation, CRM syncing", health: "98%" },
              { role: "Financial Optimizer", status: "Running", tasks: "Cash optimization, burn tracking", health: "100%" },
              { role: "Risk Auditor", status: "Idle", tasks: "Telemetry evaluation, compliance", health: "95%" },
              { role: "Executive Assistant", status: "Active", tasks: "Document parsing, brief compiling", health: "99%" },
            ].map((agent, idx) => (
              <div key={idx} className="glass-panel p-5 rounded-2xl flex flex-col justify-between space-y-4 hover:border-primary/20 transition-all">
                <div className="flex justify-between items-center">
                  <span className="material-symbols-outlined text-primary text-2xl">support_agent</span>
                  <span className="font-mono text-[9px] text-[#4edea3] bg-[#4edea3]/10 px-2.5 py-0.5 rounded-full uppercase font-bold tracking-wider">{agent.status}</span>
                </div>
                <div>
                  <h3 className="font-display text-sm text-white font-bold">{agent.role}</h3>
                  <p className="text-[11px] text-on-surface-variant mt-1">Tasks: {agent.tasks}</p>
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono text-on-surface-variant pt-2 border-t border-white/5">
                  <span>Reliability Node</span>
                  <span className="text-white font-bold">{agent.health}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Wolfram Computational Engine Section */}
      <section className="py-24 bg-[#10131b]/10 border-t border-white/5">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-full text-[10px] font-mono uppercase font-bold">
                Symbolic Mathematics
              </div>
              <h2 className="font-display text-3xl md:text-4xl text-white font-bold leading-tight">
                Wolfram Computational Intelligence
              </h2>
              <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
                Connect your operations to a deep computational engine. Sanktrix runs parametric modeling, Monte Carlo confidence intervals, and symbolic equation solving using host Wolfram Kernels.
              </p>
              <div className="space-y-3 pt-2">
                {[
                  "16 Dedicated Multi-Core Compute Kernels active.",
                  "Real-time probability bands computed in under 40ms.",
                  "Zero-overhead symbolic integration algorithms."
                ].map((txt, idx) => (
                  <div key={idx} className="flex gap-2 items-center text-xs text-on-surface font-semibold">
                    <span className="material-symbols-outlined text-[#4edea3] text-sm">check_circle</span>
                    {txt}
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-7">
              <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden flex flex-col space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="font-mono text-[10px] text-primary uppercase font-bold">Live Computational Node</span>
                  <span className="text-[10px] text-on-surface-variant font-mono">POWERED BY WOLFRAM</span>
                </div>
                {/* SVG Curve */}
                <div className="h-44 bg-[#050505]/40 border border-white/5 rounded-xl flex items-center justify-center p-4 relative overflow-hidden">
                  <svg className="w-full h-full text-primary" viewBox="0 0 500 200" fill="none">
                    <path d="M 0 160 Q 120 160, 200 60 T 400 160 T 500 160" stroke="#b0c6ff" strokeWidth="2" fill="none" />
                    <path d="M 0 160 Q 120 160, 200 60 T 400 160 T 500 160 L 500 200 L 0 200 Z" fill="url(#grad)" opacity="0.1" />
                    <defs>
                      <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#b0c6ff" />
                        <stop offset="100%" stopColor="transparent" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute top-4 right-4 bg-[#050505]/60 border border-white/10 px-3 py-1.5 rounded font-mono text-[9px] text-[#4edea3]">
                    Confidence Band: 94.2%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Business Simulations Section */}
      <section className="py-24 border-t border-white/5">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl text-center">
          <div className="mb-12">
            <h2 className="font-display text-3xl md:text-4xl text-white font-bold">Risk &amp; Runway Simulations</h2>
            <p className="text-on-surface-variant text-sm max-w-xl mx-auto mt-2">
              Stress-test company sustainability variables inside simulated scenarios powered by Wolfram evaluation curves.
            </p>
          </div>
          <div className="glass-panel max-w-3xl mx-auto p-6 rounded-2xl border border-white/5 flex flex-col space-y-6 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs text-on-surface-variant block font-bold uppercase tracking-wider">Simulated Churn Delta</label>
                <input type="range" min="0" max="30" defaultValue="15" className="w-full accent-primary bg-[#050505]/60 h-1.5 rounded-lg" />
                <div className="flex justify-between text-[10px] font-mono text-on-surface-variant">
                  <span>0% Churn</span>
                  <span>15% Delta</span>
                  <span>30% Churn</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-on-surface-variant block font-bold uppercase tracking-wider">Simulated Burn Delta</label>
                <input type="range" min="50" max="250" defaultValue="120" className="w-full accent-primary bg-[#050505]/60 h-1.5 rounded-lg" />
                <div className="flex justify-between text-[10px] font-mono text-on-surface-variant">
                  <span>$50K/mo</span>
                  <span>$120K/mo</span>
                  <span>$250K/mo</span>
                </div>
              </div>
            </div>
            <div className="p-4 bg-[#050505]/40 border border-white/5 rounded-xl flex items-center justify-between">
              <span className="text-xs font-mono text-on-surface-variant">Formula: f(c,b) = RunwayEstimation[WolframKernel]</span>
              <span className="font-mono text-xs text-[#4edea3] font-bold">Estimated Runway: 16.4 Months</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Enterprise Architecture Section */}
      <section className="py-24 bg-[#10131b]/20 border-t border-white/5" id="architecture">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl text-white font-bold">Platform Architecture</h2>
            <p className="text-on-surface-variant text-sm max-w-2xl mx-auto mt-2">
              Our deterministic pipeline converting high-throughput events into enterprise-ready strategic outcomes.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {[
              { step: "01", name: "Data Ingestion", desc: "Aggregate streams from logs, APIs, databases, and message brokers." },
              { step: "02", name: "AI Parsing", desc: "Specialized agent workflows synthesize content and extract key telemetry metrics." },
              { step: "03", name: "Wolfram Compute", desc: "Perform deep evaluations, optimizations, and confidence intervals." },
              { step: "04", name: "Dashboard alpha", desc: "Deliver actionable briefings, summaries, and automated trade outputs." },
            ].map((arch, idx) => (
              <div key={idx} className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between space-y-4 hover:border-primary/20 transition-all">
                <span className="font-mono text-3xl text-primary/30 font-bold">{arch.step}</span>
                <div>
                  <h3 className="font-display text-sm text-white font-bold">{arch.name}</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed mt-1">{arch.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Executive Copilot Section */}
      <section className="py-24 border-t border-white/5">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4 bg-[#050505]/40">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="font-mono text-[10px] text-primary uppercase font-bold">Interactive Briefing Console</span>
                  <span className="text-[10px] text-on-surface-variant font-mono">STATUS: OPTIMIZED</span>
                </div>
                <div className="space-y-3">
                  <div className="bg-[#10131b]/60 p-3 rounded-lg border border-white/5">
                    <p className="text-[10px] font-mono text-primary uppercase font-bold">User query</p>
                    <p className="text-xs text-white mt-1">&quot;What happens to our Q3 runway projection if marketing CAC surges 20%?&quot;</p>
                  </div>
                  <div className="bg-[#10131b]/60 p-3 rounded-lg border border-primary/20 shadow-[0_0_15px_rgba(86,141,255,0.05)]">
                    <p className="text-[10px] font-mono text-tertiary uppercase font-bold">Copilot synthesis</p>
                    <p className="text-xs text-on-surface-variant leading-relaxed mt-1">
                      Based on Wolfram model RunwayCAC[0.20]: Q3 Runway is expected to drop from 18.2 to 15.6 months. Recommend triggering automated operational campaign budget limits inside Workflows to offset CAC surge.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 bg-[#ffb955]/10 border border-[#ffb955]/20 text-[#ffb955] px-3 py-1 rounded-full text-[10px] font-mono uppercase font-bold">
                Decision Reasoning
              </div>
              <h2 className="font-display text-3xl md:text-4xl text-white font-bold leading-tight">
                Executive Assistant Copilot
              </h2>
              <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
                A conversational portal designed for instant strategic response. Get instant reports, run mathematical optimizations, and invoke workflow rules directly from text directives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Knowledge Graph Section */}
      <section className="py-24 bg-[#10131b]/10 border-t border-white/5">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl text-center">
          <div className="mb-12">
            <h2 className="font-display text-3xl md:text-4xl text-white font-bold">Enterprise Relationship Graph</h2>
            <p className="text-on-surface-variant text-sm max-w-xl mx-auto mt-2">
              Trace dependency networks mapping data domains, agents, workflows, and computations.
            </p>
          </div>
          <div className="glass-panel max-w-2xl mx-auto p-6 rounded-2xl border border-white/5 h-64 flex items-center justify-center relative overflow-hidden bg-[#050505]/40">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
            {/* Visual graph nodes mock */}
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="absolute w-20 h-20 rounded-full border border-primary bg-primary/10 flex items-center justify-center font-mono text-[9px] uppercase tracking-wider text-white">Sanktrix OS</div>
              <div className="absolute top-4 left-12 w-16 h-16 rounded-full border border-tertiary bg-tertiary/10 flex items-center justify-center font-mono text-[9px] uppercase text-white">Wolfram</div>
              <div className="absolute bottom-4 right-12 w-16 h-16 rounded-full border border-secondary bg-secondary/10 flex items-center justify-center font-mono text-[9px] uppercase text-white">Agents</div>
              {/* Connection lines */}
              <svg className="absolute inset-0 w-full h-full text-white/10" pointerEvents="none">
                <line x1="120" y1="60" x2="330" y2="100" stroke="currentColor" strokeWidth="1" />
                <line x1="330" y1="100" x2="520" y2="180" stroke="currentColor" strokeWidth="1" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Workflow Automation Section */}
      <section className="py-24 border-t border-white/5">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-full text-[10px] font-mono uppercase font-bold">
                Automated Orchestration
              </div>
              <h2 className="font-display text-3xl md:text-4xl text-white font-bold leading-tight">
                Robotic Workflow Automation
              </h2>
              <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
                Connect your business logic into deterministic, triggerable workflows. Integrate Slack, Salesforce, Jira, and message fabrics inside active pipelines.
              </p>
            </div>
            <div className="lg:col-span-7">
              <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-3 bg-[#050505]/40 font-mono text-[11px]">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-primary font-bold">Pipeline: CAC_EXCESS_TRIGGER</span>
                  <span className="text-tertiary">Active</span>
                </div>
                <div className="space-y-2 text-on-surface-variant">
                  <div className="flex justify-between p-2 bg-white/5 rounded border border-white/5">
                    <span>Trigger: CAC_Anomaly_Event</span>
                    <span className="text-white font-bold">FIRED</span>
                  </div>
                  <div className="flex justify-between p-2 bg-white/5 rounded border border-white/5">
                    <span>Action: Query Wolfram CAC_Mitigation_Matrix</span>
                    <span className="text-white font-bold">COMPLETED</span>
                  </div>
                  <div className="flex justify-between p-2 bg-white/5 rounded border border-white/5">
                    <span>Action: Reallocate budget via Slack Dispatch</span>
                    <span className="text-white font-bold">DISPATCHED</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. Security & Governance Section */}
      <section className="py-24 bg-[#10131b]/20 border-t border-white/5" id="security">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl text-white font-bold">Enterprise Security &amp; Compliance</h2>
            <p className="text-on-surface-variant text-sm max-w-2xl mx-auto mt-2">
              Hardened governance protocols protecting system integrity, secret tokens, and user actions.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: "security", title: "Secret Isolation", desc: "All system tokens and API variables are cryptographically isolated and hosted securely." },
              { icon: "verified_user", title: "RBAC Gating", desc: "Complete role validation (Admin, Executive, Analyst, Viewer) enforcing strict scope limits." },
              { icon: "history", title: "Immutable Audit Logs", desc: "Every user and agent action is recorded instantly into central telemetry databases." },
            ].map((sec, idx) => (
              <div key={idx} className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col space-y-3">
                <span className="material-symbols-outlined text-primary text-3xl">{sec.icon}</span>
                <h3 className="font-display text-base text-white font-bold">{sec.title}</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">{sec.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. Product Preview Card & CTA Section */}
      <section className="py-24 border-t border-white/5">
        <div className="container mx-auto px-6 md:px-12 max-w-5xl text-center">
          <div className="glass-panel p-12 rounded-3xl border border-primary/20 shadow-[0_0_50px_rgba(86,141,255,0.1)] flex flex-col items-center space-y-6 relative overflow-hidden bg-[#0A0F1E]/20">
            <div className="absolute top-0 right-0 w-44 h-44 rounded-full bg-primary/10 blur-3xl"></div>
            <h2 className="font-display text-4xl text-white font-bold tracking-tight">
              Ready to Orchestrate Your Intelligence?
            </h2>
            <p className="text-sm text-on-surface-variant max-w-lg leading-relaxed">
              Unlock strategic advantage with the next-generation autonomous computational intelligence platform built for absolute decision-making dominance.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-primary hover:bg-[#c2d6ff] text-[#001945] px-10 py-4 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(176,198,255,0.3)] hover:scale-[1.03] cursor-pointer"
            >
              Access Command Center
            </button>
          </div>
        </div>
      </section>

      {/* Login Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-[100] bg-[#050505]/80 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in">
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
