"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSecurity } from "@/lib/SecurityContext";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandItem {
  name: string;
  action?: string;
  url?: string;
  category: "Executive Command" | "Navigation" | "Knowledge Hub & Search";
  icon: string;
  description?: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { addAuditLog, rateLimitCheck } = useSecurity();
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setSearch("");
    }
  }, [isOpen]);

  const handleCommandClick = (item: CommandItem) => {
    onClose();

    if (!rateLimitCheck()) {
      alert("Rate limit exceeded. Try again in a minute.");
      return;
    }

    if (item.url) {
      addAuditLog("navigation.palette", `Navigated to ${item.name} from command palette`, "SUCCESS");
      router.push(item.url);
    } else if (item.action) {
      addAuditLog("command.trigger", `Triggered command: ${item.action}`, "SUCCESS");
      if (item.action.startsWith("/simulate")) {
        const scenario = item.action.replace("/simulate ", "");
        router.push(`/simulations?scenario=${encodeURIComponent(scenario)}`);
      } else if (item.action.startsWith("/forecast")) {
        router.push("/wolfram?action=forecast");
      } else if (item.action.startsWith("/optimize")) {
        router.push("/wolfram?action=optimize");
      } else if (item.action.startsWith("/run-agent") || item.action.startsWith("/agent")) {
        router.push("/agents");
      } else if (item.action.startsWith("/workflow")) {
        router.push("/workflows");
      } else if (item.action.startsWith("/report")) {
        router.push("/reports");
      } else if (item.action.startsWith("/document")) {
        router.push("/knowledge");
      }
    }
  };

  const commands: CommandItem[] = [
    {
      name: "/simulate Churn Spike",
      action: "/simulate Churn Spike",
      category: "Executive Command",
      icon: "model_training",
      description: "Stress-test customer churn modeling matrices",
    },
    {
      name: "/simulate Burn Rate Crisis",
      action: "/simulate Burn Rate Crisis",
      category: "Executive Command",
      icon: "trending_down",
      description: "Monte Carlo runway simulations under marketing compression",
    },
    {
      name: "/simulate Market Expansion",
      action: "/simulate Market Expansion",
      category: "Executive Command",
      icon: "query_stats",
      description: "Forecast cash yield during EMEA expansion",
    },
    {
      name: "/forecast Runway",
      action: "/forecast Runway",
      category: "Executive Command",
      icon: "functions",
      description: "Wolfram Kernel symbolic runway computation",
    },
    {
      name: "/optimize Marketing",
      action: "/optimize Marketing",
      category: "Executive Command",
      icon: "payments",
      description: "Optimize digital marketing allocations via linear solvers",
    },
    {
      name: "/workflow CAC_EXCESS_TRIGGER",
      action: "/workflow CAC_EXCESS_TRIGGER",
      category: "Executive Command",
      icon: "account_tree",
      description: "Inspect n8n anomaly mitigation workflow",
    },
    {
      name: "/agent Finance Optimizer",
      action: "/agent Finance Optimizer",
      category: "Executive Command",
      icon: "support_agent",
      description: "Check active financial agent status",
    },
    {
      name: "/agent SDR Swarm",
      action: "/agent SDR Swarm",
      category: "Executive Command",
      icon: "support_agent",
      description: "SDR outbound telemetry dashboard",
    },
    {
      name: "/document Security compliance audit",
      action: "/document Security compliance audit",
      category: "Knowledge Hub & Search",
      icon: "menu_book",
      description: "Search corporate policies and compliance audits",
    },
    {
      name: "Search people: Karan Sharma (Owner)",
      url: "/settings",
      category: "Knowledge Hub & Search",
      icon: "person",
      description: "Founder & CEO, Administrator privileges",
    },
    {
      name: "Search Risks: Marketing CAC Anomaly",
      url: "/twin",
      category: "Knowledge Hub & Search",
      icon: "warning",
      description: "Twin propagation details for marketing nodes",
    },
    {
      name: "Search Reports: Board Briefing Q3",
      url: "/reports",
      category: "Knowledge Hub & Search",
      icon: "assessment",
      description: "Generated business context report",
    },
    {
      name: "Overview Dashboard",
      url: "/dashboard",
      category: "Navigation",
      icon: "dashboard",
    },
    {
      name: "Executive Copilot",
      url: "/copilot",
      category: "Navigation",
      icon: "smart_toy",
    },
    {
      name: "Wolfram Center",
      url: "/wolfram",
      category: "Navigation",
      icon: "functions",
    },
    {
      name: "Strategy Command",
      url: "/strategy",
      category: "Navigation",
      icon: "verified",
    },
    {
      name: "Organization Digital Twin",
      url: "/twin",
      category: "Navigation",
      icon: "donut_large",
    },
    {
      name: "Enterprise Knowledge Graph",
      url: "/graph",
      category: "Navigation",
      icon: "hub",
    },
    {
      name: "Agent Observatory",
      url: "/observatory",
      category: "Navigation",
      icon: "visibility",
    },
    {
      name: "Realtime Event Fabric",
      url: "/fabric",
      category: "Navigation",
      icon: "stream",
    },
    {
      name: "Executive Boardroom",
      url: "/boardroom",
      category: "Navigation",
      icon: "summarize",
    },
    {
      name: "System Observability Center",
      url: "/status",
      category: "Navigation",
      icon: "analytics",
    },
    {
      name: "Security Governance",
      url: "/security",
      category: "Navigation",
      icon: "shield",
    },
    {
      name: "Hackathon Scenario Lab",
      url: "/simulations",
      category: "Navigation",
      icon: "model_training",
    },
  ];

  const filteredCommands = commands.filter((cmd) => {
    const searchLower = search.toLowerCase();
    return (
      cmd.name.toLowerCase().includes(searchLower) ||
      (cmd.description && cmd.description.toLowerCase().includes(searchLower))
    );
  });

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="fixed inset-0 z-[100] bg-[#050505]/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
    >
      {/* 18px Card Radius applied below */}
      <div className="w-full max-w-2xl bg-[#0a0b0e]/95 backdrop-blur-2xl rounded-[18px] overflow-hidden shadow-[0_12px_60px_rgba(0,0,0,0.85),0_0_40px_rgba(138,180,248,0.1)] flex flex-col border border-white/[0.04] max-h-[500px]">
        {/* Search Field */}
        <div className="p-4 border-b border-white/[0.04] flex items-center gap-3 bg-[#0d0f14]/50">
          <span className="material-symbols-outlined text-[#8ab4f8] text-lg">terminal</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Ask Sanktrix anything... (e.g. /simulate, risks, people, report)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent border-none text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-0 outline-none"
          />
          <span className="text-[9px] bg-white/[0.03] border border-white/[0.06] px-2 py-0.5 rounded text-gray-500 font-mono">
            ESC
          </span>
        </div>

        {/* Command Search Results */}
        <div className="flex-1 overflow-y-auto p-2 space-y-4 scrollbar-thin">
          {/* Executive Commands Section */}
          {filteredCommands.some((c) => c.category === "Executive Command") && (
            <div>
              <div className="px-4 py-1 font-mono text-[9px] text-amber-500 uppercase tracking-widest font-bold">
                Executive Action Commands
              </div>
              <div className="space-y-0.5 mt-1">
                {filteredCommands
                  .filter((c) => c.category === "Executive Command")
                  .map((cmd) => (
                    <button
                      key={cmd.name}
                      onClick={() => handleCommandClick(cmd)}
                      className="w-full text-left px-4 py-2 rounded-[10px] hover:bg-white/[0.03] flex items-center justify-between text-white group cursor-pointer transition-colors"
                    >
                      <span className="flex items-center gap-3 truncate">
                        <span className="material-symbols-outlined text-amber-500 text-sm shrink-0">
                          {cmd.icon}
                        </span>
                        <span className="font-mono text-xs text-[#8ab4f8] shrink-0">{cmd.name}</span>
                        <span className="text-[10px] text-gray-500 group-hover:text-gray-300 transition-colors pl-3 truncate">
                          {cmd.description}
                        </span>
                      </span>
                      <span className="text-[9px] text-gray-500 font-mono bg-white/[0.03] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        ↵ Enter
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Knowledge Hub & Search Results */}
          {filteredCommands.some((c) => c.category === "Knowledge Hub & Search") && (
            <div>
              <div className="px-4 py-1 font-mono text-[9px] text-[#4edea3] uppercase tracking-widest font-bold">
                Knowledge Graph &amp; Search Entities
              </div>
              <div className="space-y-0.5 mt-1">
                {filteredCommands
                  .filter((c) => c.category === "Knowledge Hub & Search")
                  .map((cmd) => (
                    <button
                      key={cmd.name}
                      onClick={() => handleCommandClick(cmd)}
                      className="w-full text-left px-4 py-2 rounded-[10px] hover:bg-white/[0.03] flex items-center justify-between text-white group cursor-pointer transition-colors"
                    >
                      <span className="flex items-center gap-3 truncate">
                        <span className="material-symbols-outlined text-[#4edea3] text-sm shrink-0">
                          {cmd.icon}
                        </span>
                        <span className="text-xs text-white truncate">{cmd.name}</span>
                        <span className="text-[10px] text-gray-500 group-hover:text-gray-300 transition-colors pl-3 truncate">
                          {cmd.description}
                        </span>
                      </span>
                      <span className="text-[9px] text-gray-500 font-mono bg-white/[0.03] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        ↵ Enter
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Navigation Section */}
          {filteredCommands.some((c) => c.category === "Navigation") && (
            <div>
              <div className="px-4 py-1 font-mono text-[9px] text-gray-500 uppercase tracking-widest font-bold">
                Go To Platform View
              </div>
              <div className="grid grid-cols-2 gap-1 mt-1">
                {filteredCommands
                  .filter((c) => c.category === "Navigation")
                  .map((cmd) => (
                    <button
                      key={cmd.name}
                      onClick={() => handleCommandClick(cmd)}
                      className="text-left px-4 py-2 rounded-[10px] hover:bg-white/[0.03] flex items-center gap-3 text-gray-400 hover:text-white text-xs cursor-pointer transition-colors"
                    >
                      <span className="material-symbols-outlined text-[#8ab4f8] text-sm">
                        {cmd.icon}
                      </span>
                      <span className="font-sans font-medium">{cmd.name}</span>
                    </button>
                  ))}
              </div>
            </div>
          )}

          {filteredCommands.length === 0 && (
            <div className="text-center py-12 text-gray-500 text-xs font-mono">
              No matching computational elements found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
