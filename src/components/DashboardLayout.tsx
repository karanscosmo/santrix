"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import CommandPalette from "./CommandPalette";
import Watermark from "./Watermark";

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  // Global hotkey listener: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const openPalette = () => setIsPaletteOpen(true);
  const closePalette = () => setIsPaletteOpen(false);

  return (
    <div className="min-h-screen flex text-on-surface">
      {/* Side Navigation Bar */}
      <Sidebar onOpenPalette={openPalette} />

      {/* Primary Layout Wrapper */}
      <div className="flex-1 flex flex-col md:pl-64 h-screen overflow-hidden">
        {/* Top Navbar */}
        <Header onOpenPalette={openPalette} />

        {/* Scrollable Main View Area */}
        <main className="flex-1 pt-16 pb-8 overflow-y-auto overflow-x-hidden bg-background relative">
          {/* Atmospheric Background Radial Glow */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              background: "radial-gradient(circle at 80% 20%, rgba(176, 198, 255, 0.15) 0%, transparent 40%)",
            }}
          />

          {/* Page content wrapper */}
          <div className="p-container-margin max-w-7xl mx-auto space-y-container-margin relative z-10">
            {children}
          </div>

          {/* Subdued Watermark Logo */}
          <Watermark />
        </main>
      </div>

      {/* Global AI Command Palette */}
      <CommandPalette isOpen={isPaletteOpen} onClose={closePalette} />
    </div>
  );
};
export default DashboardLayout;
