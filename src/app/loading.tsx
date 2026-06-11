"use client";

import React from "react";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-[#050505] text-[#e5e2e1] font-sans antialiased flex flex-col items-center justify-center z-[9999] overflow-hidden">
      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none z-0 opacity-40"></div>

      <div className="relative flex flex-col items-center justify-center space-y-6 z-10">
        {/* Particle glow container */}
        <div className="absolute w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
        
        {/* Standalone brand logo wordmark with pulse & glow */}
        <img
          src="/branding/Sanktrix_logo_transparent.png"
          className="w-[220px] h-auto object-contain animate-pulse filter drop-shadow-[0_0_30px_rgba(0,219,231,0.25)]"
          alt="Loading Sanktrix"
        />
        
        {/* Loading indicators */}
        <div className="flex items-center gap-2 pt-4">
          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
          <span className="w-1.5 h-1.5 bg-secondary-fixed-dim rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
          <span className="w-1.5 h-1.5 bg-primary-fixed-dim rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
        </div>
        
        <span className="font-mono text-[10px] text-on-surface-variant/70 uppercase tracking-widest animate-pulse">
          Initializing AGI Node
        </span>
      </div>
    </div>
  );
}
