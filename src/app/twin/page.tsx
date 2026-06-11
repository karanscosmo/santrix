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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-md">
          {/* Visual Network Mapping of Twin (Department nodes) */}
          <div className="lg:col-span-8 glass-panel rounded-xl p-md flex flex-col h-[500px] relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-outline-variant/30 pb-sm mb-md gap-sm">
              <div>
                <h3 className="font-display text-headline-md text-on-surface text-[18px]">
                  Dependency Tree & Risk Flow
                </h3>
                <p className="font-mono text-xs text-on-surface-variant mt-1">
                  SIMULATE FAILURE PROPAGATION ACROSS BUSINESS VECTORS
                </p>
              </div>
              <div className="flex gap-sm">
                <button
                  onClick={() => triggerRiskPropagation("aws")}
                  className="bg-error/25 hover:bg-error/35 border border-error text-error text-[10px] font-mono px-2 py-1 rounded cursor-pointer transition-colors"
                >
                  Simulate AWS Outage
                </button>
                <button
                  onClick={() => triggerRiskPropagation("dev")}
                  className="bg-secondary/25 hover:bg-secondary/35 border border-secondary text-secondary text-[10px] font-mono px-2 py-1 rounded cursor-pointer transition-colors"
                >
                  Simulate Dev Delay
                </button>
                <button
                  onClick={resetTwin}
                  className="border border-outline text-on-surface-variant text-[10px] font-mono px-2 py-1 rounded cursor-pointer hover:bg-surface-container-highest transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Twin Map Canvas/SVG */}
            <div className="flex-1 bg-surface-container-lowest/30 rounded border border-outline-variant/30 relative flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-radial from-surface-container-highest/10 via-surface-dim/80 to-surface-dim pointer-events-none"></div>

              {/* Dynamic Connecting Lines SVG */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                {/* Product -> Engineering */}
                <line
                  x1="120"
                  y1="250"
                  x2="280"
                  y2="150"
                  stroke={nodeHealth.Engineering.val < 60 ? "#ffb955" : "#8c90a1"}
                  strokeWidth="2"
                  className={nodeHealth.Engineering.val < 60 ? "connection-line stroke-secondary" : ""}
                />
                {/* Product -> Marketing */}
                <line
                  x1="120"
                  y1="250"
                  x2="280"
                  y2="350"
                  stroke="#8c90a1"
                  strokeWidth="2"
                />
                {/* Engineering -> Operations */}
                <line
                  x1="392"
                  y1="150"
                  x2="520"
                  y2="150"
                  stroke={nodeHealth.Operations.val < 50 ? "#ffb4ab" : "#8c90a1"}
                  strokeWidth="2"
                  className={nodeHealth.Operations.val < 50 ? "connection-line stroke-error" : ""}
                />
                {/* Marketing -> Sales */}
                <line
                  x1="392"
                  y1="350"
                  x2="520"
                  y2="350"
                  stroke="#8c90a1"
                  strokeWidth="2"
                />
                {/* Operations -> Sales */}
                <line
                  x1="576"
                  y1="190"
                  x2="576"
                  y2="310"
                  stroke={nodeHealth.Sales.val < 80 ? "#ffb955" : "#8c90a1"}
                  strokeWidth="2"
                  strokeDasharray="4"
                  className={nodeHealth.Sales.val < 80 ? "connection-line" : ""}
                />
              </svg>

              {/* Interactive Nodes */}
              {/* Product */}
              <button
                onClick={() => setSelectedNode("Product")}
                className={`absolute left-10 top-1/2 -translate-y-1/2 bg-surface-container-high border p-sm rounded text-center cursor-pointer transition-all w-24 ${
                  selectedNode === "Product" ? "border-white glow-primary" : "border-primary/50 hover:border-white"
                }`}
              >
                <span className="material-symbols-outlined text-primary text-xl">design_services</span>
                <div className="font-mono text-xs mt-1">Product</div>
                <span className="text-[9px] text-tertiary">HEALTH: {nodeHealth.Product.val}%</span>
              </button>

              {/* Engineering */}
              <button
                onClick={() => setSelectedNode("Engineering")}
                className={`absolute left-[260px] top-1/4 -translate-y-1/2 bg-surface-container-high border p-sm rounded text-center cursor-pointer transition-all w-28 ${
                  selectedNode === "Engineering" ? "border-white glow-primary" : ""
                } ${
                  nodeHealth.Engineering.val < 60
                    ? "border-secondary/80 animate-pulse text-secondary"
                    : "border-primary/50 hover:border-white"
                }`}
              >
                <span className="material-symbols-outlined text-primary text-xl">developer_board</span>
                <div className="font-mono text-xs mt-1">Engineering</div>
                <span className={`text-[9px] font-bold ${nodeHealth.Engineering.colorClass}`}>
                  HEALTH: {nodeHealth.Engineering.val}% {nodeHealth.Engineering.status !== "NOMINAL" && nodeHealth.Engineering.status}
                </span>
              </button>

              {/* Marketing */}
              <button
                onClick={() => setSelectedNode("Marketing")}
                className={`absolute left-[260px] bottom-1/4 translate-y-1/2 bg-surface-container-high border p-sm rounded text-center cursor-pointer transition-all w-28 ${
                  selectedNode === "Marketing" ? "border-white glow-primary" : "border-primary/50 hover:border-white"
                }`}
              >
                <span className="material-symbols-outlined text-primary text-xl">campaign</span>
                <div className="font-mono text-xs mt-1">Marketing</div>
                <span className="text-[9px] text-tertiary">HEALTH: {nodeHealth.Marketing.val}%</span>
              </button>

              {/* Operations */}
              <button
                onClick={() => setSelectedNode("Operations")}
                className={`absolute right-[120px] top-1/4 -translate-y-1/2 bg-surface-container-high border p-sm rounded text-center cursor-pointer transition-all w-28 ${
                  selectedNode === "Operations" ? "border-white glow-primary" : ""
                } ${
                  nodeHealth.Operations.val < 50
                    ? "border-error/80 animate-pulse text-error"
                    : "border-primary/50 hover:border-white"
                }`}
              >
                <span className="material-symbols-outlined text-primary text-xl">cloud_done</span>
                <div className="font-mono text-xs mt-1">Operations</div>
                <span className={`text-[9px] font-bold ${nodeHealth.Operations.colorClass}`}>
                  HEALTH: {nodeHealth.Operations.val}% {nodeHealth.Operations.status !== "NOMINAL" && nodeHealth.Operations.status}
                </span>
              </button>

              {/* Sales */}
              <button
                onClick={() => setSelectedNode("Sales")}
                className={`absolute right-[120px] bottom-1/4 translate-y-1/2 bg-surface-container-high border p-sm rounded text-center cursor-pointer transition-all w-28 ${
                  selectedNode === "Sales" ? "border-white glow-primary" : ""
                } ${
                  nodeHealth.Sales.val < 80
                    ? "border-secondary/80 animate-pulse text-secondary"
                    : "border-primary/50 hover:border-white"
                }`}
              >
                <span className="material-symbols-outlined text-primary text-xl">payments</span>
                <div className="font-mono text-xs mt-1">Sales</div>
                <span className={`text-[9px] font-bold ${nodeHealth.Sales.colorClass}`}>
                  HEALTH: {nodeHealth.Sales.val}% {nodeHealth.Sales.status !== "NOMINAL" && nodeHealth.Sales.status}
                </span>
              </button>
            </div>
          </div>

          {/* Inspect Panel / Twin Settings */}
          <div className="lg:col-span-4 glass-panel rounded-xl p-md flex flex-col justify-between h-[500px]">
            <div className="border-b border-outline-variant/30 pb-sm mb-sm">
              <h3 className="font-display text-headline-md text-on-surface text-[18px]">Department Telemetry</h3>
              <p className="font-mono text-xs text-on-surface-variant mt-1">NODE INSPECTION DETAILS</p>
            </div>

            <div className="flex-grow space-y-md my-md">
              <div className="bg-surface-container p-sm rounded border border-outline-variant">
                <span className="font-sans text-[10px] text-primary block font-semibold uppercase tracking-wider">
                  SELECTED NODE
                </span>
                <h4 className="font-bold text-sm text-on-surface mt-1">{currentInspect.name} Department</h4>
                <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">{currentInspect.desc}</p>
              </div>
              <div className="space-y-sm">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-on-surface-variant font-mono">Operational Load</span>
                  <span className="font-bold text-on-surface font-mono">{currentInspect.load}</span>
                </div>
                <div className="w-full h-1 bg-surface-container-highest rounded">
                  <div
                    className="h-full bg-primary rounded transition-all duration-300"
                    style={{ width: currentInspect.load }}
                  ></div>
                </div>
              </div>
              <div className="space-y-xs">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-on-surface-variant font-mono">Headcount Utilization</span>
                  <span className="font-bold text-on-surface font-mono">{currentInspect.FTE}</span>
                </div>
              </div>
              <div className="space-y-xs">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-on-surface-variant font-mono">Monthly Operating Cost</span>
                  <span className="font-bold text-on-surface font-mono">{currentInspect.cost}</span>
                </div>
              </div>
              <div className="bg-surface-container-low p-sm rounded border border-outline-variant text-[11px] font-mono text-on-surface-variant">
                <span className="text-primary font-bold">DEPENDENTS</span>
                <p className="mt-1">{currentInspect.deps}</p>
              </div>
            </div>

            <div className="pt-sm border-t border-outline-variant/30">
              <button
                onClick={runDiagnostic}
                className="w-full bg-primary text-on-primary font-semibold text-xs tracking-wider uppercase text-center py-sm rounded hover:bg-primary-container transition-all cursor-pointer"
              >
                Run Complete Twin Diagnostics
              </button>
            </div>
          </div>
        </div>

        {/* Department Bottlenecks & Risk Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          {/* Bottleneck list */}
          <div className="glass-panel rounded-xl p-md">
            <div className="border-b border-outline-variant/30 pb-sm mb-sm">
              <h3 className="font-display text-headline-md text-on-surface text-[18px]">
                Autonomous Bottleneck Analysis
              </h3>
              <p className="font-mono text-xs text-on-surface-variant mt-1">CRITICAL OPERATIONAL SLOWDOWNS</p>
            </div>
            <div className="space-y-sm my-sm">
              <div className="flex justify-between items-center p-sm bg-surface-container rounded border border-outline-variant/50">
                <div>
                  <span className="text-xs text-on-surface font-bold">Engineering Pipeline Delay</span>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">
                    QA automation bottlenecks slowing release pipeline by 1.2 days.
                  </p>
                </div>
                <span className="text-xs text-secondary bg-secondary/10 px-1.5 py-0.5 rounded font-mono font-bold">
                  MEDIUM
                </span>
              </div>
              <div className="flex justify-between items-center p-sm bg-surface-container rounded border border-outline-variant/50">
                <div>
                  <span className="text-xs text-on-surface font-bold">Operations Compute Limit</span>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">
                    Peak hour AWS cluster utilization exceeding 92% thresholds.
                  </p>
                </div>
                <span className="text-xs text-error bg-error/10 px-1.5 py-0.5 rounded font-mono font-bold">
                  CRITICAL
                </span>
              </div>
            </div>
          </div>

          {/* Simulation Output Terminal */}
          <div className="glass-panel rounded-xl p-md flex flex-col justify-between">
            <div className="border-b border-outline-variant/30 pb-sm mb-sm">
              <h3 className="font-display text-headline-md text-on-surface text-[18px]">Risk Propagation Log</h3>
              <p className="font-mono text-xs text-on-surface-variant mt-1">AUTONOMOUS TRIGGER EVENT TELEMETRY</p>
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant/60 rounded p-sm font-mono text-xs h-[100px] overflow-y-auto text-on-surface-variant space-y-1">
              {riskLogs.map((log, index) => {
                let colorClass = "text-on-surface-variant";
                if (log.includes("RISK_TRIGGER") || log.includes("degraded") || log.includes("compromised")) {
                  colorClass = log.includes("Operations") || log.includes("AWS Outage") ? "text-error" : "text-secondary";
                } else if (log.includes("[SYSTEM] Telemetry nominal") || log.includes("nominal")) {
                  colorClass = "text-tertiary";
                }
                return (
                  <div key={index} className={colorClass}>
                    {log}
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
