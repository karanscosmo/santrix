"use client";

import React, { useEffect, useState } from "react";
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
    description: "Welcome to Sanktrix. This Dashboard provides a high-level overview of your entire organization's health, AI-generated recommendations, and the current system pulse.",
    nextUrl: "/twin?tour=2"
  },
  "2": {
    step: 2,
    title: "Digital Twin (Impact Map)",
    description: "Here we map your enterprise. You can see how nodes (e.g., Marketing, Sales, Engineering) interact. Click 'Simulate Churn' to see risks propagate through the network in real-time.",
    nextUrl: "/graph?tour=3"
  },
  "3": {
    step: 3,
    title: "Intelligence Graph",
    description: "The Knowledge Graph links abstract entities (risks, events, data sets). Our Wolfram Engine evaluates multi-domain relationships here to surface non-obvious insights.",
    nextUrl: "/copilot?tour=4"
  },
  "4": {
    step: 4,
    title: "Strategic Decision Copilot",
    description: "Your AI executive assistant. It uses Monte Carlo simulations and live data to help you evaluate complex strategic 'what-if' scenarios.",
    nextUrl: "/dashboard?tour=end",
    isLast: true
  }
};

export const ProductTour: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tourStepParam = searchParams.get("tour");
  const [currentStep, setCurrentStep] = useState<TourStep | null>(null);

  useEffect(() => {
    if (tourStepParam && TOUR_STEPS[tourStepParam]) {
      setCurrentStep(TOUR_STEPS[tourStepParam]);
    } else {
      setCurrentStep(null);
    }
  }, [tourStepParam]);

  if (!currentStep) return null;

  const handleNext = () => {
    if (currentStep.nextUrl) {
      router.push(currentStep.nextUrl);
    }
  };

  const handleClose = () => {
    // Remove the tour param from URL
    const url = new URL(window.location.href);
    url.searchParams.delete("tour");
    router.replace(url.pathname + url.search);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] w-80 bg-[#0a0b0e]/95 backdrop-blur-2xl border border-[#8ab4f8]/30 rounded-[16px] shadow-[0_12px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(138,180,248,0.15)] animate-fade-in-up overflow-hidden">
      {/* Top Accent line */}
      <div className="h-1 w-full bg-gradient-to-r from-[#8ab4f8] to-[#4edea3]"></div>
      
      <div className="p-5 relative">
        <button 
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>

        <div className="mb-2">
          <span className="text-[9px] font-bold uppercase tracking-wider text-[#8ab4f8] bg-[#8ab4f8]/10 px-2 py-0.5 rounded border border-[#8ab4f8]/20">
            Interactive Guide · Step {currentStep.step} of 4
          </span>
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
    </div>
  );
};

export default ProductTour;
