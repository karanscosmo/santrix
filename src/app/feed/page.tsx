"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { ExecutiveRecommendationPanel, RecommendationProps } from "@/components/ExecutiveRecommendationPanel";

interface FeedItem {
  id: string;
  headline: string;
  summary: string;
  category: "risk" | "opportunity" | "forecast" | "strategic";
  impactLevel: "Critical" | "High" | "Medium" | "Low";
  recommendationData: RecommendationProps;
  timestamp: string;
}

const categoryConfig = {
  risk: { label: "Risk Alert", icon: "warning", color: "#f28b82", emoji: "🔴" },
  opportunity: { label: "Opportunity", icon: "trending_up", color: "#4edea3", emoji: "🟢" },
  forecast: { label: "Forecast Change", icon: "analytics", color: "#8ab4f8", emoji: "🔵" },
  strategic: { label: "Strategic Recommendation", icon: "lightbulb", color: "#f59e0b", emoji: "🟡" },
};

const seedItems: FeedItem[] = [
  {
    id: "f1",
    headline: "APAC enterprise churn trending above threshold",
    summary: "Enterprise churn in APAC increased from 8% to 11.2% over the last 45 days. 14 accounts flagged as high-risk based on usage decline, NPS drop, and support escalation patterns.",
    category: "risk",
    impactLevel: "Critical",
    recommendationData: {
      type: "RISK",
      title: "Intervene in APAC Churn",
      context: "At current trajectory, APAC churn will cost $2.3M in ARR by Q3 end.",
      action: "Increase CSM coverage to 1:10 ratio and deploy retention campaign for top 14 accounts.",
      outcome: "Retain $2.3M ARR and stabilize APAC base.",
      confidence: 94,
      impact: "Required Action",
      horizon: "Immediate"
    },
    timestamp: "25 min ago",
  },
  {
    id: "f2",
    headline: "European market showing accelerated growth signals",
    summary: "DACH region TAM expanded 23% YoY with 12 inbound inquiries from enterprise prospects in Q2. Competitor penetration remains below 8%.",
    category: "opportunity",
    impactLevel: "High",
    recommendationData: {
      type: "OPPORTUNITY",
      title: "Accelerate European Expansion",
      context: "First-mover window is narrowing. Each quarter of delay reduces projected Year 1 revenue by $1.2M.",
      action: "Fast-track European expansion — hire regional sales lead and begin partner recruitment.",
      outcome: "Capture $4.1M incremental revenue.",
      confidence: 86,
      impact: "Required Action",
      horizon: "Next Quarter"
    },
    timestamp: "1 hour ago",
  },
  {
    id: "f3",
    headline: "Q3 revenue forecast adjusted downward by 4.2%",
    summary: "The Q3 forecast has been revised from $52.4M to $50.2M ARR. Primary drivers: APAC churn increase and 2 delayed enterprise deals in the Americas.",
    category: "forecast",
    impactLevel: "High",
    recommendationData: {
      type: "RECOMMENDATION",
      title: "Protect Q3 Forecast",
      context: "While the revision is within bounds, it marks the second consecutive downward adjustment.",
      action: "Accelerate pipeline generation and prioritize the 2 delayed Americas deals for executive sponsorship.",
      outcome: "Ensure we hit the $50.2M base.",
      confidence: 91,
      impact: "Required Action",
      horizon: "This Quarter"
    },
    timestamp: "2 hours ago",
  },
  {
    id: "f4",
    headline: "AI recommends reallocating Q3 marketing budget",
    summary: "Analysis shows display advertising generating 40% of spend but only 12% of qualified pipeline. Performance marketing and content channels show 3.2x better ROI.",
    category: "strategic",
    impactLevel: "Medium",
    recommendationData: {
      type: "RECOMMENDATION",
      title: "Marketing Budget Reallocation",
      context: "Reallocating budget could save $1.8M annually while maintaining pipeline quality.",
      action: "Shift 25% of display budget to search and content marketing over 60 days.",
      outcome: "Reduce CAC by 14% and save $1.8M.",
      confidence: 89,
      impact: "Required Action",
      horizon: "60 Days"
    },
    timestamp: "3 hours ago",
  },
];

const incomingItems: Omit<FeedItem, "id" | "timestamp">[] = [
  { 
    headline: "Mid-market product launch timeline at risk", 
    summary: "Engineering velocity dropped 8% due to unplanned security patch. Mid-market tier launch may shift from Q2 to early Q3.", 
    category: "risk", 
    impactLevel: "High",
    recommendationData: {
      type: "RISK",
      title: "Protect Mid-Market Launch",
      context: "Each month of delay costs approximately $500K in lost first-mover revenue.",
      action: "Evaluate resource reallocation from low-priority projects to protect launch timeline.",
      outcome: "Launch mid-market on schedule.",
      confidence: 85,
      impact: "Required Action",
      horizon: "Immediate"
    }
  },
  { 
    headline: "Partnership opportunity with major SI firm", 
    summary: "A top-5 systems integrator expressed interest in reseller partnership. Could accelerate enterprise sales in financial services vertical.", 
    category: "opportunity", 
    impactLevel: "High",
    recommendationData: {
      type: "OPPORTUNITY",
      title: "SI Partnership Acceleration",
      context: "SI partnerships historically generate 2.4x larger deal sizes and 40% faster sales cycles.",
      action: "Schedule executive meeting with SI partnership team within 2 weeks.",
      outcome: "Expand financial services pipeline.",
      confidence: 88,
      impact: "Required Action",
      horizon: "14 Days"
    }
  }
];

const filterOptions = ["all", "risk", "opportunity", "forecast", "strategic"] as const;

export default function IntelligenceFeedPage() {
  const [items, setItems] = useState<FeedItem[]>(seedItems);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      const rand = incomingItems[Math.floor(Math.random() * incomingItems.length)];
      const newItem: FeedItem = {
        ...rand,
        id: `f_${Date.now()}`,
        timestamp: "Just now",
      };
      setItems(prev => [newItem, ...prev.slice(0, 12)]);
    }, 15000);
    return () => clearInterval(interval);
  }, [isLive]);

  const filteredItems = activeFilter === "all" ? items : items.filter(i => i.category === activeFilter);

  return (
    <DashboardLayout>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.04] pb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white">
            Executive Intelligence Feed
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Real-time strategic updates with clear business impact and required actions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-[#0d0f14] border border-white/[0.06] rounded-[10px] px-3.5 py-1.5 text-[11px] font-medium text-gray-300">
            <span className={`w-1.5 h-1.5 rounded-full ${isLive ? "bg-[#8ab4f8] animate-pulse" : "bg-gray-500"}`}></span>
            {isLive ? "Live updates" : "Paused"}
          </div>
          <button
            onClick={() => setIsLive(!isLive)}
            className="btn-action btn-secondary text-[11px] py-2"
          >
            {isLive ? "Pause" : "Resume"}
          </button>
        </div>
      </header>

      <div className="flex gap-2 flex-wrap mb-6">
        {filterOptions.map(f => {
          const cfg = f !== "all" ? categoryConfig[f] : null;
          return (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`text-[11px] px-3.5 py-1.5 rounded-full border transition-all cursor-pointer flex items-center gap-1.5 ${
                activeFilter === f
                  ? "font-bold"
                  : "text-gray-400 border-white/[0.04] hover:text-white hover:border-white/[0.1]"
              }`}
              style={activeFilter === f ? {
                backgroundColor: cfg ? `${cfg.color}10` : "rgba(138,180,248,0.1)",
                color: cfg ? cfg.color : "#8ab4f8",
                borderColor: cfg ? `${cfg.color}30` : "rgba(138,180,248,0.3)",
              } : {}}
            >
              {cfg && <span>{cfg.emoji}</span>}
              {f === "all" ? "All Updates" : cfg?.label}
            </button>
          );
        })}
      </div>

      <div className="space-y-6 max-h-[650px] overflow-y-auto pr-1 scrollbar-thin pb-12">
        {filteredItems.map(item => {
          const cfg = categoryConfig[item.category];
          return (
            <div key={item.id} className="feed-card bg-[#0a0a0a]/50 p-6 rounded-[16px] border border-white/[0.04]">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: `${cfg.color}10`, border: `1px solid ${cfg.color}20` }}
                  >
                    <span className="material-symbols-outlined text-[18px]" style={{ color: cfg.color }}>
                      {cfg.icon}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border"
                        style={{ color: cfg.color, backgroundColor: `${cfg.color}10`, borderColor: `${cfg.color}25` }}
                      >
                        {cfg.label}
                      </span>
                      <span className={`text-[10px] font-bold ${
                        item.impactLevel === "Critical" ? "text-[#f28b82]" :
                        item.impactLevel === "High" ? "text-[#f59e0b]" :
                        item.impactLevel === "Medium" ? "text-[#8ab4f8]" : "text-gray-500"
                      }`}>
                        {item.impactLevel} Impact
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white">{item.headline}</h3>
                  </div>
                </div>
                <span className="text-[10px] text-gray-500 shrink-0 mt-1">{item.timestamp}</span>
              </div>

              <p className="text-sm text-gray-400 leading-relaxed mb-6 ml-14">{item.summary}</p>

              <div className="ml-14 mt-4 border-t border-white/[0.04] pt-4">
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold block mb-3">Required Action</span>
                <ExecutiveRecommendationPanel {...item.recommendationData} />
              </div>
            </div>
          );
        })}
        {filteredItems.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            No intelligence updates found for this category.
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
