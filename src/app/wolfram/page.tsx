"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useSecurity } from "@/context/SecurityContext";

interface NotebookCell {
  id: string;
  input: string;
  output: string;
  time: string;
}

export default function WolframCenter() {
  const { addAuditLog, checkPermission, rateLimitCheck, sanitizeInput } = useSecurity();

  // Scenario Builder state variables
  const [churn, setChurn] = useState<number>(20);
  const [hiring, setHiring] = useState<number>(10);
  const [marketing, setMarketing] = useState<number>(75);

  // Derived statistics using custom mock equations
  const expectedRunway = Math.max(3.0, Number((24.5 - (churn * 0.45) - (hiring * 0.3) + (marketing * 0.05)).toFixed(1)));
  const stdDeviation = Number((1.1 + (churn * 0.02) + (hiring * 0.01)).toFixed(2));

  // Notebook cell history state
  const [notebookCells, setNotebookCells] = useState<NotebookCell[]>([
    {
      id: "c1",
      input: "Integrate[x^2 * Cos[x], x]",
      output: "2 x Cos[x] + (-2 + x^2) Sin[x]",
      time: "10:14:02",
    },
    {
      id: "c2",
      input: "Solve[RunwayFactor[churn] == 0, churn]",
      output: "{{churn -> 0.354}, {churn -> 1.84}}",
      time: "10:15:30",
    },
  ]);
  const [cellInput, setCellInput] = useState("ForecastPlot[ARR, 12]");

  // Audit Logging for model runs
  const runParametricSimulation = () => {
    if (!checkPermission("simulation:run")) {
      alert("Unauthorized action. Executive or Admin credentials required.");
      return;
    }
    if (!rateLimitCheck()) {
      alert("Rate limit exceeded. Try again in a minute.");
      return;
    }
    addAuditLog(
      "wolfram.simulate",
      `Ran scenario: Churn=${churn}%, Hiring=${hiring} headcount/mo, MarketingFactor=${(marketing / 100).toFixed(2)}. Resulting Runway=${expectedRunway} Months.`,
      "SUCCESS"
    );
  };

  // Evaluate notebook input
  const evaluateCell = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!checkPermission("model:run")) {
      alert("Access Denied: Analyst role or higher required for computation execution.");
      return;
    }
    if (!cellInput.trim()) return;

    const sanitized = sanitizeInput(cellInput);
    let output = `Out[${notebookCells.length + 1}]= [GraphObject // Rendered_Result]`;

    // Add smart simulated evaluation based on input
    const cleanInput = sanitized.toLowerCase().trim();
    if (cleanInput.includes("integrate")) {
      output = `Out[${notebookCells.length + 1}]= (1/3) * x^3 + C`;
    } else if (cleanInput.includes("solve")) {
      output = `Out[${notebookCells.length + 1}]= {{x -> -2}, {x -> 2}}`;
    } else if (cleanInput.includes("forecastplot")) {
      output = `Out[${notebookCells.length + 1}]= [PlotObject: ARR_Forecast_12_Months_Probability_Bands]`;
    } else if (cleanInput.includes("hiring")) {
      output = `Out[${notebookCells.length + 1}]= OptimizationFactor -> 0.892`;
    }

    const newCell: NotebookCell = {
      id: `c_${Date.now()}`,
      input: sanitized,
      output,
      time: new Date().toLocaleTimeString(),
    };

    setNotebookCells(prev => [...prev, newCell]);
    addAuditLog("wolfram.evaluate_cell", `Evaluated expression: ${sanitized}`, "SUCCESS");
    setCellInput("");
  };

  // SVG Probability path coordinate shifts dynamically based on range inputs
  const peakX = 200 + (marketing - 50) * 1.2 - (churn * 1.5);
  const peakY = 80 + (hiring * 1.2);
  const shiftedPath = `M 0 180 C 80 180, ${peakX - 80} ${peakY + 60}, ${peakX} ${peakY} C ${peakX + 60} ${peakY + 60}, 400 180, 500 180`;

  return (
    <DashboardLayout>
      {/* Top Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-6 mb-6">
        <div>
          <h2 className="font-display text-3xl font-bold text-white tracking-tight">Wolfram Computation Center</h2>
          <p className="font-mono text-xs text-on-surface-variant mt-1">System synchronization optimal. 16 Compute Kernels active.</p>
        </div>
        <div className="bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
          Powered by Wolfram Computational Intelligence
        </div>
      </div>

      {/* Grid Row 1: Engine Status & Active Simulations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Wolfram Engine Status */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="stream-pulse"></div>
          <div className="flex justify-between items-start border-b border-white/5 pb-3 mb-3">
            <div>
              <h3 className="font-display text-base text-white font-bold">Wolfram Kernel Engine</h3>
              <p className="font-mono text-[9px] text-primary font-bold uppercase tracking-widest mt-1">VERSION 14.1.0 ENTERPRISE</p>
            </div>
            <span className="material-symbols-outlined text-primary">analytics</span>
          </div>
          <div className="space-y-2.5 my-4">
            <div className="flex justify-between font-mono text-xs">
              <span className="text-on-surface-variant">Host Status</span>
              <span className="text-tertiary font-bold">ONLINE</span>
            </div>
            <div className="flex justify-between font-mono text-xs">
              <span className="text-on-surface-variant">Kernel CPU Load</span>
              <span className="text-white">14.2%</span>
            </div>
            <div className="flex justify-between font-mono text-xs">
              <span className="text-on-surface-variant">RAM Allocation</span>
              <span className="text-white">8.4GB / 32GB</span>
            </div>
            <div className="flex justify-between font-mono text-xs">
              <span className="text-on-surface-variant">Wolfram Cloud Link</span>
              <span className="text-tertiary">Connected (14ms latency)</span>
            </div>
          </div>
          <div className="pt-3 border-t border-white/5 flex items-center justify-between">
            <span className="font-mono text-[9px] text-on-surface-variant">AUTO-SCALE ENABLED</span>
            <button className="text-[10px] font-bold uppercase tracking-wider text-primary hover:underline cursor-pointer">
              Restart Engine
            </button>
          </div>
        </div>

        {/* Simulation Builder */}
        <div className="glass-panel col-span-2 rounded-2xl p-6 flex flex-col justify-between border border-white/5">
          <div className="flex justify-between items-start border-b border-white/5 pb-3 mb-3">
            <div>
              <h3 className="font-display text-base text-white font-bold">Mathematical Scenario Builder</h3>
              <p className="font-mono text-[9px] text-on-surface-variant uppercase tracking-widest mt-1">PARAMETRIC INPUT FOR MONTE CARLO MODELING</p>
            </div>
            <span className="material-symbols-outlined text-[#ffb955]">tune</span>
          </div>
          
          {/* Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-xs text-on-surface-variant block">Churn Delta (%)</label>
              <input
                type="range"
                min="-10"
                max="50"
                value={churn}
                onChange={(e) => setChurn(Number(e.target.value))}
                className="w-full accent-primary bg-[#1c1f28] h-1 rounded cursor-pointer"
              />
              <div className="flex justify-between font-mono text-[10px] text-on-surface-variant">
                <span>-10%</span>
                <span className="text-primary font-bold">{churn >= 0 ? `+${churn}%` : `${churn}%`}</span>
                <span>+50%</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-xs text-on-surface-variant block">Hiring Pace (count/mo)</label>
              <input
                type="range"
                min="1"
                max="25"
                value={hiring}
                onChange={(e) => setHiring(Number(e.target.value))}
                className="w-full accent-primary bg-[#1c1f28] h-1 rounded cursor-pointer"
              />
              <div className="flex justify-between font-mono text-[10px] text-on-surface-variant">
                <span>1</span>
                <span className="text-primary font-bold">{hiring} head</span>
                <span>25</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-xs text-on-surface-variant block">Marketing Opt Factor</label>
              <input
                type="range"
                min="0"
                max="100"
                value={marketing}
                onChange={(e) => setMarketing(Number(e.target.value))}
                className="w-full accent-primary bg-[#1c1f28] h-1 rounded cursor-pointer"
              />
              <div className="flex justify-between font-mono text-[10px] text-on-surface-variant">
                <span>0.0</span>
                <span className="text-primary font-bold">{(marketing / 100).toFixed(2)}</span>
                <span>1.0</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 flex justify-between items-center">
            <span className="text-[10px] text-on-surface-variant font-mono">
              Equation: f(t) = Churn(t) * Runway(t) + Optimize(m)
            </span>
            <button
              onClick={runParametricSimulation}
              className="bg-primary hover:bg-[#c2d6ff] text-[#001945] font-sans text-xs uppercase font-bold px-6 py-2 rounded-lg transition-all cursor-pointer shadow-[0_0_15px_rgba(176,198,255,0.2)]"
            >
              Run Model
            </button>
          </div>
        </div>
      </div>

      {/* Grid Row 2: Graph, Symbolic Compute, and Monte Carlo Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Probability Distribution Curve */}
        <div className="lg:col-span-8 glass-panel rounded-2xl p-6 flex flex-col h-[420px] border border-white/5">
          <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
            <div>
              <h3 className="font-display text-base text-white font-bold">Simulated Runway &amp; Probability Distribution</h3>
              <p className="font-mono text-[9px] text-on-surface-variant uppercase tracking-widest mt-1">WOLFRAM EVALUATION MODEL RESULTS (n=50,000)</p>
            </div>
            <div className="flex gap-2">
              <span className="bg-tertiary/10 border border-tertiary/30 text-tertiary px-3 py-0.5 rounded-full text-[10px] font-mono font-bold">
                90% Confidence Interval
              </span>
            </div>
          </div>
          
          <div className="flex-1 bg-[#050505]/40 rounded-xl border border-white/5 flex items-end justify-center relative overflow-hidden p-6">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
            
            {/* SVG Distribution Curve */}
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <svg className="w-full h-full text-primary/40 opacity-70" viewBox="0 0 500 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Baseline Distribution */}
                <path
                  d="M 0 180 C 100 180, 150 170, 200 120 C 230 80, 270 80, 300 120 C 350 170, 400 180, 500 180"
                  stroke="#b0c6ff"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                
                {/* Parameter-Shifted Live Path */}
                <path
                  d={shiftedPath}
                  stroke="#4edea3"
                  strokeWidth="3"
                  fill="none"
                  className="transition-all duration-700"
                />
              </svg>
            </div>

            {/* Static Stats indicators */}
            <div className="relative z-10 w-full flex justify-between px-6 font-mono text-[10px] text-on-surface-variant">
              <div>
                <span className="block text-white font-bold">{expectedRunway} Months</span>
                <span className="uppercase text-[9px]">EXPECTED RUNWAY</span>
              </div>
              <div className="text-right">
                <span className="block text-white font-bold">±{stdDeviation} Mo</span>
                <span className="uppercase text-[9px]">STD DEVIATION (σ)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Symbolic Computation Console */}
        <div className="lg:col-span-4 glass-panel rounded-2xl p-6 flex flex-col justify-between h-[420px] border border-white/5">
          <div className="flex justify-between items-start border-b border-white/5 pb-3 mb-3">
            <div>
              <h3 className="font-display text-base text-white font-bold">Symbolic Console</h3>
              <p className="font-mono text-[9px] text-on-surface-variant uppercase tracking-widest mt-1">EVALUATE MATHEMATICAL EXPRESSIONS</p>
            </div>
            <span className="material-symbols-outlined text-primary">terminal</span>
          </div>

          {/* Interactive Input/Output logs */}
          <div className="flex-1 overflow-y-auto space-y-3 font-mono text-[10px] my-3 pr-1">
            {notebookCells.map(cell => (
              <div key={cell.id} className="p-2.5 bg-[#050505]/40 rounded-lg border border-white/5 space-y-1.5">
                <div className="flex justify-between text-on-surface-variant text-[9px]">
                  <span className="text-primary font-bold">In[ ]:</span>
                  <span>{cell.time}</span>
                </div>
                <div className="text-white font-semibold">{cell.input}</div>
                <div className="border-t border-white/5 pt-1.5 flex gap-2">
                  <span className="text-tertiary font-bold">Out[ ]:</span>
                  <div className="text-on-surface leading-normal">{cell.output}</div>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={evaluateCell} className="flex gap-2 border-t border-white/5 pt-3">
            <input
              type="text"
              placeholder="e.g. Integrate[x^3, x]"
              value={cellInput}
              onChange={(e) => setCellInput(e.target.value)}
              className="flex-1 bg-[#050505]/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder:text-outline-variant focus:outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="bg-primary hover:bg-[#c2d6ff] text-[#001945] font-mono text-[10px] uppercase font-bold px-4 rounded-lg cursor-pointer"
            >
              Eval
            </button>
          </form>
        </div>
      </div>

      {/* Grid Row 3: Active Optimization Pipelines */}
      <div className="glass-panel rounded-2xl p-6 mt-6 border border-white/5">
        <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
          <h3 className="font-display text-base text-white font-bold">Active Optimization Pipelines</h3>
          <span className="font-mono text-[9px] text-on-surface-variant">4 PIPELINES ONLINE</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: "ARR Growth Bounds", status: "Nominal", rate: "99.8%", color: "text-tertiary" },
            { name: "Monte Carlo Runway", status: "Evaluating", rate: "Syncing", color: "text-primary animate-pulse" },
            { name: "CAC Spend Optimizer", status: "Nominal", rate: "100%", color: "text-tertiary" },
            { name: "SDR Workforce Allocator", status: "Online", rate: "94.5%", color: "text-primary" }
          ].map((pipe, idx) => (
            <div key={idx} className="bg-[#050505]/40 border border-white/5 rounded-xl p-4 flex justify-between items-center">
              <div>
                <span className="block text-xs font-semibold text-white">{pipe.name}</span>
                <span className="block text-[9px] font-mono text-on-surface-variant uppercase mt-0.5">{pipe.status}</span>
              </div>
              <span className={`font-mono text-xs font-bold ${pipe.color}`}>{pipe.rate}</span>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
