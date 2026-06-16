"use client";

import React, { useState, useCallback, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  type Node,
  type Edge,
  type NodeProps,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

/* ─── Custom Node Component ─── */
function EnterpriseNode({ data, selected }: NodeProps) {
  const d = data as {
    label: string;
    icon: string;
    impact: string;
    risk: string;
    contribution: string;
    description: string;
    accentColor: string;
  };

  return (
    <div
      className={`bg-[#0d0e12]/95 backdrop-blur-md border rounded-[16px] p-4 min-w-[160px] max-w-[180px] transition-all duration-300 group cursor-grab ${
        selected
          ? "border-[#8ab4f8] shadow-[0_0_24px_rgba(138,180,248,0.2)]"
          : "border-white/[0.06] hover:border-white/[0.15]"
      }`}
    >
      <Handle type="target" position={Position.Left} className="!bg-[#8ab4f8] !border-[#0d0e12] !w-2 !h-2" />
      <Handle type="source" position={Position.Right} className="!bg-[#8ab4f8] !border-[#0d0e12] !w-2 !h-2" />

      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-8 h-8 rounded-[10px] flex items-center justify-center"
          style={{ backgroundColor: `${d.accentColor}15`, border: `1px solid ${d.accentColor}30` }}
        >
          <span className="material-symbols-outlined text-[16px]" style={{ color: d.accentColor }}>
            {d.icon}
          </span>
        </div>
        <span className="text-xs font-bold text-white leading-tight">{d.label}</span>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between text-[10px]">
          <span className="text-gray-500">Impact</span>
          <span className="text-white font-bold">{d.impact}</span>
        </div>
        <div className="flex justify-between text-[10px]">
          <span className="text-gray-500">Risk</span>
          <span className={`font-bold ${d.risk === "High" ? "text-[#f28b82]" : d.risk === "Medium" ? "text-[#f59e0b]" : "text-[#4edea3]"}`}>
            {d.risk}
          </span>
        </div>
        <div className="flex justify-between text-[10px]">
          <span className="text-gray-500">Contribution</span>
          <span className="text-[#8ab4f8] font-bold">{d.contribution}</span>
        </div>
      </div>

      {/* Tooltip on hover */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-2 left-1/2 -translate-x-1/2 translate-y-full z-50 bg-[#0a0b0e] border border-white/[0.1] rounded-[10px] p-3 min-w-[200px] max-w-[240px] shadow-xl pointer-events-none">
        <p className="text-[10px] text-gray-300 leading-relaxed">{d.description}</p>
      </div>
    </div>
  );
}

/* ─── Node Type Registry ─── */
const nodeTypes = { enterprise: EnterpriseNode };

/* ─── Primary Metrics ─── */
const primaryMetrics = [
  { label: "Revenue", value: "Revenue" },
  { label: "Profit", value: "Profit" },
  { label: "Growth", value: "Growth" },
  { label: "Customer Retention", value: "Retention" },
  { label: "Market Expansion", value: "Expansion" },
];

/* ─── Graph Data ─── */
const initialNodes: Node[] = [
  { id: "revenue", type: "enterprise", position: { x: 450, y: 0 }, data: { label: "Revenue", icon: "payments", impact: "$50.2M ARR", risk: "Medium", contribution: "Core metric", description: "Total annual recurring revenue across all segments and regions. Primary north-star metric for executive decision-making.", accentColor: "#4edea3" } },
  { id: "sales", type: "enterprise", position: { x: 50, y: 140 }, data: { label: "Sales", icon: "storefront", impact: "$32.4M", risk: "Low", contribution: "64%", description: "Direct and partner-led sales across enterprise, mid-market, and SMB segments. 120 reps across 3 regions.", accentColor: "#8ab4f8" } },
  { id: "marketing", type: "enterprise", position: { x: 280, y: 160 }, data: { label: "Marketing", icon: "campaign", impact: "$8.2M pipeline", risk: "Medium", contribution: "18%", description: "Demand generation, brand, and product marketing. $4.2M quarterly budget with 2.8x pipeline coverage.", accentColor: "#c4b5fd" } },
  { id: "customer_success", type: "enterprise", position: { x: 650, y: 140 }, data: { label: "Customer Success", icon: "support_agent", impact: "118% NRR", risk: "High", contribution: "24%", description: "Post-sale relationship management, renewal execution, and expansion revenue. APAC NRR declining to 109%.", accentColor: "#f59e0b" } },
  { id: "products", type: "enterprise", position: { x: 880, y: 160 }, data: { label: "Products", icon: "inventory_2", impact: "3 tiers", risk: "Low", contribution: "Platform", description: "Enterprise, Professional, and Starter tiers. New mid-market tier planned for Q2 launch.", accentColor: "#8ab4f8" } },
  { id: "finance", type: "enterprise", position: { x: 100, y: 340 }, data: { label: "Finance", icon: "account_balance", impact: "$12.4M burn", risk: "Low", contribution: "Controls", description: "Financial planning, treasury, and investor relations. 18-month runway at current burn rate.", accentColor: "#4edea3" } },
  { id: "operations", type: "enterprise", position: { x: 370, y: 340 }, data: { label: "Operations", icon: "precision_manufacturing", impact: "1.42x efficiency", risk: "Low", contribution: "Enabler", description: "Infrastructure, IT, procurement, and business operations. Driving 14% YoY efficiency improvement.", accentColor: "#8ab4f8" } },
  { id: "supply_chain", type: "enterprise", position: { x: 620, y: 360 }, data: { label: "Supply Chain", icon: "local_shipping", impact: "3-tier vendor", risk: "High", contribution: "Critical", description: "Three-tier vendor dependency with APAC concentration. 12-day delay risk detected in logistics nodes.", accentColor: "#f28b82" } },
  { id: "partners", type: "enterprise", position: { x: 870, y: 340 }, data: { label: "Partners", icon: "handshake", impact: "$6.8M indirect", risk: "Medium", contribution: "14%", description: "Channel partners, technology alliances, and reseller network. 42 active partners across EMEA and Americas.", accentColor: "#c4b5fd" } },
  { id: "apac", type: "enterprise", position: { x: 50, y: 520 }, data: { label: "APAC Region", icon: "public", impact: "$8.4M", risk: "High", contribution: "17%", description: "Asia-Pacific region with 8% churn increase trend. Key risk concentration area requiring immediate attention.", accentColor: "#f28b82" } },
  { id: "emea", type: "enterprise", position: { x: 350, y: 520 }, data: { label: "EMEA Region", icon: "public", impact: "$14.2M", risk: "Low", contribution: "28%", description: "Europe, Middle East & Africa. Fastest growing region with 23% YoY TAM expansion. DACH entry recommended.", accentColor: "#4edea3" } },
  { id: "americas", type: "enterprise", position: { x: 670, y: 520 }, data: { label: "Americas", icon: "public", impact: "$27.6M", risk: "Low", contribution: "55%", description: "Largest revenue region with stable growth. Mature market with focus on expansion and upsell.", accentColor: "#8ab4f8" } },
];

const initialEdges: Edge[] = [
  { id: "e-sales-rev", source: "sales", target: "revenue", animated: true, style: { stroke: "#8ab4f8", strokeWidth: 2 } },
  { id: "e-mkt-rev", source: "marketing", target: "revenue", animated: true, style: { stroke: "#c4b5fd", strokeWidth: 2 } },
  { id: "e-cs-rev", source: "customer_success", target: "revenue", animated: true, style: { stroke: "#f59e0b", strokeWidth: 2 } },
  { id: "e-prod-rev", source: "products", target: "revenue", style: { stroke: "#8ab4f8", strokeWidth: 1.5 } },
  { id: "e-fin-sales", source: "finance", target: "sales", style: { stroke: "#4edea380", strokeWidth: 1.5 } },
  { id: "e-ops-mkt", source: "operations", target: "marketing", style: { stroke: "#8ab4f860", strokeWidth: 1.5 } },
  { id: "e-ops-cs", source: "operations", target: "customer_success", style: { stroke: "#8ab4f860", strokeWidth: 1.5 } },
  { id: "e-sc-ops", source: "supply_chain", target: "operations", animated: true, style: { stroke: "#f28b82", strokeWidth: 2 } },
  { id: "e-part-sales", source: "partners", target: "products", style: { stroke: "#c4b5fd60", strokeWidth: 1.5 } },
  { id: "e-apac-sales", source: "apac", target: "sales", style: { stroke: "#f28b8280", strokeWidth: 1.5, strokeDasharray: "5 3" } },
  { id: "e-apac-cs", source: "apac", target: "customer_success", animated: true, style: { stroke: "#f28b82", strokeWidth: 2, strokeDasharray: "5 3" } },
  { id: "e-emea-sales", source: "emea", target: "sales", style: { stroke: "#4edea380", strokeWidth: 1.5 } },
  { id: "e-amer-sales", source: "americas", target: "sales", style: { stroke: "#8ab4f860", strokeWidth: 1.5 } },
  { id: "e-sc-apac", source: "supply_chain", target: "apac", animated: true, style: { stroke: "#f28b82", strokeWidth: 2 } },
  { id: "e-part-emea", source: "partners", target: "emea", style: { stroke: "#c4b5fd60", strokeWidth: 1.5 } },
];

export default function DigitalTwinPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedMetric, setSelectedMetric] = useState("Revenue");
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const nodeTypesMemo = useMemo(() => nodeTypes, []);

  const currentNodeData = selectedNode?.data as Record<string, string> | undefined;

  return (
    <DashboardLayout>
      {/* Page Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.04] pb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white">
            Enterprise Impact Map
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Visualize business dependencies, risk propagation, and financial impact across your organization
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 bg-[#0d0f14] border border-white/[0.06] rounded-[10px] px-3.5 py-1.5 text-[11px] font-medium text-gray-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
            Live sync · 12 departments
          </div>
        </div>
      </header>

      {/* Metric Selector */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">Primary Metric:</span>
        {primaryMetrics.map(pm => (
          <button
            key={pm.value}
            onClick={() => setSelectedMetric(pm.value)}
            className={`text-[11px] px-3.5 py-1.5 rounded-full border transition-all cursor-pointer ${
              selectedMetric === pm.value
                ? "bg-[#8ab4f8]/10 text-[#8ab4f8] border-[#8ab4f8]/30 font-bold"
                : "text-gray-400 border-white/[0.04] hover:border-white/[0.1] hover:text-white"
            }`}
          >
            {pm.label}
          </button>
        ))}
      </div>

      {/* Graph + Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* React Flow Canvas */}
        <div className="lg:col-span-8 panel-layer overflow-hidden" style={{ height: "580px" }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypesMemo}
            fitView
            fitViewOptions={{ padding: 0.3 }}
            minZoom={0.4}
            maxZoom={1.8}
            proOptions={{ hideAttribution: true }}
          >
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="rgba(255,255,255,0.03)" />
            <Controls showInteractive={false} />
          </ReactFlow>
        </div>

        {/* Department Detail Panel */}
        <div className="lg:col-span-4 panel-layer p-6 flex flex-col justify-between" style={{ height: "580px" }}>
          {selectedNode && currentNodeData ? (
            <div className="space-y-5">
              <div className="border-b border-white/[0.04] pb-4">
                <span className="text-[10px] text-[#8ab4f8] uppercase tracking-widest font-bold">Department Detail</span>
                <h3 className="font-display text-lg font-bold text-white mt-1">{currentNodeData.label}</h3>
              </div>

              <p className="text-sm text-gray-300 leading-relaxed">{currentNodeData.description}</p>

              <div className="space-y-3">
                <div className="bg-[#050505]/40 p-3.5 rounded-[12px] border border-white/[0.03]">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Financial Impact</span>
                  <span className="text-lg font-bold text-white">{currentNodeData.impact}</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#050505]/40 p-3 rounded-[12px] border border-white/[0.03]">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Risk Level</span>
                    <span className={`text-sm font-bold ${currentNodeData.risk === "High" ? "text-[#f28b82]" : currentNodeData.risk === "Medium" ? "text-[#f59e0b]" : "text-[#4edea3]"}`}>
                      {currentNodeData.risk}
                    </span>
                  </div>
                  <div className="bg-[#050505]/40 p-3 rounded-[12px] border border-white/[0.03]">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Contribution</span>
                    <span className="text-sm font-bold text-[#8ab4f8]">{currentNodeData.contribution}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-3 text-gray-500">
              <span className="material-symbols-outlined text-[40px] opacity-30">touch_app</span>
              <p className="text-sm">Click any department node to inspect its business telemetry</p>
            </div>
          )}

          <div className="pt-4 border-t border-white/[0.04] mt-auto">
            <div className="text-[10px] text-gray-500 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-[2px] bg-[#8ab4f8] rounded"></span>
                <span>Dependency flow</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-[2px] bg-[#f28b82] rounded" style={{ borderBottom: "2px dashed #f28b82" }}></span>
                <span>Risk propagation path</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-[2px] bg-[#4edea3] rounded"></span>
                <span>Revenue contribution</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
