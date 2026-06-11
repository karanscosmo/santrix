"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSecurity } from "@/context/SecurityContext";
import WebGLBackground from "@/components/WebGLBackground";

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated } = useSecurity();

  // Scroll reveal observer
  useEffect(() => {
    if (typeof window !== "undefined") {
      const observerOptions = { threshold: 0.1 };
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      }, observerOptions);

      document.querySelectorAll(".scroll-reveal").forEach((el) => observer.observe(el));

      // Parallax effect for grid background
      const handleScroll = () => {
        const scrolled = window.pageYOffset;
        const grid = document.querySelector(".bg-grid-pattern") as HTMLElement;
        if (grid) {
          grid.style.transform = `translateY(${scrolled * 0.1}px)`;
        }
      };
      window.addEventListener("scroll", handleScroll);

      return () => {
        observer.disconnect();
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  // Smooth scroll helper
  const handleNavClick = (e: React.MouseEvent<HTMLElement>, targetId: string) => {
    e.preventDefault();
    if (targetId === "#") return;
    const element = document.querySelector(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Showcase state
  const [carouselIdx, setCarouselIdx] = useState(0);
  const carouselItems = [
    {
      title: "Executive Copilot",
      desc: "Your voice-activated bridge to enterprise intelligence. Ask strategy questions, build automatic brief logs, and generate memos instantly.",
      icon: "smart_toy",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCu8blTiBRjwd6FD6pzl3ZxkUBnCKdb9XzDsFxpUzxGDHwb8tonKjrYQMCaXPSq0HGjIUgwookhHOPkFYNS-U4JUXvwdnYavesBYtiHhZqYu7X9n0sQtIqSSCYLNRNVOXkCi10CcODLLA05tMNWPamVMkLHYZlhR7bx1Y1nauuZxJ_LZQ-Mt9wp5EWhD6xl0nAIEYj79YR2UcRmCICAJhZ09huFUSAUHFkM9RekGWaCJkEg72LANjMAbKmvhvDrDGY6S3bHNXAp56M"
    },
    {
      title: "Agent Observatory",
      desc: "Observe every autonomous agent's reasoning path in real-time. Inspect prompts, trace nodes, and evaluate LLM swarms execution logs.",
      icon: "visibility",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDIaizFC2bzA52UEUnmft1xxpPlkSfMcCAEGnDLdDD5zxaOMbiJG4WEN7j8kpGgkVy6QcLpbeZyt9-qCqKhDEaaZGSmMIMbT518c9o2RtgVKU3lvnZkqUVG4_PBDLYAx6ay8DxoXMnxQfACrR30ZRIGks_8YxE9EviN8JLKEhqqWioVtxXoCjvemx4TkeZSKGBX_ECPrSIe2EwHf6bR6c51luYuHUXXfSxQXt1g2UxXsSIlO67YZTpY57DAK6_h7M9_tjEa8U7dl0w"
    },
    {
      title: "Business Simulation Engine",
      desc: "Compute multi-variable runways and cash flow models. Drag variance sliders to forecast hiring speed and churn mitigation rates.",
      icon: "model_training",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCu8blTiBRjwd6FD6pzl3ZxkUBnCKdb9XzDsFxpUzxGDHwb8tonKjrYQMCaXPSq0HGjIUgwookhHOPkFYNS-U4JUXvwdnYavesBYtiHhZqYu7X9n0sQtIqSSCYLNRNVOXkCi10CcODLLA05tMNWPamVMkLHYZlhR7bx1Y1nauuZxJ_LZQ-Mt9wp5EWhD6xl0nAIEYj79YR2UcRmCICAJhZ09huFUSAUHFkM9RekGWaCJkEg72LANjMAbKmvhvDrDGY6S3bHNXAp56M"
    },
    {
      title: "Knowledge Graph",
      desc: "Inspect semantic files vector indices, audit documents context stores, and query company-wide structured metadata links.",
      icon: "hub",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDIaizFC2bzA52UEUnmft1xxpPlkSfMcCAEGnDLdDD5zxaOMbiJG4WEN7j8kpGgkVy6QcLpbeZyt9-qCqKhDEaaZGSmMIMbT518c9o2RtgVKU3lvnZkqUVG4_PBDLYAx6ay8DxoXMnxQfACrR30ZRIGks_8YxE9EviN8JLKEhqqWioVtxXoCjvemx4TkeZSKGBX_ECPrSIe2EwHf6bR6c51luYuHUXXfSxQXt1g2UxXsSIlO67YZTpY57DAK6_h7M9_tjEa8U7dl0w"
    },
    {
      title: "Digital Twin",
      desc: "Visualize your entire business ecosystem in real time. Map projects, KPI progress bars, and critical latency dependencies.",
      icon: "donut_large",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCu8blTiBRjwd6FD6pzl3ZxkUBnCKdb9XzDsFxpUzxGDHwb8tonKjrYQMCaXPSq0HGjIUgwookhHOPkFYNS-U4JUXvwdnYavesBYtiHhZqYu7X9n0sQtIqSSCYLNRNVOXkCi10CcODLLA05tMNWPamVMkLHYZlhR7bx1Y1nauuZxJ_LZQ-Mt9wp5EWhD6xl0nAIEYj79YR2UcRmCICAJhZ09huFUSAUHFkM9RekGWaCJkEg72LANjMAbKmvhvDrDGY6S3bHNXAp56M"
    },
    {
      title: "Intelligence Feed",
      desc: "Subscribe to real-time agent output logs, system telemetry, n8n sync updates, and active Wolfram computational tickers.",
      icon: "dynamic_feed",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDIaizFC2bzA52UEUnmft1xxpPlkSfMcCAEGnDLdDD5zxaOMbiJG4WEN7j8kpGgkVy6QcLpbeZyt9-qCqKhDEaaZGSmMIMbT518c9o2RtgVKU3lvnZkqUVG4_PBDLYAx6ay8DxoXMnxQfACrR30ZRIGks_8YxE9EviN8JLKEhqqWioVtxXoCjvemx4TkeZSKGBX_ECPrSIe2EwHf6bR6c51luYuHUXXfSxQXt1g2UxXsSIlO67YZTpY57DAK6_h7M9_tjEa8U7dl0w"
    }
  ];

  // Wolfram Demo states
  const [activeScenario, setActiveScenario] = useState("churn");
  const [simulationVal, setSimulationVal] = useState(15);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 1000);
  };

  return (
    <div className="bg-[#050505] text-[#e5e2e1] font-sans antialiased overflow-x-hidden min-h-screen selection:bg-primary/30 selection:text-white flex flex-col relative">
      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none z-0"></div>

      {/* TopNavBar */}
      <header className="fixed top-0 w-full z-[100] bg-[#0e0e0e]/70 backdrop-blur-xl border-b border-white/5 shadow-[0_0_40px_rgba(0,219,231,0.05)]">
        <div className="flex justify-between items-center px-6 md:px-12 py-4 max-w-[1440px] mx-auto w-full">
          {/* Standalone Logo Brand (No Text Beside It) */}
          <div className="flex items-center">
            <div className="relative w-36 h-9 overflow-hidden border border-white/5 rounded-lg bg-black/40 p-1">
              <img
                src="/Santrix_logo.jpeg"
                className="w-full h-full object-contain filter brightness-110"
                alt="Sanktrix Logo"
              />
            </div>
          </div>
          <div className="hidden md:flex gap-8">
            <a
              className="text-[#e5e2e1] hover:text-primary transition-all duration-300 font-medium text-sm"
              href="#loop"
              onClick={(e) => handleNavClick(e, "#loop")}
            >
              Platform
            </a>
            <a
              className="text-on-surface-variant hover:text-[#e5e2e1] transition-all duration-300 text-sm"
              href="#problem"
              onClick={(e) => handleNavClick(e, "#problem")}
            >
              Features
            </a>
            <a
              className="text-on-surface-variant hover:text-[#e5e2e1] transition-all duration-300 text-sm"
              href="#wolfram"
              onClick={(e) => handleNavClick(e, "#wolfram")}
            >
              Wolfram Engine
            </a>
            <a
              className="text-on-surface-variant hover:text-[#e5e2e1] transition-all duration-300 text-sm"
              href="#architecture"
              onClick={(e) => handleNavClick(e, "#architecture")}
            >
              Architecture
            </a>
            <a
              className="text-on-surface-variant hover:text-[#e5e2e1] transition-all duration-300 text-sm"
              href="#security"
              onClick={(e) => handleNavClick(e, "#security")}
            >
              Security
            </a>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => router.push("/login")}
              className="px-6 py-2 bg-primary-container text-on-primary-container font-semibold transition-all duration-300 ease-out active:scale-95 hover:bg-primary-container/90 text-sm rounded cursor-pointer"
            >
              Login
            </button>
          </div>
        </div>
      </header>

      {/* SECTION 1: HERO */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden" id="hero">
        <div className="absolute inset-0 w-full h-full opacity-60 pointer-events-none">
          <WebGLBackground />
        </div>
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto space-y-8 flex flex-col items-center">
          {/* Giant Logo Centerpiece (No duplicate text beside it) */}
          <div className="relative w-64 h-20 overflow-hidden border border-white/10 rounded-2xl bg-black/60 p-2 shadow-[0_0_30px_rgba(86,141,255,0.1)] hover:border-primary/30 transition-all duration-500">
            <img
              src="/Santrix_logo.jpeg"
              className="w-full h-full object-contain filter brightness-125"
              alt="Sanktrix Logo centerpiece"
            />
          </div>

          <div className="space-y-6">
            <h2 className="font-display text-4xl sm:text-7xl font-bold tracking-tight text-glow text-white max-w-4xl mx-auto leading-tight">
              The Operating System for Autonomous Enterprises
            </h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto text-base sm:text-xl font-light leading-relaxed">
              AI Agents reason. Wolfram computes. Sanktrix predicts, simulates, optimizes and recommends strategic decisions in real time.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 pt-8">
              <button
                onClick={() => router.push("/login")}
                className="px-10 py-4 bg-primary text-on-primary font-bold text-lg hover:bg-primary/90 transition-all duration-300 shadow-[0_0_30px_rgba(179,197,255,0.3)] cursor-pointer rounded"
              >
                Launch Platform
              </button>
              <button
                onClick={() => router.push("/demo")}
                className="px-10 py-4 border border-outline-variant hover:bg-surface-bright/10 transition-all duration-300 font-bold text-lg cursor-pointer rounded"
              >
                Run Interactive Demo
              </button>
              <button
                onClick={(e) => handleNavClick(e, "#showcase")}
                className="px-8 py-4 text-on-surface hover:underline font-semibold flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined">play_circle</span> Watch Product Tour
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
          <span className="material-symbols-outlined">expand_more</span>
        </div>
      </section>

      {/* SECTION 2: THE PROBLEM */}
      <section className="py-32 px-6 md:px-12 relative overflow-hidden bg-background" id="problem">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div className="space-y-8 scroll-reveal">
              <div className="inline-block px-3 py-1 bg-surface-container-highest border border-outline-variant text-xs font-mono text-secondary-fixed-dim uppercase tracking-widest rounded">
                Context Shift
              </div>
              <h3 className="font-display text-4xl sm:text-5xl font-bold leading-tight text-white">
                Beyond Static Dashboards.
              </h3>
              <p className="text-on-surface-variant text-lg leading-relaxed">
                The era of manual reporting and spreadsheet chaos is over. Modern enterprises require computational rigor at the speed of thought.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="glass-panel p-8 space-y-4 border-error/20 hover:border-error/40 transition-all rounded-lg">
                <span className="material-symbols-outlined text-error">warning</span>
                <h4 className="font-display text-lg text-error font-bold">Traditional Enterprise</h4>
                <ul className="space-y-2 text-on-surface-variant text-xs font-mono">
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-error rounded-full"></span> Static Dashboards</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-error rounded-full"></span> Manual Reporting</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-error rounded-full"></span> Spreadsheet Chaos</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-error rounded-full"></span> Hindsight Focus</li>
                </ul>
              </div>
              <div className="glass-panel p-8 space-y-4 border-primary/20 hover:border-primary/40 transition-all bg-primary-container/5 rounded-lg">
                <span className="material-symbols-outlined text-primary">bolt</span>
                <h4 className="font-display text-lg text-primary font-bold">Sanktrix OS</h4>
                <ul className="space-y-2 text-on-surface-variant text-xs font-mono">
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary rounded-full"></span> Autonomous Reasoning</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary rounded-full"></span> Continuous Simulation</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary rounded-full"></span> Predictive Forecasting</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary rounded-full"></span> Strategic Intelligence</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: THE INTELLIGENCE LOOP */}
      <section className="py-32 px-6 md:px-12 bg-surface-container-lowest" id="loop">
        <div className="max-w-[1440px] mx-auto text-center space-y-16">
          <h3 className="font-display text-3xl md:text-4xl text-white font-bold">The Intelligence Loop</h3>
          <div className="relative flex flex-wrap justify-center gap-8 md:gap-0 md:flex-nowrap md:items-center">
            {/* Connection Line */}
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-outline-variant/30 hidden md:block z-0"></div>
            {[
              { label: "Data Ingestion", icon: "database" },
              { label: "AI Agents", icon: "smart_toy" },
              { label: "Wolfram Core", icon: "terminal", highlight: true },
              { label: "Simulations", icon: "vital_signs" },
              { label: "Intelligence", icon: "psychology" },
              { label: "Recommendations", icon: "verified" }
            ].map((node, idx) => (
              <div key={idx} className="relative z-10 w-full md:w-1/6 px-4 space-y-4 group">
                <div className={`w-16 h-16 mx-auto glass-panel rounded-full flex items-center justify-center group-hover:scale-110 transition-transform bg-background ${
                  node.highlight ? "bg-primary/10 border-primary/50 shadow-[0_0_20px_rgba(0,219,231,0.2)]" : ""
                }`}>
                  <span className={`material-symbols-outlined ${node.highlight ? "text-primary-fixed-dim text-2xl" : "text-primary"}`}>
                    {node.icon}
                  </span>
                </div>
                <div className={`text-xs font-mono uppercase tracking-tighter ${node.highlight ? "text-primary font-bold" : "text-outline"}`}>
                  {node.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: WOLFRAM COMPUTATIONAL CORE */}
      <section className="py-32 px-6 md:px-12 bg-background relative overflow-hidden" id="wolfram">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h3 className="font-display text-3xl sm:text-5xl font-bold leading-tight text-white">
              The Precision of Wolfram.<br />
              <span className="text-secondary-fixed-dim">The Power of AGI.</span>
            </h3>
            <p className="text-on-surface-variant text-lg leading-relaxed font-light">
              Sanktrix integrates directly with the Wolfram Language to provide symbolic computational intelligence. We don&apos;t just &quot;guess&quot; next tokens; we compute exact mathematical outcomes.
            </p>
            <div className="space-y-4">
              <div className="glass-panel p-6 border-l-4 border-l-primary flex items-start gap-4 rounded-r-lg">
                <div className="pt-1"><span className="material-symbols-outlined text-primary">query_stats</span></div>
                <div>
                  <div className="font-bold text-on-surface text-sm uppercase tracking-wider">Monte Carlo Simulations</div>
                  <div className="text-xs text-on-surface-variant mt-1 leading-normal">Run 100,000 parallel futures to determine confidence intervals for every strategic move.</div>
                </div>
              </div>
              <div className="glass-panel p-6 border-l-4 border-l-primary flex items-start gap-4 rounded-r-lg">
                <div className="pt-1"><span className="material-symbols-outlined text-primary">functions</span></div>
                <div>
                  <div className="font-bold text-on-surface text-sm uppercase tracking-wider">Symbolic Logic</div>
                  <div className="text-xs text-on-surface-variant mt-1 leading-normal">Transparent reasoning chains that can be audited, verified, and tuned by humans.</div>
                </div>
              </div>
            </div>
          </div>
          <div className="relative h-[560px] glass-panel border-outline-variant/10 rounded-xl overflow-hidden p-8 flex flex-col bg-surface-container-lowest shadow-2xl">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-error"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-secondary"></div>
              </div>
              <div className="text-xs font-mono text-outline">Wolfram_Core_Simulation.nb</div>
            </div>
            {/* Data Viz Visualization */}
            <div className="flex-grow flex flex-col justify-end space-y-1">
              <div className="flex items-end gap-1.5 h-full pt-8">
                <div className="w-1/12 bg-primary/20 h-[10%] rounded-t"></div>
                <div className="w-1/12 bg-primary/30 h-[25%] rounded-t"></div>
                <div className="w-1/12 bg-primary/40 h-[45%] rounded-t"></div>
                <div className="w-1/12 bg-primary/50 h-[70%] rounded-t"></div>
                <div className="w-1/12 bg-primary/70 h-[90%] rounded-t"></div>
                <div className="w-1/12 bg-primary h-[100%] rounded-t shadow-[0_0_20px_rgba(179,197,255,0.4)] relative">
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-xs font-bold text-primary font-mono whitespace-nowrap">μ = 94.2%</div>
                </div>
                <div className="w-1/12 bg-primary/70 h-[85%] rounded-t"></div>
                <div className="w-1/12 bg-primary/50 h-[60%] rounded-t"></div>
                <div className="w-1/12 bg-primary/40 h-[40%] rounded-t"></div>
                <div className="w-1/12 bg-primary/30 h-[20%] rounded-t"></div>
                <div className="w-1/12 bg-primary/20 h-[5%] rounded-t"></div>
              </div>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="p-4 bg-background border border-outline-variant/20 rounded">
                <div className="text-xs font-mono text-outline uppercase">Confidence Interval</div>
                <div className="text-2xl font-bold font-display text-white mt-1">98.4%</div>
              </div>
              <div className="p-4 bg-background border border-outline-variant/20 rounded">
                <div className="text-xs font-mono text-outline uppercase">Compute Cycles</div>
                <div className="text-2xl font-bold font-display text-white mt-1">4.2 TFlops</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: WOLFRAM DEMO SIMULATOR */}
      <section className="py-24 bg-[#10131b]/10 border-t border-white/5">
        <div className="container mx-auto px-6 md:px-12 max-w-6xl">
          <div className="glass-panel p-8 rounded-3xl border border-primary/20 shadow-[0_0_50px_rgba(86,141,255,0.05)] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="font-mono text-[10px] text-primary uppercase font-bold tracking-widest">Interactive Calculator</span>
                <h3 className="font-display text-2xl text-white font-bold mt-1">Wolfram Monte Carlo Engine</h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-on-surface-variant uppercase font-mono text-[9px] tracking-wider">Select metric node</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => { setActiveScenario("churn"); setSimulationVal(15); }} 
                      className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${activeScenario === "churn" ? "bg-primary text-[#001945]" : "bg-white/5 text-on-surface-variant hover:text-white"}`}
                    >
                      Churn Rate
                    </button>
                    <button 
                      onClick={() => { setActiveScenario("hiring"); setSimulationVal(20); }} 
                      className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${activeScenario === "hiring" ? "bg-primary text-[#001945]" : "bg-white/5 text-on-surface-variant hover:text-white"}`}
                    >
                      Hiring Speed
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-on-surface-variant">Adjust variance</span>
                    <span className="text-white font-bold">{simulationVal}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="50" 
                    value={simulationVal}
                    onChange={(e) => setSimulationVal(Number(e.target.value))}
                    className="w-full accent-primary bg-white/5 rounded-lg appearance-none h-1.5 cursor-pointer"
                  />
                </div>

                <button
                  onClick={handleRunSimulation}
                  disabled={isSimulating}
                  className="w-full bg-primary hover:bg-[#c2d6ff] text-[#001945] font-bold text-xs uppercase tracking-wider py-3.5 rounded transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(176,198,255,0.15)]"
                >
                  <span className="material-symbols-outlined text-sm">rotate_left</span>
                  <span>{isSimulating ? "Computing paths..." : "Compute Forecast"}</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 bg-[#050505]/60 border border-white/5 rounded-2xl p-6 relative flex flex-col justify-between min-h-[260px]">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#4edea3] font-bold">Simulator Output</span>
                <span className="font-mono text-[9px] text-on-surface-variant">KERNEL STATUS: ONLINE</span>
              </div>

              {isSimulating ? (
                <div className="flex flex-col items-center justify-center my-auto space-y-4 py-8">
                  <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                  <span className="font-mono text-[10px] text-on-surface-variant animate-pulse">Querying Wolfram APIs...</span>
                </div>
              ) : (
                <div className="my-auto space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border border-white/5 bg-[#0a0d16]/30 p-4 rounded-xl">
                      <span className="text-[9px] font-mono text-on-surface-variant uppercase block">Projected Runway</span>
                      <span className="font-display text-2xl font-bold text-white mt-1">
                        {activeScenario === "churn" 
                          ? (24.5 - simulationVal * 0.45).toFixed(1)
                          : (24.5 - simulationVal * 0.3).toFixed(1)} months
                      </span>
                    </div>
                    <div className="border border-white/5 bg-[#0a0d16]/30 p-4 rounded-xl">
                      <span className="text-[9px] font-mono text-on-surface-variant uppercase block">Standard Deviation</span>
                      <span className="font-display text-2xl font-bold text-tertiary mt-1">
                        {(1.1 + simulationVal * 0.02).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-on-surface-variant leading-relaxed">
                    <strong className="text-white">Wolfram Core Recommendation:</strong> Based on the simulated variance, there is a <span className="text-[#4edea3]">92.8%</span> probability that cash runway remains stable above 12 months. Recommendation: maintain current marketing spend.
                  </p>
                </div>
              )}

              <div className="flex justify-between items-center border-t border-white/5 pt-2 text-[9px] font-mono text-on-surface-variant">
                <span>FORMULA: NIntegrate[Runway[v], {`{v, 0, ${simulationVal}}`}]</span>
                <span className="text-[#4edea3] flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span> SYNCED
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 6: AGENT ECOSYSTEM */}
      <section className="py-32 px-6 md:px-12 bg-surface-container-lowest">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h3 className="font-display text-3xl md:text-4xl text-white font-bold">Modular Agent Ecosystem</h3>
            <p className="text-on-surface-variant max-w-2xl mx-auto font-light text-sm sm:text-base">
              Deploy specialized intelligence nodes tailored to your enterprise&apos;s unique structure.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Finance Agent", icon: "account_balance", desc: "Real-time P&L monitoring, burn rate forecasting, and automated budget reallocation." },
              { name: "Forecasting Agent", icon: "trending_up", desc: "Demand sensing, inventory optimization, and long-range market trend analysis." },
              { name: "Strategy Agent", icon: "hub", desc: "Competitive landscape mapping and high-level strategic 'what-if' analysis." },
              { name: "Risk Agent", icon: "security", desc: "Regulatory compliance tracking and operational risk threshold monitoring." },
              { name: "Operations Agent", icon: "settings_input_component", desc: "Supply chain logistics optimization and workforce management efficiency." },
              { name: "Wolfram Agents", icon: "functions", desc: "Direct access to the Wolfram Knowledgebase for multi-domain data computations.", highlight: true }
            ].map((agent, idx) => (
              <div key={idx} className={`glass-panel p-8 space-y-6 hover:-translate-y-2 transition-all duration-300 group rounded-xl ${
                agent.highlight ? "border-secondary-fixed-dim/30" : ""
              }`}>
                <div className={`w-12 h-12 rounded flex items-center justify-center transition-colors ${
                  agent.highlight ? "bg-secondary-fixed-dim/10 group-hover:bg-secondary-fixed-dim/20" : "bg-primary/10 group-hover:bg-primary/20"
                }`}>
                  <span className={`material-symbols-outlined ${agent.highlight ? "text-secondary-fixed-dim" : "text-primary"}`}>
                    {agent.icon}
                  </span>
                </div>
                <h4 className={`font-display text-xl font-bold ${agent.highlight ? "text-secondary-fixed-dim" : "text-white"}`}>
                  {agent.name}
                </h4>
                <p className="text-on-surface-variant text-sm font-light leading-relaxed">{agent.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: SIMULATION PLAYGROUND */}
      <section className="py-32 px-6 md:px-12 bg-background">
        <div className="max-w-[1440px] mx-auto">
          <h3 className="font-display text-3xl font-bold text-white mb-12">Simulation Playground</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { id: "Alpha", title: "Revenue Forecast", desc: "Predict outcome of 15% churn rise.", fill: "w-[70%]", border: "border-l-primary" },
              { id: "Beta", title: "Expansion Analysis", desc: "Model EMEA market entry ROI.", fill: "w-[45%]", border: "border-l-secondary-fixed-dim" },
              { id: "Gamma", title: "Hiring Impact", desc: "Analyze 50 new engineer hires.", fill: "w-[90%]", border: "border-l-tertiary-fixed-dim" },
              { id: "Delta", title: "Crisis Stress-Test", desc: "Simulate supply chain collapse.", fill: "w-[25%]", border: "border-l-error" }
            ].map((scenario, idx) => (
              <button 
                key={idx}
                onClick={() => router.push("/demo")}
                className={`glass-panel p-8 text-left hover:bg-surface-container-high transition-all border-l-4 rounded-r-lg cursor-pointer ${scenario.border}`}
              >
                <div className="text-xs font-mono text-outline mb-2">Scenario {scenario.id}</div>
                <div className="font-bold text-lg mb-4 text-white font-display">{scenario.title}</div>
                <div className="h-1 bg-outline-variant/30 w-full rounded-full overflow-hidden">
                  <div className={`bg-primary h-full ${scenario.fill}`}></div>
                </div>
                <div className="mt-4 text-xs text-on-surface-variant">{scenario.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8: DIGITAL TWIN */}
      <section className="py-32 px-6 md:px-12 bg-surface-container-lowest overflow-hidden">
        <div className="max-w-[1440px] mx-auto text-center space-y-16">
          <div className="max-w-2xl mx-auto space-y-6">
            <h3 className="font-display text-4xl font-bold leading-tight text-white">The Digital Twin of your Business.</h3>
            <p className="text-on-surface-variant text-base sm:text-lg font-light leading-relaxed">
              Visualize every connection, KPI, and risk factor in a real-time graph of your entire enterprise ecosystem.
            </p>
          </div>
          <div className="relative h-[500px] w-full glass-panel rounded-3xl overflow-hidden border-primary/20 bg-background/50">
            {/* Graph Visualization */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full opacity-50">
                <svg className="w-full h-full" viewBox="0 0 800 400">
                  <circle cx="400" cy="200" fill="none" r="100" stroke="rgba(0, 219, 231, 0.4)" strokeWidth="1"></circle>
                  <circle cx="400" cy="200" fill="none" r="150" stroke="rgba(0, 219, 231, 0.2)" strokeWidth="1"></circle>
                  <path d="M400 50 L400 350 M100 200 L700 200" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"></path>
                  <circle className="animate-pulse" cx="400" cy="200" fill="#00dbe7" r="4"></circle>
                  <g className="animate-pulse">
                    <circle cx="200" cy="100" fill="#b3c5ff" r="3"></circle>
                    <circle cx="600" cy="300" fill="#b3c5ff" r="3"></circle>
                    <circle cx="300" cy="350" fill="#b3c5ff" r="3"></circle>
                    <circle cx="500" cy="50" fill="#b3c5ff" r="3"></circle>
                  </g>
                </svg>
              </div>
            </div>
            {/* UI Overlays */}
            <div className="absolute top-8 left-8 p-6 glass-panel border-l-4 border-l-primary text-left max-w-[240px] rounded-r-lg">
              <div className="text-[10px] font-mono text-primary mb-1 uppercase">Real-time KPIs</div>
              <div className="text-xl font-bold font-display text-white">$4.2B ARR</div>
              <div className="text-[10px] text-on-surface-variant mt-1 font-mono">+12% vs last simulation</div>
            </div>
            <div className="absolute bottom-8 right-8 p-6 glass-panel border-l-4 border-l-error text-left max-w-[240px] rounded-r-lg">
              <div className="text-[10px] font-mono text-error mb-1 uppercase">Risk Alert</div>
              <div className="text-base font-bold font-display text-white">Supply Chain Latency</div>
              <div className="text-[10px] text-on-surface-variant mt-1">Potential 12-day delay detected in Asia-Pacific nodes.</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9: SYSTEM PULSE EVENT STREAM */}
      <section className="py-32 px-6 md:px-12 bg-background">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="space-y-6">
            <h3 className="font-display text-3xl md:text-4xl text-white font-bold">System Pulse</h3>
            <p className="text-on-surface-variant font-light leading-relaxed">
              Monitor every decision, simulation, and autonomous action in real-time. Full transparency into the AGI&apos;s reasoning process.
            </p>
            <div className="pt-4">
              <div className="flex items-center gap-3 text-primary font-mono text-xs">
                <div className="w-2.5 h-2.5 bg-primary rounded-full animate-ping"></div>
                <span>SYSTEM OPERATIONAL - ALL AGENTS ACTIVE</span>
              </div>
            </div>
          </div>
          <div className="glass-panel font-mono text-xs overflow-hidden flex flex-col h-[360px] rounded-xl">
            <div className="bg-[#10131b] px-6 py-3 border-b border-outline-variant/20 flex justify-between items-center text-outline">
              <span className="text-white font-bold">LIVE_EVENT_STREAM</span>
              <span>T-MINUS 00:00:00</span>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto flex-grow bg-[#050505]/40 leading-relaxed">
              <div className="flex gap-4">
                <span className="text-outline shrink-0">[14:32:01]</span>
                <span className="text-secondary-fixed-dim font-bold">COMPLETED:</span>
                <span className="text-on-surface-variant">Market volatility simulation (Scenario Alpha-9). Confidence 94.2%.</span>
              </div>
              <div className="flex gap-4">
                <span className="text-outline shrink-0">[14:31:45]</span>
                <span className="text-primary font-bold">ACTION:</span>
                <span className="text-on-surface-variant">Reallocated $2M budget from Acquisition to Retention based on churn forecast.</span>
              </div>
              <div className="flex gap-4">
                <span className="text-outline shrink-0">[14:31:12]</span>
                <span className="text-[#00F2FF] font-bold">INGEST:</span>
                <span className="text-on-surface-variant">ERP data sync completed. 12,042 new records parsed.</span>
              </div>
              <div className="flex gap-4">
                <span className="text-outline shrink-0">[14:30:58]</span>
                <span className="text-error font-bold">ALERT:</span>
                <span className="text-on-surface-variant">Risk threshold exceeded in Tier-2 Logistic nodes. Initiating reroute.</span>
              </div>
              <div className="flex gap-4 opacity-50">
                <span className="text-outline shrink-0">[14:30:22]</span>
                <span className="text-secondary-fixed-dim">WOLFRAM:</span>
                <span className="text-on-surface-variant">Solving non-linear optimization for labor scheduling...</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 10: PRODUCT SHOWCASE INTERACTIVE CAROUSEL */}
      <section className="py-32 px-6 md:px-12 bg-surface-container-lowest" id="showcase">
        <div className="max-w-[1440px] mx-auto text-center mb-16 space-y-4">
          <h3 className="font-display text-3xl md:text-4xl text-white font-bold">Command &amp; Control</h3>
          <p className="text-on-surface-variant max-w-xl mx-auto font-light text-sm">
            Select a module to view a visual preview representation of Sanktrix platform capabilities.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
          {/* Tab Selector Buttons */}
          <div className="lg:col-span-4 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0">
            {carouselItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setCarouselIdx(idx)}
                className={`w-full text-left px-5 py-3 rounded-lg border transition-all duration-300 flex items-center gap-3 cursor-pointer ${
                  carouselIdx === idx
                    ? "border-primary/20 bg-primary/5 text-primary font-bold shadow-[0_0_15px_rgba(86,141,255,0.05)]"
                    : "border-white/5 bg-transparent text-on-surface-variant hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="material-symbols-outlined text-lg">{item.icon}</span>
                <span className="text-xs uppercase tracking-wider font-semibold whitespace-nowrap">{item.title}</span>
              </button>
            ))}
          </div>

          {/* Interactive Slide Frame */}
          <div className="lg:col-span-8 glass-panel p-8 rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(86,141,255,0.05)] flex flex-col justify-between min-h-[380px] relative overflow-hidden text-left bg-background/40">
            <div className="absolute top-0 right-0 w-36 h-36 bg-primary/5 rounded-full blur-3xl"></div>

            <div className="flex justify-between items-start border-b border-white/5 pb-4">
              <div>
                <span className="font-mono text-[9px] text-primary uppercase font-bold tracking-widest">Sanktrix Module Preview {carouselIdx + 1}/6</span>
                <h3 className="font-display text-xl text-white font-bold mt-1">{carouselItems[carouselIdx].title}</h3>
              </div>
              <span className="material-symbols-outlined text-primary text-3xl">
                {carouselItems[carouselIdx].icon}
              </span>
            </div>

            {/* Simulated UI screenshot mock */}
            <div className="my-6 relative rounded-lg border border-white/10 overflow-hidden aspect-video bg-[#050505] shadow-inner flex flex-col">
              <img 
                src={carouselItems[carouselIdx].image} 
                className="w-full h-full object-cover opacity-65 hover:scale-102 transition-transform duration-700" 
                alt={`${carouselItems[carouselIdx].title} Mockup`} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <span className="font-mono text-[9px] text-primary uppercase font-bold tracking-widest block mb-0.5">Telemetry Status: Connected</span>
                <p className="text-[10px] text-on-surface-variant/90 leading-relaxed">{carouselItems[carouselIdx].desc}</p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-white/5 text-[10px] font-bold uppercase tracking-wider text-primary">
              <button
                onClick={() => setCarouselIdx(prev => (prev === 0 ? 5 : prev - 1))}
                className="hover:underline cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-xs">chevron_left</span> Previous
              </button>
              <button
                onClick={() => setCarouselIdx(prev => (prev === 5 ? 0 : prev + 1))}
                className="hover:underline cursor-pointer flex items-center gap-1"
              >
                Next <span className="material-symbols-outlined text-xs">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 11: THE SANKTRIX ADVANTAGE TABLE */}
      <section className="py-32 px-6 md:px-12 bg-background">
        <div className="max-w-[1000px] mx-auto">
          <h3 className="font-display text-3xl font-bold text-center mb-16 text-white">The Sanktrix Advantage</h3>
          <div className="glass-panel overflow-hidden border-outline-variant/10 rounded-xl bg-surface-container-lowest/40">
            <table className="w-full text-left font-mono text-xs text-on-surface-variant">
              <thead>
                <tr className="bg-[#10131b]/60 border-b border-white/10 text-white">
                  <th className="p-6 font-bold">Capabilities</th>
                  <th className="p-6 font-bold text-primary">SANKTRIX OS</th>
                  <th className="p-6 font-bold text-outline">Legacy BI</th>
                  <th className="p-6 font-bold text-outline">Generic LLM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10 leading-relaxed">
                <tr>
                  <td className="p-6 font-semibold text-white">Autonomous Actions</td>
                  <td className="p-6"><span className="material-symbols-outlined text-primary">check_circle</span></td>
                  <td className="p-6"><span className="material-symbols-outlined text-outline">cancel</span></td>
                  <td className="p-6"><span className="material-symbols-outlined text-outline">cancel</span></td>
                </tr>
                <tr>
                  <td className="p-6 font-semibold text-white">Continuous Simulation</td>
                  <td className="p-6"><span className="material-symbols-outlined text-primary">check_circle</span></td>
                  <td className="p-6"><span className="material-symbols-outlined text-outline">cancel</span></td>
                  <td className="p-6"><span className="material-symbols-outlined text-outline">circle</span></td>
                </tr>
                <tr>
                  <td className="p-6 font-semibold text-white">Wolfram Computational Rigor</td>
                  <td className="p-6"><span className="material-symbols-outlined text-primary">check_circle</span></td>
                  <td className="p-6"><span className="material-symbols-outlined text-outline">cancel</span></td>
                  <td className="p-6"><span className="material-symbols-outlined text-outline">cancel</span></td>
                </tr>
                <tr>
                  <td className="p-6 font-semibold text-white">Digital Twin Mapping</td>
                  <td className="p-6"><span className="material-symbols-outlined text-primary">check_circle</span></td>
                  <td className="p-6"><span className="material-symbols-outlined text-outline">check_circle</span></td>
                  <td className="p-6"><span className="material-symbols-outlined text-outline">cancel</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION 12: PLATFORM ARCHITECTURE */}
      <section className="py-32 border-t border-white/5" id="architecture">
        <div className="container mx-auto px-6 md:px-12 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl text-white font-bold">Systems Architecture</h2>
            <div className="h-0.5 w-12 bg-primary mt-3 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 text-center font-mono">
            {[
              { id: "01", name: "Data Sources", desc: "Salesforce, Clickhouse, Kafka brokers" },
              { id: "02", name: "Workflows (n8n)", desc: "Trigger.dev pipeline orchestration" },
              { id: "03", name: "AI Core", desc: "LangGraph autonomous agents" },
              { id: "04", name: "Wolfram Engine", desc: "monte carlo & symbolic math" },
              { id: "05", name: "Executive Output", desc: "recommendations & dashboard" }
            ].map((node, idx) => (
              <div key={idx} className="glass-panel p-5 rounded-xl border border-white/5 flex flex-col justify-between space-y-4 hover:border-primary/20 transition-all duration-300">
                <span className="text-2xl text-primary/30 font-bold">{node.id}</span>
                <div>
                  <h4 className="text-white font-bold text-xs uppercase tracking-wider">{node.name}</h4>
                  <p className="text-[10px] text-on-surface-variant mt-1 leading-normal">{node.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 13: GOVERNANCE & SECURITY */}
      <section className="py-32 px-6 md:px-12 bg-surface-container-lowest" id="security">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Granular RBAC", icon: "lock", desc: "Military-grade access controls ensuring only authorized personnel can trigger autonomous actions." },
            { title: "Immutable Audit Logs", icon: "verified_user", desc: "Every decision made by an agent is logged on a private, tamper-proof ledger for complete accountability." },
            { title: "On-Prem/Private Cloud", icon: "cloud_off", desc: "Deploy Sanktrix in your own environment. Your data never leaves your infrastructure." }
          ].map((sec, idx) => (
            <div key={idx} className="glass-panel p-8 space-y-4 rounded-xl">
              <span className="material-symbols-outlined text-primary text-2xl">{sec.icon}</span>
              <h4 className="font-display text-lg text-white font-bold">{sec.title}</h4>
              <p className="text-sm text-on-surface-variant font-light leading-relaxed">{sec.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 14: FINAL CTA */}
      <section className="py-40 px-6 md:px-12 relative overflow-hidden bg-background text-center">
        <div className="absolute inset-0 bg-primary/5 opacity-30 blur-[100px] -z-10"></div>
        <div className="max-w-4xl mx-auto space-y-12 relative z-10 flex flex-col items-center">
          <h3 className="font-display text-3xl sm:text-6xl font-bold leading-tight text-white">
            While Most AI Generates Answers,<br />
            <span className="text-glow text-primary">Sanktrix Computes Strategic Intelligence.</span>
          </h3>
          <p className="text-lg sm:text-xl text-on-surface-variant max-w-2xl font-light leading-relaxed">
            The future of enterprise operations is autonomous. Join the elite organizations already running on Sanktrix.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <button
              onClick={() => router.push("/login")}
              className="px-12 py-5 bg-primary text-on-primary font-bold text-xl hover:scale-105 transition-all duration-300 cursor-pointer rounded"
            >
              Launch Platform
            </button>
            <button
              onClick={() => router.push("/demo")}
              className="px-12 py-5 border border-outline-variant hover:bg-surface-bright/10 font-bold text-xl transition-all duration-300 cursor-pointer rounded"
            >
              Run Demo Scenario
            </button>
            <button
              onClick={() => window.open("https://github.com/karanscosmo/santrix", "_blank")}
              className="px-8 py-5 flex items-center gap-2 text-on-surface hover:text-primary transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined">code</span> GitHub Repository
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 bg-[#050505] relative overflow-hidden">
        <div className="bg-grid-pattern opacity-[0.03] absolute inset-0 pointer-events-none"></div>
        <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-12 py-12 gap-6 max-w-[1440px] mx-auto relative z-10 w-full text-xs font-mono text-on-surface-variant">
          <div className="relative w-36 h-9 overflow-hidden border border-white/5 rounded-lg bg-black/40 p-1">
            <img
              src="/Santrix_logo.jpeg"
              className="w-full h-full object-contain filter brightness-110"
              alt="Sanktrix Logo footer"
            />
          </div>
          <div className="flex gap-8">
            <a className="hover:text-white transition-colors hover:underline" href="#">Privacy Protocol</a>
            <a className="hover:text-white transition-colors hover:underline" href="#">Service Terms</a>
            <a className="hover:text-white transition-colors hover:underline" href="#">API Documentation</a>
            <a className="hover:text-white transition-colors hover:underline" href="#">System Status</a>
          </div>
          <div className="text-secondary-fixed-dim uppercase tracking-widest text-[10px]">
            © 2026 SANKTRIX AGI OS. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>
    </div>
  );
}
