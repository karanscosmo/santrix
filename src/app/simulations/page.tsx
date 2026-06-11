"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useSecurity } from "@/lib/SecurityContext";

interface RiskMetric {
  name: string;
  baseline: string;
  simulated: string;
  status: "nominal" | "warning" | "error";
  colorClass: string;
}

interface MonteCarloRow {
  percentile: string;
  baseline: string;
  simulated: string;
  prob: string;
  colorClass: string;
}

export default function SimulationsPage() {
  const { addAuditLog, checkPermission, rateLimitCheck } = useSecurity();
  const [prompt, setPrompt] = useState<string>("What happens if churn rises next quarter?");
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // States that change based on simulation run
  const [runCount, setRunCount] = useState<number>(12482);
  const [curvePath, setCurvePath] = useState<string>(
    "M 50 250 C 150 250, 200 80, 250 80 C 300 80, 350 250, 450 250" // Baseline wave
  );
  const [simulatedPath, setSimulatedPath] = useState<string>(
    "M 50 250 C 120 250, 180 140, 280 140 C 330 140, 380 250, 450 250"
  );

  const [riskMetrics, setRiskMetrics] = useState<RiskMetric[]>([
    { name: "Revenue Impact", baseline: "-0.5%", simulated: "-12.4%", status: "error", colorClass: "text-red-400" },
    { name: "CAC Variance", baseline: "+1.2%", simulated: "+8.1%", status: "warning", colorClass: "text-amber-500" },
    { name: "Market Share", baseline: "+0.2%", simulated: "-1.2%", status: "nominal", colorClass: "text-gray-400" },
  ]);

  const [monteCarlo, setMonteCarlo] = useState<MonteCarloRow[]>([
    { percentile: "90th (Optimistic)", baseline: "-$0.4M", simulated: "-$2.1M", prob: "10%", colorClass: "text-[#4edea3]" },
    { percentile: "50th (Expected)", baseline: "-$1.2M", simulated: "-$5.4M", prob: "80%", colorClass: "text-white" },
    { percentile: "10th (Pessimistic)", baseline: "-$3.8M", simulated: "-$11.2M", prob: "10%", colorClass: "text-red-400" },
  ]);

  const [aiRecommendation, setAiRecommendation] = useState<string>(
    "Deploy retention offers to cohorts B and C to mitigate worst-case scenarios by 40%."
  );

  const handleExecute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkPermission("simulation:run")) {
      alert("Access Denied: Your current role does not have permission to execute simulations.");
      return;
    }
    if (!rateLimitCheck()) {
      alert("Rate limit reached. Please limit simulation execution to 10 requests per minute.");
      return;
    }

    setIsSimulating(true);
    addAuditLog("simulation.execute_start", `Running business simulation for prompt: "${prompt}"`, "SUCCESS");

    setTimeout(() => {
      setIsSimulating(false);
      setRunCount(prev => prev + 1);

      const isChurn = prompt.toLowerCase().includes("churn");
      const isMarketing = prompt.toLowerCase().includes("market") || prompt.toLowerCase().includes("ad");

      if (isChurn) {
        setSimulatedPath("M 50 250 C 130 250, 220 180, 310 180 C 360 180, 400 250, 450 250");
        setRiskMetrics([
          { name: "Revenue Impact", baseline: "-0.5%", simulated: "-14.8%", status: "error", colorClass: "text-red-400" },
          { name: "CAC Variance", baseline: "+1.2%", simulated: "+9.5%", status: "warning", colorClass: "text-amber-500" },
          { name: "Market Share", baseline: "+0.2%", simulated: "-2.1%", status: "error", colorClass: "text-red-400" },
        ]);
        setMonteCarlo([
          { percentile: "90th (Optimistic)", baseline: "-$0.4M", simulated: "-$3.8M", prob: "10%", colorClass: "text-[#4edea3]" },
          { percentile: "50th (Expected)", baseline: "-$1.2M", simulated: "-$7.2M", prob: "80%", colorClass: "text-white" },
          { percentile: "10th (Pessimistic)", baseline: "-$3.8M", simulated: "-$15.6M", prob: "10%", colorClass: "text-red-400" },
        ]);
        setAiRecommendation("Initiate SDR Swarm retention callbacks. Reallocate budget from cold display to customer retention accounts.");
      } else if (isMarketing) {
        setSimulatedPath("M 50 250 C 100 250, 160 90, 220 90 C 280 90, 360 250, 450 250");
        setRiskMetrics([
          { name: "Revenue Impact", baseline: "-0.5%", simulated: "+6.2%", status: "nominal", colorClass: "text-[#4edea3]" },
          { name: "CAC Variance", baseline: "+1.2%", simulated: "-4.8%", status: "nominal", colorClass: "text-[#4edea3]" },
          { name: "Market Share", baseline: "+0.2%", simulated: "+1.5%", status: "nominal", colorClass: "text-[#4edea3]" },
        ]);
        setMonteCarlo([
          { percentile: "90th (Optimistic)", baseline: "-$0.4M", simulated: "+$1.8M", prob: "10%", colorClass: "text-[#4edea3]" },
          { percentile: "50th (Expected)", baseline: "-$1.2M", simulated: "+$0.4M", prob: "80%", colorClass: "text-white" },
          { percentile: "10th (Pessimistic)", baseline: "-$3.8M", simulated: "-$1.1M", prob: "10%", colorClass: "text-red-400" },
        ]);
        setAiRecommendation("Search ad reallocation is mathematically sound. Push budget commit rules to fabric event router.");
      } else {
        setSimulatedPath(`M 50 250 C 100 250, ${150 + Math.random() * 80} ${100 + Math.random() * 80}, 250 150 C 300 150, 380 250, 450 250`);
        setRiskMetrics([
          { name: "Revenue Impact", baseline: "-0.5%", simulated: "-4.2%", status: "warning", colorClass: "text-amber-500" },
          { name: "CAC Variance", baseline: "+1.2%", simulated: "+3.2%", status: "nominal", colorClass: "text-gray-400" },
          { name: "Market Share", baseline: "+0.2%", simulated: "-0.5%", status: "nominal", colorClass: "text-gray-400" },
        ]);
        setAiRecommendation("General parameters indicate normal operation variance. Run specific Wolfram optimization scenarios.");
      }

      addAuditLog("simulation.execute_complete", `Completed simulation run #${runCount + 1}`, "SUCCESS");
    }, 1200);
  };

  return (
    <DashboardLayout>
      {/* 1. Page Header matching visual hierarchy guidelines */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.04] pb-5">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white">
            Executive Scenario Lab
          </h1>
          <p className="text-xs text-gray-400 font-mono mt-1 uppercase tracking-wider">
            Simulate Monte Carlo cash yield distributions and forecast ARR outcomes.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Indicator */}
          <div className="flex items-center gap-2 bg-[#0d0f14] border border-white/[0.06] rounded-[10px] px-3.5 py-1.5 text-[10px] font-mono font-bold text-gray-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8ab4f8] animate-pulse"></span>
            Simulations Run: {runCount} Runs
          </div>
          <button
            onClick={() => alert("Simulation History logs retrieved successfully.")}
            className="btn-action btn-secondary text-[10px] py-2"
          >
            History Logs
          </button>
        </div>
      </header>

      {/* 2. Interactive Prompt Panel */}
      <section className="panel-layer p-5 relative overflow-hidden">
        <label className="font-mono text-[9px] text-[#8ab4f8] mb-2 block font-bold uppercase tracking-widest">
          Monte Carlo Simulation Prompt
        </label>
        <form onSubmit={handleExecute} className="flex flex-col md:flex-row gap-3">
          <input
            className="flex-1 bg-[#050505]/60 border border-white/[0.06] text-white font-sans text-xs py-3 px-4 rounded-[12px] focus:outline-none focus:border-[#8ab4f8]"
            type="text"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="What happens if churn rises next quarter?"
          />
          <button
            type="submit"
            disabled={isSimulating}
            className="btn-action btn-primary py-3 px-6 text-[10px]"
          >
            {isSimulating ? (
              <div className="w-4.5 h-4.5 border-2 border-[#001945] border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span className="material-symbols-outlined text-xs">play_arrow</span>
            )}
            {isSimulating ? "COMPUTING..." : "EXECUTE SCENARIO"}
          </button>
        </form>
        
        {/* Preset quick chips */}
        <div className="flex gap-2 mt-4 font-mono text-[8px] text-gray-500">
          <span className="bg-[#050505]/40 border border-white/[0.03] px-2.5 py-1 rounded-[6px]">
            Model: Predictor-X7
          </span>
          <span className="bg-[#050505]/40 border border-white/[0.03] px-2.5 py-1 rounded-[6px]">
            Confidence Interval: 95.8%
          </span>
          <span className="bg-[#050505]/40 border border-white/[0.03] px-2.5 py-1 rounded-[6px]">
            Engine: Wolfram solver v4
          </span>
        </div>
      </section>

      {/* 3. Overlapping distribution curves & Risk matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Chart (Col 8) */}
        <section className="lg:col-span-8 panel-layer p-5 flex flex-col h-[400px]">
          <div className="flex justify-between items-center border-b border-white/[0.04] pb-3 mb-4">
            <h3 className="font-display text-sm font-bold text-white tracking-wide">
              Probability Bell Distribution
            </h3>
            <div className="flex gap-2 font-mono text-[9px]">
              <span className="bg-[#8ab4f8]/10 border border-[#8ab4f8]/30 text-[#8ab4f8] px-2.5 py-0.5 rounded font-bold">
                Baseline Normal
              </span>
              <span className="bg-amber-500/10 border border-amber-500/30 text-amber-500 px-2.5 py-0.5 rounded font-bold">
                Simulated Drift
              </span>
            </div>
          </div>

          <div className="flex-grow relative bg-[#050505]/50 rounded-xl border border-white/[0.03] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>

            {/* SVG Overlapping distribution Curves */}
            <svg className="absolute inset-0 w-full h-full p-6" viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="baseCurveGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8ab4f8" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#8ab4f8" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="simCurveGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Guidelines */}
              <line x1="50" y1="250" x2="450" y2="250" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="50" y1="50" x2="450" y2="50" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

              {/* Area path base */}
              <path d={`${curvePath} L 450 250 L 50 250 Z`} fill="url(#baseCurveGrad)" className="transition-all duration-700" />
              {/* Base line curve */}
              <path d={curvePath} fill="none" stroke="#8ab4f8" strokeWidth="2.5" className="transition-all duration-700" />

              {/* Area path sim */}
              <path d={`${simulatedPath} L 450 250 L 50 250 Z`} fill="url(#simCurveGrad)" className="transition-all duration-700" />
              {/* Sim line curve */}
              <path d={simulatedPath} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="3" className="transition-all duration-700" />
            </svg>
          </div>
        </section>

        {/* Risk Matrix (Col 4) */}
        <section className="lg:col-span-4 panel-layer p-5 flex flex-col h-[400px]">
          <div className="border-b border-white/[0.04] pb-3 mb-4">
            <h3 className="font-display text-sm font-bold text-white tracking-wide">Simulation Risk Metrics</h3>
          </div>
          <div className="flex-1 flex flex-col justify-between overflow-y-auto scrollbar-thin">
            <div className="space-y-2">
              {riskMetrics.map((m, idx) => (
                <div
                  key={idx}
                  className="bg-[#050505]/40 border border-white/[0.03] rounded-[12px] p-3 flex items-center justify-between font-mono text-[10px]"
                >
                  <span className="text-gray-400 font-sans">{m.name}</span>
                  <div className="flex gap-3">
                    <span className="text-gray-600">Base: {m.baseline}</span>
                    <span className={`${m.colorClass} font-bold`}>{m.simulated}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-white/[0.04] mt-4 space-y-1.5">
              <span className="font-mono text-[8px] text-gray-500 uppercase tracking-widest block">Critical Swarm Parameters</span>
              <div className="flex flex-wrap gap-1">
                <span className="bg-red-400/10 text-red-400 border border-red-400/20 font-mono text-[8px] px-2 py-0.5 rounded font-bold">
                  Retention_Index_Q3
                </span>
                <span className="bg-[#8ab4f8]/10 text-[#8ab4f8] border border-[#8ab4f8]/20 font-mono text-[8px] px-2 py-0.5 rounded font-bold">
                  CAC_Volatility_Shift
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 4. Scenario map flowchart & Monte Carlo outcomes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Scenario Tree node mapping (Col 6) */}
        <section className="lg:col-span-6 card-layer p-5 flex flex-col h-[300px]">
          <div className="border-b border-white/[0.04] pb-3 mb-4">
            <h3 className="font-display text-sm font-bold text-white tracking-wide">
              Scenario Path Mapping
            </h3>
          </div>
          <div className="flex-grow bg-[#050505]/40 border border-white/[0.03] rounded-xl flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-25"></div>

            {/* Tree nodes flow chart */}
            <div className="relative flex items-center gap-6 z-10 font-mono text-[9px] text-gray-400">
              <div className="bg-[#0d0e12] p-2.5 rounded-[10px] border border-[#8ab4f8]/30 text-white">
                <span>Start Simulation</span>
              </div>
              <span className="text-gray-600">&rarr;</span>
              <div className="flex flex-col gap-2">
                <div className="bg-[#0d0e12] p-2.5 rounded-[10px] border border-amber-500/30 text-white">
                  <span>Scenario A: High Churn (-12% ARR)</span>
                </div>
                <div className="bg-[#0d0e12] p-2.5 rounded-[10px] border border-white/[0.04]">
                  <span>Scenario B: Low Churn (-2% ARR)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Monte Carlo data table + Recommendations (Col 6) */}
        <div className="lg:col-span-6 flex flex-col gap-4 h-[300px]">
          <div className="glass-panel rounded-xl flex-grow flex flex-col overflow-hidden border border-white/[0.04]">
            <div className="p-3 border-b border-white/[0.04] bg-[#07080c]/50">
              <h3 className="font-mono text-[9px] text-gray-500 uppercase tracking-widest font-bold">
                Monte Carlo Simulation Percentiles (n=10,000)
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
              <table className="w-full text-left font-mono text-[10px] text-gray-400">
                <thead>
                  <tr className="border-b border-white/[0.04] text-gray-500 text-[9px]">
                    <th className="p-2 font-normal">PERCENTILE</th>
                    <th className="p-2 font-normal text-right">BASE IMPACT</th>
                    <th className="p-2 font-normal text-right">SIMULATED</th>
                    <th className="p-2 font-normal text-right">PROBABILITY</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.02]">
                  {monteCarlo.map((row, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.01] transition-colors">
                      <td className="p-2 font-bold text-white">{row.percentile}</td>
                      <td className="p-2 text-right">{row.baseline}</td>
                      <td className={`p-2 text-right font-bold ${row.colorClass}`}>{row.simulated}</td>
                      <td className="p-2 text-right text-white font-semibold">{row.prob}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Recommendation Insight Panel */}
          <div className="card-layer p-4 flex flex-col justify-between bg-gradient-to-r from-amber-500/5 to-transparent">
            <h3 className="font-mono text-[9px] text-amber-500 flex items-center gap-1 font-bold uppercase tracking-widest">
              <span className="material-symbols-outlined text-[14px]">psychology</span>
              AI Decision Recommendation
            </h3>
            <p className="font-sans text-[11px] text-gray-300 mt-2 leading-relaxed">{aiRecommendation}</p>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
