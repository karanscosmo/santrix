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
      title: "Revenue anomaly detected",
      timestamp: "14:02:45 UTC",
      description: "Detected a 15% drop in recurring revenue projections for Q3 EMEA region. Confidence score: 94%.",
      agent: "Financial_Sentinel_V4",
      drilldownAvailable: true,
    },
    {
      id: "evt_2",
      severity: "WARNING",
      title: "Forecast updated",
      timestamp: "13:45:12 UTC",
      description: "Supply chain disruption in APAC likely to delay delivery schedule by 3-5 days. Impacting 12 major accounts.",
      agent: "SupplyChain_Oracle",
      drilldownAvailable: false,
    },
    {
      id: "evt_3",
      severity: "INFO",
      title: "Simulation completed",
      timestamp: "13:10:05 UTC",
      description: "Market penetration scenario 'Project_Alpha_Launch' finished running 10,000 iterations. Optimal pricing strategy identified.",
      agent: "Sim_Engine_Core",
      drilldownAvailable: true,
    },
    {
      id: "evt_4",
      severity: "INFO",
      title: "Executive report generated",
      timestamp: "12:00:00 UTC",
      description: "Weekly global performance summary compiled and distributed to C-suite group.",
      agent: "Reporting_Bot_Prime",
      drilldownAvailable: false,
    },
  ]);

  // Simulate new stream items
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
      };

      setFeedItems(prev => [newItem, ...prev.slice(0, 19)]);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleDrilldown = (item: FeedItem) => {
    addAuditLog("feed.drilldown", `Viewed feed event details for: ${item.title}`, "SUCCESS");
    alert(`Drilldown details for event "${item.title}":\nLogged by agent: ${item.agent}\nDescription: ${item.description}`);
  };

  const filteredItems = feedItems.filter(item => {
    // Search filter
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.agent.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Severity filter
    if (activeSeverityFilter === "ALL") return true;
    return item.severity === activeSeverityFilter;
  });

  return (
    <DashboardLayout>
      <div className="space-y-md">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md">
          <div>
            <h1 className="font-display text-headline-lg text-on-surface flex items-center gap-sm font-bold text-[24px]">
              <div className="w-2 h-2 rounded-full bg-primary pulse-dot"></div>
              Intelligence Feed
            </h1>
            <p className="text-xs text-on-surface-variant mt-xs">
              Real-time autonomous agent activity and platform events.
            </p>
          </div>
          <div className="flex gap-sm">
            <input
              type="text"
              placeholder="Search feed items..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-surface-container-high border border-outline-variant/60 rounded px-md py-xs text-xs text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-primary"
            />
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="border border-outline-variant text-on-surface font-semibold text-xs tracking-wider uppercase py-xs px-sm rounded hover:bg-surface-container-highest transition-colors flex items-center gap-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">
                {isPlaying ? "pause" : "play_arrow"}
              </span>{" "}
              {isPlaying ? "Pause Stream" : "Resume Stream"}
            </button>
          </div>
        </div>

        {/* Severity Filter Toggles */}
        <div className="flex gap-sm border-b border-outline-variant/30 pb-sm font-mono text-[10px] text-on-surface-variant">
          {["ALL", "CRITICAL", "WARNING", "INFO"].map(sev => (
            <button
              key={sev}
              onClick={() => setActiveSeverityFilter(sev)}
              className={`px-2.5 py-1 rounded cursor-pointer transition-colors ${
                activeSeverityFilter === sev
                  ? "bg-primary/20 text-primary border border-primary font-bold"
                  : "hover:bg-surface-container"
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        {/* Feed Container */}
        <div className="glass-panel rounded-lg p-md relative overflow-hidden h-[calc(100vh-280px)] flex flex-col">
          <div className="absolute top-0 left-0 w-full h-[2px] stream-line"></div>

          <div className="flex-grow overflow-y-auto pr-sm space-y-md">
            {filteredItems.length === 0 ? (
              <div className="text-center py-xl text-on-surface-variant text-xs font-mono">
                No matching events registered in streaming cache.
              </div>
            ) : (
              filteredItems.map(item => {
                let severityColor = "bg-primary-container/20 text-primary border-primary/30";
                let iconName = "info";

                if (item.severity === "CRITICAL") {
                  severityColor = "bg-error-container/20 text-error border-error/30";
                  iconName = "warning";
                } else if (item.severity === "WARNING") {
                  severityColor = "bg-secondary-container/20 text-secondary border-secondary/30";
                  iconName = "update";
                }

                return (
                  <div key={item.id} className="flex gap-md group">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-6 h-6 rounded flex items-center justify-center border ${severityColor} z-10`}
                      >
                        <span className="material-symbols-outlined text-[14px]">{iconName}</span>
                      </div>
                      <div className="w-px h-full bg-outline-variant/30 mt-xs group-last:hidden"></div>
                    </div>
                    <div className="bg-surface-container-low border border-outline-variant/50 rounded p-md flex-1 mb-xs hover:border-outline-variant transition-colors">
                      <div className="flex justify-between items-start mb-sm gap-sm">
                        <div className="flex flex-wrap items-center gap-sm">
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                              item.severity === "CRITICAL"
                                ? "text-error border-error/20 bg-error/10"
                                : item.severity === "WARNING"
                                ? "text-secondary border-secondary/20 bg-secondary/10"
                                : "text-primary border-primary/20 bg-primary/10"
                            }`}
                          >
                            {item.severity}
                          </span>
                          <span className="font-display font-semibold text-on-surface text-sm">{item.title}</span>
                        </div>
                        <span className="font-mono text-[10px] text-on-surface-variant whitespace-nowrap">
                          {item.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant leading-relaxed">{item.description}</p>
                      <div className="flex items-center gap-sm mt-sm pt-sm border-t border-outline-variant/30">
                        <span className="material-symbols-outlined text-outline text-sm">support_agent</span>
                        <span className="font-mono text-[10px] text-on-surface">Agent: {item.agent}</span>
                        {item.drilldownAvailable && (
                          <button
                            onClick={() => handleDrilldown(item)}
                            className="ml-auto text-primary font-semibold uppercase text-[10px] hover:text-primary-container cursor-pointer transition-colors"
                          >
                            Analyze Drilldown
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
