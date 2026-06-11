"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useSecurity } from "@/lib/SecurityContext";

interface FeedItem {
  id: string;
  severity: "CRITICAL" | "WARNING" | "INFO";
  title: string;
  timestamp: string;
  description: string;
  agent: string;
  drilldownAvailable: boolean;
  source: string;
  impactScore: string;
}

export default function IntelligenceFeedPage() {
  const { addAuditLog } = useSecurity();
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activeSeverityFilter, setActiveSeverityFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [feedItems, setFeedItems] = useState<FeedItem[]>([
    {
      id: "evt_1",
      severity: "CRITICAL",
      title: "Revenue projection deviation detected",
      timestamp: "14:02:45 UTC",
      description: "Detected a 15% drop in recurring revenue projections for Q3 EMEA region. Confidence score: 94%.",
      agent: "Financial_Sentinel_V4",
      drilldownAvailable: true,
      source: "stripe.webhook.arr_stream",
      impactScore: "High Impact (9.2/10)",
    },
    {
      id: "evt_2",
      severity: "WARNING",
      title: "APAC Forecast Latency updated",
      timestamp: "13:45:12 UTC",
      description: "Supply chain disruption in APAC likely to delay delivery schedule by 3-5 days. Impacting 12 major accounts.",
      agent: "SupplyChain_Oracle",
      drilldownAvailable: false,
      source: "logistics.transit.lake",
      impactScore: "Medium Impact (5.4/10)",
    },
    {
      id: "evt_3",
      severity: "INFO",
      title: "Simulation 'Project_Alpha_Launch' completed",
      timestamp: "13:10:05 UTC",
      description: "Market penetration scenario 'Project_Alpha_Launch' finished running 10,000 iterations. Optimal pricing strategy identified.",
      agent: "Sim_Engine_Core",
      drilldownAvailable: true,
      source: "scenariolab.montecarlo.runs",
      impactScore: "Operational Optimization",
    },
  ]);

  // Simulate incoming news alerts
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      const severities: Array<"CRITICAL" | "WARNING" | "INFO"> = ["CRITICAL", "WARNING", "INFO"];
      const titles = [
        "LLM API latency spike",
        "Wolfram scenario converged",
        "Ad campaign budget depleted",
        "Database backup finalized",
      ];
      const descs = [
        "Response times from openai endpoints exceeded 2.4s over the last 5 minutes.",
        "Monte Carlo algorithm converged under standard bounds. Output logs written to settings.",
        "Google Ads spend limits reached. Shifting budget automatically to keyword campaigns.",
        "Sanktrix core PostgreSQL node successfully backed up to secure bucket storage.",
      ];
      const sources = ["infrastructure.openai.proxy", "wolfram.kernel.solvers", "marketing.google.telemetry", "postgres.backup.cron"];
      const impacts = ["Medium (4.2/10)", "Optimization Node", "Low (2.8/10)", "Nominal (0.0/10)"];
      const agentsList = ["Latency_Guard_Agent", "WC_Omega_Kernel", "Marketing_Budget_Agent", "System_DB_Daemon"];
      const randomIdx = Math.floor(Math.random() * titles.length);
      const randomSeverity = severities[Math.floor(Math.random() * severities.length)];

      const now = new Date().toISOString().slice(11, 19) + " UTC";
      const newItem: FeedItem = {
        id: `evt_${Date.now()}`,
        severity: randomSeverity,
        title: titles[randomIdx],
        timestamp: now,
        description: descs[randomIdx],
        agent: agentsList[randomIdx],
        drilldownAvailable: Math.random() > 0.5,
        source: sources[randomIdx],
        impactScore: impacts[randomIdx],
      };

      setFeedItems(prev => [newItem, ...prev.slice(0, 15)]);
    }, 4500);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleDrilldown = (item: FeedItem) => {
    addAuditLog("feed.drilldown", `Viewed feed event details for: ${item.title}`, "SUCCESS");
    alert(`Drilldown details for event "${item.title}":\nLogged by agent: ${item.agent}\nDescription: ${item.description}`);
  };

  const filteredItems = feedItems.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.agent.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (activeSeverityFilter === "ALL") return true;
    return item.severity === activeSeverityFilter;
  });

  return (
    <DashboardLayout>
      {/* 1. Page Header matching visual hierarchy guidelines */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.04] pb-5">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white">
            Intelligence Newsfeed
          </h1>
          <p className="text-xs text-gray-400 font-mono mt-1 uppercase tracking-wider">
            Real-time news alerts compiled from autonomous agent observations.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Indicators */}
          <div className="flex items-center gap-2 bg-[#0d0f14] border border-white/[0.06] rounded-[10px] px-3.5 py-1.5 text-[10px] font-mono font-bold text-gray-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8ab4f8] animate-pulse"></span>
            Streaming: ACTIVE
          </div>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="btn-action btn-secondary text-[10px] py-2"
          >
            {isPlaying ? "Pause Feed" : "Resume Feed"}
          </button>
        </div>
      </header>

      {/* 2. Severity Filters & Search */}
      <div className="card-layer p-3 flex flex-wrap gap-4 justify-between items-center bg-[#0d0e12]/30">
        <div className="flex items-center gap-3 flex-1 min-w-[260px]">
          <span className="material-symbols-outlined text-[#8ab4f8] text-lg">search</span>
          <input
            type="text"
            placeholder="Search news alerts..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-[#050505]/40 border border-white/[0.06] rounded-[8px] px-3 py-1.5 text-xs text-white placeholder-gray-500 w-full focus:outline-none focus:border-[#8ab4f8]"
          />
        </div>
        <div className="flex gap-1 font-mono text-[9px] text-gray-400">
          {["ALL", "CRITICAL", "WARNING", "INFO"].map(sev => (
            <button
              key={sev}
              onClick={() => setActiveSeverityFilter(sev)}
              className={`px-2.5 py-1 rounded-[6px] border transition-colors cursor-pointer ${
                activeSeverityFilter === sev
                  ? "bg-[#8ab4f8]/10 text-[#8ab4f8] border-[#8ab4f8]/30 font-bold"
                  : "border-transparent hover:bg-white/[0.02] hover:text-white"
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Newsfeed Grid List of Cards */}
      <div className="space-y-4 pb-8 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin">
        {filteredItems.length === 0 ? (
          <div className="card-layer p-12 text-center text-gray-500 font-mono text-xs">
            No active intelligence alerts cached.
          </div>
        ) : (
          filteredItems.map(item => {
            let severityBorder = "border-l-4 border-l-[#8ab4f8]";
            let severityBadge = "text-[#8ab4f8] bg-[#8ab4f8]/10 border-[#8ab4f8]/20";
            let iconName = "info";

            if (item.severity === "CRITICAL") {
              severityBorder = "border-l-4 border-l-red-400";
              severityBadge = "text-red-400 bg-red-400/10 border-red-400/20 animate-pulse";
              iconName = "warning";
            } else if (item.severity === "WARNING") {
              severityBorder = "border-l-4 border-l-amber-500";
              severityBadge = "text-amber-500 bg-amber-500/10 border-amber-500/20";
              iconName = "update";
            }

            return (
              <div 
                key={item.id} 
                className={`card-layer p-5 flex flex-col md:flex-row justify-between gap-4 bg-[#0d0e12]/60 hover:bg-[#0d0e12]/80 transition-all ${severityBorder}`}
              >
                {/* Left side details */}
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded border ${severityBadge}`}>
                      {item.severity}
                    </span>
                    <h2 className="font-display font-semibold text-white text-xs md:text-sm tracking-wide">
                      {item.title}
                    </h2>
                    <span className="font-mono text-[8px] text-gray-500 ml-auto md:ml-2">
                      {item.timestamp}
                    </span>
                  </div>

                  <p className="text-[11px] text-gray-400 leading-relaxed font-sans font-light">
                    {item.description}
                  </p>

                  {/* Metadata and source indicators */}
                  <div className="flex flex-wrap gap-4 font-mono text-[9px] text-gray-500 pt-2 border-t border-white/[0.02]">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px] text-gray-500">support_agent</span>
                      Reporter: <strong className="text-gray-300 font-semibold">{item.agent}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px] text-gray-500">link</span>
                      Source: <strong className="text-gray-300 font-semibold">{item.source}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px] text-gray-500">query_stats</span>
                      Impact: <strong className="text-gray-300 font-semibold">{item.impactScore}</strong>
                    </span>
                  </div>
                </div>

                {/* Right side remediation action buttons */}
                <div className="flex items-center gap-2 shrink-0 md:pl-4 border-t md:border-t-0 md:border-l border-white/[0.04] pt-3 md:pt-0">
                  {item.drilldownAvailable && (
                    <button
                      onClick={() => handleDrilldown(item)}
                      className="btn-action btn-primary text-[9px] py-1.5 px-3"
                    >
                      Remediate
                    </button>
                  )}
                  <button
                    onClick={() => alert(`Acknowledging alert: ${item.title}`)}
                    className="btn-action btn-secondary text-[9px] py-1.5 px-3"
                  >
                    Acknowledge
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </DashboardLayout>
  );
}
