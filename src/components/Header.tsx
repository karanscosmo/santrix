"use client";

import React, { useState } from "react";
import { useSecurity } from "@/lib/SecurityContext";

interface HeaderProps {
  onOpenPalette: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenPalette }) => {
  const { currentUser, auditLogs } = useSecurity();
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <header className="flex justify-between items-center h-16 px-6 fixed top-0 right-0 w-full md:w-[calc(100%-16rem)] z-40 bg-[#050505]/50 backdrop-blur-xl border-b border-white/[0.02] shadow-[0_1px_10px_rgba(0,0,0,0.4)]">
      {/* Global AI Search command input */}
      <div className="flex items-center gap-3 w-1/3 min-w-[280px]">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
            search
          </span>
          <input
            onClick={onOpenPalette}
            onFocus={onOpenPalette}
            readOnly
            className="w-full bg-[#0d0e12]/60 border border-white/[0.06] rounded-[10px] pl-9 pr-12 py-1.5 text-xs text-white outline-none transition-all placeholder-gray-500 cursor-pointer hover:border-[#8ab4f8]/30 focus:border-[#8ab4f8]"
            placeholder="Ask Sanktrix anything... (⌘K)"
            type="text"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] bg-white/[0.04] border border-white/[0.08] px-1.5 py-0.5 rounded text-gray-500 font-mono pointer-events-none">
            ⌘K
          </span>
        </div>
      </div>

      {/* Action Controls & User Identity */}
      <div className="flex items-center gap-4 relative">
        <div className="flex items-center gap-3">
          {/* AI Command trigger icon */}
          <button
            onClick={onOpenPalette}
            className="text-gray-400 hover:text-[#8ab4f8] transition-all cursor-pointer flex items-center p-1.5 rounded-lg hover:bg-white/[0.03]"
            title="Open AI Command Center"
          >
            <span className="material-symbols-outlined text-[18px]">terminal</span>
          </button>

          {/* Notifications status feed indicator */}
          <button
            onClick={toggleNotifications}
            className="text-gray-400 hover:text-[#8ab4f8] transition-all relative cursor-pointer flex items-center p-1.5 rounded-lg hover:bg-white/[0.03]"
            title="Audit Telemetry Log Feed"
          >
            <span className="material-symbols-outlined text-[18px]">notifications</span>
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#8ab4f8] rounded-full"></span>
          </button>
        </div>

        {/* Command Button */}
        <button
          onClick={onOpenPalette}
          className="bg-transparent border border-white/[0.08] hover:bg-white/[0.04] text-white hover:text-[#8ab4f8] font-mono text-[9px] uppercase font-bold px-3.5 py-1.5 rounded-[8px] transition-colors cursor-pointer"
        >
          AI Center
        </button>

        {/* User profile identifier */}
        <div className="flex items-center gap-2 border-l border-white/[0.08] pl-3">
          <img
            alt={currentUser?.name || "User"}
            className="w-7 h-7 rounded-full border border-white/[0.1] object-cover shadow-sm"
            src={currentUser?.avatarUrl || "/branding/favicon.png"}
          />
        </div>

        {/* Notification Feed Popover */}
        {showNotifications && (
          <div className="absolute right-0 top-12 w-80 bg-[#0d0e12]/95 backdrop-blur-xl rounded-[14px] shadow-[0_10px_30px_rgba(0,0,0,0.8)] p-4 z-50 border border-white/[0.05] overflow-hidden">
            <div className="flex justify-between items-center mb-3 border-b border-white/[0.05] pb-2">
              <h4 className="font-sans font-bold text-[10px] text-white uppercase tracking-wider">
                Audit Log Feed
              </h4>
              <span className="text-[9px] text-[#4edea3] font-mono flex items-center gap-1 font-bold">
                <span className="w-1 h-1 rounded-full bg-[#4edea3] animate-pulse"></span> Synchronized
              </span>
            </div>
            <div className="max-h-60 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
              {auditLogs && auditLogs.length > 0 ? (
                auditLogs.slice(0, 5).map((log) => (
                  <div
                    key={log.id}
                    className="p-2 bg-[#050505]/40 rounded-[8px] border border-white/[0.03] text-[10px]"
                  >
                    <div className="flex justify-between items-baseline mb-1 font-mono text-[9px] text-gray-500">
                      <span className="uppercase text-[#8ab4f8] font-bold truncate max-w-[140px]">{log.action}</span>
                      <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-gray-300 leading-tight font-sans">{log.details}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500 text-[10px] font-mono">
                  No telemetry logs available
                </div>
              )}
            </div>
            <button
              onClick={() => setShowNotifications(false)}
              className="w-full text-center text-[9px] font-bold uppercase tracking-wider text-[#8ab4f8] hover:underline mt-3 pt-2 border-t border-white/[0.05]"
            >
              Close Feed
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
