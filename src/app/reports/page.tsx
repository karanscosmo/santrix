"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useSecurity } from "@/lib/SecurityContext";

interface ReportItem {
  id: string;
  name: string;
  type: "PDF" | "CSV" | "XLSX" | "JSON" | "TXT";
  status: "COMPLETED" | "COMPILING" | "FAILED";
  time: string;
  progress?: number;
  variance?: string;
  dataPoints?: number[];
  author?: string;
}

interface ConnectedSystem {
  id: string;
  name: string;
  category: string;
  status: "LIVE" | "SYNCING" | "PAUSED" | "DISCONNECTED";
  lastSync: string;
  percent?: number;
  color: string;
  icon: string;
}

export default function ReportsPage() {
  const { addAuditLog, checkPermission, sanitizeInput, rateLimitCheck } = useSecurity();
  const [dragActive, setDragActive] = useState<boolean>(false);
  
  // Reports State
  const [reports, setReports] = useState<ReportItem[]>([
    {
      id: "rep_1",
      name: "Q3 Board Briefing",
      type: "PDF",
      status: "COMPLETED",
      time: "2 hrs ago",
      author: "JD",
    },
    {
      id: "rep_2",
      name: "Investor Summary",
      type: "PDF",
      status: "COMPILING",
      time: "Compiling Data...",
      progress: 65,
      author: "AK",
    },
    {
      id: "rep_3",
      name: "FY24 Forecast Audit",
      type: "CSV",
      status: "COMPLETED",
      time: "Analyzed against 4 datasets",
      variance: "Variance Nominal",
      dataPoints: [30, 45, 35, 70, 85, 95],
      author: "JD",
    }
  ]);

  // Connected Systems State
  const [systems, setSystems] = useState<ConnectedSystem[]>([
    {
      id: "sys_1",
      name: "Salesforce",
      category: "CRM Data",
      status: "LIVE",
      lastSync: "2m ago",
      color: "#8ab4f8",
      icon: "cloud"
    },
    {
      id: "sys_2",
      name: "PostgreSQL",
      category: "Core Database",
      status: "LIVE",
      lastSync: "5s ago",
      color: "#4edea3",
      icon: "data_object"
    },
    {
      id: "sys_3",
      name: "Jira",
      category: "Issue Tracking",
      status: "SYNCING",
      lastSync: "Syncing",
      percent: 85,
      color: "#c4b5fd",
      icon: "bug_report"
    },
    {
      id: "sys_4",
      name: "Slack",
      category: "Communications",
      status: "PAUSED",
      lastSync: "Manual",
      color: "#f28b82",
      icon: "forum"
    }
  ]);

  // Compile Progress Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setReports(prev =>
        prev.map(r => {
          if (r.status === "COMPILING" && r.progress !== undefined) {
            const nextProgress = r.progress + 5;
            if (nextProgress >= 100) {
              return {
                ...r,
                status: "COMPLETED",
                progress: undefined,
                time: "Just now"
              };
            }
            return {
              ...r,
              progress: nextProgress
            };
          }
          return r;
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Secure File Upload Handlers
  const validateAndAddReport = (fileName: string, fileSize: number, fileType: string) => {
    // Check role permission
    if (!checkPermission("file:upload")) {
      alert("Access Denied: Viewer/Analyst credentials lack document ingestion permissions.");
      return;
    }

    // Rate Limit check
    if (!rateLimitCheck()) {
      alert("Rate limit exceeded. Try again in a minute.");
      return;
    }

    // Max Size Validation (10MB limit)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (fileSize > MAX_SIZE) {
      alert(`Security Blocked: File size (${(fileSize / (1024 * 1024)).toFixed(2)}MB) exceeds 10MB limit.`);
      addAuditLog("upload.rejected", `Size violation for file ${fileName} (${(fileSize / (1024 * 1024)).toFixed(2)}MB)`, "FAILED");
      return;
    }

    // Allowed Extensions Filter
    const allowedExtensions = [".pdf", ".csv", ".xlsx", ".json", ".txt"];
    const fileExt = fileName.substring(fileName.lastIndexOf(".")).toLowerCase();
    if (!allowedExtensions.includes(fileExt)) {
      alert(`Security Blocked: Unauthorized extension "${fileExt}". Only PDF, CSV, XLSX, JSON, and TXT files are permitted.`);
      addAuditLog("upload.rejected", `Extension violation for file: ${fileName}`, "FAILED");
      return;
    }

    // Filename Sanitization
    const sanitizedName = sanitizeInput(fileName).replace(/[^a-zA-Z0-9_.-]/g, "_");

    const newReport: ReportItem = {
      id: `rep_${Date.now()}`,
      name: sanitizedName.replace(/\.[^/.]+$/, ""), // remove ext for display name
      type: fileExt.substring(1).toUpperCase() as "PDF" | "CSV" | "XLSX" | "JSON" | "TXT",
      status: "COMPILING",
      time: "Analyzing schema...",
      progress: 20,
      author: "JD"
    };

    setReports(prev => [newReport, ...prev]);
    addAuditLog("report.ingest", `Ingested file: ${sanitizedName} for processing`, "SUCCESS");

    // Simulate analysis timeline
    setTimeout(() => {
      setReports(currentReports =>
        currentReports.map(r => {
          if (r.id === newReport.id) {
            return {
              ...r,
              status: "COMPLETED",
              progress: undefined,
              time: "Just now"
            };
          }
          return r;
        })
      );
      addAuditLog("report.compile_success", `Successfully verified schema and created report: ${sanitizedName}`, "SUCCESS");
    }, 5000);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndAddReport(file.name, file.size, file.type);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      validateAndAddReport(file.name, file.size, file.type);
    }
  };

  // Sync System Action
  const triggerSync = (systemId: string) => {
    if (!checkPermission("config:write")) {
      alert("Unauthorized: Executive or Admin credentials required to trigger system syncs.");
      return;
    }

    setSystems(prev =>
      prev.map(s => {
        if (s.id === systemId) {
          addAuditLog("system.sync_start", `Triggered manual sync for data connector: ${s.name}`, "SUCCESS");
          
          // Complete mock sync in 3s
          setTimeout(() => {
            setSystems(currentSystems =>
              currentSystems.map(cs => {
                if (cs.id === systemId) {
                  addAuditLog("system.sync_complete", `Sync completed for connector: ${cs.name}`, "SUCCESS");
                  return {
                    ...cs,
                    status: "LIVE",
                    lastSync: "Just now",
                    percent: undefined
                  };
                }
                return cs;
              })
            );
          }, 3000);

          return {
            ...s,
            status: "SYNCING",
            percent: 5,
            lastSync: "Syncing..."
          };
        }
        return s;
      })
    );
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.04] pb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white">
            Enterprise Reports
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Executive summaries, forecast audits, and data integrations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => alert("Filter overlays enabled.")}
            className="btn-action btn-secondary text-[11px] py-2"
          >
            <span className="material-symbols-outlined text-[14px]">filter_list</span>
            Filter
          </button>
          <label
            htmlFor="header-upload-input"
            className="btn-action btn-primary text-[11px] py-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[14px]">add</span>
            New Report
            <input
              type="file"
              id="header-upload-input"
              className="hidden"
              accept=".pdf,.csv,.xlsx,.json,.txt"
              onChange={handleFileInputChange}
            />
          </label>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Reports Panel */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] text-gray-500 uppercase tracking-wider font-bold">
              Generated Reports
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-[#050505]/40 border border-white/[0.04] hover:border-white/[0.15] p-5 rounded-[16px] transition-all flex flex-col justify-between min-h-[170px] relative group cursor-pointer"
              >
                {report.status === "COMPLETED" ? (
                  <div className="absolute top-4 right-4 text-[#4edea3]">
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  </div>
                ) : (
                  <div className="absolute top-4 right-4 text-[#8ab4f8]">
                    <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                  </div>
                )}

                <div className="mb-4 pr-6">
                  <div className="w-8 h-8 rounded-[8px] bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-3">
                    <span className="material-symbols-outlined text-[16px] text-gray-400">
                      {report.type === "PDF" ? "pie_chart" : report.type === "CSV" ? "show_chart" : "description"}
                    </span>
                  </div>
                  <h4 className="font-display text-lg font-bold text-white tracking-tight">{report.name}</h4>
                  <p className="text-[11px] text-gray-500 mt-1">
                    {report.status === "COMPILING" ? report.time : `Generated: ${report.time}`}
                  </p>
                </div>

                {report.status === "COMPILING" && report.progress !== undefined && (
                  <div className="w-full mt-auto">
                    <div className="confidence-bar w-full h-1.5 mb-2">
                      <div className="fill" style={{ width: `${report.progress}%` }}></div>
                    </div>
                    <span className="text-[10px] text-[#8ab4f8] font-bold">{report.progress}% Complete</span>
                  </div>
                )}

                {/* Sparkline for specific reports */}
                {report.dataPoints && (
                  <div className="h-12 flex items-end gap-1 mt-auto pt-2 border-t border-white/[0.04]">
                    {report.dataPoints.map((dp, idx) => (
                      <div
                        key={idx}
                        style={{ height: `${dp}%` }}
                        className="flex-1 bg-[#8ab4f8]/30 rounded-t hover:bg-[#8ab4f8] transition-colors"
                        title={`Variance score: ${dp}`}
                      ></div>
                    ))}
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 mt-auto border-t border-white/[0.04]">
                  {report.author && (
                    <div className="w-6 h-6 rounded-full bg-[#1a1b21] border border-white/[0.1] flex items-center justify-center text-[9px] text-white font-bold">
                      {report.author}
                    </div>
                  )}
                  {report.variance && (
                    <span className="text-[10px] text-[#4edea3] font-bold px-2 py-0.5 rounded-full border border-[#4edea3]/20 bg-[#4edea3]/10">
                      {report.variance}
                    </span>
                  )}
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${report.status === "COMPLETED" ? "text-[#8ab4f8] group-hover:underline" : "text-gray-500"}`}>
                    {report.status === "COMPLETED" ? `View ${report.type}` : "Processing"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Secure File Ingestion */}
          <div className="pt-2">
            <h2 className="text-[11px] text-gray-500 uppercase tracking-wider font-bold mb-3">
              Secure Document Ingestion
            </h2>
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-[16px] p-8 flex flex-col items-center justify-center transition-all cursor-pointer min-h-[160px] ${
                dragActive ? "border-[#8ab4f8] bg-[#8ab4f8]/5" : "border-white/[0.1] hover:border-white/[0.2] bg-[#050505]/40"
              }`}
            >
              <input
                type="file"
                id="sec-upload-input"
                className="hidden"
                accept=".pdf,.csv,.xlsx,.json,.txt"
                onChange={handleFileInputChange}
              />
              <label htmlFor="sec-upload-input" className="cursor-pointer flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-white/[0.03] flex items-center justify-center mb-3 group-hover:bg-white/[0.05] transition-colors">
                  <span className="material-symbols-outlined text-[24px] text-gray-400">
                    cloud_upload
                  </span>
                </div>
                <p className="text-sm text-white font-bold">Drag &amp; drop data reports or click to upload</p>
                <p className="text-[11px] text-gray-500 mt-2">
                  Supported extensions: PDF, CSV, XLSX, JSON, TXT (Maximum limit 10MB)
                </p>
              </label>
            </div>
          </div>
        </div>

        {/* Connected Systems Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] text-gray-500 uppercase tracking-wider font-bold">
              Connected Systems
            </h2>
          </div>

          <div className="panel-layer flex flex-col border border-white/[0.05] rounded-[16px] overflow-hidden">
            <div className="p-4 border-b border-white/[0.04] bg-[#0a0b0e] flex justify-between items-center">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Data Connectors</span>
              <span className="material-symbols-outlined text-[16px] text-gray-500">hub</span>
            </div>

            <div className="flex-1 p-2 space-y-1">
              {systems.map((sys) => (
                <div
                  key={sys.id}
                  className="flex items-center justify-between p-3 hover:bg-white/[0.03] rounded-[10px] transition-colors group border border-transparent hover:border-white/[0.05]"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${sys.color}15`, border: `1px solid ${sys.color}30` }}
                    >
                      <span className="material-symbols-outlined text-[18px]" style={{ color: sys.color }}>
                        {sys.icon}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white leading-tight">{sys.name}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">{sys.category}</p>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end min-w-[80px]">
                    {sys.status === "LIVE" && (
                      <div className="flex items-center gap-1.5 text-[#4edea3]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
                        <span className="text-[10px] font-bold uppercase tracking-wider">Live</span>
                      </div>
                    )}
                    {sys.status === "SYNCING" && (
                      <div className="flex items-center gap-1.5 text-[#8ab4f8]">
                        <span className="material-symbols-outlined text-[12px] animate-spin">sync</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider">Syncing</span>
                      </div>
                    )}
                    {sys.status === "PAUSED" && (
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <span className="material-symbols-outlined text-[12px]">pause_circle</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider">Paused</span>
                      </div>
                    )}
                    <span className="text-[10px] text-gray-500 mt-1 block">
                      {sys.percent ? `${sys.percent}% complete` : `Last sync: ${sys.lastSync}`}
                    </span>

                    <button
                      onClick={() => triggerSync(sys.id)}
                      disabled={sys.status === "SYNCING"}
                      className="opacity-0 group-hover:opacity-100 text-[10px] text-[#8ab4f8] font-bold uppercase tracking-wider hover:underline mt-1.5 transition-opacity cursor-pointer disabled:opacity-30"
                    >
                      Sync Now
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-white/[0.04] bg-[#0a0b0e]">
              <button
                onClick={() => alert("Activity logs loaded.")}
                className="w-full text-center text-xs font-bold text-[#8ab4f8] hover:text-[#a8c7fa] uppercase tracking-wider transition-colors py-1.5 cursor-pointer"
              >
                View Activity Log
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
