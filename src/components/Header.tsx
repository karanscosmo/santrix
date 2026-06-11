"use client";

import React, { useState } from "react";
import { useSecurity } from "@/context/SecurityContext";

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
    <header className="flex justify-between items-center h-16 px-lg fixed top-0 right-0 w-full md:w-[calc(100%-16rem)] z-40 bg-surface-container/80 backdrop-blur-xl border-b border-outline-variant shadow-sm">
      {/* Search Input Bar */}
      <div className="flex items-center gap-md w-1/3">
        <div className="relative w-full max-w-md">
          <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
            search
          </span>
          <input
            className="w-full bg-[#121212] border border-outline-variant rounded pl-xl pr-sm py-xs text-xs font-medium text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-on-surface-variant/50"
            placeholder="Search operations..."
            type="text"
          />
        </div>
      </div>

      {/* Action Controls & Notifications */}
      <div className="flex items-center gap-lg relative">
        <div className="flex items-center gap-md">
          {/* Terminal Command Button */}
          <button
            onClick={onOpenPalette}
            className="text-on-surface-variant hover:text-primary transition-all cursor-pointer"
            title="Open AI Command Palette"
          >
            <span className="material-symbols-outlined">terminal</span>
          </button>

          {/* Notifications Center Toggle */}
          <button
            onClick={toggleNotifications}
            className="text-on-surface-variant hover:text-primary transition-all relative cursor-pointer"
          >
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full"></span>
          </button>
        </div>

        {/* AI Command Trigger Button */}
        <button
          onClick={onOpenPalette}
          className="bg-primary text-on-primary font-mono text-[10px] uppercase font-bold px-md py-xs rounded hover:bg-primary-container transition-colors shadow-[0_0_15px_rgba(176,198,255,0.3)] cursor-pointer"
        >
          AI Command
        </button>

        {/* User profile picture */}
        <div className="flex items-center gap-sm">
          <img
            alt={currentUser.name}
            className="w-8 h-8 rounded-full border border-outline-variant object-cover"
            src={currentUser.avatarUrl}
          />
        </div>

        {/* Notifications Popover */}
        {showNotifications && (
          <div className="absolute right-12 top-12 w-80 glass-panel rounded-xl shadow-2xl p-md z-50 border border-outline-variant overflow-hidden">
            <div className="flex justify-between items-center mb-sm border-b border-outline-variant/50 pb-xs">
              <h4 className="font-display font-semibold text-xs text-on-surface uppercase tracking-wider">
                System Log Feed
              </h4>
              <span className="text-[10px] text-error font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping"></span> Realtime
              </span>
            </div>
            <div className="max-h-60 overflow-y-auto space-y-sm">
              {auditLogs.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  className="p-sm bg-surface-container rounded border border-outline-variant/30 text-[11px]"
                >
                  <div className="flex justify-between items-baseline mb-xs font-mono text-[9px] text-on-surface-variant">
                    <span className="uppercase text-primary font-bold">{log.action}</span>
                    <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-on-surface leading-tight font-sans">{log.details}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowNotifications(false)}
              className="w-full text-center text-[10px] text-primary hover:underline mt-sm pt-xs border-t border-outline-variant/30"
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
