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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-md border-b border-outline-variant pb-md mb-md">
        <div>
          <h2 className="font-display text-4xl text-on-surface">Wolfram Computation Center</h2>
          <p className="font-mono text-xs text-on-surface-variant">System synchronization optimal. 16 Compute Kernels active.</p>
        </div>
      </div>

      {/* Grid Row 1: Engine Status & Active Simulations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
        {/* Wolfram Engine Status */}
        <div className="glass-panel rounded-xl p-md flex flex-col justify-between relative overflow-hidden">
          <div className="stream-pulse"></div>
          <div className="flex justify-between items-start border-b border-outline-variant/30 pb-sm mb-sm">
            <div>
              <h3 className="font-display text-base text-on-surface">Wolfram Kernel Engine</h3>
              <p className="font-mono text-[9px] text-on-surface-variant mt-1">VERSION 14.1.0 ENTERPRISE</p>
            </div>
            <span className="material-symbols-outlined text-primary">analytics</span>
          </div>
          <div className="space-y-sm my-md">
            <div className="flex justify-between font-mono text-xs">
              <span className="text-on-surface-variant">Host Status</span>
              <span className="text-tertiary font-bold">ONLINE</span>
            </div>
            <div className="flex justify-between font-mono text-xs">
              <span className="text-on-surface-variant">Kernel CPU Load</span>
              <span className="text-on-surface">14.2%</span>
            </div>
            <div className="flex justify-between font-mono text-xs">
              <span className="text-on-surface-variant">RAM Allocation</span>
              <span className="text-on-surface">8.4GB / 32GB</span>
            </div>
            <div className="flex justify-between font-mono text-xs">
              <span className="text-on-surface-variant">Wolfram Cloud Link</span>
              <span className="text-tertiary">Connected (14ms latency)</span>
            </div>
          </div>
          <div className="pt-sm border-t border-outline-variant/30 flex items-center justify-between">
            <span className="font-mono text-[9px] text-on-surface-variant">AUTO-SCALE ENABLED</span>
            <button className="text-xs text-primary hover:underline font-semibold uppercase tracking-wider cursor-pointer">
              Restart Engine
            </button>
          </div>
        </div>

        {/* Simulation Builder */}
        <div className="glass-panel col-span-2 rounded-xl p-md flex flex-col justify-between">
          <div className="flex justify-between items-start border-b border-outline-variant/30 pb-sm mb-sm">
            <div>
              <h3 className="font-display text-base text-on-surface">Mathematical Scenario Builder</h3>
              <p className="font-mono text-[9px] text-on-surface-variant mt-1">PARAMETRIC INPUT FOR MONTE CARLO MODELING</p>
            </div>
            <span className="material-symbols-outlined text-secondary">tune</span>
          </div>
          
          {/* Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md my-md">
            <div className="space-y-xs">
              <label className="font-semibold text-xs text-on-surface-variant block">Churn Delta (%)</label>
              <input
                type="range"
                min="-10"
                max="50"
                value={churn}
                onChange={(e) => setChurn(Number(e.target.value))}
                className="w-full accent-primary bg-surface-container h-1 rounded cursor-pointer"
              />
              <div className="flex justify-between font-mono text-[10px] text-on-surface-variant">
                <span>-10%</span>
                <span className="text-primary font-bold">{churn >= 0 ? `+${churn}%` : `${churn}%`}</span>
                <span>+50%</span>
              </div>
            </div>
            <div className="space-y-xs">
              <label className="font-semibold text-xs text-on-surface-variant block">Hiring Pace (count/mo)</label>
              <input
                type="range"
                min="1"
                max="25"
                value={hiring}
                onChange={(e) => setHiring(Number(e.target.value))}
                className="w-full accent-primary bg-surface-container h-1 rounded cursor-pointer"
              />
              <div className="flex justify-between font-mono text-[10px] text-on-surface-variant">
                <span>1</span>
                <span className="text-primary font-bold">{hiring} head</span>
                <span>25</span>
              </div>
            </div>
            <div className="space-y-xs">
              <label className="font-semibold text-xs text-on-surface-variant block">Marketing Opt Factor</label>
              <input
                type="range"
                min="0"
                max="100"
                value={marketing}
                onChange={(e) => setMarketing(Number(e.target.value))}
                className="w-full accent-primary bg-surface-container h-1 rounded cursor-pointer"
              />
              <div className="flex justify-between font-mono text-[10px] text-on-surface-variant">
                <span>0.0</span>
                <span className="text-primary font-bold">{(marketing / 100).toFixed(2)}</span>
                <span>1.0</span>
              </div>
            </div>
          </div>

          <div className="pt-sm border-t border-outline-variant/30 flex justify-between items-center">
            <span className="text-xs text-on-surface-variant font-mono">
              Equation: f(t) = Churn(t) * Runway(t) + Optimize(m)
            </span>
            <button
              onClick={runParametricSimulation}
              className="bg-primary text-on-primary font-sans text-xs uppercase font-bold px-md py-sm rounded hover:bg-primary-container transition-all cursor-pointer shadow-[0_0_15px_rgba(176,198,255,0.3)]"
            >
              Run Model
            </button>
          </div>
        </div>
      </div>

      {/* Grid Row 2: Graph, Symbolic Compute, and Monte Carlo Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-md mt-md">
        {/* Probability Distribution Curve */}
        <div className="lg:col-span-8 glass-panel rounded-xl p-md flex flex-col h-[420px]">
          <div className="flex justify-between items-center border-b border-outline-variant/30 pb-sm mb-md">
            <div>
              <h3 className="font-display text-base text-on-surface">Simulated Runway & Probability Distribution</h3>
              <p className="font-mono text-[9px] text-on-surface-variant mt-1">WOLFRAM EVALUATION MODEL RESULTS (n=50,000)</p>
            </div>
            <div className="flex gap-sm">
              <span className="bg-tertiary/10 border border-tertiary/30 text-tertiary px-2 py-0.5 rounded text-[10px] font-mono">
                90% Confidence Interval
              </span>
            </div>
          </div>
          
          <div className="flex-1 bg-surface-container-low/30 rounded border border-outline-variant/30 flex items-end justify-center relative overflow-hidden p-md">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
            
            {/* SVG Distribution Curve */}
            <div className="absolute inset-0 flex items-center justify-center p-lg">
              <svg className="w-full h-full text-primary/40 opacity-70" viewBox="0 0 500 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Baseline Distribution */}
                <path
                  d="M 0 180 C 100 180, 150 170, 200 120 C 230 80, 270 80, 300 120 C 350 170, 400 180, 500 180"
                  stroke="#b0c6ff"
                  strokeWidth="2"
                  fill="url(#grad-baseline)"
                />
                {/* Shifted Distribution based on sliders */}
                <path
                  id="svg-dist-curve"
                  d={shiftedPath}
                  stroke="#ffb955"
                  strokeWidth="2"
                  strokeDasharray="4"
                  fill="url(#grad-shifted)"
                />
                
                <defs>
                  <linearGradient id="grad-baseline" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#b0c6ff" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#b0c6ff" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="grad-shifted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffb955" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#ffb955" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            
            {/* Live Stats Overlay */}
            <div className="absolute left-md top-md text-mono text-xs text-on-surface-variant flex flex-col gap-1">
              <span>Scenario: <strong className="text-secondary">Custom Forecast Model</strong></span>
              <span>Expected Runway: <strong className="text-tertiary">{expectedRunway} Months</strong></span>
              <span>Standard Deviation: <strong className="text-on-surface">{stdDeviation} Months</strong></span>
            </div>
            
            <div className="absolute right-md bottom-md flex gap-md font-mono text-[10px] text-on-surface-variant">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-primary rounded-full"></span>Baseline
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-secondary rounded-full border border-dashed border-secondary"></span>Simulated Path
              </div>
            </div>
          </div>
        </div>

        {/* Monte Carlo Jobs Queue */}
        <div className="lg:col-span-4 glass-panel rounded-xl p-md flex flex-col h-[420px] justify-between">
          <div className="border-b border-outline-variant/30 pb-sm mb-xs">
            <h3 className="font-display text-base text-on-surface">Active Simulation Jobs</h3>
            <p className="font-mono text-[9px] text-on-surface-variant mt-1">ACTIVE FORECAST PIPELINES</p>
          </div>
          
          <div className="flex-grow overflow-y-auto space-y-sm my-sm pr-xs">
            <div className="bg-surface-container-low p-sm rounded border border-outline-variant/50">
              <div className="flex justify-between items-center mb-1">
                <span className="font-mono text-xs text-on-surface font-bold">Job #5092: Churn Variance</span>
                <span className="text-[9px] text-tertiary bg-tertiary/10 px-1.5 py-0.5 rounded">COMPLETED</span>
              </div>
              <div className="flex justify-between text-[10px] text-on-surface-variant font-mono">
                <span>Iterations: 50k</span>
                <span>Time: 48ms</span>
                <span>Conf: 95%</span>
              </div>
            </div>

            <div className="bg-surface-container-low p-sm rounded border border-outline-variant/50">
              <div className="flex justify-between items-center mb-1">
                <span className="font-mono text-xs text-on-surface font-bold">Job #5093: Budget Optimization</span>
                <span className="text-[9px] text-primary bg-primary/10 px-1.5 py-0.5 rounded animate-pulse">OPTIMIZING</span>
              </div>
              <div className="flex justify-between text-[10px] text-on-surface-variant font-mono">
                <span>Iterations: 100k</span>
                <span>Time: running</span>
                <span>Conf: 98%</span>
              </div>
            </div>

            <div className="bg-surface-container-low p-sm rounded border border-outline-variant/50">
              <div className="flex justify-between items-center mb-1">
                <span className="font-mono text-xs text-on-surface font-bold">Job #5091: Hiring Speed Target</span>
                <span className="text-[9px] text-tertiary bg-tertiary/10 px-1.5 py-0.5 rounded">COMPLETED</span>
              </div>
              <div className="flex justify-between text-[10px] text-on-surface-variant font-mono">
                <span>Iterations: 10k</span>
                <span>Time: 12ms</span>
                <span>Conf: 90%</span>
              </div>
            </div>
          </div>

          <div className="pt-sm border-t border-outline-variant/30 space-y-sm">
            <div className="flex justify-between font-mono text-xs text-on-surface-variant">
              <span>Queue Status: Empty</span>
              <span>Latency: 2ms</span>
            </div>
            <button className="w-full py-sm rounded bg-surface-container border border-outline hover:border-primary text-on-surface font-sans text-xs uppercase font-bold text-center transition-all cursor-pointer">
              View Historical Jobs Log
            </button>
          </div>
        </div>
      </div>

      {/* Grid Row 3: Symbolic Computation Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-md mt-md">
        {/* Symbolic Console */}
        <div className="lg:col-span-7 glass-panel rounded-xl p-md flex flex-col h-[350px]">
          <div className="flex justify-between items-center border-b border-outline-variant/30 pb-sm mb-sm">
            <div>
              <h3 className="font-display text-base text-on-surface">Symbolic Computation Notebook</h3>
              <p className="font-mono text-[9px] text-on-surface-variant mt-1">DIRECT EVALUATION ENGINE CELL</p>
            </div>
            <span className="material-symbols-outlined text-outline">code</span>
          </div>
          
          {/* Console Cell */}
          <div className="flex-grow flex flex-col bg-surface-container-lowest border border-outline-variant/60 rounded p-sm font-mono text-xs overflow-y-auto">
            {notebookCells.map((cell) => (
              <div key={cell.id} className="mb-md">
                <div className="text-on-surface-variant">In[{cell.id}]:= {cell.input}</div>
                <div className="text-primary font-bold">{cell.output}</div>
              </div>
            ))}
            
            <form onSubmit={evaluateCell} className="text-on-surface-variant flex items-center gap-1">
              <span>In[{notebookCells.length + 1}]:=</span>
              <input
                type="text"
                value={cellInput}
                onChange={(e) => setCellInput(e.target.value)}
                className="bg-transparent border-none focus:outline-none focus:ring-0 p-0 text-on-surface flex-1 w-full outline-none"
              />
            </form>
          </div>
          
          <div className="mt-sm flex justify-between items-center">
            <span className="text-[9px] text-on-surface-variant font-mono">Press Enter to evaluate cell</span>
            <button onClick={() => evaluateCell()} className="text-xs text-primary font-bold uppercase tracking-wider hover:underline cursor-pointer">
              Execute Cell
            </button>
          </div>
        </div>

        {/* Computation Pipeline Graph */}
        <div className="lg:col-span-5 glass-panel rounded-xl p-md flex flex-col h-[350px] justify-between">
          <div className="border-b border-outline-variant/30 pb-sm mb-xs">
            <h3 className="font-display text-base text-on-surface">Evaluation Pipeline Graph</h3>
            <p className="font-mono text-[9px] text-on-surface-variant mt-1">COMPUTATIONAL TELEMETRY PATHWAYS</p>
          </div>

          <div className="flex-grow flex items-center justify-center bg-surface-container-lowest/20 rounded border border-outline-variant/30 relative overflow-hidden">
            <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <line x1="60" y1="110" x2="160" y2="110" stroke="#4edea3" strokeWidth="1.5" strokeDasharray="4" className="connection-line" />
              <line x1="220" y1="110" x2="310" y2="70" stroke="#b0c6ff" strokeWidth="1.5" />
              <line x1="220" y1="110" x2="310" y2="150" stroke="#b0c6ff" strokeWidth="1.5" />
            </svg>
            
            {/* Nodes */}
            <div className="absolute left-6 top-1/2 -translate-y-1/2 bg-surface border border-tertiary text-center p-sm rounded text-[10px] flex flex-col items-center">
              <span className="material-symbols-outlined text-tertiary text-sm">database</span>
              <span className="font-mono mt-1">Ingestion</span>
            </div>
            
            <div className="absolute left-[37%] top-1/2 -translate-y-1/2 bg-surface border border-primary text-center p-sm rounded text-[10px] flex flex-col items-center">
              <span className="material-symbols-outlined text-primary text-sm">functions</span>
              <span className="font-mono mt-1">Wolfram Link</span>
            </div>

            <div className="absolute right-6 top-1/4 -translate-y-1/2 bg-surface border border-outline-variant text-center p-sm rounded text-[10px] flex flex-col items-center">
              <span className="material-symbols-outlined text-on-surface-variant text-sm">casino</span>
              <span className="font-mono mt-1">Monte Carlo</span>
            </div>

            <div className="absolute right-6 bottom-1/4 translate-y-1/2 bg-surface border border-outline-variant text-center p-sm rounded text-[10px] flex flex-col items-center">
              <span className="material-symbols-outlined text-on-surface-variant text-sm">show_chart</span>
              <span className="font-mono mt-1">Forecast OS</span>
            </div>
          </div>

          <div className="pt-xs text-[9px] text-on-surface-variant font-mono flex justify-between">
            <span>PIPELINE HEALTH: 100%</span>
            <span>SPEED: 148 TFLOPS</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
