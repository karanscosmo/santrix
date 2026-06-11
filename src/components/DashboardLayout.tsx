"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSecurity } from "@/context/SecurityContext";
import Sidebar from "./Sidebar";
import Header from "./Header";
import CommandPalette from "./CommandPalette";
import Watermark from "./Watermark";

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const { isAuthenticated } = useSecurity();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

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

  // Avoid rendering anything while checking authentication
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex text-on-surface bg-[#050505]">
      {/* Side Navigation Bar */}
      <Sidebar onOpenPalette={openPalette} />

      {/* Primary Layout Wrapper */}
      <div className="flex-1 flex flex-col md:pl-64 h-screen overflow-hidden">
        {/* Top Navbar */}
        <Header onOpenPalette={openPalette} />

        {/* Scrollable Main View Area */}
        <main className="flex-1 pt-16 pb-8 overflow-y-auto overflow-x-hidden bg-[#050505] relative">
          {/* Atmospheric Background Radial Glow */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              background: "radial-gradient(circle at 80% 20%, rgba(176, 198, 255, 0.1) 0%, transparent 40%)",
            }}
          />

          {/* Page content wrapper with standard responsive spacing */}
          <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8 relative z-10">
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
