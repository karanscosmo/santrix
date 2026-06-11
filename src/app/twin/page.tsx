"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useSecurity } from "@/lib/SecurityContext";

interface NodeDetails {
  name: string;
  desc: string;
  load: string;
  FTE: string;
  cost: string;
  deps: string;
}

export default function DigitalTwinPage() {
  const { checkPermission, addAuditLog } = useSecurity();
  const [selectedNode, setSelectedNode] = useState<string>("Engineering");

  // Health and style states
  const [nodeHealth, setNodeHealth] = useState({
    Engineering: { val: 95, status: "NOMINAL", colorClass: "text-tertiary" },
    Marketing: { val: 92, status: "NOMINAL", colorClass: "text-tertiary" },
    Operations: { val: 99, status: "NOMINAL", colorClass: "text-tertiary" },
    Sales: { val: 94, status: "NOMINAL", colorClass: "text-tertiary" },
    Product: { val: 98, status: "NOMINAL", colorClass: "text-tertiary" },
  });

  const [riskLogs, setRiskLogs] = useState<string[]>([
    "[SYSTEM] Telemetry nominal. No propagation events registered.",
    "[SYSTEM] Twin running in sync with Pinecone metadata lake.",
  ]);

  const nodeDetailsMap: Record<string, NodeDetails> = {
    Product: {
      name: "Product",
      desc: "Manages development, design, and roadmap priorities.",
      load: "45.2%",
      FTE: "8 / 8 FTE",
      cost: "$180K",
      deps: "Engineering, Marketing",
    },
    Engineering: {
      name: "Engineering",
      desc: "Manages development, deployments, and security architecture.",
      load: "78.4%",
      FTE: "14 / 16 FTE",
      cost: "$340K",
      deps: "Operations, Sales",
    },
    Marketing: {
      name: "Marketing",
      desc: "Owns user acquisition, lead gen pipelines, and branding campaigns.",
      load: "82.1%",
      FTE: "10 / 12 FTE",
      cost: "$450K",
      deps: "Sales",
    },
    Operations: {
      name: "Operations",
      desc: "Orchestrates infrastructure, databases, and LLM orchestration layer.",
      load: "62.0%",
      FTE: "6 / 6 FTE",
      cost: "$210K",
      deps: "Sales",
    },
    Sales: {
      name: "Sales (ARR)",
      desc: "Executes closing strategy, ARR expansions, and partner operations.",
      load: "90.5%",
      FTE: "12 / 12 FTE",
      cost: "$290K",
      deps: "None",
    },
  };

  const logMessage = (msg: string) => {
    const now = new Date().toLocaleTimeString();
    setRiskLogs(prev => [`[${now}] ${msg}`, ...prev]);
  };

  const triggerRiskPropagation = (type: "aws" | "dev") => {
    if (!checkPermission("simulation:run")) {
      alert("Access Denied: Your current role does not have permission to trigger risk simulations.");
      return;
    }

    if (type === "aws") {
      setNodeHealth(prev => ({
        ...prev,
        Operations: { val: 14, status: "[OUTAGE]", colorClass: "text-error" },
        Sales: { val: 62, status: "[BLOCKED]", colorClass: "text-secondary" },
      }));
      logMessage("[RISK_TRIGGER] AWS Outage event activated.");
      logMessage("Operations health degraded to 14%. Propagation started.");
      logMessage("Dependency warning: Sales ARR sync compromised. Sales health degraded.");
      addAuditLog("twin.simulate_aws_outage", "AWS Outage risk propagation simulated", "SUCCESS");
    } else {
      setNodeHealth(prev => ({
        ...prev,
        Engineering: { val: 55, status: "[DELAY]", colorClass: "text-secondary" },
        Sales: { val: 75, status: "[PIPELINE DELAY]", colorClass: "text-secondary" },
      }));
      logMessage("[RISK_TRIGGER] Engineering Sprint Delay event activated.");
      logMessage("Engineering health degraded to 55%. Propagation started.");
      logMessage("Dependency warning: Sales feature release commitments impacted.");
      addAuditLog("twin.simulate_dev_delay", "Dev Sprint Delay risk propagation simulated", "SUCCESS");
    }
  };

  const resetTwin = () => {
    setNodeHealth({
      Engineering: { val: 95, status: "NOMINAL", colorClass: "text-tertiary" },
      Marketing: { val: 92, status: "NOMINAL", colorClass: "text-tertiary" },
      Operations: { val: 99, status: "NOMINAL", colorClass: "text-tertiary" },
      Sales: { val: 94, status: "NOMINAL", colorClass: "text-tertiary" },
      Product: { val: 98, status: "NOMINAL", colorClass: "text-tertiary" },
    });
    logMessage("[SYSTEM] Telemetry reset to nominal.");
    addAuditLog("twin.reset", "Digital twin simulation state reset", "SUCCESS");
  };

  const runDiagnostic = () => {
    addAuditLog("twin.diagnostic", "Full twin diagnostics run executed", "SUCCESS");
    alert(
      "Running complete Organization Digital Twin diagnostics. Pinecone node graph consistent. n8n automation channels checked. All operational links verified."
    );
  };

  const currentInspect = nodeDetailsMap[selectedNode];

  return (
    <DashboardLayout>
      <div className="space-y-md">
        
        {/* Visual Network Mapping of Twin (Department nodes) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-md">
          <div className="lg:col-span-8 glass-panel rounded-xl p-md flex flex-col h-[520px] relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-outline-variant/30 pb-sm mb-md gap-sm">
              <div>
                <h3 className="font-display text-headline-md text-on-surface text-[18px]">
                  Dependency Tree &amp; Risk Flow
                </h3>
                <p className="font-mono text-xs text-on-surface-variant mt-1">
                  SIMULATE FAILURE PROPAGATION ACROSS BUSINESS VECTORS
                </p>
              </div>
              <div className="flex gap-sm shrink-0">
                <button
                  onClick={() => triggerRiskPropagation("aws")}
                  className="bg-error/15 hover:bg-error/25 border border-error/30 text-error text-[10px] font-mono px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                >
                  Simulate AWS Outage
                </button>
                <button
                  onClick={() => triggerRiskPropagation("dev")}
                  className="bg-secondary/15 hover:bg-secondary/25 border border-secondary/30 text-secondary text-[10px] font-mono px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                >
                  Simulate Dev Delay
                </button>
                <button
                  onClick={resetTwin}
                  className="border border-white/10 text-on-surface-variant text-[10px] font-mono px-3 py-1.5 rounded-lg cursor-pointer hover:bg-white/5 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Twin Map Canvas/SVG */}
            <div className="flex-grow bg-[#050505]/60 rounded-xl border border-white/5 relative flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-radial from-primary/5 via-transparent to-transparent pointer-events-none"></div>

              {/* Dynamic Connecting Lines SVG */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00dbe7" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#b0c6ff" stopOpacity="0.4" />
                  </linearGradient>
                  <linearGradient id="errorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffb4ab" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#ff5449" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
                {/* Product -> Engineering */}
                <line
                  x1="120"
                  y1="250"
                  x2="260"
                  y2="140"
                  stroke={nodeHealth.Engineering.val < 60 ? "url(#errorGrad)" : "url(#lineGrad)"}
                  strokeWidth="2.5"
                  strokeDasharray={nodeHealth.Engineering.val < 60 ? "4" : "0"}
                  className={nodeHealth.Engineering.val < 60 ? "animate-pulse" : ""}
                />
                {/* Product -> Marketing */}
                <line
                  x1="120"
                  y1="250"
                  x2="260"
                  y2="360"
                  stroke="url(#lineGrad)"
                  strokeWidth="2"
                />
                {/* Engineering -> Operations */}
                <line
                  x1="380"
                  y1="140"
                  x2="520"
                  y2="140"
                  stroke={nodeHealth.Operations.val < 50 ? "url(#errorGrad)" : "url(#lineGrad)"}
                  strokeWidth="2.5"
                  strokeDasharray={nodeHealth.Operations.val < 50 ? "6 4" : "0"}
                  className={nodeHealth.Operations.val < 50 ? "animate-pulse" : ""}
                />
                {/* Marketing -> Sales */}
                <line
                  x1="380"
                  y1="360"
                  x2="520"
                  y2="360"
                  stroke="url(#lineGrad)"
                  strokeWidth="2"
                />
                {/* Operations -> Sales */}
                <line
                  x1="580"
                  y1="180"
                  x2="580"
                  y2="320"
                  stroke={nodeHealth.Sales.val < 80 ? "url(#errorGrad)" : "url(#lineGrad)"}
                  strokeWidth="2.5"
                  strokeDasharray="4"
                  className={nodeHealth.Sales.val < 80 ? "animate-pulse" : ""}
                />
              </svg>

              {/* Interactive Nodes */}
              {/* Product */}
              <button
                onClick={() => setSelectedNode("Product")}
                className={`absolute left-8 top-1/2 -translate-y-1/2 bg-[#090b10]/90 border p-md rounded-xl text-center cursor-pointer transition-all w-28 hover:scale-[1.03] ${
                  selectedNode === "Product" ? "border-primary glow-primary shadow-[0_0_20px_rgba(0,219,231,0.15)]" : "border-white/10 hover:border-white/30"
                }`}
              >
                <span className="material-symbols-outlined text-primary text-xl">design_services</span>
                <div className="font-mono text-xs font-bold text-white mt-1">Product</div>
                <div className="text-[9px] text-tertiary mt-0.5">HEALTH: {nodeHealth.Product.val}%</div>
              </button>

              {/* Engineering */}
              <button
                onClick={() => setSelectedNode("Engineering")}
                className={`absolute left-[260px] top-1/4 -translate-y-1/2 bg-[#090b10]/90 border p-md rounded-xl text-center cursor-pointer transition-all w-32 hover:scale-[1.03] ${
                  selectedNode === "Engineering" ? "border-primary glow-primary shadow-[0_0_20px_rgba(0,219,231,0.15)]" : ""
                } ${
                  nodeHealth.Engineering.val < 60
                    ? "border-secondary/80 animate-pulse text-secondary"
                    : selectedNode !== "Engineering" ? "border-white/10 hover:border-white/30" : ""
                }`}
              >
                <span className="material-symbols-outlined text-primary text-xl">developer_board</span>
                <div className="font-mono text-xs font-bold text-white mt-1">Engineering</div>
                <div className={`text-[9px] font-bold mt-0.5 ${nodeHealth.Engineering.colorClass}`}>
                  H: {nodeHealth.Engineering.val}% {nodeHealth.Engineering.status !== "NOMINAL" && nodeHealth.Engineering.status}
                </div>
              </button>

              {/* Marketing */}
              <button
                onClick={() => setSelectedNode("Marketing")}
                className={`absolute left-[260px] bottom-1/4 translate-y-1/2 bg-[#090b10]/90 border p-md rounded-xl text-center cursor-pointer transition-all w-32 hover:scale-[1.03] ${
                  selectedNode === "Marketing" ? "border-primary glow-primary shadow-[0_0_20px_rgba(0,219,231,0.15)]" : "border-white/10 hover:border-white/30"
                }`}
              >
                <span className="material-symbols-outlined text-primary text-xl">campaign</span>
                <div className="font-mono text-xs font-bold text-white mt-1">Marketing</div>
                <div className="text-[9px] text-tertiary mt-0.5">HEALTH: {nodeHealth.Marketing.val}%</div>
              </button>

              {/* Operations */}
              <button
                onClick={() => setSelectedNode("Operations")}
                className={`absolute right-[120px] top-1/4 -translate-y-1/2 bg-[#090b10]/90 border p-md rounded-xl text-center cursor-pointer transition-all w-32 hover:scale-[1.03] ${
                  selectedNode === "Operations" ? "border-primary glow-primary shadow-[0_0_20px_rgba(0,219,231,0.15)]" : ""
                } ${
                  nodeHealth.Operations.val < 50
                    ? "border-error/80 animate-pulse text-error"
                    : selectedNode !== "Operations" ? "border-white/10 hover:border-white/30" : ""
                }`}
              >
                <span className="material-symbols-outlined text-primary text-xl">cloud_done</span>
                <div className="font-mono text-xs font-bold text-white mt-1">Operations</div>
                <div className={`text-[9px] font-bold mt-0.5 ${nodeHealth.Operations.colorClass}`}>
                  H: {nodeHealth.Operations.val}% {nodeHealth.Operations.status !== "NOMINAL" && nodeHealth.Operations.status}
                </div>
              </button>

              {/* Sales */}
              <button
                onClick={() => setSelectedNode("Sales")}
                className={`absolute right-[120px] bottom-1/4 translate-y-1/2 bg-[#090b10]/90 border p-md rounded-xl text-center cursor-pointer transition-all w-32 hover:scale-[1.03] ${
                  selectedNode === "Sales" ? "border-primary glow-primary shadow-[0_0_20px_rgba(0,219,231,0.15)]" : ""
                } ${
                  nodeHealth.Sales.val < 80
                    ? "border-secondary/80 animate-pulse text-secondary"
                    : selectedNode !== "Sales" ? "border-white/10 hover:border-white/30" : ""
                }`}
              >
                <span className="material-symbols-outlined text-primary text-xl">payments</span>
                <div className="font-mono text-xs font-bold text-white mt-1">Sales</div>
                <div className={`text-[9px] font-bold mt-0.5 ${nodeHealth.Sales.colorClass}`}>
                  H: {nodeHealth.Sales.val}% {nodeHealth.Sales.status !== "NOMINAL" && nodeHealth.Sales.status}
                </div>
              </button>
            </div>
          </div>

          {/* Inspect Panel / Twin Settings */}
          <div className="lg:col-span-4 glass-panel rounded-xl p-md flex flex-col justify-between h-[520px]">
            <div>
              <div className="border-b border-outline-variant/30 pb-sm mb-md">
                <h3 className="font-display text-headline-md text-on-surface text-[18px]">Department Telemetry</h3>
                <p className="font-mono text-xs text-on-surface-variant mt-1">NODE INSPECTION DETAILS</p>
              </div>

              <div className="space-y-md">
                <div className="bg-[#050505]/40 p-md rounded-xl border border-white/5">
                  <span className="font-sans text-[10px] text-primary block font-semibold uppercase tracking-wider">
                    SELECTED NODE
                  </span>
                  <h4 className="font-bold text-sm text-white mt-1.5">{currentInspect.name} Department</h4>
                  <p className="text-[11px] text-on-surface-variant mt-1.5 leading-relaxed font-light">{currentInspect.desc}</p>
                </div>
                
                <div className="space-y-sm">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-on-surface-variant">Operational Load</span>
                    <span className="font-bold text-white">{currentInspect.load}</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(0,219,231,0.5)]"
                      style={{ width: currentInspect.load }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-sm">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-on-surface-variant">Headcount Utilization</span>
                    <span className="font-bold text-white">{currentInspect.FTE}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-on-surface-variant">Monthly Operating Cost</span>
                    <span className="font-bold text-white">{currentInspect.cost}</span>
                  </div>
                </div>

                <div className="bg-[#050505]/40 p-md rounded-xl border border-white/5 text-[11px] font-mono text-on-surface-variant">
                  <span className="text-primary font-bold uppercase tracking-wider text-[10px] block mb-1">DEPENDENTS</span>
                  <p className="font-light">{currentInspect.deps}</p>
                </div>
              </div>
            </div>

            <div className="pt-md border-t border-outline-variant/30 mt-md">
              <button
                onClick={runDiagnostic}
                className="w-full bg-primary text-on-primary font-semibold text-xs tracking-wider uppercase text-center py-md rounded-lg hover:bg-primary-container transition-all cursor-pointer glow-button"
              >
                Run Complete Twin Diagnostics
              </button>
            </div>
          </div>
        </div>

        {/* Department Bottlenecks & Risk Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md pb-8">
          
          {/* Bottleneck list */}
          <div className="glass-panel rounded-xl p-md">
            <div className="border-b border-outline-variant/30 pb-sm mb-md">
              <h3 className="font-display text-headline-md text-on-surface text-[18px]">
                Autonomous Bottleneck Analysis
              </h3>
              <p className="font-mono text-xs text-on-surface-variant mt-1">CRITICAL OPERATIONAL SLOWDOWNS</p>
            </div>
            
            <div className="space-y-sm">
              <div className="flex justify-between items-center p-md bg-[#050505]/40 rounded-xl border border-white/5 hover:border-secondary/20 transition-all">
                <div className="space-y-1">
                  <span className="text-xs text-white font-bold block">Engineering Pipeline Delay</span>
                  <p className="text-[10px] text-on-surface-variant font-light leading-relaxed">
                    QA automation bottlenecks slowing release pipeline by 1.2 days.
                  </p>
                </div>
                <span className="text-[9px] text-secondary bg-secondary/10 px-2.5 py-1 rounded-lg border border-secondary/20 font-mono font-bold shrink-0">
                  MEDIUM
                </span>
              </div>
              
              <div className="flex justify-between items-center p-md bg-[#050505]/40 rounded-xl border border-white/5 hover:border-error/20 transition-all">
                <div className="space-y-1">
                  <span className="text-xs text-white font-bold block">Operations Compute Limit</span>
                  <p className="text-[10px] text-on-surface-variant font-light leading-relaxed">
                    Peak hour AWS cluster utilization exceeding 92% thresholds.
                  </p>
                </div>
                <span className="text-[9px] text-error bg-error/10 px-2.5 py-1 rounded-lg border border-error/20 font-mono font-bold shrink-0">
                  CRITICAL
                </span>
              </div>
            </div>
          </div>

          {/* Simulation Output Terminal */}
          <div className="glass-panel rounded-xl p-md flex flex-col h-full min-h-[260px]">
            <div className="border-b border-outline-variant/30 pb-sm mb-md">
              <h3 className="font-display text-headline-md text-on-surface text-[18px]">Risk Propagation Log</h3>
              <p className="font-mono text-xs text-on-surface-variant mt-1">AUTONOMOUS TRIGGER EVENT TELEMETRY</p>
            </div>
            <div className="flex-1 bg-[#050505]/60 border border-white/5 rounded-xl p-md font-mono text-xs overflow-y-auto text-on-surface-variant space-y-2 select-all h-[130px]">
              {riskLogs.map((log, index) => {
                let colorClass = "text-on-surface-variant";
                if (log.includes("RISK_TRIGGER") || log.includes("degraded") || log.includes("compromised")) {
                  colorClass = log.includes("Operations") || log.includes("AWS Outage") ? "text-error" : "text-secondary";
                } else if (log.includes("[SYSTEM] Telemetry nominal") || log.includes("nominal")) {
                  colorClass = "text-tertiary";
                }
                return (
                  <div key={index} className={`${colorClass} flex items-start gap-1 font-light leading-relaxed`}>
                    <span className="text-primary/45 shrink-0">&raquo;</span>
                    <span>{log}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
