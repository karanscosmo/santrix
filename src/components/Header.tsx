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
    <header className="flex justify-between items-center h-16 px-6 fixed top-0 right-0 w-full md:w-[calc(100%-16rem)] z-40 bg-[#1c1f28]/80 backdrop-blur-xl border-b border-white/5 shadow-sm">
      {/* Search Input Bar (Command Palette Trigger) */}
      <div className="flex items-center gap-3 w-1/3">
        <div className="relative w-full max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
            search
          </span>
          <input
            onClick={onOpenPalette}
            onFocus={onOpenPalette}
            readOnly
            className="w-full bg-[#050505]/60 border border-white/10 rounded-lg pl-9 pr-12 py-1.5 text-xs font-medium text-on-surface outline-none transition-all placeholder-on-surface-variant/50 cursor-pointer hover:border-primary/30"
            placeholder="Search operations..."
            type="text"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-on-surface-variant font-mono pointer-events-none">
            ⌘K
          </span>
        </div>
      </div>

      {/* Action Controls & Notifications */}
      <div className="flex items-center gap-6 relative">
        <div className="flex items-center gap-3">
          {/* Terminal Command Button */}
          <button
            onClick={onOpenPalette}
            className="text-on-surface-variant hover:text-primary transition-all cursor-pointer flex items-center"
            title="Open AI Command Palette"
          >
            <span className="material-symbols-outlined text-[20px]">terminal</span>
          </button>

          {/* Notifications Center Toggle */}
          <button
            onClick={toggleNotifications}
            className="text-on-surface-variant hover:text-primary transition-all relative cursor-pointer flex items-center"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-[#ffb4ab] rounded-full"></span>
          </button>
        </div>

        {/* AI Command Trigger Button */}
        <button
          onClick={onOpenPalette}
          className="bg-primary hover:bg-[#c2d6ff] text-[#001945] font-mono text-[9px] uppercase font-bold px-4 py-1.5 rounded-lg transition-colors shadow-[0_0_15px_rgba(176,198,255,0.2)] cursor-pointer"
        >
          AI Command
        </button>

        {/* User profile picture */}
        <div className="flex items-center gap-2">
          <img
            alt={currentUser.name}
            className="w-8 h-8 rounded-full border border-white/10 object-cover shadow-md"
            src={currentUser.avatarUrl}
          />
        </div>

        {/* Notifications Popover */}
        {showNotifications && (
          <div className="absolute right-12 top-12 w-80 glass-panel rounded-xl shadow-2xl p-4 z-50 border border-white/5 overflow-hidden">
            <div className="flex justify-between items-center mb-2 border-b border-white/5 pb-1">
              <h4 className="font-display font-bold text-xs text-white uppercase tracking-wider">
                System Log Feed
              </h4>
              <span className="text-[9px] text-[#ffb4ab] font-mono flex items-center gap-1 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ffb4ab] animate-ping"></span> Realtime
              </span>
            </div>
            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {auditLogs.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  className="p-2 bg-[#050505]/40 rounded-lg border border-white/5 text-[10px]"
                >
                  <div className="flex justify-between items-baseline mb-1 font-mono text-[9px] text-on-surface-variant">
                    <span className="uppercase text-primary font-bold">{log.action}</span>
                    <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-on-surface leading-tight font-sans">{log.details}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowNotifications(false)}
              className="w-full text-center text-[9px] font-bold uppercase tracking-wider text-primary hover:underline mt-2 pt-2 border-t border-white/5"
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
