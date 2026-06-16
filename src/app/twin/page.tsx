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

/* ─── Custom Node Component ─── */
function EnterpriseNode({ data, selected }: NodeProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const d = data as any;

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
          <span className="text-gray-500">Rev. Impact</span>
          <span className="text-white font-bold">{d.revenueImpact}</span>
        </div>
        <div className="flex justify-between text-[10px]">
          <span className="text-gray-500">Risk</span>
          <span className={`font-bold ${d.riskLevel === "High" ? "text-[#f28b82]" : d.riskLevel === "Medium" ? "text-[#f59e0b]" : "text-[#4edea3]"}`}>
            {d.riskLevel}
          </span>
        </div>
      </div>
    </div>
  );
}

const nodeTypes = { enterprise: EnterpriseNode };

const primaryMetrics = [
  { label: "Revenue", value: "Revenue" },
  { label: "Profit", value: "Profit" },
  { label: "Growth", value: "Growth" },
  { label: "Customer Retention", value: "Retention" },
  { label: "Market Expansion", value: "Expansion" },
];

const initialNodes: Node[] = [
  { 
    id: "revenue", 
    type: "enterprise", 
    position: { x: 450, y: 0 }, 
    data: { 
      label: "Global Revenue", icon: "payments", accentColor: "#4edea3",
      revenueImpact: "$50.2M ARR", operationalImpact: "North-Star Metric", dependencies: "All Regions, Sales", riskLevel: "Medium",
      recommendationData: {
        type: "RECOMMENDATION", title: "Protect Q3 Revenue Base", context: "Q3 pipeline is soft by 4%.", action: "Incentivize early renewals with 5% discount.", outcome: "Secure $4.2M base ARR.", confidence: 89, impact: "+$4.2M Base", horizon: "30 Days"
      }
    } 
  },
  { 
    id: "sales", 
    type: "enterprise", 
    position: { x: 50, y: 140 }, 
    data: { 
      label: "Direct Sales", icon: "storefront", accentColor: "#8ab4f8",
      revenueImpact: "$32.4M ARR", operationalImpact: "120 active reps", dependencies: "Marketing, APAC, EMEA, Americas", riskLevel: "Low",
      recommendationData: {
        type: "OPPORTUNITY", title: "Scale DACH Sales Team", context: "EMEA inbound inquiries up 23%.", action: "Deploy 3 additional reps to DACH region.", outcome: "Capture $1.2M pipeline spillover.", confidence: 86, impact: "+$1.2M Pipe", horizon: "60 Days"
      }
    } 
  },
  { 
    id: "marketing", 
    type: "enterprise", 
    position: { x: 280, y: 160 }, 
    data: { 
      label: "Marketing", icon: "campaign", accentColor: "#c4b5fd",
      revenueImpact: "$8.2M pipeline", operationalImpact: "2.8x Coverage Ratio", dependencies: "Operations", riskLevel: "Medium",
      recommendationData: {
        type: "RECOMMENDATION", title: "Reallocate Display Spend", context: "Display ROAS is 0.8x, Search is 3.2x.", action: "Shift 40% display budget to Search.", outcome: "Reduce CAC by 18%.", confidence: 91, impact: "-18% CAC", horizon: "Next Quarter"
      }
    } 
  },
  { 
    id: "customer_success", 
    type: "enterprise", 
    position: { x: 650, y: 140 }, 
    data: { 
      label: "Customer Success", icon: "support_agent", accentColor: "#f59e0b",
      revenueImpact: "118% NRR", operationalImpact: "1:18 Account Ratio", dependencies: "APAC, Operations", riskLevel: "High",
      recommendationData: {
        type: "RISK", title: "Address APAC Churn", context: "APAC NRR dropped from 118% to 109%.", action: "Hire 4 dedicated APAC enterprise CSMs.", outcome: "Recover 340bps NRR.", confidence: 94, impact: "340bps NRR", horizon: "90 Days"
      }
    } 
  },
  { 
    id: "products", 
    type: "enterprise", 
    position: { x: 880, y: 160 }, 
    data: { 
      label: "Product Matrix", icon: "inventory_2", accentColor: "#8ab4f8",
      revenueImpact: "3 Revenue Tiers", operationalImpact: "Mid-market launch pending", dependencies: "Partners", riskLevel: "Low",
      recommendationData: {
        type: "OPPORTUNITY", title: "Accelerate Mid-Market Tier", context: "Mid-market TAM represents $240M whitespace.", action: "Launch 'Professional' tier 30 days early.", outcome: "Capture early Q3 market share.", confidence: 82, impact: "TAM Unlock", horizon: "60 Days"
      }
    } 
  },
  { 
    id: "finance", 
    type: "enterprise", 
    position: { x: 100, y: 340 }, 
    data: { 
      label: "Finance & Treasury", icon: "account_balance", accentColor: "#4edea3",
      revenueImpact: "$12.4M Burn", operationalImpact: "18 Months Runway", dependencies: "None", riskLevel: "Low",
      recommendationData: {
        type: "RECOMMENDATION", title: "Optimize Cash Yield", context: "Treasury yields are sub-optimal.", action: "Shift $5M to high-yield corporate bonds.", outcome: "Generate $250K passive yield.", confidence: 99, impact: "+$250K Yield", horizon: "12 Months"
      }
    } 
  },
  { 
    id: "operations", 
    type: "enterprise", 
    position: { x: 370, y: 340 }, 
    data: { 
      label: "Business Ops", icon: "precision_manufacturing", accentColor: "#8ab4f8",
      revenueImpact: "1.42x Efficiency", operationalImpact: "Cloud infrastructure scaling", dependencies: "Supply Chain", riskLevel: "Low",
      recommendationData: {
        type: "RECOMMENDATION", title: "Cloud Cost Optimization", context: "AWS bill increased 14% without usage spike.", action: "Execute reserved instance purchases.", outcome: "Reduce cloud spend by 22%.", confidence: 95, impact: "-22% Spend", horizon: "30 Days"
      }
    } 
  },
  { 
    id: "supply_chain", 
    type: "enterprise", 
    position: { x: 620, y: 360 }, 
    data: { 
      label: "Supply Chain", icon: "local_shipping", accentColor: "#f28b82",
      revenueImpact: "Cost of Goods", operationalImpact: "12-day delay risk", dependencies: "APAC", riskLevel: "High",
      recommendationData: {
        type: "RISK", title: "Vendor Concentration Risk", context: "3-tier vendor dependency with APAC concentration.", action: "Onboard LATAM secondary supplier.", outcome: "Reduce 12-day delay risk to 2 days.", confidence: 88, impact: "De-risk Supply", horizon: "120 Days"
      }
    } 
  },
  { 
    id: "partners", 
    type: "enterprise", 
    position: { x: 870, y: 340 }, 
    data: { 
      label: "Partner Network", icon: "handshake", accentColor: "#c4b5fd",
      revenueImpact: "$6.8M Indirect", operationalImpact: "42 active partners", dependencies: "Products, EMEA", riskLevel: "Medium",
      recommendationData: {
        type: "OPPORTUNITY", title: "Expand Channel Program", context: "Partner-sourced deals have 14% higher ACV.", action: "Double channel marketing MDF budget.", outcome: "Generate $1.4M additional partner pipeline.", confidence: 84, impact: "+$1.4M Pipe", horizon: "90 Days"
      }
    } 
  },
  { 
    id: "apac", 
    type: "enterprise", 
    position: { x: 50, y: 520 }, 
    data: { 
      label: "APAC Region", icon: "public", accentColor: "#f28b82",
      revenueImpact: "$8.4M ARR", operationalImpact: "8% Churn Spikes", dependencies: "Sales, Customer Success", riskLevel: "High",
      recommendationData: {
        type: "RISK", title: "Critical Churn Mitigation", context: "APAC region accounts for 60% of total enterprise churn.", action: "Execute executive sponsor outreach program.", outcome: "Save 3 critical accounts.", confidence: 92, impact: "$1.1M Saved", horizon: "14 Days"
      }
    } 
  },
  { 
    id: "emea", 
    type: "enterprise", 
    position: { x: 350, y: 520 }, 
    data: { 
      label: "EMEA Region", icon: "public", accentColor: "#4edea3",
      revenueImpact: "$14.2M ARR", operationalImpact: "23% YoY Growth", dependencies: "Sales, Partners", riskLevel: "Low",
      recommendationData: {
        type: "OPPORTUNITY", title: "Accelerate EMEA Growth", context: "EMEA is the most capital-efficient growth region.", action: "Greenlight DACH and Nordics expansion.", outcome: "Capture $4.1M new revenue stream.", confidence: 86, impact: "+$4.1M ARR", horizon: "18 Months"
      }
    } 
  },
  { 
    id: "americas", 
    type: "enterprise", 
    position: { x: 670, y: 520 }, 
    data: { 
      label: "Americas Region", icon: "public", accentColor: "#8ab4f8",
      revenueImpact: "$27.6M ARR", operationalImpact: "55% of total business", dependencies: "Sales", riskLevel: "Low",
      recommendationData: {
        type: "RECOMMENDATION", title: "Upsell Expansion", context: "Americas has lowest NRR despite highest base.", action: "Deploy cross-sell automated campaigns.", outcome: "Boost NRR from 104% to 110%.", confidence: 90, impact: "600bps NRR", horizon: "180 Days"
      }
    } 
  },
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currentNodeData = selectedNode?.data as any;

  return (
    <DashboardLayout>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.04] pb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white">
            Digital Twin & Impact Map
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Analyze business impact, cascading risks, and automated decisions across your enterprise topology.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 bg-[#0d0f14] border border-white/[0.06] rounded-[10px] px-3.5 py-1.5 text-[11px] font-medium text-gray-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
            Live sync · 12 departments
          </div>
        </div>
      </header>

      <div className="flex items-center gap-3 flex-wrap mt-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        <div className="lg:col-span-8 panel-layer overflow-hidden" style={{ height: "650px" }}>
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

        <div className="lg:col-span-4 panel-layer flex flex-col justify-start overflow-y-auto" style={{ height: "650px" }}>
          {selectedNode && currentNodeData ? (
            <div className="p-6 space-y-6">
              <div className="border-b border-white/[0.04] pb-4">
                <span className="text-[10px] text-[#8ab4f8] uppercase tracking-widest font-bold">Business Impact Analysis</span>
                <h3 className="font-display text-2xl font-bold text-white mt-1">{currentNodeData.label}</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#050505]/40 p-3.5 rounded-[12px] border border-white/[0.03]">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Revenue Impact</span>
                  <span className="text-sm font-bold text-white">{currentNodeData.revenueImpact}</span>
                </div>
                <div className="bg-[#050505]/40 p-3.5 rounded-[12px] border border-white/[0.03]">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Operational Impact</span>
                  <span className="text-sm font-bold text-white">{currentNodeData.operationalImpact}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#050505]/40 p-3.5 rounded-[12px] border border-white/[0.03]">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Dependencies</span>
                  <span className="text-sm font-medium text-gray-300">{currentNodeData.dependencies}</span>
                </div>
                <div className="bg-[#050505]/40 p-3.5 rounded-[12px] border border-white/[0.03]">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Risk Level</span>
                  <span className={`text-sm font-bold ${currentNodeData.riskLevel === "High" ? "text-[#f28b82]" : currentNodeData.riskLevel === "Medium" ? "text-[#f59e0b]" : "text-[#4edea3]"}`}>
                    {currentNodeData.riskLevel}
                  </span>
                </div>
              </div>

              {/* Directly integrate the executive recommendation component for this node */}
              <div className="pt-4 border-t border-white/[0.04]">
                <ExecutiveRecommendationPanel {...currentNodeData.recommendationData} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-3 text-gray-500 p-6">
              <span className="material-symbols-outlined text-[40px] opacity-30">touch_app</span>
              <p className="text-sm font-medium">Select a node to view its Business Impact Analysis and Strategic Recommendations</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
