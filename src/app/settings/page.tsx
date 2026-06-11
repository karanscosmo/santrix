"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useSecurity } from "@/lib/SecurityContext";
import { UserRole } from "@/types";

interface AlertItem {
  id: string;
  severity: "CRITICAL" | "HIGH" | "INFO";
  title: string;
  time: string;
  message: string;
  acknowledged: boolean;
}

interface ApiKey {
  id: string;
  name: string;
  key: string;
  status: "ACTIVE" | "REVOKED";
}

export default function SettingsPage() {
  const { currentUser, setRole, auditLogs, addAuditLog, checkPermission, rateLimitCheck } = useSecurity();

  // Settings inputs
  const [orgName, setOrgName] = useState("Sanktrix Global Systems");
  const [region, setRegion] = useState("US-East (N. Virginia)");
  
  // API Keys state
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: "key_1",
      name: "Production Analytics",
      key: "sk_live_2fa3...4f9a",
      status: "ACTIVE"
    },
    {
      id: "key_2",
      name: "Development Sandbox",
      key: "sk_test_7c2b...8b2c",
      status: "REVOKED"
    }
  ]);

  // Alerts Center state
  const [alerts, setAlerts] = useState<AlertItem[]>([
    {
      id: "alt_1",
      severity: "CRITICAL",
      title: "CRITICAL THRESHOLD VIOLATION",
      time: "02:14:05 UTC",
      message: "Logistics cluster Alpha-7 reporting 40% latency spike. Forecast deviation indicates potential supply chain delay.",
      acknowledged: false
    },
    {
      id: "alt_2",
      severity: "HIGH",
      title: "HIGH FORECAST DEVIATION",
      time: "01:45:22 UTC",
      message: "Q3 Revenue projection dropped by 2.4% in the last hour based on new EU regulatory filings data ingestion.",
      acknowledged: false
    },
    {
      id: "alt_3",
      severity: "INFO",
      title: "SYSTEM ADVISORY",
      time: "00:12:00 UTC",
      message: "Agent 'Nexus-2' completed scheduled automated workflow for competitor analysis.",
      acknowledged: false
    }
  ]);

  // Security toggles
  const [agentTrades, setAgentTrades] = useState(false);
  const [require2FA, setRequire2FA] = useState(true);

  // Acknowledge alert
  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev =>
      prev.map(a => {
        if (a.id === alertId) {
          addAuditLog("alert.acknowledge", `Acknowledged ${a.severity} alert: ${a.title}`, "SUCCESS");
          return { ...a, acknowledged: true };
        }
        return a;
      })
    );
  };

  // Generate API Key
  const generateApiKey = () => {
    if (!checkPermission("admin:api_keys") && currentUser.role !== "Admin" && currentUser.role !== "Executive") {
      alert("Access Denied: Only Admin or Executive roles can generate new API keys.");
      addAuditLog("api_key.generate_failed", "Unauthorized attempt to generate API access key", "FAILED");
      return;
    }

    if (!rateLimitCheck()) {
      alert("Rate limit exceeded. Please wait.");
      return;
    }

    const name = prompt("Enter a description for the new API Key:", "API Integration Key");
    if (!name) return;

    const randomSuffix = Math.random().toString(36).substr(2, 8);
    const newKey: ApiKey = {
      id: `key_${Date.now()}`,
      name,
      key: `sk_live_new_${randomSuffix}...${Math.random().toString(36).substr(2, 4)}`,
      status: "ACTIVE"
    };

    setApiKeys(prev => [newKey, ...prev]);
    addAuditLog("api_key.generate", `Generated new API key: ${name}`, "SUCCESS");
  };

  // Revoke Key
  const revokeKey = (keyId: string, keyName: string) => {
    if (currentUser.role !== "Admin") {
      alert("Access Denied: Only Administrator role can revoke API keys.");
      return;
    }

    setApiKeys(prev =>
      prev.map(k => (k.id === keyId ? { ...k, status: "REVOKED" } : k))
    );
    addAuditLog("api_key.revoke", `Revoked API key: ${keyName}`, "SUCCESS");
  };

  // Save Config
  const saveConfiguration = () => {
    if (!checkPermission("config:write")) {
      alert("Unauthorized: Viewer/Analyst roles are blocked from modifying organization configurations.");
      return;
    }

    addAuditLog(
      "config.save",
      `Saved configuration parameters. Org: ${orgName}, Region: ${region}, 2FA: ${require2FA}, AgentTrades: ${agentTrades}`,
      "SUCCESS"
    );
    alert("Configuration parameters synchronized successfully.");
  };

  return (
    <DashboardLayout>
      {/* 1. Page Header matching visual hierarchy guidelines */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.04] pb-5">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white">
            Alerts &amp; Settings
          </h1>
          <p className="text-xs text-gray-400 font-mono mt-1 uppercase tracking-wider">
            Manage credentials, roles, governance policies, and audit logs.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Indicators */}
          <div className="flex items-center gap-2 bg-[#0d0f14] border border-white/[0.06] rounded-[10px] px-3.5 py-1.5 text-[10px] font-mono font-bold text-red-400">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
            {alerts.filter(a => !a.acknowledged && a.severity === "CRITICAL").length} Critical Alerts
          </div>
          <div className="flex items-center gap-2 bg-[#0d0f14] border border-white/[0.06] rounded-[10px] px-3.5 py-1.5 text-[10px] font-mono font-bold text-amber-400">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            {alerts.filter(a => !a.acknowledged && a.severity === "HIGH").length} Warnings
          </div>
        </div>
      </header>

      {/* 2. Content columns */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 pb-8">
        
        {/* Left Column: Alerts & Logs (Col 7) */}
        <section className="xl:col-span-7 flex flex-col gap-6">
          
          {/* Alerts Center */}
          <div className="panel-layer p-5 flex flex-col">
            <div className="flex justify-between items-center mb-4 border-b border-white/[0.04] pb-3">
              <h3 className="font-display text-sm font-bold text-white tracking-wide flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-red-400">warning</span>
                Alerts Center
              </h3>
              <button
                onClick={() => alert("Alert filters synced.")}
                className="font-mono text-[9px] text-gray-500 hover:text-white transition-colors cursor-pointer"
              >
                FILTER ALERTS
              </button>
            </div>
            
            <div className="flex flex-col gap-3 overflow-y-auto max-h-[300px] pr-1 scrollbar-thin">
              {alerts.filter(a => !a.acknowledged).length === 0 ? (
                <div className="text-center py-8 font-mono text-[11px] text-[#4edea3] flex flex-col items-center gap-2">
                  <span className="material-symbols-outlined text-3xl">verified</span>
                  All system alerts acknowledged. Operational threshold nominal.
                </div>
              ) : (
                alerts
                  .filter(a => !a.acknowledged)
                  .map((alertItem) => {
                    let sevClass = "bg-red-400/5 border-red-400/20 text-red-400";
                    let buttonClass = "btn-danger";

                    if (alertItem.severity === "HIGH") {
                      sevClass = "bg-amber-500/5 border-amber-500/20 text-amber-500";
                      buttonClass = "btn-primary bg-amber-500 hover:bg-amber-400 text-black";
                    } else if (alertItem.severity === "INFO") {
                      sevClass = "bg-[#8ab4f8]/5 border-[#8ab4f8]/20 text-[#8ab4f8]";
                      buttonClass = "btn-primary";
                    }

                    return (
                      <div
                        key={alertItem.id}
                        className={`border p-4 rounded-[18px] flex gap-3.5 items-start transition-all ${sevClass}`}
                      >
                        <span className="material-symbols-outlined text-lg shrink-0 mt-0.5">
                          {alertItem.severity === "CRITICAL"
                            ? "warning"
                            : alertItem.severity === "HIGH"
                            ? "notifications"
                            : "info"}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline mb-1">
                            <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-white">
                              {alertItem.title}
                            </span>
                            <span className="font-mono text-[8px] text-gray-500">
                              {alertItem.time}
                            </span>
                          </div>
                          <p className="font-sans text-xs text-gray-300 mb-3 leading-relaxed font-light">
                            {alertItem.message}
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => acknowledgeAlert(alertItem.id)}
                              className={`btn-action text-[9px] py-1.5 px-3.5 ${buttonClass}`}
                            >
                              Acknowledge
                            </button>
                            <button
                              onClick={() => alert(`Reviewing source dataset for ${alertItem.title}`)}
                              className="btn-action btn-secondary text-[9px] py-1.5 px-3.5"
                            >
                              View Data
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>

          {/* Centralized Audit Log */}
          <div className="panel-layer p-5 flex flex-col h-[350px]">
            <div className="flex justify-between items-center mb-4 border-b border-white/[0.04] pb-3">
              <h3 className="font-display text-sm font-bold text-white tracking-wide flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-[#4edea3]">history</span>
                Centralized Audit Log (Layer 7 Governance)
              </h3>
              <span className="w-1.5 h-1.5 bg-[#4edea3] rounded-full animate-ping"></span>
            </div>
            
            <div className="flex-1 overflow-y-auto font-mono text-[10px] space-y-2 pr-1 scrollbar-thin">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3 bg-[#050505]/40 rounded-[12px] border border-white/[0.03] text-gray-400 flex gap-3 items-start hover:border-[#8ab4f8]/20 transition-colors">
                  <span className={`px-2 py-0.5 rounded font-bold text-[8px] mt-0.5 shrink-0 ${
                    log.status === "SUCCESS" ? "text-[#4edea3] bg-[#4edea3]/10" : "text-red-400 bg-red-400/10"
                  }`}>
                    {log.status}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs truncate">
                      <strong className="text-[#8ab4f8] font-bold">{log.action}</strong>: {log.details}
                    </p>
                    <div className="flex justify-between text-[8px] text-gray-500 mt-1">
                      <span>USER: {log.userEmail} ({log.role})</span>
                      <span>{new Date(log.timestamp).toLocaleTimeString()} • IP: {log.ipAddress}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right Column: Configurations & RBAC Swapping (Col 5) */}
        <section className="xl:col-span-5 flex flex-col gap-6">
          
          {/* Active Security Session & Role Override */}
          <div className="card-layer p-5 border border-[#8ab4f8]/25 bg-[#0d0f14]/50">
            <h3 className="font-display text-sm text-white mb-2 font-bold flex items-center gap-2 text-[#8ab4f8]">
              <span className="material-symbols-outlined text-sm">shield</span> Active Governance Controls
            </h3>
            <p className="font-sans text-[11px] text-gray-400 mb-4 leading-relaxed font-light">
              Switch roles to evaluate security guards (RBAC, mutations, simulations, and API creation limits).
            </p>
            
            <div className="bg-[#050505]/40 p-3.5 rounded-[12px] border border-white/[0.04]">
              <label className="block font-sans text-[9px] text-gray-500 uppercase font-bold mb-1.5">
                Override Active User Session Role
              </label>
              <select
                value={currentUser.role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full bg-[#050505] border border-white/[0.06] rounded-[10px] p-2 font-mono text-xs text-amber-500 font-bold focus:border-[#8ab4f8] outline-none cursor-pointer"
              >
                <option value="Admin">Admin (Full System Permissions)</option>
                <option value="Executive">Executive (Run Simulations, No Configuration Writes)</option>
                <option value="Analyst">Analyst (Trigger Models, Upload Files, Scoped Boardroom)</option>
                <option value="Viewer">Viewer (Read-Only Portal Gating)</option>
              </select>
              <div className="mt-3 flex items-center justify-between text-[9px] text-gray-500 font-mono">
                <span>Subject ID: {currentUser.id}</span>
                <span>Role Scope: {currentUser.role === "Admin" ? "Full Access" : currentUser.role === "Viewer" ? "Read-Only Gate" : "Scoped Actions"}</span>
              </div>
            </div>
          </div>

          {/* System Configurations Panel */}
          <div className="panel-layer p-5 flex flex-col justify-between flex-grow">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-white/[0.04] pb-3">
                <h3 className="font-display text-sm font-bold text-white tracking-wide flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-[#8ab4f8]">settings_applications</span>
                  System Configurations
                </h3>
              </div>

              {/* Org Details */}
              <div className="space-y-3">
                <h4 className="font-mono text-[8px] text-gray-500 uppercase font-bold tracking-widest">ORGANIZATION CONFIGS</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block font-sans text-[10px] text-gray-400 font-medium mb-1">
                      Organization Name
                    </label>
                    <input
                      className="w-full bg-[#050505] border border-white/[0.06] rounded-[10px] px-3.5 py-2 text-xs font-sans text-white focus:border-[#8ab4f8] outline-none"
                      type="text"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-[10px] text-gray-400 font-medium mb-1">
                      Primary Compute Cloud Region
                    </label>
                    <select
                      className="w-full bg-[#050505] border border-white/[0.06] rounded-[10px] px-3.5 py-2 text-xs font-mono text-white focus:border-[#8ab4f8] outline-none cursor-pointer"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                    >
                      <option value="US-East (N. Virginia)">US-East (N. Virginia)</option>
                      <option value="EU-Central (Frankfurt)">EU-Central (Frankfurt)</option>
                      <option value="AP-South (Mumbai)">AP-South (Mumbai)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* API Access Keys */}
              <div className="space-y-3 pt-3 border-t border-white/[0.02]">
                <div className="flex justify-between items-center">
                  <h4 className="font-mono text-[8px] text-gray-500 uppercase font-bold tracking-widest">API ACCESS CREDENTIALS</h4>
                  <button
                    onClick={generateApiKey}
                    className="text-[#8ab4f8] font-mono text-[9px] font-bold flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">add</span> GENERATE KEY
                  </button>
                </div>
                <div className="space-y-2">
                  {apiKeys.map((key) => (
                    <div
                      key={key.id}
                      className={`bg-[#050505]/40 p-3 rounded-[12px] border border-white/[0.03] flex justify-between items-center ${
                        key.status === "REVOKED" ? "opacity-45" : ""
                      }`}
                    >
                      <div className="min-w-0 flex-1 pr-3">
                        <span className="block font-sans text-xs font-bold text-white truncate">{key.name}</span>
                        <span className="font-mono text-[9px] text-gray-500 block mt-0.5 truncate">{key.key}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {key.status === "ACTIVE" ? (
                          <>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(key.key);
                                alert("API Key copied to clipboard.");
                              }}
                              className="text-gray-500 hover:text-white cursor-pointer transition-colors p-1"
                              title="Copy"
                            >
                              <span className="material-symbols-outlined text-sm">content_copy</span>
                            </button>
                            <button
                              onClick={() => revokeKey(key.id, key.name)}
                              className="text-red-400 font-mono text-[9px] font-bold uppercase hover:underline cursor-pointer transition-all p-1"
                              title="Revoke Access"
                            >
                              Revoke
                            </button>
                          </>
                        ) : (
                          <span className="font-mono text-[9px] font-bold text-red-400 uppercase">Revoked</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-3 border-t border-white/[0.02]">
                <h4 className="font-mono text-[8px] text-gray-500 uppercase font-bold tracking-widest">SECURITY FLAGS</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-4">
                    <span className="font-sans text-xs text-gray-300 leading-normal">Allow AI Agents to execute direct trades</span>
                    <button
                      onClick={() => setAgentTrades(prev => !prev)}
                      className={`w-9 h-5 rounded-full relative border transition-all cursor-pointer shrink-0 mt-0.5 ${
                        agentTrades ? "bg-[#8ab4f8]/20 border-[#8ab4f8]/60" : "bg-[#1c1d24] border-white/[0.06]"
                      }`}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded-full absolute top-[2px] transition-all ${
                          agentTrades ? "bg-[#8ab4f8] right-[2px]" : "bg-gray-500 left-[2px]"
                        }`}
                      ></div>
                    </button>
                  </div>
                  <div className="flex justify-between items-start gap-4">
                    <span className="font-sans text-xs text-gray-300 leading-normal">Require hardware 2FA key for threshold mutations</span>
                    <button
                      onClick={() => setRequire2FA(prev => !prev)}
                      className={`w-9 h-5 rounded-full relative border transition-all cursor-pointer shrink-0 mt-0.5 ${
                        require2FA ? "bg-[#8ab4f8]/20 border-[#8ab4f8]/60" : "bg-[#1c1d24] border-white/[0.06]"
                      }`}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded-full absolute top-[2px] transition-all ${
                          require2FA ? "bg-[#8ab4f8] right-[2px]" : "bg-gray-500 left-[2px]"
                        }`}
                      ></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Config Actions */}
            <div className="mt-6 pt-4 border-t border-white/[0.04] flex justify-end">
              <button
                onClick={saveConfiguration}
                className="btn-action btn-primary text-[10px] py-2 px-6"
              >
                Save Settings
              </button>
            </div>
          </div>
        </section>

      </div>
    </DashboardLayout>
  );
}
