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

/* ─── Node category config ─── */
const categoryConfig: Record<string, { color: string; icon: string }> = {
  People: { color: "#8ab4f8", icon: "person" },
  Project: { color: "#c4b5fd", icon: "rocket_launch" },
  Market: { color: "#4edea3", icon: "public" },
  Risk: { color: "#f28b82", icon: "warning" },
  Report: { color: "#f59e0b", icon: "assessment" },
  Agent: { color: "#80deea", icon: "smart_toy" },
  Metric: { color: "#4edea3", icon: "analytics" },
};

/* ─── Custom Intelligence Node ─── */
function IntelNode({ data, selected }: NodeProps) {
  const d = data as { label: string; category: string; description: string };
  const cfg = categoryConfig[d.category] || categoryConfig.Metric;

  return (
    <div
      className={`bg-[#0d0e12]/95 backdrop-blur-md border rounded-[14px] p-3.5 min-w-[140px] max-w-[170px] transition-all duration-300 group cursor-grab ${
        selected
          ? "border-[#8ab4f8] shadow-[0_0_20px_rgba(138,180,248,0.2)]"
          : "border-white/[0.06] hover:border-white/[0.15]"
      }`}
    >
      <Handle type="target" position={Position.Left} className="!bg-[#8ab4f8] !border-[#0d0e12] !w-2 !h-2" />
      <Handle type="source" position={Position.Right} className="!bg-[#8ab4f8] !border-[#0d0e12] !w-2 !h-2" />

      <div className="flex items-center gap-2 mb-1.5">
        <div
          className="w-7 h-7 rounded-[8px] flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${cfg.color}15`, border: `1px solid ${cfg.color}30` }}
        >
          <span className="material-symbols-outlined text-[14px]" style={{ color: cfg.color }}>
            {cfg.icon}
          </span>
        </div>
        <div className="min-w-0">
          <span className="text-[11px] font-bold text-white block truncate leading-tight">{d.label}</span>
          <span className="text-[9px] uppercase tracking-wider font-bold" style={{ color: cfg.color }}>{d.category}</span>
        </div>
      </div>

      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-1 left-1/2 -translate-x-1/2 translate-y-full z-50 bg-[#0a0b0e] border border-white/[0.1] rounded-[10px] p-3 min-w-[200px] max-w-[260px] shadow-xl pointer-events-none">
        <p className="text-[10px] text-gray-300 leading-relaxed">{d.description}</p>
      </div>
    </div>
  );
}

const nodeTypes = { intel: IntelNode };

/* ─── Graph Data ─── */
const graphNodes: Node[] = [
  // People
  { id: "ceo", type: "intel", position: { x: 400, y: 0 }, data: { label: "CEO", category: "People", description: "Chief Executive Officer. Primary strategic authority with oversight of all business units and final decision-maker for enterprise strategy." } },
  { id: "cfo", type: "intel", position: { x: 150, y: 100 }, data: { label: "CFO", category: "People", description: "Chief Financial Officer. Manages financial planning, treasury, and investor relations. Reports to CEO." } },
  { id: "vp_sales", type: "intel", position: { x: 650, y: 100 }, data: { label: "VP Sales", category: "People", description: "Vice President of Sales. Oversees $32.4M ARR target with 120 reps across enterprise and mid-market segments." } },
  // Projects
  { id: "europe_launch", type: "intel", position: { x: 0, y: 260 }, data: { label: "Europe Expansion", category: "Project", description: "Strategic initiative to enter DACH region. Projected $4.1M incremental revenue over 18 months with 3-person initial sales team." } },
  { id: "product_launch", type: "intel", position: { x: 250, y: 280 }, data: { label: "Mid-Market Launch", category: "Project", description: "New mid-market product tier launching Q2. Targets $15K-50K ACV segment with self-serve capabilities." } },
  // Markets
  { id: "apac_market", type: "intel", position: { x: 500, y: 260 }, data: { label: "APAC Market", category: "Market", description: "Asia-Pacific region contributing $8.4M ARR. Currently experiencing 8% churn increase requiring retention intervention." } },
  { id: "emea_market", type: "intel", position: { x: 750, y: 260 }, data: { label: "EMEA Market", category: "Market", description: "Europe, Middle East & Africa. Fastest growing region at 23% YoY TAM growth. Key expansion target for next 2 quarters." } },
  // Risks
  { id: "churn_risk", type: "intel", position: { x: 100, y: 430 }, data: { label: "APAC Churn Risk", category: "Risk", description: "14 enterprise accounts flagged for potential churn in Q3. $2.3M ARR at risk. Root cause: reduced CSM coverage and competitive pressure." } },
  { id: "supply_risk", type: "intel", position: { x: 380, y: 450 }, data: { label: "Supply Chain Risk", category: "Risk", description: "Three-tier vendor dependency with APAC concentration. 12-day delivery delay risk detected affecting 8 enterprise accounts." } },
  // Reports
  { id: "q3_forecast", type: "intel", position: { x: 620, y: 430 }, data: { label: "Q3 Forecast", category: "Report", description: "Quarterly revenue forecast showing $50.2M projected ARR. 91.8% confidence with primary downside risk from APAC churn." } },
  // Agents
  { id: "market_agent", type: "intel", position: { x: 0, y: 580 }, data: { label: "Market Analyst AI", category: "Agent", description: "Autonomous agent monitoring competitive landscape and market trends. Currently analyzing European expansion opportunity." } },
  { id: "risk_agent", type: "intel", position: { x: 280, y: 580 }, data: { label: "Risk Forecaster AI", category: "Agent", description: "Autonomous agent monitoring risk signals across supply chain, churn indicators, and market volatility." } },
  // Metrics
  { id: "arr_metric", type: "intel", position: { x: 550, y: 580 }, data: { label: "$50.2M ARR", category: "Metric", description: "Annual Recurring Revenue — the primary revenue metric. Growing at 14.2% QoQ with 91.8% forecast confidence." } },
  { id: "nrr_metric", type: "intel", position: { x: 800, y: 580 }, data: { label: "118% NRR", category: "Metric", description: "Net Revenue Retention. Enterprise segment declining from 118% to 109% over 2 quarters. Requires CSM intervention." } },
];

const graphEdges: Edge[] = [
  { id: "e1", source: "ceo", target: "cfo", style: { stroke: "#8ab4f860" } },
  { id: "e2", source: "ceo", target: "vp_sales", style: { stroke: "#8ab4f860" } },
  { id: "e3", source: "cfo", target: "europe_launch", style: { stroke: "#c4b5fd60" } },
  { id: "e4", source: "cfo", target: "product_launch", style: { stroke: "#c4b5fd60" } },
  { id: "e5", source: "vp_sales", target: "apac_market", animated: true, style: { stroke: "#f28b82", strokeWidth: 2 } },
  { id: "e6", source: "vp_sales", target: "emea_market", style: { stroke: "#4edea380" } },
  { id: "e7", source: "apac_market", target: "churn_risk", animated: true, style: { stroke: "#f28b82", strokeWidth: 2 } },
  { id: "e8", source: "supply_risk", target: "apac_market", style: { stroke: "#f28b8260", strokeDasharray: "5 3" } },
  { id: "e9", source: "q3_forecast", target: "arr_metric", style: { stroke: "#4edea380" } },
  { id: "e10", source: "apac_market", target: "nrr_metric", style: { stroke: "#f59e0b60" } },
  { id: "e11", source: "market_agent", target: "europe_launch", animated: true, style: { stroke: "#80deea80" } },
  { id: "e12", source: "risk_agent", target: "churn_risk", animated: true, style: { stroke: "#80deea80" } },
  { id: "e13", source: "risk_agent", target: "supply_risk", animated: true, style: { stroke: "#80deea80" } },
  { id: "e14", source: "emea_market", target: "europe_launch", style: { stroke: "#4edea360" } },
  { id: "e15", source: "ceo", target: "q3_forecast", style: { stroke: "#f59e0b40" } },
];

const filterOptions = ["All", "People", "Project", "Market", "Risk", "Report", "Agent", "Metric"];

export default function KnowledgeGraphPage() {
  const [nodes, , onNodesChange] = useNodesState(graphNodes);
  const [edges, , onEdgesChange] = useEdgesState(graphEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const filteredNodes = useMemo(() => {
    return nodes.map(node => {
      const d = node.data as { label: string; category: string; description: string };
      const matchesSearch = !searchQuery ||
        d.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === "All" || d.category === activeFilter;
      return {
        ...node,
        style: {
          ...node.style,
          opacity: matchesSearch && matchesFilter ? 1 : 0.15,
          transition: "opacity 0.3s ease",
        },
      };
    });
  }, [nodes, searchQuery, activeFilter]);

  const nodeTypesMemo = useMemo(() => nodeTypes, []);
  const currentNodeData = selectedNode?.data as Record<string, string> | undefined;
  const currentCfg = currentNodeData ? categoryConfig[currentNodeData.category] : null;

  return (
    <DashboardLayout>
      {/* Page Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.04] pb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white">
            Enterprise Intelligence Graph
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Explore connections between people, projects, markets, risks, and AI agents
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-[#0d0f14] border border-white/[0.06] rounded-[10px] px-3.5 py-1.5 text-[11px] font-medium text-gray-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
            {graphNodes.length} entities · {graphEdges.length} connections
          </div>
        </div>
      </header>

      {/* Search & Filter Bar */}
      <div className="card-layer p-3.5 flex flex-wrap gap-4 justify-between items-center">
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <span className="material-symbols-outlined text-[#8ab4f8] text-lg">search</span>
          <input
            type="text"
            placeholder="Search entities (e.g. APAC, churn, CFO)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-[#050505]/40 border border-white/[0.06] rounded-[8px] px-3 py-1.5 text-xs text-white placeholder-gray-500 w-full focus:outline-none focus:border-[#8ab4f8] transition-colors"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {filterOptions.map(f => {
            const cfg = categoryConfig[f];
            return (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`text-[11px] px-2.5 py-1 rounded-[6px] cursor-pointer transition-colors border ${
                  activeFilter === f
                    ? "font-bold"
                    : "border-transparent hover:bg-white/[0.02] text-gray-400 hover:text-white"
                }`}
                style={activeFilter === f && cfg ? {
                  backgroundColor: `${cfg.color}10`,
                  color: cfg.color,
                  borderColor: `${cfg.color}30`,
                } : activeFilter === f ? {
                  backgroundColor: "rgba(138,180,248,0.1)",
                  color: "#8ab4f8",
                  borderColor: "rgba(138,180,248,0.3)",
                } : {}}
              >
                {f === "All" ? "All Entities" : f}
              </button>
            );
          })}
        </div>
      </div>

      {/* Graph + Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Canvas */}
        <div className="lg:col-span-8 panel-layer overflow-hidden" style={{ height: "560px" }}>
          <ReactFlow
            nodes={filteredNodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypesMemo}
            fitView
            fitViewOptions={{ padding: 0.25 }}
            minZoom={0.3}
            maxZoom={2.0}
            proOptions={{ hideAttribution: true }}
          >
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="rgba(255,255,255,0.03)" />
            <Controls showInteractive={false} />
          </ReactFlow>
        </div>

        {/* Detail Sidebar */}
        <div className="lg:col-span-4 panel-layer p-6 flex flex-col justify-between" style={{ height: "560px" }}>
          {selectedNode && currentNodeData && currentCfg ? (
            <div className="space-y-5">
              <div className="border-b border-white/[0.04] pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-8 h-8 rounded-[10px] flex items-center justify-center"
                    style={{ backgroundColor: `${currentCfg.color}15`, border: `1px solid ${currentCfg.color}30` }}
                  >
                    <span className="material-symbols-outlined text-[16px]" style={{ color: currentCfg.color }}>
                      {currentCfg.icon}
                    </span>
                  </div>
                  <div>
                    <span
                      className="text-[9px] uppercase tracking-widest font-bold block"
                      style={{ color: currentCfg.color }}
                    >
                      {currentNodeData.category}
                    </span>
                    <h3 className="font-display text-lg font-bold text-white">{currentNodeData.label}</h3>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-300 leading-relaxed">{currentNodeData.description}</p>

              <div>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold block mb-2">Connections</span>
                <div className="space-y-1.5">
                  {edges
                    .filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
                    .map(e => {
                      const connectedId = e.source === selectedNode.id ? e.target : e.source;
                      const connectedNode = graphNodes.find(n => n.id === connectedId);
                      if (!connectedNode) return null;
                      const cd = connectedNode.data as Record<string, string>;
                      const ccfg = categoryConfig[cd.category];
                      return (
                        <button
                          key={e.id}
                          onClick={() => setSelectedNode(connectedNode)}
                          className="flex items-center gap-2 bg-[#050505]/40 border border-white/[0.03] p-2.5 rounded-[10px] text-[11px] text-white w-full hover:border-white/[0.1] transition-colors cursor-pointer text-left"
                        >
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: ccfg?.color || "#8ab4f8" }}></span>
                          <span className="truncate">{cd.label}</span>
                          <span className="text-[9px] ml-auto shrink-0" style={{ color: ccfg?.color || "#8ab4f8" }}>{cd.category}</span>
                        </button>
                      );
                    })}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-3 text-gray-500">
              <span className="material-symbols-outlined text-[40px] opacity-30">hub</span>
              <p className="text-sm">Click any entity to explore its connections and intelligence</p>
            </div>
          )}

          {/* Legend */}
          <div className="pt-4 border-t border-white/[0.04] mt-auto">
            <div className="grid grid-cols-2 gap-1.5 text-[10px]">
              {Object.entries(categoryConfig).map(([cat, cfg]) => (
                <div key={cat} className="flex items-center gap-2 text-gray-500">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cfg.color }}></span>
                  <span>{cat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
