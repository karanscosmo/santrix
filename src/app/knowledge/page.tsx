"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useSecurity } from "@/lib/SecurityContext";

interface DocumentItem {
  id: string;
  name: string;
  type: "PDF" | "SLACK" | "CSV" | "JSON";
  size: string;
  time: string;
  status: "INDEXED" | "EMBEDDING" | "FAILED";
  progress: number;
}

export default function KnowledgeHubPage() {
  const { addAuditLog, checkPermission, sanitizeInput } = useSecurity();
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [retrievalScore, setRetrievalScore] = useState<number>(0.92);
  const [retrievalSource, setRetrievalSource] = useState<string>("Q3_Financial_Report_v2.pdf (Page 14)");
  const [retrievalText, setRetrievalText] = useState<string>(
    "...the integration of the new RAG pipeline has significantly reduced latency in our enterprise intelligence queries by approximately 40% compared to Q2. This efficiency gain is largely attributed to the optimized vector database schema and the implementation of hierarchical semantic caching strategies. Moving forward into Q4, the focus will shift towards expanding the knowledge graph capabilities to support multi-modal data ingestion..."
  );

  const [documents, setDocuments] = useState<DocumentItem[]>([
    {
      id: "doc_1",
      name: "Q3_Financial_Report_v2.pdf",
      type: "PDF",
      size: "24 MB",
      time: "10m ago",
      status: "INDEXED",
      progress: 100,
    },
    {
      id: "doc_2",
      name: "#engineering-architecture",
      type: "SLACK",
      size: "Slack Export",
      time: "1h ago",
      status: "INDEXED",
      progress: 100,
    },
    {
      id: "doc_3",
      name: "Client_Database_Dump_2023.csv",
      type: "CSV",
      size: "1.2 GB",
      time: "Processing...",
      status: "EMBEDDING",
      progress: 45,
    },
  ]);

  const [selectedNode, setSelectedNode] = useState<string>("central");

  // Validate uploaded files
  const validateAndAddFile = (fileName: string, fileSize: number, fileType: string) => {
    // Layer 3: Secure Uploads
    // Restrict sizes (<10MB)
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (fileSize > MAX_SIZE) {
      alert("Security Alert: File exceeds maximum allowed size (10MB). Upload blocked.");
      addAuditLog("upload.failed", `File upload blocked: ${fileName} too large (${(fileSize/1024/1024).toFixed(1)}MB)`, "FAILED");
      return;
    }

    // Restrict mime-types / extensions
    const allowedExtensions = [".pdf", ".csv", ".xlsx", ".json", ".txt"];
    const fileExt = fileName.substring(fileName.lastIndexOf(".")).toLowerCase();
    if (!allowedExtensions.includes(fileExt)) {
      alert(`Security Alert: Extension ${fileExt} is not permitted. Only PDF, CSV, XLSX, JSON, and TXT allowed.`);
      addAuditLog("upload.failed", `File upload blocked: forbidden extension: ${fileExt}`, "FAILED");
      return;
    }

    // Sanitization: remove path traversal characters / script tags from name
    const sanitizedName = sanitizeInput(fileName).replace(/[^a-zA-Z0-9_.-]/g, "_");

    const newDoc: DocumentItem = {
      id: `doc_${Date.now()}`,
      name: sanitizedName,
      type: fileExt === ".pdf" ? "PDF" : fileExt === ".json" ? "JSON" : "CSV",
      size: `${(fileSize / (1024 * 1024)).toFixed(2)} MB`,
      time: "Just now",
      status: "EMBEDDING",
      progress: 10,
    };

    setDocuments(prev => [newDoc, ...prev]);
    addAuditLog("upload.success", `Successfully ingested and sanitized file: ${sanitizedName}`, "SUCCESS");

    // Simulate embedding processing completes in 5s
    setTimeout(() => {
      setDocuments(currentDocs =>
        currentDocs.map(d => (d.id === newDoc.id ? { ...d, status: "INDEXED", progress: 100 } : d))
      );
      addAuditLog("embedding.success", `Successfully indexed vector embeddings for: ${sanitizedName}`, "SUCCESS");
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

    if (!checkPermission("file:upload")) {
      alert("Access Denied: Your role does not have permission to upload files.");
      return;
    }

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndAddFile(file.name, file.size, file.type);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!checkPermission("file:upload")) {
      alert("Access Denied: Your role does not have permission to upload files.");
      return;
    }

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      validateAndAddFile(file.name, file.size, file.type);
    }
  };

  const inspectNode = (nodeId: string) => {
    setSelectedNode(nodeId);
    if (nodeId === "central") {
      setRetrievalScore(0.98);
      setRetrievalSource("Core Platform Mandate.pdf");
      setRetrievalText(
        "Sanktrix core platform directives establish symbolic and neural AI loops to audit cash burn rate and strategic initiatives."
      );
    } else if (nodeId === "pdf_node") {
      setRetrievalScore(0.92);
      setRetrievalSource("Q3_Financial_Report_v2.pdf (Page 14)");
      setRetrievalText(
        "...the integration of the new RAG pipeline has significantly reduced latency in our enterprise intelligence queries by approximately 40%..."
      );
    } else {
      setRetrievalScore(0.89);
      setRetrievalSource("Karan Sharma profile.json");
      setRetrievalText(
        "Karan A Sharma holds strategic root executive oversight permissions over the platform algorithms and n8n execution brokers."
      );
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-md">
        {/* Row 1: Ingestion and Graph */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-md">
          {/* Upload & Ingestion Area */}
          <div className="lg:col-span-4 glass-panel rounded-lg p-md relative overflow-hidden flex flex-col h-[280px]">
            <div className="stream-pulse"></div>
            <div className="flex justify-between items-center mb-md border-b border-outline-variant pb-sm">
              <h2 className="font-display text-headline-md text-on-surface flex items-center gap-sm font-bold text-[16px]">
                <span className="material-symbols-outlined text-primary text-sm">cloud_upload</span>
                Data Ingestion
              </h2>
              <span className="bg-surface-container-high px-2 py-0.5 rounded font-mono text-tertiary border border-tertiary/30 text-[10px]">
                Active
              </span>
            </div>

            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`flex-1 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors cursor-pointer relative group ${
                dragActive ? "border-primary bg-primary/10" : "border-outline-variant hover:border-primary/50 bg-surface-container-lowest/50"
              }`}
            >
              <input
                type="file"
                id="file-upload-input"
                className="hidden"
                accept=".pdf,.csv,.xlsx,.json,.txt"
                onChange={handleFileInputChange}
              />
              <label
                htmlFor="file-upload-input"
                className="absolute inset-0 w-full h-full cursor-pointer flex flex-col items-center justify-center"
              >
                <span className="material-symbols-outlined text-[32px] text-on-surface-variant group-hover:text-primary mb-sm transition-colors">
                  upload_file
                </span>
                <p className="text-xs text-on-surface text-center px-lg font-bold">
                  Drag &amp; drop files or click to upload
                </p>
                <p className="font-mono text-[9px] text-on-surface-variant mt-sm">
                  PDF, CSV, XLSX, JSON, TXT (Max 10MB)
                </p>
              </label>
            </div>
          </div>

          {/* Knowledge Graph Visualization */}
          <div className="lg:col-span-8 glass-panel rounded-lg p-md relative overflow-hidden flex flex-col h-[280px]">
            <div className="flex justify-between items-center mb-md border-b border-outline-variant pb-sm">
              <h2 className="font-display text-headline-md text-on-surface flex items-center gap-sm font-bold text-[16px]">
                <span className="material-symbols-outlined text-primary text-sm">hub</span>
                Entity Graph Explorer
              </h2>
              <div className="flex gap-sm">
                {["zoom_in", "zoom_out", "filter_list"].map((ico, idx) => (
                  <button
                    key={idx}
                    onClick={() => alert(`Map operation ${ico} toggled.`)}
                    className="bg-surface-container-high border border-outline-variant p-1 rounded hover:bg-surface-container-highest transition-colors text-on-surface-variant cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">{ico}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Graph Container (Visual Nodes) */}
            <div className="flex-grow bg-surface-container-lowest rounded border border-outline-variant/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-radial from-primary/5 via-surface-dim to-surface-dim pointer-events-none"></div>

              {/* Central Node */}
              <button
                onClick={() => inspectNode("central")}
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-primary rounded-full flex items-center justify-center glow-active z-20 pulse-indicator cursor-pointer border ${
                  selectedNode === "central" ? "border-white" : "border-primary/40"
                }`}
              >
                <span className="material-symbols-outlined text-on-primary">corporate_fare</span>
              </button>

              {/* Connected Nodes */}
              <button
                onClick={() => inspectNode("pdf_node")}
                className={`absolute top-1/4 left-1/4 w-8 h-8 bg-surface-container-high border-2 rounded-full flex items-center justify-center z-20 cursor-pointer ${
                  selectedNode === "pdf_node" ? "border-white" : "border-tertiary"
                }`}
              >
                <span className="material-symbols-outlined text-tertiary text-[14px]">article</span>
              </button>

              <button
                onClick={() => inspectNode("person_node")}
                className={`absolute bottom-1/4 left-1/3 w-8 h-8 bg-surface-container-high border-2 rounded-full flex items-center justify-center z-20 cursor-pointer ${
                  selectedNode === "person_node" ? "border-white" : "border-secondary"
                }`}
              >
                <span className="material-symbols-outlined text-secondary text-[14px]">person</span>
              </button>

              {/* Connections SVG */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5">
                <line strokeDasharray="4" x1="50%" x2="25%" y1="50%" y2="25%"></line>
                <line x1="50%" x2="33%" y1="50%" y2="75%"></line>
              </svg>
            </div>
          </div>
        </div>

        {/* Row 2: Ingestions Logs and Retrieval Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-md">
          {/* Recent Ingestions / Stats */}
          <div className="lg:col-span-4 glass-panel rounded-lg p-md flex flex-col h-[300px]">
            <h2 className="font-display text-headline-md text-on-surface mb-md border-b border-outline-variant pb-sm flex items-center gap-sm font-bold text-[16px]">
              <span className="material-symbols-outlined text-primary text-sm">history</span>
              Index Status
            </h2>
            <div className="flex-grow overflow-y-auto space-y-sm pr-xs">
              {documents.map(doc => (
                <div
                  key={doc.id}
                  className="bg-surface-container p-sm rounded border border-outline-variant flex items-start gap-md hover:border-primary/30 transition-colors"
                >
                  <div className="p-xs bg-primary/10 rounded">
                    <span className="material-symbols-outlined text-primary text-[20px]">
                      {doc.type === "PDF" ? "picture_as_pdf" : doc.type === "SLACK" ? "forum" : "description"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-semibold text-on-surface truncate">{doc.name}</h3>
                    <div className="flex justify-between items-center mt-1 text-[10px] font-mono">
                      <span className="text-on-surface-variant">
                        {doc.size} • {doc.time}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded font-bold ${
                          doc.status === "INDEXED" ? "text-tertiary bg-tertiary/10" : "text-secondary bg-secondary/10"
                        }`}
                      >
                        {doc.status}
                      </span>
                    </div>
                    {doc.status === "EMBEDDING" && (
                      <div className="w-full bg-surface-container-highest h-1 mt-2 rounded-full overflow-hidden">
                        <div
                          className="bg-secondary h-full transition-all duration-500"
                          style={{ width: `${doc.progress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-md pt-md border-t border-outline-variant grid grid-cols-2 gap-sm">
              <div className="bg-surface-container-low p-sm rounded border border-outline-variant text-center">
                <p className="text-[9px] text-on-surface-variant font-mono uppercase">Total Documents</p>
                <p className="text-lg font-bold text-on-surface font-mono">{documents.length + 14201}</p>
              </div>
              <div className="bg-surface-container-low p-sm rounded border border-outline-variant text-center">
                <p className="text-[9px] text-on-surface-variant font-mono uppercase">Vector Count</p>
                <p className="text-lg font-bold text-primary font-mono">2.4M</p>
              </div>
            </div>
          </div>

          {/* Document Viewer / Retrieval Preview */}
          <div className="lg:col-span-8 glass-panel rounded-lg p-md flex flex-col h-[300px]">
            <div className="flex justify-between items-center mb-md border-b border-outline-variant pb-sm">
              <h2 className="font-display text-headline-md text-on-surface flex items-center gap-sm font-bold text-[16px]">
                <span className="material-symbols-outlined text-primary text-sm">find_in_page</span>
                Retrieval Preview
              </h2>
              <div className="flex gap-sm items-center">
                <span className="font-mono text-[10px] text-on-surface-variant bg-surface-container px-2 py-1 rounded">
                  Score: {retrievalScore}
                </span>
                <button
                  onClick={() => alert("Opening full source document view...")}
                  className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                </button>
              </div>
            </div>

            <div className="flex-1 bg-surface-container-lowest border border-outline-variant rounded p-md overflow-y-auto font-sans text-xs text-on-surface-variant leading-relaxed">
              <p className="mb-2">
                <strong className="text-on-surface font-bold">Source:</strong> {retrievalSource}
              </p>
              <div className="p-sm bg-surface-container/50 border-l-4 border-primary rounded-r font-mono">
                {retrievalText}
              </div>
              <div className="mt-md flex gap-sm">
                <span className="px-2 py-0.5 border border-outline-variant rounded-full font-mono text-[9px] text-on-surface-variant bg-surface-container-high">
                  #infrastructure
                </span>
                <span className="px-2 py-0.5 border border-outline-variant rounded-full font-mono text-[9px] text-on-surface-variant bg-surface-container-high">
                  #q3-performance
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
