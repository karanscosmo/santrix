"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface TourStep {
  step: number;
  title: string;
  description: string;
  nextUrl?: string;
  isLast?: boolean;
}

const TOUR_STEPS: Record<string, TourStep> = {
  "1": {
    step: 1,
    title: "Executive Command Center",
    description: "Welcome to Sanktrix OS. This Dashboard provides a high-level overview of your entire organization's health, AI recommendations, and live system pulse.",
    nextUrl: "/twin?tour=2"
  },
  "2": {
    step: 2,
    title: "Enterprise Impact Map",
    description: "The Digital Twin visualizes how departments and nodes interact. A risk in one node cascades to others in real-time.",
    nextUrl: "/graph?tour=3"
  },
  "3": {
    step: 3,
    title: "Intelligence Graph",
    description: "Our Knowledge Graph links abstract entities. The Wolfram Engine evaluates these multi-domain relationships to surface non-obvious insights.",
    nextUrl: "/copilot?tour=4"
  },
  "4": {
    step: 4,
    title: "Decision Copilot",
    description: "Your AI executive assistant. It uses Monte Carlo simulations and live data to help you evaluate complex strategic 'what-if' scenarios.",
    nextUrl: "/simulations?tour=5"
  },
  "5": {
    step: 5,
    title: "Scenario Planning Lab",
    description: "Run advanced business simulations (like Revenue Forecasts or Burn Rate Crises) to stress-test your enterprise against multiple futures.",
    nextUrl: "/agents?tour=6"
  },
  "6": {
    step: 6,
    title: "AI Workforce Dashboard",
    description: "Monitor specialized autonomous agents (Finance, Strategy, Operations) as they reason, collaborate, and execute workflows.",
    nextUrl: "/fabric?tour=7"
  },
  "7": {
    step: 7,
    title: "Business Event Fabric",
    description: "A chronological ledger of every single event and transaction running through the enterprise ecosystem.",
    nextUrl: "/feed?tour=8"
  },
  "8": {
    step: 8,
    title: "Executive News Feed",
    description: "Get real-time curated insights, market shifts, and internal alerts synthesized directly for the C-Suite.",
    nextUrl: "/reports?tour=9"
  },
  "9": {
    step: 9,
    title: "Enterprise Reports",
    description: "Automatically generated, boardroom-ready documentation detailing historical performance and future projections.",
    nextUrl: "/status?tour=10"
  },
  "10": {
    step: 10,
    title: "Platform Health",
    description: "Complete visibility into the technical infrastructure, agent status, and API health of the entire OS.",
    nextUrl: "/demo?tour=end",
    isLast: true
  }
};

const TOTAL_STEPS = 10;
const AUTO_TOUR_DELAY = 6000; // 6 seconds per page

export const ProductTour: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tourStepParam = searchParams.get("tour");
  const isAutoMode = searchParams.get("auto") === "true";
  
  const currentStep = tourStepParam && TOUR_STEPS[tourStepParam] ? TOUR_STEPS[tourStepParam] : null;

  // Auto-advance logic
  useEffect(() => {
    if (!currentStep || !isAutoMode) return;

    const timer = setTimeout(() => {
      handleNext();
    }, AUTO_TOUR_DELAY);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, isAutoMode]);

  if (!currentStep) return null;

  const handleNext = () => {
    if (currentStep.nextUrl) {
      // Preserve auto mode in the next URL if active
      const nextParamUrl = isAutoMode ? `${currentStep.nextUrl}&auto=true` : currentStep.nextUrl;
      router.push(nextParamUrl);
    }
  };

  const handleClose = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("tour");
    url.searchParams.delete("auto");
    router.replace(url.pathname + url.search);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] w-80 bg-[#0a0b0e]/95 backdrop-blur-2xl border border-[#8ab4f8]/30 rounded-[16px] shadow-[0_12px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(138,180,248,0.15)] animate-fade-in-up overflow-hidden">
      {/* Top Accent line with progress bar in auto mode */}
      <div className="h-1 w-full bg-white/[0.1] relative">
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#8ab4f8] to-[#4edea3]"
          style={{ width: `${(currentStep.step / TOTAL_STEPS) * 100}%` }}
        ></div>
        {isAutoMode && (
          <div 
            className="absolute top-0 left-0 h-full bg-white opacity-30 animate-pulse"
            style={{ 
              width: '100%', 
              animation: `shrinkWidth ${AUTO_TOUR_DELAY}ms linear forwards` 
            }}
          ></div>
        )}
      </div>
      
      <div className="p-5 relative">
        <button 
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>

        <div className="mb-2 flex items-center gap-2">
          <span className="text-[9px] font-bold uppercase tracking-wider text-[#8ab4f8] bg-[#8ab4f8]/10 px-2 py-0.5 rounded border border-[#8ab4f8]/20">
            Interactive Guide · Step {currentStep.step} of {TOTAL_STEPS}
          </span>
          {isAutoMode && (
            <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-[#4edea3]">
              <span className="w-1.5 h-1.5 bg-[#4edea3] rounded-full animate-pulse"></span> Auto
            </span>
          )}
        </div>
        
        <h4 className="text-lg font-bold text-white font-display mb-2">{currentStep.title}</h4>
        <p className="text-xs text-gray-300 leading-relaxed mb-5">
          {currentStep.description}
        </p>

        <div className="flex items-center justify-between mt-2 pt-4 border-t border-white/[0.05]">
          <button 
            onClick={handleClose}
            className="text-[10px] text-gray-400 hover:text-white uppercase font-bold tracking-wider"
          >
            End Tour
          </button>
          <button 
            onClick={handleNext}
            className="bg-[#8ab4f8] text-[#050505] text-[10px] px-4 py-1.5 rounded-[6px] font-bold uppercase tracking-wider hover:bg-[#a8c7fa] transition-colors flex items-center gap-1 shadow-[0_0_15px_rgba(138,180,248,0.2)]"
          >
            {currentStep.isLast ? "Finish" : "Next"} <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>
      </div>
      
      {/* Global styles for animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shrinkWidth {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}} />
    </div>
  );
};

export default ProductTour;
