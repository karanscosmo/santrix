"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSecurity } from "@/context/SecurityContext";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandItem {
  name: string;
  action?: string;
  url?: string;
  category: "Executive" | "Navigation";
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
        router.push(`/demo?scenario=${encodeURIComponent(scenario)}`);
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
      category: "Executive",
      icon: "play_arrow",
      description: "Stress-test user retention model",
    },
    {
      name: "/simulate Burn Rate Crisis",
      action: "/simulate Burn Rate Crisis",
      category: "Executive",
      icon: "play_arrow",
      description: "Simulate cash runway crunch under market stress",
    },
    {
      name: "/simulate Market Expansion",
      action: "/simulate Market Expansion",
      category: "Executive",
      icon: "play_arrow",
      description: "Run growth simulations on international segments",
    },
    {
      name: "/forecast Runway",
      action: "/forecast Runway",
      category: "Executive",
      icon: "functions",
      description: "Runway projection using Wolfram Cloud integration",
    },
    {
      name: "/optimize Marketing",
      action: "/optimize Marketing",
      category: "Executive",
      icon: "bar_chart",
      description: "Wolfram-powered budget allocation optimization",
    },
    {
      name: "/workflow CAC_EXCESS_TRIGGER",
      action: "/workflow CAC_EXCESS_TRIGGER",
      category: "Executive",
      icon: "account_tree",
      description: "View active CAC anomaly mitigation pipeline",
    },
    {
      name: "/workflow LEAD_ROUTING_SYNC",
      action: "/workflow LEAD_ROUTING_SYNC",
      category: "Executive",
      icon: "account_tree",
      description: "Check CRM routing workflow synchronization logs",
    },
    {
      name: "/report Q3 Board Briefing",
      action: "/report Q3 Board Briefing",
      category: "Executive",
      icon: "assessment",
      description: "Open synthesized executive brief for stakeholders",
    },
    {
      name: "/report Financial Forecast Audit",
      action: "/report Financial Forecast Audit",
      category: "Executive",
      icon: "assessment",
      description: "View detailed cash and ARR projections audit",
    },
    {
      name: "/agent Finance Optimizer",
      action: "/agent Finance Optimizer",
      category: "Executive",
      icon: "support_agent",
      description: "Review active financial scaling operations status",
    },
    {
      name: "/agent Strategy Agent",
      action: "/agent Strategy Agent",
      category: "Executive",
      icon: "support_agent",
      description: "Trigger autonomous competitive landscape scanner",
    },
    {
      name: "/agent SDR Swarm",
      action: "/agent SDR Swarm",
      category: "Executive",
      icon: "support_agent",
      description: "Check active workforce lead gen telemetry",
    },
    {
      name: "/document Security Compliance Audit",
      action: "/document Security Compliance Audit",
      category: "Executive",
      icon: "menu_book",
      description: "Inspect active governance audit reports",
    },
    {
      name: "/document Semantic Hub Index",
      action: "/document Semantic Hub Index",
      category: "Executive",
      icon: "menu_book",
      description: "View compiled vectors in knowledge storage base",
    },
    {
      name: "Overview Dashboard",
      url: "/dashboard",
      category: "Navigation",
      icon: "dashboard",
    },
    {
      name: "Wolfram Computation Center",
      url: "/wolfram",
      category: "Navigation",
      icon: "functions",
    },
    {
      name: "Strategy Command Center",
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
      name: "Hackathon Demo Mode",
      url: "/demo",
      category: "Navigation",
      icon: "play_circle",
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
      className="fixed inset-0 z-[100] bg-[#050505]/80 backdrop-blur-md flex items-center justify-center p-4"
    >
      <div className="glass-panel w-full max-w-2xl rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(86,141,255,0.2)] flex flex-col border border-primary/20">
        {/* Search Field */}
        <div className="p-4 border-b border-white/5 flex items-center gap-3 bg-[#090b10]">
          <span className="material-symbols-outlined text-primary text-xl">terminal</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search modules... (e.g. /simulate, /forecast)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent border-none text-white placeholder-on-surface-variant/50 text-sm focus:outline-none focus:ring-0 outline-none"
          />
          <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-on-surface-variant font-mono">
            ESC
          </span>
        </div>

        {/* Command Search Results */}
        <div className="max-h-[350px] overflow-y-auto p-2 space-y-4">
          {/* Executive Commands Section */}
          {filteredCommands.some((c) => c.category === "Executive") && (
            <div>
              <div className="px-4 py-1 font-mono text-[9px] text-[#ffb955] uppercase tracking-widest font-bold">
                Executive Commands
              </div>
              <div className="space-y-1 mt-1">
                {filteredCommands
                  .filter((c) => c.category === "Executive")
                  .map((cmd) => (
                    <button
                      key={cmd.name}
                      onClick={() => handleCommandClick(cmd)}
                      className="command-item w-full text-left px-4 py-2 rounded-lg hover:bg-white/5 flex items-center justify-between text-white group cursor-pointer"
                    >
                      <span className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#ffb955] text-sm">
                          {cmd.icon}
                        </span>
                        <span className="font-mono text-xs text-primary">{cmd.name}</span>
                        <span className="text-[10px] text-on-surface-variant group-hover:text-primary transition-colors pl-3">
                          {cmd.description}
                        </span>
                      </span>
                      <span className="text-[9px] text-on-surface-variant font-mono bg-white/5 px-1.5 py-0.5 rounded">
                        Enter
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Navigation Section */}
          {filteredCommands.some((c) => c.category === "Navigation") && (
            <div>
              <div className="px-4 py-1 font-mono text-[9px] text-primary uppercase tracking-widest font-bold">
                Go To Section
              </div>
              <div className="grid grid-cols-2 gap-1 mt-1">
                {filteredCommands
                  .filter((c) => c.category === "Navigation")
                  .map((cmd) => (
                    <button
                      key={cmd.name}
                      onClick={() => handleCommandClick(cmd)}
                      className="command-item text-left px-4 py-2 rounded-lg hover:bg-white/5 flex items-center gap-3 text-on-surface-variant hover:text-white text-xs cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-primary text-sm">
                        {cmd.icon}
                      </span>
                      <span>{cmd.name}</span>
                    </button>
                  ))}
              </div>
            </div>
          )}

          {filteredCommands.length === 0 && (
            <div className="text-center py-12 text-on-surface-variant text-xs font-mono">
              No matching computational command found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default CommandPalette;
