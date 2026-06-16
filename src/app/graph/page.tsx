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
import { ExecutiveRecommendationPanel, RecommendationProps } from "@/components/ExecutiveRecommendationPanel";

const categoryConfig: Record<string, { color: string; icon: string }> = {
  People: { color: "#8ab4f8", icon: "person" },
  Project: { color: "#c4b5fd", icon: "rocket_launch" },
  Market: { color: "#4edea3", icon: "public" },
  Risk: { color: "#f28b82", icon: "warning" },
  Report: { color: "#f59e0b", icon: "assessment" },
  Agent: { color: "#80deea", icon: "smart_toy" },
  Metric: { color: "#4edea3", icon: "analytics" },
};

function IntelNode({ data, selected }: NodeProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const d = data as any;
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
    </div>
  );
}

const nodeTypes = { intel: IntelNode };

const graphNodes: Node[] = [
  // People
  { id: "ceo", type: "intel", position: { x: 400, y: 0 }, data: { label: "CEO", category: "People", businessMeaning: "Chief Executive Officer. Primary strategic authority with oversight of all business units.", risks: "Execution drift across departments.", opportunities: "M&A target acquisitions.", decisions: "Q3 Budget Approval, DACH Expansion", recommendationData: { type: "RECOMMENDATION", title: "Approve DACH Expansion", context: "DACH expansion models show rapid breakeven.", action: "Sign off on Q3 expansion budget.", outcome: "+$4.1M ARR", confidence: 86, impact: "High", horizon: "18 Months" } } },
  { id: "cfo", type: "intel", position: { x: 150, y: 100 }, data: { label: "CFO", category: "People", businessMeaning: "Chief Financial Officer. Manages financial planning and treasury.", risks: "Treasury yield compression.", opportunities: "Tax optimization in EU.", decisions: "Capital Allocation, R&D Investment", recommendationData: { type: "RECOMMENDATION", title: "R&D Cap Ex Shift", context: "Current tax laws favor R&D cap ex.", action: "Shift OPEX to CAPEX for mid-market.", outcome: "12% Tax Savings", confidence: 91, impact: "Medium", horizon: "6 Months" } } },
  { id: "vp_sales", type: "intel", position: { x: 650, y: 100 }, data: { label: "VP Sales", category: "People", businessMeaning: "Vice President of Sales. Oversees $32.4M ARR target.", risks: "Q3 pipeline missing coverage ratio.", opportunities: "Partner channel expansion.", decisions: "Sales Incentive Structure", recommendationData: { type: "OPPORTUNITY", title: "Revise SPIFFs", context: "Mid-market product lacks sales focus.", action: "Double SPIFFs for mid-market bundle.", outcome: "Accelerate mid-market adoption.", confidence: 85, impact: "+$800K Pipe", horizon: "30 Days" } } },
  // Projects
  { id: "europe_launch", type: "intel", position: { x: 0, y: 260 }, data: { label: "Europe Expansion", category: "Project", businessMeaning: "Strategic initiative to enter DACH region.", risks: "Regulatory compliance delays.", opportunities: "First-mover advantage in DACH.", decisions: "Localize vs Translate Product", recommendationData: { type: "RECOMMENDATION", title: "Full Localization", context: "DACH market rejects poor translations.", action: "Invest $120K in native localization.", outcome: "Reduce sales cycle by 22 days.", confidence: 89, impact: "Faster Sales", horizon: "90 Days" } } },
  { id: "product_launch", type: "intel", position: { x: 250, y: 280 }, data: { label: "Mid-Market Launch", category: "Project", businessMeaning: "New product tier targeting $15K-50K ACV.", risks: "Cannibalizing enterprise tier.", opportunities: "Opening $240M TAM.", decisions: "Pricing Structure", recommendationData: { type: "OPPORTUNITY", title: "Volume Pricing", context: "Mid-market prefers seat-based pricing.", action: "Implement sliding scale per-seat model.", outcome: "Increase conversion by 14%.", confidence: 82, impact: "+14% Conv", horizon: "60 Days" } } },
  // Markets
  { id: "apac_market", type: "intel", position: { x: 500, y: 260 }, data: { label: "APAC Market", category: "Market", businessMeaning: "Asia-Pacific region contributing $8.4M ARR.", risks: "8% churn spike.", opportunities: "Local partner networks.", decisions: "Customer Success Resource Allocation", recommendationData: { type: "RISK", title: "APAC Churn Crisis", context: "Enterprise accounts churning to RegionPay.", action: "Deploy dedicated APAC success team.", outcome: "Halt 8% churn bleed.", confidence: 94, impact: "$2.3M Saved", horizon: "30 Days" } } },
  { id: "emea_market", type: "intel", position: { x: 750, y: 260 }, data: { label: "EMEA Market", category: "Market", businessMeaning: "Europe, Middle East & Africa.", risks: "GDPR compliance changes.", opportunities: "23% YoY TAM growth.", decisions: "Regional HQ Location", recommendationData: { type: "RECOMMENDATION", title: "Frankfurt HQ", context: "DACH is primary target.", action: "Sign lease for Frankfurt hub.", outcome: "Establish localized presence.", confidence: 91, impact: "Strategic", horizon: "45 Days" } } },
  // Risks
  { id: "churn_risk", type: "intel", position: { x: 100, y: 430 }, data: { label: "APAC Churn Risk", category: "Risk", businessMeaning: "14 enterprise accounts flagged for potential churn.", risks: "Contagion to global accounts.", opportunities: "Save campaigns yield high loyalty.", decisions: "Discount Approvals", recommendationData: { type: "RISK", title: "Aggressive Save Offers", context: "Accounts are 30 days from non-renewal.", action: "Authorize up to 20% save discounts.", outcome: "Retain $1.8M ARR.", confidence: 88, impact: "$1.8M Retained", horizon: "Immediate" } } },
  { id: "supply_risk", type: "intel", position: { x: 380, y: 450 }, data: { label: "Supply Chain Risk", category: "Risk", businessMeaning: "Three-tier vendor dependency.", risks: "12-day delivery delays.", opportunities: "Diversifying to LATAM.", decisions: "Secondary Supplier Onboarding", recommendationData: { type: "RISK", title: "Supplier Diversification", context: "APAC delays threatening enterprise SLA.", action: "Onboard LATAM backup supplier.", outcome: "Eliminate SLA penalties.", confidence: 95, impact: "-$400K Risk", horizon: "60 Days" } } },
  // Reports
  { id: "q3_forecast", type: "intel", position: { x: 620, y: 430 }, data: { label: "Q3 Forecast", category: "Report", businessMeaning: "Quarterly revenue forecast.", risks: "Missed pipeline targets.", opportunities: "Exceeding street expectations.", decisions: "Guidance Revision", recommendationData: { type: "RECOMMENDATION", title: "Maintain Guidance", context: "Wolfram models show 91% chance to hit base.", action: "Do not revise public guidance.", outcome: "Stock stability.", confidence: 91, impact: "Stable", horizon: "End of Quarter" } } },
  // Agents
  { id: "market_agent", type: "intel", position: { x: 0, y: 580 }, data: { label: "Market Analyst AI", category: "Agent", businessMeaning: "Autonomous agent monitoring competitive landscape.", risks: "Hallucinated data.", opportunities: "Real-time pricing intel.", decisions: "Competitive Pricing Adjustments", recommendationData: { type: "RECOMMENDATION", title: "Price Match Guarantee", context: "Competitors are aggressively discounting.", action: "Implement dynamic price matching.", outcome: "Protect win rates.", confidence: 84, impact: "Win Rates Up", horizon: "Ongoing" } } },
  { id: "risk_agent", type: "intel", position: { x: 280, y: 580 }, data: { label: "Risk Forecaster AI", category: "Agent", businessMeaning: "Autonomous agent monitoring risk signals.", risks: "False positives.", opportunities: "Early warning detection.", decisions: "Automated SLA Pauses", recommendationData: { type: "OPPORTUNITY", title: "Automate Supply Alerts", context: "Agent can auto-notify customers of delays.", action: "Enable auto-communications.", outcome: "Improve customer trust.", confidence: 89, impact: "High Trust", horizon: "14 Days" } } },
  // Metrics
  { id: "arr_metric", type: "intel", position: { x: 550, y: 580 }, data: { label: "$50.2M ARR", category: "Metric", businessMeaning: "Total Annual Recurring Revenue.", risks: "Macro downturn.", opportunities: "Cross-sell expansion.", decisions: "Growth Investment Sizing", recommendationData: { type: "RECOMMENDATION", title: "Reinvest Free Cash", context: "Growth is stable, cash yield is low.", action: "Deploy $2M into marketing.", outcome: "Accelerate to $55M ARR.", confidence: 81, impact: "+$5M ARR", horizon: "12 Months" } } },
  { id: "nrr_metric", type: "intel", position: { x: 800, y: 580 }, data: { label: "118% NRR", category: "Metric", businessMeaning: "Net Revenue Retention.", risks: "Declining enterprise health.", opportunities: "New module upselling.", decisions: "CSM Compensation", recommendationData: { type: "RECOMMENDATION", title: "Bonus on Expansion", context: "CSMs are focused only on renewals.", action: "Introduce 2% commission on cross-sells.", outcome: "Boost NRR to 120%.", confidence: 92, impact: "+200bps NRR", horizon: "90 Days" } } },
];

const graphEdges: Edge[] = [
  { id: "e1", source: "ceo", target: "cfo", style: { stroke: "#8ab4f860" } },
  { id: "e2", source: "ceo", target: "vp_sales", style: { stroke: "#8ab4f860" } },
  { id: "e3", source: "cfo", target: "europe_launch", style: { stroke: "#c4b5fd60" } },
  { id: "e4", source: "cfo", target: "product_launch", style: { stroke: "#c4b5fd60" } },
  { id: "e5", source: "vp_sales", target: "apac_market", style: { stroke: "#4edea360" } },
  { id: "e6", source: "vp_sales", target: "emea_market", style: { stroke: "#4edea360" } },
  { id: "e7", source: "apac_market", target: "churn_risk", animated: true, style: { stroke: "#f28b82" } },
  { id: "e8", source: "emea_market", target: "europe_launch", style: { stroke: "#4edea360" } },
  { id: "e9", source: "supply_risk", target: "product_launch", animated: true, style: { stroke: "#f28b82" } },
  { id: "e10", source: "q3_forecast", target: "vp_sales", style: { stroke: "#f59e0b60" } },
  { id: "e11", source: "market_agent", target: "emea_market", style: { stroke: "#80deea60", strokeDasharray: "5 5" } },
  { id: "e12", source: "risk_agent", target: "supply_risk", style: { stroke: "#80deea60", strokeDasharray: "5 5" } },
  { id: "e13", source: "risk_agent", target: "churn_risk", style: { stroke: "#80deea60", strokeDasharray: "5 5" } },
  { id: "e14", source: "arr_metric", target: "q3_forecast", style: { stroke: "#4edea360" } },
  { id: "e15", source: "nrr_metric", target: "churn_risk", style: { stroke: "#4edea360" } },
];

export default function KnowledgeGraphPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(graphNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(graphEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filterOptions = ["All", ...Object.keys(categoryConfig)];

  const filteredNodes = useMemo(() => {
    return nodes.filter(n => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const d = n.data as any;
      const matchesSearch = d.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            d.businessMeaning.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === "All" || d.category === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [nodes, searchQuery, activeFilter]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const nodeTypesMemo = useMemo(() => nodeTypes, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currentNodeData = selectedNode?.data as any;
  const currentCfg = currentNodeData ? categoryConfig[currentNodeData.category] : null;

  return (
    <DashboardLayout>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.04] pb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white">
            Enterprise Knowledge Graph
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Explore connections between business concepts, risks, and strategic decisions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-[#0d0f14] border border-white/[0.06] rounded-[10px] px-3.5 py-1.5 text-[11px] font-medium text-gray-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
            {graphNodes.length} entities · {graphEdges.length} connections
          </div>
        </div>
      </header>

      <div className="card-layer p-3.5 flex flex-wrap gap-4 justify-between items-center mt-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        <div className="lg:col-span-8 panel-layer overflow-hidden" style={{ height: "650px" }}>
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

        <div className="lg:col-span-4 panel-layer flex flex-col justify-start overflow-y-auto" style={{ height: "650px" }}>
          {selectedNode && currentNodeData && currentCfg ? (
            <div className="p-6 space-y-6">
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
                    <h3 className="font-display text-xl font-bold text-white">{currentNodeData.label}</h3>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Business Meaning</span>
                  <p className="text-sm text-white font-medium">{currentNodeData.businessMeaning}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-error/5 p-3 rounded-[12px] border border-error/20">
                    <span className="text-[10px] text-error uppercase tracking-wider block mb-1">Associated Risks</span>
                    <span className="text-xs text-gray-300">{currentNodeData.risks}</span>
                  </div>
                  <div className="bg-primary/5 p-3 rounded-[12px] border border-primary/20">
                    <span className="text-[10px] text-primary uppercase tracking-wider block mb-1">Opportunities</span>
                    <span className="text-xs text-gray-300">{currentNodeData.opportunities}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Related Decisions</span>
                  <div className="bg-[#050505]/40 p-3 rounded-[12px] border border-white/[0.03]">
                    <span className="text-xs text-gray-300">{currentNodeData.decisions}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.04]">
                <ExecutiveRecommendationPanel {...currentNodeData.recommendationData} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-3 text-gray-500 p-6">
              <span className="material-symbols-outlined text-[40px] opacity-30">hub</span>
              <p className="text-sm font-medium">Select any node to view its business meaning and associated actions</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
