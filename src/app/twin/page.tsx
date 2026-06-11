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
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  // Health and style states
  const [nodeHealth, setNodeHealth] = useState({
    Engineering: { val: 95, status: "NOMINAL", colorClass: "text-[#4edea3]" },
    Marketing: { val: 92, status: "NOMINAL", colorClass: "text-[#4edea3]" },
    Operations: { val: 99, status: "NOMINAL", colorClass: "text-[#4edea3]" },
    Sales: { val: 94, status: "NOMINAL", colorClass: "text-[#4edea3]" },
    Product: { val: 98, status: "NOMINAL", colorClass: "text-[#4edea3]" },
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
        Operations: { val: 14, status: "[OUTAGE]", colorClass: "text-red-400" },
        Sales: { val: 62, status: "[BLOCKED]", colorClass: "text-amber-400" },
      }));
      logMessage("[RISK_TRIGGER] AWS Outage event activated.");
      logMessage("Operations health degraded to 14%. Propagation started.");
      logMessage("Dependency warning: Sales ARR sync compromised. Sales health degraded.");
      addAuditLog("twin.simulate_aws_outage", "AWS Outage risk propagation simulated", "SUCCESS");
    } else {
      setNodeHealth(prev => ({
        ...prev,
        Engineering: { val: 55, status: "[DELAY]", colorClass: "text-amber-400" },
        Sales: { val: 75, status: "[PIPELINE DELAY]", colorClass: "text-amber-400" },
      }));
      logMessage("[RISK_TRIGGER] Engineering Sprint Delay event activated.");
      logMessage("Engineering health degraded to 55%. Propagation started.");
      logMessage("Dependency warning: Sales feature release commitments impacted.");
      addAuditLog("twin.simulate_dev_delay", "Dev Sprint Delay risk propagation simulated", "SUCCESS");
    }
  };

  const resetTwin = () => {
    setNodeHealth({
      Engineering: { val: 95, status: "NOMINAL", colorClass: "text-[#4edea3]" },
      Marketing: { val: 92, status: "NOMINAL", colorClass: "text-[#4edea3]" },
      Operations: { val: 99, status: "NOMINAL", colorClass: "text-[#4edea3]" },
      Sales: { val: 94, status: "NOMINAL", colorClass: "text-[#4edea3]" },
      Product: { val: 98, status: "NOMINAL", colorClass: "text-[#4edea3]" },
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

  const handleZoom = (type: "in" | "out" | "reset") => {
    if (type === "in") setZoom(prev => Math.min(prev + 0.1, 1.8));
    else if (type === "out") setZoom(prev => Math.max(prev - 0.1, 0.6));
    else {
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  };

  const currentInspect = nodeDetailsMap[selectedNode];

  // Calculate overall enterprise score based on department averages
  const overallHealth = Math.round(
    Object.values(nodeHealth).reduce((acc, curr) => acc + curr.val, 0) / 5
  );

  return (
    <DashboardLayout>
      {/* 1. Page Header matching visual hierarchy guidelines */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.04] pb-5">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white">
            Digital Twin Modeling
          </h1>
          <p className="text-xs text-gray-400 font-mono mt-1 uppercase tracking-wider">
            Model enterprise dependencies and simulate failure propagation.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Indicator */}
          <div className="flex items-center gap-2 bg-[#0d0f14] border border-white/[0.06] rounded-[10px] px-3.5 py-1.5 text-[10px] font-mono font-bold text-gray-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
            Twin Health: {overallHealth}%
          </div>
          {/* Action Contexts */}
          <button
            onClick={() => triggerRiskPropagation("aws")}
            className="btn-action btn-danger text-[10px] py-2"
          >
            Simulate AWS Outage
          </button>
          <button
            onClick={() => triggerRiskPropagation("dev")}
            className="btn-action btn-secondary text-[10px] py-2"
          >
            Simulate Dev Delay
          </button>
          <button
            onClick={resetTwin}
            className="btn-action btn-secondary text-[10px] py-2"
          >
            Reset Model
          </button>
        </div>
      </header>

      {/* 2. Interactive SVG network canvas panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Network Canvas (Col 8) */}
        <div className="lg:col-span-8 panel-layer p-5 flex flex-col h-[520px] relative overflow-hidden">
          <div className="flex justify-between items-center border-b border-white/[0.04] pb-3 mb-4">
            <div>
              <h3 className="font-display text-sm font-bold text-white tracking-wide">
                Dependency Tree &amp; Animacy
              </h3>
              <p className="font-mono text-[9px] text-gray-500 mt-0.5">
                CLICK NODES TO INSPECT TELEMETRY METRICS
              </p>
            </div>
            
            {/* Zoom Controls */}
            <div className="flex items-center gap-1.5 bg-[#050505]/60 border border-white/[0.06] rounded-[8px] p-1">
              <button
                onClick={() => handleZoom("in")}
                className="w-6 h-6 rounded hover:bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer"
                title="Zoom In"
              >
                <span className="material-symbols-outlined text-[15px]">zoom_in</span>
              </button>
              <button
                onClick={() => handleZoom("out")}
                className="w-6 h-6 rounded hover:bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <span className="material-symbols-outlined text-[15px]">zoom_out</span>
              </button>
              <button
                onClick={() => handleZoom("reset")}
                className="w-6 h-6 rounded hover:bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer"
                title="Reset Zoom"
              >
                <span className="material-symbols-outlined text-[15px]">restart_alt</span>
              </button>
            </div>
          </div>

          {/* SVG Map Area */}
          <div className="flex-1 bg-[#050505]/50 rounded-xl border border-white/[0.03] relative flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-40"></div>

            {/* Transform Canvas for Zoom & Pan */}
            <div 
              className="w-full h-full relative transition-transform duration-300 ease-out"
              style={{ transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)` }}
            >
              {/* Dynamic Connection lines SVG */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="normalGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#8ab4f8" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#8ab4f8" stopOpacity="0.1" />
                  </linearGradient>
                  <linearGradient id="failureGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#f28b82" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#f28b82" stopOpacity="0.2" />
                  </linearGradient>
                </defs>

                {/* Product -> Engineering */}
                <line
                  x1="120"
                  y1="235"
                  x2="280"
                  y2="140"
                  stroke={nodeHealth.Engineering.val < 60 ? "url(#failureGrad)" : "url(#normalGrad)"}
                  strokeWidth="2.5"
                  strokeDasharray={nodeHealth.Engineering.val < 60 ? "5 3" : "0"}
                />
                
                {/* Product -> Marketing */}
                <line
                  x1="120"
                  y1="235"
                  x2="280"
                  y2="340"
                  stroke="url(#normalGrad)"
                  strokeWidth="2"
                />

                {/* Engineering -> Operations */}
                <line
                  x1="400"
                  y1="140"
                  x2="540"
                  y2="140"
                  stroke={nodeHealth.Operations.val < 50 ? "url(#failureGrad)" : "url(#normalGrad)"}
                  strokeWidth="2.5"
                  strokeDasharray={nodeHealth.Operations.val < 50 ? "6 3" : "0"}
                />

                {/* Marketing -> Sales */}
                <line
                  x1="400"
                  y1="340"
                  x2="540"
                  y2="340"
                  stroke="url(#normalGrad)"
                  strokeWidth="2"
                />

                {/* Operations -> Sales */}
                <line
                  x1="600"
                  y1="180"
                  x2="600"
                  y2="300"
                  stroke={nodeHealth.Sales.val < 80 ? "url(#failureGrad)" : "url(#normalGrad)"}
                  strokeWidth="2"
                  strokeDasharray="4"
                />
              </svg>

              {/* Department Nodes mapping */}
              {/* Product Node */}
              <button
                onClick={() => setSelectedNode("Product")}
                className={`absolute left-8 top-1/2 -translate-y-1/2 bg-[#0d0e12]/90 border p-3.5 rounded-[18px] text-center cursor-pointer transition-all w-28 hover:scale-[1.03] ${
                  selectedNode === "Product" ? "border-[#8ab4f8] shadow-[0_0_20px_rgba(138,180,248,0.15)]" : "border-white/[0.06] hover:border-white/[0.15]"
                }`}
              >
                <span className="material-symbols-outlined text-[#8ab4f8] text-lg">design_services</span>
                <div className="font-mono text-[10px] font-bold text-white mt-1">Product</div>
                <div className="text-[9px] text-[#4edea3] mt-0.5">{nodeHealth.Product.val}% Health</div>
              </button>

              {/* Engineering Node */}
              <button
                onClick={() => setSelectedNode("Engineering")}
                className={`absolute left-[260px] top-1/4 -translate-y-1/2 bg-[#0d0e12]/90 border p-3.5 rounded-[18px] text-center cursor-pointer transition-all w-32 hover:scale-[1.03] ${
                  selectedNode === "Engineering" ? "border-[#8ab4f8] shadow-[0_0_20px_rgba(138,180,248,0.15)]" : "border-white/[0.06]"
                } ${
                  nodeHealth.Engineering.val < 60 ? "border-amber-500/80 text-amber-500" : ""
                }`}
              >
                <span className="material-symbols-outlined text-[#8ab4f8] text-lg">developer_board</span>
                <div className="font-mono text-[10px] font-bold text-white mt-1">Engineering</div>
                <div className={`text-[9px] font-bold mt-0.5 ${nodeHealth.Engineering.colorClass}`}>
                  H: {nodeHealth.Engineering.val}% {nodeHealth.Engineering.status !== "NOMINAL" && nodeHealth.Engineering.status}
                </div>
              </button>

              {/* Marketing Node */}
              <button
                onClick={() => setSelectedNode("Marketing")}
                className={`absolute left-[260px] bottom-1/4 translate-y-1/2 bg-[#0d0e12]/90 border p-3.5 rounded-[18px] text-center cursor-pointer transition-all w-32 hover:scale-[1.03] ${
                  selectedNode === "Marketing" ? "border-[#8ab4f8] shadow-[0_0_20px_rgba(138,180,248,0.15)]" : "border-white/[0.06] hover:border-white/[0.15]"
                }`}
              >
                <span className="material-symbols-outlined text-[#8ab4f8] text-lg">campaign</span>
                <div className="font-mono text-[10px] font-bold text-white mt-1">Marketing</div>
                <div className="text-[9px] text-[#4edea3] mt-0.5">{nodeHealth.Marketing.val}% Health</div>
              </button>

              {/* Operations Node */}
              <button
                onClick={() => setSelectedNode("Operations")}
                className={`absolute right-[120px] top-1/4 -translate-y-1/2 bg-[#0d0e12]/90 border p-3.5 rounded-[18px] text-center cursor-pointer transition-all w-32 hover:scale-[1.03] ${
                  selectedNode === "Operations" ? "border-[#8ab4f8] shadow-[0_0_20px_rgba(138,180,248,0.15)]" : "border-white/[0.06]"
                } ${
                  nodeHealth.Operations.val < 50 ? "border-red-400/80 text-red-400" : ""
                }`}
              >
                <span className="material-symbols-outlined text-[#8ab4f8] text-lg">cloud_done</span>
                <div className="font-mono text-[10px] font-bold text-white mt-1">Operations</div>
                <div className={`text-[9px] font-bold mt-0.5 ${nodeHealth.Operations.colorClass}`}>
                  H: {nodeHealth.Operations.val}% {nodeHealth.Operations.status !== "NOMINAL" && nodeHealth.Operations.status}
                </div>
              </button>

              {/* Sales Node */}
              <button
                onClick={() => setSelectedNode("Sales")}
                className={`absolute right-[120px] bottom-1/4 translate-y-1/2 bg-[#0d0e12]/90 border p-3.5 rounded-[18px] text-center cursor-pointer transition-all w-32 hover:scale-[1.03] ${
                  selectedNode === "Sales" ? "border-[#8ab4f8] shadow-[0_0_20px_rgba(138,180,248,0.15)]" : "border-white/[0.06]"
                } ${
                  nodeHealth.Sales.val < 80 ? "border-amber-500/80 text-amber-500" : ""
                }`}
              >
                <span className="material-symbols-outlined text-[#8ab4f8] text-lg">payments</span>
                <div className="font-mono text-[10px] font-bold text-white mt-1">Sales</div>
                <div className={`text-[9px] font-bold mt-0.5 ${nodeHealth.Sales.colorClass}`}>
                  H: {nodeHealth.Sales.val}% {nodeHealth.Sales.status !== "NOMINAL" && nodeHealth.Sales.status}
                </div>
              </button>
            </div>

            {/* Mini Map Panel (Bottom Right of Canvas) */}
            <div className="absolute bottom-3 right-3 bg-[#0d0f14]/90 border border-white/[0.08] rounded-[10px] p-2 w-28 h-20 opacity-80 pointer-events-none flex flex-col justify-between">
              <span className="font-mono text-[7px] text-gray-500 tracking-wider">MINI-MAP</span>
              <div className="relative w-full h-8 bg-black/40 rounded border border-white/5 flex items-center justify-around px-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8ab4f8]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#8ab4f8]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#8ab4f8]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#8ab4f8]"></span>
              </div>
            </div>
          </div>
        </div>

        {/* Telemetry Inspect Sidebar (Col 4) */}
        <div className="lg:col-span-4 panel-layer p-5 flex flex-col justify-between h-[520px]">
          <div>
            <div className="border-b border-white/[0.04] pb-3 mb-4">
              <h3 className="font-display text-sm font-bold text-white tracking-wide">Department Telemetry</h3>
              <p className="font-mono text-[9px] text-gray-500 mt-0.5">NODE INSPECTION DETAILS</p>
            </div>

            <div className="space-y-4">
              <div className="bg-[#050505]/40 p-3.5 rounded-[12px] border border-white/[0.03]">
                <span className="font-mono text-[8px] text-[#8ab4f8] uppercase font-bold tracking-wider block">
                  SELECTED NODE
                </span>
                <h4 className="font-bold text-xs text-white mt-1">{currentInspect.name} Department</h4>
                <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">{currentInspect.desc}</p>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-gray-400">Operational Load</span>
                  <span className="font-bold text-white">{currentInspect.load}</span>
                </div>
                <div className="w-full h-1 bg-white/[0.03] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#8ab4f8] rounded-full"
                    style={{ width: currentInspect.load }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
                <div className="bg-[#050505]/20 p-2.5 rounded-[10px] border border-white/[0.02]">
                  <span className="text-gray-500 text-[8px] block">HEADCOUNT</span>
                  <span className="font-bold text-white mt-0.5 block">{currentInspect.FTE}</span>
                </div>
                <div className="bg-[#050505]/20 p-2.5 rounded-[10px] border border-white/[0.02]">
                  <span className="text-gray-500 text-[8px] block">MONTHLY COST</span>
                  <span className="font-bold text-white mt-0.5 block">{currentInspect.cost}</span>
                </div>
              </div>

              <div className="bg-[#050505]/40 p-3 rounded-[12px] border border-white/[0.03] text-[9px] font-mono text-gray-400">
                <span className="text-[#8ab4f8] font-bold uppercase tracking-wider text-[8px] block mb-1">DEPENDENCIES</span>
                <p>{currentInspect.deps}</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.04] mt-4">
            <button
              onClick={runDiagnostic}
              className="w-full btn-action btn-primary py-3 text-[10px]"
            >
              Run Full Twin Diagnostics
            </button>
          </div>
        </div>
      </div>

      {/* 3. Autonomous Bottlenecks & Outage logs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
        
        {/* Anomaly analysis */}
        <div className="card-layer p-5">
          <div className="border-b border-white/[0.04] pb-3 mb-4">
            <h3 className="font-display text-sm font-bold text-white tracking-wide">
              Autonomous Bottleneck Report
            </h3>
            <p className="font-mono text-[9px] text-gray-500 mt-0.5">CRITICAL OPERATIONAL TELEMETRY SLOWDOWNS</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 bg-[#050505]/40 rounded-[12px] border border-white/[0.03] hover:border-amber-500/20 transition-all">
              <div className="min-w-0 flex-1">
                <span className="text-xs text-white font-bold block">Engineering Pipeline Delay</span>
                <p className="text-[10px] text-gray-400 mt-0.5 truncate leading-relaxed">
                  QA automation bottlenecks slowing release pipeline by 1.2 days.
                </p>
              </div>
              <span className="text-[8px] text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20 font-mono font-bold shrink-0">
                MEDIUM
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-[#050505]/40 rounded-[12px] border border-white/[0.03] hover:border-red-400/20 transition-all">
              <div className="min-w-0 flex-1">
                <span className="text-xs text-white font-bold block">Operations Compute Limit</span>
                <p className="text-[10px] text-gray-400 mt-0.5 truncate leading-relaxed">
                  Peak hour AWS cluster utilization exceeding 92% thresholds.
                </p>
              </div>
              <span className="text-[8px] text-red-400 bg-red-400/10 px-2 py-0.5 rounded border border-red-400/20 font-mono font-bold shrink-0">
                CRITICAL
              </span>
            </div>
          </div>
        </div>

        {/* Real-time propagation terminal logs */}
        <div className="card-layer p-5 flex flex-col min-h-[220px]">
          <div className="border-b border-white/[0.04] pb-3 mb-4">
            <h3 className="font-display text-sm font-bold text-white tracking-wide">Risk Propagation Log</h3>
            <p className="font-mono text-[9px] text-gray-500 mt-0.5">AUTONOMOUS SIMULATION TRACE OUTPUTS</p>
          </div>
          <div className="flex-1 bg-[#050505]/60 border border-white/[0.03] rounded-xl p-3 font-mono text-[10px] overflow-y-auto text-gray-400 space-y-1.5 scrollbar-thin">
            {riskLogs.map((log, idx) => {
              let colorClass = "text-gray-400";
              if (log.includes("RISK_TRIGGER") || log.includes("degraded") || log.includes("compromised")) {
                colorClass = log.includes("Operations") || log.includes("AWS Outage") ? "text-red-400" : "text-amber-400";
              } else if (log.includes("[SYSTEM] Telemetry nominal") || log.includes("nominal")) {
                colorClass = "text-[#4edea3]";
              }
              return (
                <div key={idx} className={`${colorClass} flex items-start gap-1 font-light leading-relaxed`}>
                  <span className="text-[#8ab4f8]/50 shrink-0">&raquo;</span>
                  <span>{log}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
