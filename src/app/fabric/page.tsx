"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";

interface DataAsset {
  id: string;
  name: string;
  category: "Financial" | "Customer" | "Market" | "Operational";
  importance: "High" | "Medium" | "Critical";
  decisions: string;
  yield: string;
  health: "Optimal" | "Degraded" | "Requires Attention";
  icon: string;
  color: string;
}

const dataAssets: DataAsset[] = [
  {
    id: "da_salesforce",
    name: "Enterprise CRM Records",
    category: "Customer",
    importance: "Critical",
    decisions: "Expansion Targeting, Churn Prediction, ACV Forecasting",
    yield: "High (Identified $4.2M expansion pipeline)",
    health: "Optimal",
    icon: "groups",
    color: "#8ab4f8",
  },
  {
    id: "da_netsuite",
    name: "Global Financial Ledger",
    category: "Financial",
    importance: "Critical",
    decisions: "Budget Reallocation, Burn Rate Management",
    yield: "High (Optimized $1.8M Q4 budget)",
    health: "Optimal",
    icon: "account_balance",
    color: "#4edea3",
  },
  {
    id: "da_market",
    name: "Competitor Intel Feed",
    category: "Market",
    importance: "Medium",
    decisions: "Pricing Strategy, Feature Roadmap",
    yield: "Medium (Flagged mid-market competitor launch)",
    health: "Optimal",
    icon: "public",
    color: "#c4b5fd",
  },
  {
    id: "da_supply",
    name: "Supply Chain Telemetry",
    category: "Operational",
    importance: "High",
    decisions: "Vendor Diversification, SLA Management",
    yield: "High (Prevented 12-day APAC delay penalty)",
    health: "Degraded",
    icon: "local_shipping",
    color: "#f28b82",
  },
  {
    id: "da_product",
    name: "Product Usage Analytics",
    category: "Customer",
    importance: "High",
    decisions: "Upsell Triggering, UI Optimization",
    yield: "Medium (Found 3 onboarding bottlenecks)",
    health: "Optimal",
    icon: "touch_app",
    color: "#f59e0b",
  },
  {
    id: "da_hr",
    name: "Workforce Analytics",
    category: "Operational",
    importance: "Medium",
    decisions: "Hiring Freeze Scenarios, Capacity Planning",
    yield: "Low (Requires additional signals for Q1)",
    health: "Requires Attention",
    icon: "work",
    color: "#8ab4f8",
  },
];

export default function DataFabricPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filteredAssets = activeCategory === "All" 
    ? dataAssets 
    : dataAssets.filter(a => a.category === activeCategory);

  return (
    <DashboardLayout>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.04] pb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white">
            Enterprise Data Fabric
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Centralized strategic intelligence assets driving autonomous executive decisions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-[#0d0f14] border border-white/[0.06] rounded-[10px] px-3.5 py-1.5 text-[11px] font-medium text-gray-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
            {dataAssets.length} Strategic Assets Monitored
          </div>
        </div>
      </header>

      <div className="flex gap-2 mb-6">
        {["All", "Customer", "Financial", "Market", "Operational"].map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-[11px] px-4 py-2 rounded-full border transition-all ${
              activeCategory === cat
                ? "bg-white/[0.08] text-white border-white/[0.15] font-bold"
                : "text-gray-400 border-white/[0.04] hover:text-white hover:border-white/[0.1]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="panel-layer overflow-hidden border border-white/[0.04] rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/[0.04]">
                <th className="p-4 text-[10px] uppercase tracking-wider text-gray-500 font-bold">Data Asset</th>
                <th className="p-4 text-[10px] uppercase tracking-wider text-gray-500 font-bold">Strategic Importance</th>
                <th className="p-4 text-[10px] uppercase tracking-wider text-gray-500 font-bold">Related Decisions</th>
                <th className="p-4 text-[10px] uppercase tracking-wider text-gray-500 font-bold">Intelligence Yield</th>
                <th className="p-4 text-[10px] uppercase tracking-wider text-gray-500 font-bold">Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {filteredAssets.map(asset => (
                <tr key={asset.id} className="hover:bg-white/[0.01] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-[8px] flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${asset.color}15`, border: `1px solid ${asset.color}30` }}
                      >
                        <span className="material-symbols-outlined text-[14px]" style={{ color: asset.color }}>{asset.icon}</span>
                      </div>
                      <div>
                        <span className="text-sm font-bold text-white block">{asset.name}</span>
                        <span className="text-[10px] text-gray-500">{asset.category} Intelligence</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`text-[11px] font-bold px-2 py-1 rounded-[6px] ${
                      asset.importance === "Critical" ? "bg-primary/10 text-primary border border-primary/20" :
                      asset.importance === "High" ? "bg-white/5 text-white border border-white/10" :
                      "bg-white/[0.02] text-gray-400"
                    }`}>
                      {asset.importance}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-xs text-gray-300 font-medium">{asset.decisions}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-xs text-[#8ab4f8]">{asset.yield}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        asset.health === "Optimal" ? "bg-[#4edea3]" :
                        asset.health === "Degraded" ? "bg-[#f59e0b]" :
                        "bg-[#f28b82] animate-pulse"
                      }`}></span>
                      <span className={`text-xs ${
                        asset.health === "Optimal" ? "text-[#4edea3]" :
                        asset.health === "Degraded" ? "text-[#f59e0b]" :
                        "text-[#f28b82] font-bold"
                      }`}>
                        {asset.health}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredAssets.length === 0 && (
            <div className="p-8 text-center text-gray-500 text-sm">
              No assets found for this category.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
