"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useSecurity } from "@/context/SecurityContext";

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
  const [runCount, setRunCount] = useState<number>(1);
  const [curvePath, setCurvePath] = useState<string>(
    "M 50,250 Q 150,50 250,250 T 450,250" // Baseline wave
  );
  const [simulatedPath, setSimulatedPath] = useState<string>(
    "M 50,250 Q 180,120 280,250 T 450,250"
  );

  const [riskMetrics, setRiskMetrics] = useState<RiskMetric[]>([
    { name: "Revenue Impact", baseline: "-0.5%", simulated: "-12.4%", status: "error", colorClass: "text-error" },
    { name: "CAC Variance", baseline: "+1.2%", simulated: "+8.1%", status: "warning", colorClass: "text-secondary" },
    { name: "Market Share", baseline: "+0.2%", simulated: "-1.2%", status: "nominal", colorClass: "text-on-surface-variant" },
  ]);

  const [monteCarlo, setMonteCarlo] = useState<MonteCarloRow[]>([
    { percentile: "90th (Optimistic)", baseline: "-$0.4M", simulated: "-$2.1M", prob: "10%", colorClass: "text-tertiary" },
    { percentile: "50th (Expected)", baseline: "-$1.2M", simulated: "-$5.4M", prob: "80%", colorClass: "text-on-surface" },
    { percentile: "10th (Pessimistic)", baseline: "-$3.8M", simulated: "-$11.2M", prob: "10%", colorClass: "text-error" },
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

      // Mutate results based on prompt keywords to feel alive
      const isChurn = prompt.toLowerCase().includes("churn");
      const isMarketing = prompt.toLowerCase().includes("market") || prompt.toLowerCase().includes("ad");

      if (isChurn) {
        setSimulatedPath("M 50,250 Q 220,180 320,250 T 450,250");
        setRiskMetrics([
          { name: "Revenue Impact", baseline: "-0.5%", simulated: "-14.8%", status: "error", colorClass: "text-error" },
          { name: "CAC Variance", baseline: "+1.2%", simulated: "+9.5%", status: "warning", colorClass: "text-secondary" },
          { name: "Market Share", baseline: "+0.2%", simulated: "-2.1%", status: "error", colorClass: "text-error" },
        ]);
        setMonteCarlo([
          { percentile: "90th (Optimistic)", baseline: "-$0.4M", simulated: "-$3.8M", prob: "10%", colorClass: "text-tertiary" },
          { percentile: "50th (Expected)", baseline: "-$1.2M", simulated: "-$7.2M", prob: "80%", colorClass: "text-on-surface" },
          { percentile: "10th (Pessimistic)", baseline: "-$3.8M", simulated: "-$15.6M", prob: "10%", colorClass: "text-error" },
        ]);
        setAiRecommendation("Initiate SDR Swarm retention callbacks. Reallocate budget from cold display to customer retention accounts.");
      } else if (isMarketing) {
        setSimulatedPath("M 50,250 Q 120,80 220,250 T 450,250");
        setRiskMetrics([
          { name: "Revenue Impact", baseline: "-0.5%", simulated: "+6.2%", status: "nominal", colorClass: "text-tertiary" },
          { name: "CAC Variance", baseline: "+1.2%", simulated: "-4.8%", status: "nominal", colorClass: "text-tertiary" },
          { name: "Market Share", baseline: "+0.2%", simulated: "+1.5%", status: "nominal", colorClass: "text-tertiary" },
        ]);
        setMonteCarlo([
          { percentile: "90th (Optimistic)", baseline: "-$0.4M", simulated: "+$1.8M", prob: "10%", colorClass: "text-tertiary" },
          { percentile: "50th (Expected)", baseline: "-$1.2M", simulated: "+$0.4M", prob: "80%", colorClass: "text-on-surface" },
          { percentile: "10th (Pessimistic)", baseline: "-$3.8M", simulated: "-$1.1M", prob: "10%", colorClass: "text-error" },
        ]);
        setAiRecommendation("Search ad reallocation is mathematically sound. Push budget commit rules to fabric event router.");
      } else {
        // Random drift
        setSimulatedPath(`M 50,250 Q ${120 + Math.random() * 80},${80 + Math.random() * 80} 250,250 T 450,250`);
        setRiskMetrics([
          { name: "Revenue Impact", baseline: "-0.5%", simulated: "-4.2%", status: "warning", colorClass: "text-secondary" },
          { name: "CAC Variance", baseline: "+1.2%", simulated: "+3.2%", status: "nominal", colorClass: "text-on-surface-variant" },
          { name: "Market Share", baseline: "+0.2%", simulated: "-0.5%", status: "nominal", colorClass: "text-on-surface-variant" },
        ]);
        setAiRecommendation("General parameters indicate normal operation variance. Run specific Wolfram optimization scenarios.");
      }

      addAuditLog("simulation.execute_complete", `Completed simulation run #${runCount + 1}`, "SUCCESS");
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="space-y-md">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md">
          <div>
            <h2 className="font-display text-headline-lg text-on-surface flex items-center gap-sm font-bold text-[24px]">
              Business Simulations
              <span className="w-2 h-2 bg-primary rounded-full pulse-indicator inline-block ml-xs"></span>
            </h2>
            <p className="text-xs text-on-surface-variant mt-xs">
              Real-time predictive modeling and scenario generation.
            </p>
          </div>
          <div className="flex gap-sm">
            <button
              onClick={() => alert("Simulation History: Model execution logs retrieved from Postgres storage.")}
              className="glass-panel text-on-surface font-semibold text-xs tracking-wider uppercase px-md py-sm rounded flex items-center gap-xs hover:bg-surface-container-highest transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">history</span>
              History
            </button>
            <button
              onClick={() => alert("Initializing fresh modeling preset workspace...")}
              className="bg-primary text-on-primary font-semibold text-xs tracking-wider uppercase px-md py-sm rounded flex items-center gap-xs hover:bg-primary-container transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              New Model
            </button>
          </div>
        </div>

        {/* Prompt Interface */}
        <div className="glass-panel-elevated rounded-xl p-md relative overflow-hidden">
          <div className="stream-pulse"></div>
          <label className="font-sans text-[10px] text-primary mb-xs block font-semibold uppercase tracking-wider">
            Simulation Prompt
          </label>
          <form onSubmit={handleExecute} className="flex flex-col md:flex-row gap-sm">
            <input
              className="flex-1 bg-surface-container-highest border border-outline-variant text-on-surface font-sans text-sm py-md px-md rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              type="text"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="e.g. What happens if churn rises next quarter?"
            />
            <button
              type="submit"
              disabled={isSimulating}
              className="bg-primary text-on-primary font-semibold text-xs tracking-wider uppercase px-lg py-md rounded-lg glow-primary flex items-center justify-center gap-xs hover:bg-primary-container transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSimulating ? (
                <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="material-symbols-outlined text-sm">play_arrow</span>
              )}
              {isSimulating ? "SIMULATING..." : "EXECUTE"}
            </button>
          </form>
          <div className="flex gap-sm mt-sm">
            <span className="bg-surface-container-highest text-on-surface-variant font-mono text-[11px] px-2 py-0.5 rounded">
              Model: Predictor-X7
            </span>
            <span className="bg-surface-container-highest text-on-surface-variant font-mono text-[11px] px-2 py-0.5 rounded">
              Confidence: 94.2%
            </span>
            <span className="bg-surface-container-highest text-on-surface-variant font-mono text-[11px] px-2 py-0.5 rounded">
              Parameters: 12.4B
            </span>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-md">
          {/* Main Graph Area (Span 8) */}
          <div className="lg:col-span-8 glass-panel rounded-xl flex flex-col h-[400px]">
            <div className="p-md border-b border-outline-variant flex justify-between items-center">
              <h3 className="font-sans text-xs text-on-surface font-semibold uppercase tracking-wider">
                Probability Distribution
              </h3>
              <div className="flex gap-sm font-mono text-[11px]">
                <span className="bg-primary/25 text-primary px-2 py-0.5 rounded">Baseline</span>
                <span className="bg-secondary/25 text-secondary px-2 py-0.5 rounded">Simulated</span>
              </div>
            </div>
            <div className="flex-grow relative bg-[#050505] rounded-b-xl overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-radial from-surface-container-highest/20 via-surface-dim/90 to-surface-dim pointer-events-none"></div>

              {/* Dynamic SVG Probability Curve */}
              <svg className="absolute inset-0 w-full h-full p-md" viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
                {/* Grid guidelines */}
                <line x1="50" y1="250" x2="450" y2="250" stroke="#424655" strokeWidth="1" strokeDasharray="2" />
                <line x1="50" y1="50" x2="450" y2="50" stroke="#424655" strokeWidth="1" strokeDasharray="2" />

                {/* Baseline path */}
                <path
                  d={curvePath}
                  fill="none"
                  stroke="#b0c6ff"
                  strokeWidth="3"
                  className="transition-all duration-1000"
                />

                {/* Simulated path */}
                <path
                  d={simulatedPath}
                  fill="none"
                  stroke="#ffb955"
                  strokeWidth="3"
                  strokeDasharray="4"
                  className="transition-all duration-1000"
                />
              </svg>

              {/* Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between p-md opacity-20 pointer-events-none">
                <div className="w-full h-px bg-outline-variant"></div>
                <div className="w-full h-px bg-outline-variant"></div>
                <div className="w-full h-px bg-outline-variant"></div>
                <div className="w-full h-px bg-outline-variant"></div>
              </div>
            </div>
          </div>

          {/* Risk Heatmap (Span 4) */}
          <div className="lg:col-span-4 glass-panel rounded-xl flex flex-col h-[400px]">
            <div className="p-md border-b border-outline-variant">
              <h3 className="font-sans text-xs text-on-surface font-semibold uppercase tracking-wider">Risk Matrix</h3>
            </div>
            <div className="flex-grow p-md flex flex-col justify-between overflow-y-auto">
              <div className="space-y-sm">
                {riskMetrics.map((m, idx) => (
                  <div
                    key={idx}
                    className="bg-surface-container border border-outline-variant/30 rounded p-sm flex items-center justify-between"
                  >
                    <span className="font-mono text-xs text-on-surface">{m.name}</span>
                    <div className="flex gap-md font-mono text-xs">
                      <span className="text-on-surface-variant opacity-60">Base: {m.baseline}</span>
                      <span className={`${m.colorClass} font-bold`}>{m.simulated}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-sm border-t border-outline-variant/50">
                <p className="font-sans text-[10px] text-on-surface-variant mb-xs font-semibold uppercase tracking-wider">
                  Critical Vectors
                </p>
                <div className="flex flex-wrap gap-xs">
                  <span className="bg-error/10 text-error border border-error/20 font-mono text-[10px] px-2 py-0.5 rounded font-bold">
                    Retention_Q3
                  </span>
                  <span className="bg-secondary/10 text-secondary border border-secondary/20 font-mono text-[10px] px-2 py-0.5 rounded font-bold">
                    Competitor_Pricing
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 4: Scenario tree & Monte carlo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-md">
          {/* Scenario Tree */}
          <div className="lg:col-span-6 glass-panel rounded-xl flex flex-col h-[300px]">
            <div className="p-md border-b border-outline-variant">
              <h3 className="font-sans text-xs text-on-surface font-semibold uppercase tracking-wider">
                Scenario Tree (Node Map)
              </h3>
            </div>
            <div className="flex-grow p-md bg-[#050505] rounded-b-xl flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-radial from-primary/10 via-transparent pointer-events-none"></div>

              {/* Node-based flowchart representation */}
              <div className="relative flex items-center gap-lg z-10 font-mono text-[10px]">
                <div className="bg-surface-container p-sm rounded border border-primary">
                  <span>Start Prompt</span>
                </div>
                <span className="text-outline">&rarr;</span>
                <div className="flex flex-col gap-sm">
                  <div className="bg-surface-container p-sm rounded border border-tertiary">
                    <span>Alpha: High Churn (-12% ARR)</span>
                  </div>
                  <div className="bg-surface-container p-sm rounded border border-outline-variant">
                    <span>Beta: Low Churn (-2% ARR)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Monte Carlo Results */}
          <div className="lg:col-span-6 flex flex-col gap-md h-[300px]">
            <div className="glass-panel rounded-xl flex-grow flex flex-col overflow-hidden">
              <div className="p-sm px-md border-b border-outline-variant flex justify-between items-center bg-surface-container/50">
                <h3 className="font-sans text-xs text-on-surface font-semibold uppercase tracking-wider">
                  Monte Carlo Simulations (n=10,000)
                </h3>
              </div>
              <div className="flex-grow overflow-y-auto p-xs">
                <table className="w-full text-left font-mono text-xs text-on-surface-variant">
                  <thead className="text-on-surface-variant sticky top-0 bg-surface-dim">
                    <tr className="border-b border-outline-variant/30 text-on-surface">
                      <th className="p-sm font-normal">Percentile</th>
                      <th className="p-sm font-normal text-right">Base Impact</th>
                      <th className="p-sm font-normal text-right">Simulated</th>
                      <th className="p-sm font-normal text-right">Probability</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    {monteCarlo.map((row, idx) => (
                      <tr key={idx} className="hover:bg-surface-container-highest/50 transition-colors">
                        <td className="p-sm font-bold">{row.percentile}</td>
                        <td className="p-sm text-right">{row.baseline}</td>
                        <td className={`p-sm text-right font-bold ${row.colorClass}`}>{row.simulated}</td>
                        <td className="p-sm text-right text-on-surface">{row.prob}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* AI Recommendation */}
            <div className="glass-panel-elevated rounded-xl p-md flex flex-col justify-between">
              <h3 className="font-sans text-xs text-primary mb-sm flex items-center gap-xs font-semibold uppercase tracking-wider">
                <span className="material-symbols-outlined text-[16px]">psychology</span>
                AI Recommendations
              </h3>
              <p className="font-sans text-xs text-on-surface mb-xs leading-relaxed">{aiRecommendation}</p>
              <button
                onClick={() => alert("Loading advanced strategic playbook...")}
                className="text-tertiary font-semibold uppercase text-[10px] hover:underline self-start cursor-pointer"
              >
                View Action Plan &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
