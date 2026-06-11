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
      <div className="space-y-md">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md border-b border-outline-variant pb-md mb-xl">
          <div>
            <h2 className="font-display text-3xl text-on-surface font-bold">Alerts &amp; Settings</h2>
            <p className="font-mono text-xs text-on-surface-variant mt-xs">Manage credentials, roles, governance policies, and audit logs.</p>
          </div>
          <div className="flex gap-md font-mono text-xs">
            <span className="text-error flex items-center gap-xs">
              <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
              {alerts.filter(a => !a.acknowledged && a.severity === "CRITICAL").length} Critical
            </span>
            <span className="text-secondary flex items-center gap-xs">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              {alerts.filter(a => !a.acknowledged && a.severity === "HIGH").length} Warnings
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-md pb-8">
          {/* Left Column: Alerts Center & Centralized Audit Log */}
          <section className="xl:col-span-7 flex flex-col gap-md">
            
            {/* Alerts Center Panel */}
            <div className="glass-panel rounded-xl p-md relative overflow-hidden flex flex-col">
              <div className="flex justify-between items-center mb-md border-b border-outline-variant/30 pb-sm">
                <h3 className="font-display text-base text-on-surface font-semibold uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-error">warning</span>
                  Alerts Center
                </h3>
                <button
                  onClick={() => alert("Filters applied")}
                  className="font-sans text-[10px] font-bold text-on-surface-variant hover:text-primary uppercase tracking-wide cursor-pointer"
                >
                  Filter Alerts
                </button>
              </div>
              
              <div className="flex flex-col gap-sm overflow-y-auto max-h-[300px] pr-xs">
                {alerts.filter(a => !a.acknowledged).length === 0 ? (
                  <div className="text-center py-lg font-mono text-xs text-tertiary flex flex-col items-center gap-sm">
                    <span className="material-symbols-outlined text-4xl">verified</span>
                    All system alerts acknowledged. Operational threshold nominal.
                  </div>
                ) : (
                  alerts
                    .filter(a => !a.acknowledged)
                    .map((alertItem) => {
                      const sevClass =
                        alertItem.severity === "CRITICAL"
                          ? "bg-error-container/10 border-error/30 text-error"
                          : alertItem.severity === "HIGH"
                          ? "bg-secondary-container/5 border-secondary/20 text-secondary"
                          : "bg-surface-container border-outline-variant/40 text-tertiary";

                      return (
                        <div
                          key={alertItem.id}
                          className={`border p-md rounded-xl flex gap-md items-start transition-all ${sevClass}`}
                        >
                          <span className="material-symbols-outlined mt-0.5">
                            {alertItem.severity === "CRITICAL"
                              ? "warning"
                              : alertItem.severity === "HIGH"
                              ? "notifications"
                              : "info"}
                          </span>
                          <div className="flex-1">
                            <div className="flex justify-between items-baseline mb-1">
                              <span className="font-sans text-[10px] font-bold uppercase tracking-wider">
                                {alertItem.title}
                              </span>
                              <span className="font-mono text-[9px] text-on-surface-variant/75">
                                {alertItem.time}
                              </span>
                            </div>
                            <p className="font-sans text-xs text-on-surface-variant mb-md leading-relaxed font-light">
                              {alertItem.message}
                            </p>
                            <div className="flex gap-sm">
                              <button
                                onClick={() => acknowledgeAlert(alertItem.id)}
                                className={`font-sans text-[10px] font-bold px-md py-1 rounded-lg uppercase cursor-pointer transition-colors ${
                                  alertItem.severity === "CRITICAL"
                                    ? "bg-error text-on-error hover:bg-error/80"
                                    : "bg-secondary text-on-secondary hover:bg-secondary/80"
                                }`}
                              >
                                Acknowledge
                              </button>
                              <button
                                onClick={() => alert(`Reviewing source dataset for ${alertItem.title}`)}
                                className="border border-white/10 text-white font-sans text-[10px] font-bold px-md py-1 rounded-lg uppercase hover:bg-white/5 transition-colors cursor-pointer"
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

            {/* Centralized Audit Log (Layer 7 Audit Logs) */}
            <div className="glass-panel rounded-xl p-md flex flex-col h-[350px]">
              <div className="flex justify-between items-center mb-md border-b border-outline-variant/30 pb-sm">
                <h3 className="font-display text-base text-on-surface font-semibold uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-tertiary">history</span>
                  Centralized Audit Log (Layer 7 Security)
                </h3>
                <span className="w-1.5 h-1.5 bg-tertiary rounded-full animate-ping"></span>
              </div>
              <div className="flex-1 overflow-y-auto font-mono text-[10px] space-y-2 pr-xs select-all">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-sm bg-surface-container-lowest/30 rounded border border-outline-variant/35 text-on-surface-variant flex gap-sm items-start hover:border-primary/25 transition-all">
                    <span className={`px-2 py-0.5 rounded font-bold text-[8px] mt-0.5 ${
                      log.status === "SUCCESS" ? "text-tertiary bg-tertiary/10" : "text-error bg-error/10"
                    }`}>
                      {log.status}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-on-surface truncate"><strong className="text-primary">{log.action}</strong>: {log.details}</p>
                      <div className="flex justify-between text-[8px] text-on-surface-variant/60 mt-1">
                        <span>USER: {log.userEmail} ({log.role})</span>
                        <span>{new Date(log.timestamp).toLocaleTimeString()} • IP: {log.ipAddress}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Right Column: Configuration & Session Controls */}
          <section className="xl:col-span-5 flex flex-col gap-md">
            
            {/* Active Security Session & Role Override */}
            <div className="glass-panel rounded-xl p-md border-2 border-primary/20">
              <h3 className="font-display text-md text-on-surface mb-xs font-bold text-[16px] text-primary flex items-center gap-sm">
                <span className="material-symbols-outlined text-sm">shield</span> Active Governance Controls
              </h3>
              <p className="font-sans text-xs text-on-surface-variant mb-md leading-relaxed font-light">
                Switch roles to evaluate security guards (RBAC, mutations, simulations, and API creation limits).
              </p>
              
              <div className="bg-[#050505]/40 p-sm rounded-xl border border-white/5">
                <label className="block font-sans text-[10px] text-on-surface-variant uppercase font-semibold mb-1">
                  Override Active User Session Role
                </label>
                <select
                  value={currentUser.role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full bg-[#050505] border border-white/10 rounded p-sm font-mono text-xs text-tertiary font-bold focus:border-primary outline-none cursor-pointer"
                >
                  <option value="Admin">Admin (Full System Permissions)</option>
                  <option value="Executive">Executive (Run Simulations, No Configuration Writes)</option>
                  <option value="Analyst">Analyst (Trigger Models, Upload Files, Restricted Boardroom)</option>
                  <option value="Viewer">Viewer (Read-Only Portal Gating)</option>
                </select>
                <div className="mt-sm flex items-center justify-between text-[10px] text-on-surface-variant font-mono">
                  <span>Subject ID: {currentUser.id}</span>
                  <span>Role Scope: {currentUser.role === "Admin" ? "Full Access" : currentUser.role === "Viewer" ? "Read-Only Gate" : "Scoped Actions"}</span>
                </div>
              </div>
            </div>

            {/* System Configurations Panel */}
            <div className="glass-panel rounded-xl p-md flex flex-col justify-between flex-grow">
              <div className="space-y-md">
                <div className="flex justify-between items-center border-b border-outline-variant/30 pb-sm">
                  <h3 className="font-display text-base text-on-surface font-semibold uppercase tracking-wider flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-primary">settings_applications</span>
                    System Configurations
                  </h3>
                </div>

                {/* Org Details */}
                <div>
                  <h4 className="font-sans text-[10px] text-on-surface-variant uppercase font-semibold mb-md tracking-wider">Organization Management</h4>
                  <div className="space-y-md">
                    <div>
                      <label className="block font-sans text-[10px] text-on-surface uppercase font-semibold mb-1">
                        Organization Name
                      </label>
                      <input
                        className="w-full bg-[#050505] border border-white/10 rounded px-md py-sm text-xs font-mono text-on-surface focus:border-primary outline-none"
                        type="text"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block font-sans text-[10px] text-on-surface uppercase font-semibold mb-1">
                        Primary Compute Cloud Region
                      </label>
                      <select
                        className="w-full bg-[#050505] border border-white/10 rounded px-md py-sm text-xs font-mono text-on-surface focus:border-primary outline-none cursor-pointer"
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
                <div>
                  <div className="flex justify-between items-center mb-md">
                    <h4 className="font-sans text-[10px] text-on-surface-variant uppercase font-semibold tracking-wider">API Access Credentials</h4>
                    <button
                      onClick={generateApiKey}
                      className="text-primary font-sans text-[10px] font-bold flex items-center gap-xs hover:text-primary-container cursor-pointer transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span> Generate Key
                    </button>
                  </div>
                  <div className="space-y-sm">
                    {apiKeys.map((key) => (
                      <div
                        key={key.id}
                        className={`glass-panel p-sm rounded-lg flex justify-between items-center ${
                          key.status === "REVOKED" ? "opacity-45" : ""
                        }`}
                      >
                        <div>
                          <span className="block font-sans text-xs font-bold text-white">{key.name}</span>
                          <span className="font-mono text-[10px] text-on-surface-variant">{key.key}</span>
                        </div>
                        <div className="flex items-center gap-sm">
                          {key.status === "ACTIVE" ? (
                            <>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(key.key);
                                  alert("API Key copied to clipboard.");
                                }}
                                className="text-on-surface-variant hover:text-white cursor-pointer transition-colors"
                                title="Copy"
                              >
                                <span className="material-symbols-outlined text-sm">content_copy</span>
                              </button>
                              <button
                                onClick={() => revokeKey(key.id, key.name)}
                                className="text-error font-sans text-[9px] font-bold uppercase hover:underline cursor-pointer transition-all"
                                title="Revoke Access"
                              >
                                Revoke
                              </button>
                            </>
                          ) : (
                            <span className="font-sans text-[10px] font-bold text-error uppercase">Revoked</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Toggles */}
                <div>
                  <h4 className="font-sans text-[10px] text-on-surface-variant uppercase font-semibold mb-md tracking-wider">Security Flags</h4>
                  <div className="space-y-md">
                    <div className="flex justify-between items-center">
                      <span className="font-sans text-xs text-on-surface-variant">Allow AI Agents to execute direct trades</span>
                      <button
                        onClick={() => setAgentTrades(prev => !prev)}
                        className={`w-10 h-6 rounded-full relative border transition-all cursor-pointer ${
                          agentTrades ? "bg-primary/20 border-primary" : "bg-surface-container-highest border-outline-variant"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full absolute top-0.5 transition-all ${
                            agentTrades ? "bg-primary right-0.5 glow-button" : "bg-on-surface-variant left-0.5"
                          }`}
                        ></div>
                      </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-sans text-xs text-on-surface-variant">Require hardware 2FA key for threshold mutations</span>
                      <button
                        onClick={() => setRequire2FA(prev => !prev)}
                        className={`w-10 h-6 rounded-full relative border transition-all cursor-pointer ${
                          require2FA ? "bg-primary/20 border-primary" : "bg-surface-container-highest border-outline-variant"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full absolute top-0.5 transition-all ${
                            require2FA ? "bg-primary right-0.5 glow-button" : "bg-on-surface-variant left-0.5"
                          }`}
                        ></div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Configuration Actions Container */}
              <div className="mt-xl pt-md border-t border-outline-variant/30 flex justify-end">
                <button
                  onClick={saveConfiguration}
                  className="bg-primary text-on-primary font-sans text-xs uppercase font-bold px-lg py-md rounded-lg glow-button cursor-pointer hover:bg-primary-container transition-all"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
