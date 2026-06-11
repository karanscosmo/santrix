"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import WebGLBackground from "@/components/WebGLBackground";

export default function LandingPage() {
  const router = useRouter();

  // Scroll reveal and parallax effect listener
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

  // Smooth scroll handler
  const handleNavClick = (e: React.MouseEvent<HTMLElement>, targetId: string) => {
    e.preventDefault();
    if (targetId === "#") return;
    const element = document.querySelector(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-[#050505] text-[#e5e2e1] font-sans antialiased overflow-x-hidden min-h-screen selection:bg-primary/30 selection:text-white flex flex-col relative">
      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none z-0"></div>

      {/* TopNavBar */}
      <header className="fixed top-0 w-full z-[100] bg-surface-container-lowest/70 backdrop-blur-xl border-b border-outline-variant/10 shadow-[0_0_40px_rgba(0,219,231,0.05)]">
        <div className="flex justify-between items-center px-margin-desktop py-4 max-w-[1440px] mx-auto w-full">
          {/* Standalone Logo Brand (Direct image render, no card) */}
          <div className="flex items-center">
            <img
              src="/branding/sanktrix-logo.png"
              className="h-7 w-auto object-contain brightness-110"
              alt="Sanktrix Logo"
            />
          </div>
          <div className="hidden md:flex gap-8">
            <a
              className="text-on-surface-variant hover:text-on-surface transition-colors duration-300 font-body-md text-body-md"
              href="#intelligence"
              onClick={(e) => handleNavClick(e, "#intelligence")}
            >
              Intelligence
            </a>
            <a
              className="text-on-surface-variant hover:text-on-surface transition-colors duration-300 font-body-md text-body-md"
              href="#architecture"
              onClick={(e) => handleNavClick(e, "#architecture")}
            >
              Architecture
            </a>
            <a
              className="text-on-surface-variant hover:text-on-surface transition-colors duration-300 font-body-md text-body-md"
              href="#simulations"
              onClick={(e) => handleNavClick(e, "#simulations")}
            >
              Simulations
            </a>
            <a
              className="text-on-surface-variant hover:text-on-surface transition-colors duration-300 font-body-md text-body-md"
              href="#security"
              onClick={(e) => handleNavClick(e, "#security")}
            >
              Security
            </a>
            <a
              className="text-on-surface-variant hover:text-on-surface transition-colors duration-300 font-body-md text-body-md"
              href="#why-sanktrix"
              onClick={(e) => handleNavClick(e, "#why-sanktrix")}
            >
              Enterprise
            </a>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => window.open("https://github.com/karanscosmo/santrix", "_blank")}
              className="hidden md:block px-6 py-2 text-on-surface-variant hover:text-on-surface transition-colors duration-300 font-body-md text-body-md cursor-pointer"
            >
              Documentation
            </button>
            <button
              onClick={() => router.push("/login")}
              className="px-6 py-2 bg-primary-container text-on-primary-container font-semibold transition-all duration-300 ease-out active:scale-95 hover:bg-primary-container/90 cursor-pointer"
            >
              Login
            </button>
          </div>
        </div>
      </header>

      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden" id="hero">
        <div className="absolute inset-0 w-full h-full opacity-60 pointer-events-none">
          <WebGLBackground />
        </div>
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto space-y-8 flex flex-col items-center">
          {/* Giant Logo Centerpiece (Direct image render, no cards around it) */}
          <img
            src="/branding/sanktrix-logo.png"
            className="h-16 sm:h-28 w-auto object-contain opacity-95 filter drop-shadow-[0_0_35px_rgba(179,197,255,0.25)] hover:scale-[1.02] transition-transform duration-500"
            alt="Sanktrix Logo centerpiece"
          />

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
                className="px-10 py-4 bg-primary text-on-primary font-bold text-lg hover:bg-secondary-fixed-dim transition-all duration-300 shadow-[0_0_30px_rgba(179,197,255,0.3)] cursor-pointer"
              >
                Launch Platform
              </button>
              <button
                onClick={() => router.push("/demo")}
                className="px-10 py-4 border border-outline-variant hover:bg-surface-bright/10 transition-all duration-300 font-bold text-lg cursor-pointer"
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

      {/* 2. PROBLEM SECTION */}
      <section className="py-32 px-margin-desktop relative overflow-hidden bg-background" id="problem">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div className="space-y-8 scroll-reveal">
              <div className="inline-block px-3 py-1 bg-surface-container-highest border border-outline-variant text-code-sm font-code-sm text-secondary-fixed-dim uppercase tracking-widest">
                Context Shift
              </div>
              <h3 className="font-headline-lg text-display-lg leading-tight text-white">
                Beyond Static Dashboards.
              </h3>
              <p className="text-on-surface-variant text-xl leading-relaxed font-light">
                The era of manual reporting and spreadsheet chaos is over. Modern enterprises require computational rigor at the speed of thought.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-panel p-8 space-y-4 border-error/20 hover:border-error/40 transition-all">
                <span className="material-symbols-outlined text-error">warning</span>
                <h4 className="font-headline-lg text-lg text-error font-bold">Traditional Enterprise</h4>
                <ul className="space-y-2 text-on-surface-variant text-sm font-code-sm">
                  <li className="flex items-center gap-2"><span className="w-1 h-1 bg-error rounded-full"></span> Static Dashboards</li>
                  <li className="flex items-center gap-2"><span className="w-1 h-1 bg-error rounded-full"></span> Manual Reporting</li>
                  <li className="flex items-center gap-2"><span className="w-1 h-1 bg-error rounded-full"></span> Spreadsheet Chaos</li>
                  <li className="flex items-center gap-2"><span className="w-1 h-1 bg-error rounded-full"></span> Hindsight Focus</li>
                </ul>
              </div>
              <div className="glass-panel p-8 space-y-4 border-primary/20 hover:border-primary/40 transition-all bg-primary-container/5">
                <span className="material-symbols-outlined text-primary">bolt</span>
                <h4 className="font-headline-lg text-lg text-primary font-bold">Sanktrix OS</h4>
                <ul className="space-y-2 text-on-surface-variant text-sm font-code-sm">
                  <li className="flex items-center gap-2"><span className="w-1 h-1 bg-primary rounded-full"></span> Autonomous Reasoning</li>
                  <li className="flex items-center gap-2"><span className="w-1 h-1 bg-primary rounded-full"></span> Continuous Simulation</li>
                  <li className="flex items-center gap-2"><span className="w-1 h-1 bg-primary rounded-full"></span> Predictive Forecasting</li>
                  <li className="flex items-center gap-2"><span className="w-1 h-1 bg-primary rounded-full"></span> Strategic Intelligence</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHY SANKTRIX (Comparison Table) */}
      <section className="py-32 px-margin-desktop bg-background" id="why-sanktrix">
        <div className="max-w-[1000px] mx-auto">
          <h3 className="font-headline-lg text-headline-lg text-center mb-16 text-white">The Sanktrix Advantage</h3>
          <div className="glass-panel overflow-hidden border-outline-variant/10 rounded">
            <table className="w-full text-left font-mono text-xs text-on-surface-variant">
              <thead>
                <tr className="bg-surface-container-high border-b border-white/10 text-white">
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

      {/* 4. INTELLIGENCE LOOP */}
      <section className="py-32 px-margin-desktop bg-surface-container-lowest" id="intelligence">
        <div className="max-w-[1440px] mx-auto text-center space-y-16">
          <h3 className="font-headline-lg text-headline-lg text-white">The Intelligence Loop</h3>
          <div className="relative flex flex-wrap justify-center gap-8 md:gap-0 md:flex-nowrap md:items-center">
            {/* Connection Line */}
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-outline-variant/30 hidden md:block"></div>
            
            {/* Node 1 */}
            <div className="relative z-10 w-full md:w-1/6 px-4 space-y-4 group">
              <div className="w-16 h-16 mx-auto glass-panel rounded-full flex items-center justify-center group-hover:scale-110 transition-transform bg-background">
                <span className="material-symbols-outlined text-primary">database</span>
              </div>
              <div className="text-sm font-code-sm uppercase tracking-tighter text-outline">Data Ingestion</div>
            </div>

            {/* Node 2 */}
            <div className="relative z-10 w-full md:w-1/6 px-4 space-y-4 group">
              <div className="w-16 h-16 mx-auto glass-panel rounded-full flex items-center justify-center group-hover:scale-110 transition-transform bg-background">
                <span className="material-symbols-outlined text-primary">smart_toy</span>
              </div>
              <div className="text-sm font-code-sm uppercase tracking-tighter text-outline">Agents</div>
            </div>

            {/* Node 3 */}
            <div className="relative z-10 w-full md:w-1/6 px-4 space-y-4 group">
              <div className="w-20 h-20 mx-auto glass-panel rounded-full flex items-center justify-center group-hover:scale-110 transition-transform bg-primary/10 border-primary/50 shadow-[0_0_20px_rgba(0,219,231,0.2)]">
                <span className="material-symbols-outlined text-primary-fixed-dim text-3xl">terminal</span>
              </div>
              <div className="text-sm font-code-sm uppercase tracking-tighter text-primary font-bold">Wolfram Core</div>
            </div>

            {/* Node 4 */}
            <div className="relative z-10 w-full md:w-1/6 px-4 space-y-4 group">
              <div className="w-16 h-16 mx-auto glass-panel rounded-full flex items-center justify-center group-hover:scale-110 transition-transform bg-background">
                <span className="material-symbols-outlined text-primary">vital_signs</span>
              </div>
              <div className="text-sm font-code-sm uppercase tracking-tighter text-outline">Simulations</div>
            </div>

            {/* Node 5 */}
            <div className="relative z-10 w-full md:w-1/6 px-4 space-y-4 group">
              <div className="w-16 h-16 mx-auto glass-panel rounded-full flex items-center justify-center group-hover:scale-110 transition-transform bg-background">
                <span className="material-symbols-outlined text-primary">psychology</span>
              </div>
              <div className="text-sm font-code-sm uppercase tracking-tighter text-outline">Intelligence</div>
            </div>

            {/* Node 6 */}
            <div className="relative z-10 w-full md:w-1/6 px-4 space-y-4 group">
              <div className="w-16 h-16 mx-auto glass-panel rounded-full flex items-center justify-center group-hover:scale-110 transition-transform bg-background">
                <span className="material-symbols-outlined text-primary">verified</span>
              </div>
              <div className="text-sm font-code-sm uppercase tracking-tighter text-outline">Recommendations</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WOLFRAM COMPUTATIONAL CORE */}
      <section className="py-32 px-margin-desktop bg-background relative overflow-hidden" id="wolfram">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h3 className="font-headline-lg text-[48px] leading-tight text-white">
              The Precision of Wolfram.<br />
              <span className="text-secondary-fixed-dim">The Power of AGI.</span>
            </h3>
            <p className="text-on-surface-variant text-xl leading-relaxed font-light">
              Sanktrix integrates directly with the Wolfram Language to provide symbolic computational intelligence. We don&apos;t just &quot;guess&quot; next tokens; we compute exact mathematical outcomes.
            </p>
            <div className="space-y-4">
              <div className="glass-panel p-6 border-l-4 border-l-primary flex items-start gap-4">
                <div className="pt-1"><span className="material-symbols-outlined text-primary">query_stats</span></div>
                <div>
                  <div className="font-bold text-on-surface">Monte Carlo Simulations</div>
                  <div className="text-sm text-on-surface-variant">Run 100,000 parallel futures to determine confidence intervals for every strategic move.</div>
                </div>
              </div>
              <div className="glass-panel p-6 border-l-4 border-l-primary flex items-start gap-4">
                <div className="pt-1"><span className="material-symbols-outlined text-primary">functions</span></div>
                <div>
                  <div className="font-bold text-on-surface">Symbolic Logic</div>
                  <div className="text-sm text-on-surface-variant">Transparent reasoning chains that can be audited, verified, and tuned by humans.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative h-[600px] glass-panel border-outline-variant/10 rounded-xl overflow-hidden p-8 flex flex-col bg-surface-container-lowest shadow-2xl">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-error"></div>
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <div className="w-3 h-3 rounded-full bg-secondary"></div>
              </div>
              <div className="text-code-sm font-code-sm text-outline">Wolfram_Core_Simulation.nb</div>
            </div>
            {/* Data Viz Visualization */}
            <div className="flex-grow flex flex-col justify-end space-y-1">
              <div className="flex items-end gap-1 h-full">
                <div className="w-1/12 bg-primary/20 h-[10%]"></div>
                <div className="w-1/12 bg-primary/30 h-[25%]"></div>
                <div className="w-1/12 bg-primary/40 h-[45%]"></div>
                <div className="w-1/12 bg-primary/50 h-[70%]"></div>
                <div className="w-1/12 bg-primary/70 h-[90%]"></div>
                <div className="w-1/12 bg-primary h-[100%] shadow-[0_0_20px_rgba(179,197,255,0.4)] relative">
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-code-sm font-bold text-primary whitespace-nowrap">μ = 94.2%</div>
                </div>
                <div className="w-1/12 bg-primary/70 h-[85%]"></div>
                <div className="w-1/12 bg-primary/50 h-[60%]"></div>
                <div className="w-1/12 bg-primary/40 h-[40%]"></div>
                <div className="w-1/12 bg-primary/30 h-[20%]"></div>
                <div className="w-1/12 bg-primary/20 h-[5%]"></div>
              </div>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="p-4 bg-background border border-outline-variant/20">
                <div className="text-code-sm text-outline">Confidence Interval</div>
                <div className="text-2xl font-display-lg text-on-surface">98.4%</div>
              </div>
              <div className="p-4 bg-background border border-outline-variant/20">
                <div className="text-code-sm text-outline">Compute Cycles</div>
                <div className="text-2xl font-display-lg text-on-surface">4.2 TFlops</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. AGENT ECOSYSTEM */}
      <section className="py-32 px-margin-desktop bg-surface-container-lowest" id="agents">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h3 className="font-headline-lg text-headline-lg text-white">Modular Agent Ecosystem</h3>
            <p className="text-on-surface-variant max-w-2xl mx-auto font-light">
              Deploy specialized intelligence nodes tailored to your enterprise&apos;s unique structure.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Finance Agent */}
            <div className="glass-panel p-10 space-y-6 hover:-translate-y-2 transition-all duration-300 group rounded">
              <div className="w-12 h-12 bg-primary/10 rounded flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-primary">account_balance</span>
              </div>
              <h4 className="font-headline-lg text-xl text-white">Finance Agent</h4>
              <p className="text-on-surface-variant font-light">Real-time P&amp;L monitoring, burn rate forecasting, and automated budget reallocation.</p>
            </div>
            {/* Forecasting Agent */}
            <div className="glass-panel p-10 space-y-6 hover:-translate-y-2 transition-all duration-300 group rounded">
              <div className="w-12 h-12 bg-primary/10 rounded flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-primary">trending_up</span>
              </div>
              <h4 className="font-headline-lg text-xl text-white">Forecasting Agent</h4>
              <p className="text-on-surface-variant font-light">Demand sensing, inventory optimization, and long-range market trend analysis.</p>
            </div>
            {/* Strategy Agent */}
            <div className="glass-panel p-10 space-y-6 hover:-translate-y-2 transition-all duration-300 group rounded">
              <div className="w-12 h-12 bg-primary/10 rounded flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-primary">hub</span>
              </div>
              <h4 className="font-headline-lg text-xl text-white">Strategy Agent</h4>
              <p className="text-on-surface-variant font-light">Competitive landscape mapping and high-level strategic &quot;what-if&quot; analysis.</p>
            </div>
            {/* Risk Agent */}
            <div className="glass-panel p-10 space-y-6 hover:-translate-y-2 transition-all duration-300 group rounded">
              <div className="w-12 h-12 bg-primary/10 rounded flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-primary">security</span>
              </div>
              <h4 className="font-headline-lg text-xl text-white">Risk Agent</h4>
              <p className="text-on-surface-variant font-light">Regulatory compliance tracking and operational risk threshold monitoring.</p>
            </div>
            {/* Operations Agent */}
            <div className="glass-panel p-10 space-y-6 hover:-translate-y-2 transition-all duration-300 group rounded">
              <div className="w-12 h-12 bg-primary/10 rounded flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-primary">settings_input_component</span>
              </div>
              <h4 className="font-headline-lg text-xl text-white">Operations Agent</h4>
              <p className="text-on-surface-variant font-light">Supply chain logistics optimization and workforce management efficiency.</p>
            </div>
            {/* Wolfram Agent */}
            <div className="glass-panel p-10 space-y-6 hover:-translate-y-2 transition-all duration-300 group border-secondary-fixed-dim/30 rounded">
              <div className="w-12 h-12 bg-secondary-fixed-dim/10 rounded flex items-center justify-center group-hover:bg-secondary-fixed-dim/20 transition-colors">
                <span className="material-symbols-outlined text-secondary-fixed-dim">functions</span>
              </div>
              <h4 className="font-headline-lg text-xl text-secondary-fixed-dim">Wolfram Agents</h4>
              <p className="text-on-surface-variant font-light">Direct access to the Wolfram Knowledgebase for multi-domain data computations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. BUSINESS SIMULATION SHOWCASE (Simulation Playground) */}
      <section className="py-32 px-margin-desktop bg-background" id="simulations">
        <div className="max-w-[1440px] mx-auto">
          <h3 className="font-headline-lg text-headline-lg mb-12 text-white">Simulation Playground</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <button
              onClick={() => router.push("/login")}
              className="glass-panel p-8 text-left hover:bg-surface-container-high transition-all border-l-4 border-l-primary cursor-pointer rounded"
            >
              <div className="text-code-sm text-outline mb-2">Scenario Alpha</div>
              <div className="font-bold text-lg mb-4 text-white font-display">Revenue Forecast</div>
              <div className="h-1 bg-outline-variant/30 w-full rounded-full overflow-hidden">
                <div className="bg-primary h-full w-[70%]"></div>
              </div>
              <div className="mt-4 text-xs text-on-surface-variant">Predict outcome of 15% churn rise.</div>
            </button>
            <button
              onClick={() => router.push("/login")}
              className="glass-panel p-8 text-left hover:bg-surface-container-high transition-all border-l-4 border-l-secondary-fixed-dim cursor-pointer rounded"
            >
              <div className="text-code-sm text-outline mb-2">Scenario Beta</div>
              <div className="font-bold text-lg mb-4 text-white font-display">Expansion Analysis</div>
              <div className="h-1 bg-outline-variant/30 w-full rounded-full overflow-hidden">
                <div className="bg-secondary-fixed-dim h-full w-[45%]"></div>
              </div>
              <div className="mt-4 text-xs text-on-surface-variant">Model EMEA market entry ROI.</div>
            </button>
            <button
              onClick={() => router.push("/login")}
              className="glass-panel p-8 text-left hover:bg-surface-container-high transition-all border-l-4 border-l-tertiary-fixed-dim cursor-pointer rounded"
            >
              <div className="text-code-sm text-outline mb-2">Scenario Gamma</div>
              <div className="font-bold text-lg mb-4 text-white font-display">Hiring Impact</div>
              <div className="h-1 bg-outline-variant/30 w-full rounded-full overflow-hidden">
                <div className="bg-tertiary-fixed-dim h-full w-[90%]"></div>
              </div>
              <div className="mt-4 text-xs text-on-surface-variant">Analyze 50 new engineer hires.</div>
            </button>
            <button
              onClick={() => router.push("/login")}
              className="glass-panel p-8 text-left hover:bg-surface-container-high transition-all border-l-4 border-l-error cursor-pointer rounded"
            >
              <div className="text-code-sm text-outline mb-2">Scenario Delta</div>
              <div className="font-bold text-lg mb-4 text-white font-display">Crisis Stress-Test</div>
              <div className="h-1 bg-outline-variant/30 w-full rounded-full overflow-hidden">
                <div className="bg-error h-full w-[25%]"></div>
              </div>
              <div className="mt-4 text-xs text-on-surface-variant">Simulate supply chain collapse.</div>
            </button>
          </div>
        </div>
      </section>

      {/* 8. DIGITAL TWIN */}
      <section className="py-32 px-margin-desktop bg-surface-container-lowest overflow-hidden" id="twin">
        <div className="max-w-[1440px] mx-auto text-center space-y-16">
          <div className="max-w-2xl mx-auto space-y-6">
            <h3 className="font-headline-lg text-display-lg leading-tight text-white">The Digital Twin of your Business.</h3>
            <p className="text-on-surface-variant text-xl font-light">Visualize every connection, KPI, and risk factor in a real-time graph of your entire enterprise ecosystem.</p>
          </div>
          <div className="relative h-[600px] w-full glass-panel rounded overflow-hidden border-primary/20">
            {/* Graph Visual Representation */}
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
            <div className="absolute top-8 left-8 p-6 glass-panel border-l-4 border-l-primary text-left max-w-xs rounded-r">
              <div className="text-code-sm text-primary mb-1">REAL-TIME KPIS</div>
              <div className="text-2xl font-bold text-white">$4.2B ARR</div>
              <div className="text-xs text-on-surface-variant font-mono mt-1">+12% vs last simulation</div>
            </div>
            <div className="absolute bottom-8 right-8 p-6 glass-panel border-l-4 border-l-error text-left max-w-xs rounded-r">
              <div className="text-code-sm text-error mb-1">RISK ALERT</div>
              <div className="text-lg font-bold text-white">Supply Chain Latency</div>
              <div className="text-xs text-on-surface-variant mt-1">Potential 12-day delay detected in Asia-Pacific nodes.</div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. LIVE INTELLIGENCE FEED */}
      <section className="py-32 px-margin-desktop bg-background" id="pulse">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-20">
          <div className="space-y-6">
            <h3 className="font-headline-lg text-headline-lg text-white">System Pulse</h3>
            <p className="text-on-surface-variant font-light">Monitor every decision, simulation, and autonomous action in real-time. Full transparency into the AGI&apos;s reasoning process.</p>
            <div className="pt-8">
              <div className="flex items-center gap-4 text-primary font-code-sm">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse-cyan"></div>
                SYSTEM OPERATIONAL - ALL AGENTS ACTIVE
              </div>
            </div>
          </div>
          <div className="glass-panel font-code-sm text-code-sm overflow-hidden flex flex-col h-[400px] rounded">
            <div className="bg-surface-container-high px-6 py-3 border-b border-outline-variant/20 flex justify-between items-center text-outline">
              <span className="text-on-surface">LIVE_EVENT_STREAM</span>
              <span>T-MINUS 00:00:00</span>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto flex-grow bg-surface-container-lowest/50 font-mono">
              <div className="flex gap-4">
                <span className="text-outline shrink-0">[14:32:01]</span>
                <span className="text-secondary-fixed-dim">COMPLETED:</span>
                <span className="text-on-surface-variant">Market volatility simulation (Scenario Alpha-9). Confidence 94.2%.</span>
              </div>
              <div className="flex gap-4">
                <span className="text-outline shrink-0">[14:31:45]</span>
                <span className="text-primary">ACTION:</span>
                <span className="text-on-surface-variant">Reallocated $2M budget from Acquisition to Retention based on churn forecast.</span>
              </div>
              <div className="flex gap-4">
                <span className="text-outline shrink-0">[14:31:12]</span>
                <span className="text-on-secondary-container">INGEST:</span>
                <span className="text-on-surface-variant">ERP data sync completed. 12,042 new records parsed.</span>
              </div>
              <div className="flex gap-4">
                <span className="text-outline shrink-0">[14:30:58]</span>
                <span className="text-error">ALERT:</span>
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

      {/* 10. ARCHITECTURE */}
      <section className="py-32 border-t border-white/5 bg-background" id="architecture">
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
              <div key={idx} className="glass-panel p-5 rounded border border-white/5 flex flex-col justify-between space-y-4 hover:border-primary/20 transition-all duration-300">
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

      {/* 11. SECURITY */}
      <section className="py-32 px-margin-desktop bg-surface-container-lowest" id="security">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel p-8 space-y-4 rounded">
            <span className="material-symbols-outlined text-primary">lock</span>
            <h4 className="font-headline-lg text-lg text-white font-bold">Granular RBAC</h4>
            <p className="text-sm text-on-surface-variant font-light leading-relaxed">Military-grade access controls ensuring only authorized personnel can trigger autonomous actions.</p>
          </div>
          <div className="glass-panel p-8 space-y-4 rounded">
            <span className="material-symbols-outlined text-primary">verified_user</span>
            <h4 className="font-headline-lg text-lg text-white font-bold">Immutable Audit Logs</h4>
            <p className="text-sm text-on-surface-variant font-light leading-relaxed">Every decision made by an agent is logged on a private, tamper-proof ledger for complete accountability.</p>
          </div>
          <div className="glass-panel p-8 space-y-4 rounded">
            <span className="material-symbols-outlined text-primary">cloud_off</span>
            <h4 className="font-headline-lg text-lg text-white font-bold">On-Prem/Private Cloud</h4>
            <p className="text-sm text-on-surface-variant font-light leading-relaxed">Deploy Sanktrix in your own environment. Your data never leaves your infrastructure.</p>
          </div>
        </div>
      </section>

      {/* 12. PRODUCT SCREENSHOTS (Command & Control showcase) */}
      <section className="py-32 px-margin-desktop bg-surface-container-lowest relative overflow-hidden" id="showcase">
        <div className="max-w-[1440px] mx-auto text-center mb-16">
          <h3 className="font-headline-lg text-headline-lg text-white">Command &amp; Control</h3>
        </div>
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-8 no-scrollbar px-margin-desktop pb-12">
          {/* Mockup 1 */}
          <div className="shrink-0 w-full md:w-[800px] snap-center">
            <div className="glass-panel aspect-video rounded-2xl overflow-hidden border-outline-variant/30 group cursor-pointer relative">
              <img
                className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCu8blTiBRjwd6FD6pzl3ZxkUBnCKdb9XzDsFxpUzxGDHwb8tonKjrYQMCaXPSq0HGjIUgwookhHOPkFYNS-U4JUXvwdnYavesBYtiHhZqYu7X9n0sQtIqSSCYLNRNVOXkCi10CcODLLA05tMNWPamVMkLHYZlhR7bx1Y1nauuZxJ_LZQ-Mt9wp5EWhD6xl0nAIEYj79YR2UcRmCICAJhZ09huFUSAUHFkM9RekGWaCJkEg72LANjMAbKmvhvDrDGY6S3bHNXAp56M"
                alt="Executive Copilot Mockup"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8 text-left">
                <h4 className="font-headline-lg text-2xl mb-2 text-white font-bold">Executive Copilot</h4>
                <p className="text-on-surface-variant font-light">Your voice-activated bridge to enterprise intelligence.</p>
              </div>
            </div>
          </div>
          {/* Mockup 2 */}
          <div className="shrink-0 w-full md:w-[800px] snap-center">
            <div className="glass-panel aspect-video rounded-2xl overflow-hidden border-outline-variant/30 group cursor-pointer relative">
              <img
                className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIaizFC2bzA52UEUnmft1xxpPlkSfMcCAEGnDLdDD5zxaOMbiJG4WEN7j8kpGgkVy6QcLpbeZyt9-qCqKhDEaaZGSmMIMbT518c9o2RtgVKU3lvnZkqUVG4_PBDLYAx6ay8DxoXMnxQfACrR30ZRIGks_8YxE9EviN8JLKEhqqWioVtxXoCjvemx4TkeZSKGBX_ECPrSIe2EwHf6bR6c51luYuHUXXfSxQXt1g2UxXsSIlO67YZTpY57DAK6_h7M9_tjEa8U7dl0w"
                alt="Agent Observatory Mockup"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8 text-left">
                <h4 className="font-headline-lg text-2xl mb-2 text-white font-bold">Agent Observatory</h4>
                <p className="text-on-surface-variant font-light">Observe every autonomous agent&apos;s reasoning path in real-time.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 13. FINAL CTA */}
      <section className="py-40 px-margin-desktop relative overflow-hidden bg-background text-center" id="cta">
        <div className="absolute inset-0 bg-primary/5 opacity-30 blur-[100px] -z-10"></div>
        <div className="max-w-4xl mx-auto space-y-12 relative z-10 flex flex-col items-center">
          <h3 className="font-display-lg text-display-lg leading-tight text-white">
            While Most AI Generates Answers,<br />
            <span className="text-glow text-primary font-bold">Sanktrix Computes Strategic Intelligence.</span>
          </h3>
          <p className="text-xl text-on-surface-variant font-light leading-relaxed">The future of enterprise operations is autonomous. Join the elite organizations already running on Sanktrix.</p>
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

      {/* 14. FOOTER */}
      <footer className="w-full border-t border-outline-variant/20 bg-background relative overflow-hidden">
        <div className="bg-grid-pattern opacity-grid-opacity absolute inset-0 pointer-events-none"></div>
        <div className="flex flex-col md:flex-row justify-between items-center px-margin-desktop py-12 gap-gutter max-w-[1440px] mx-auto relative z-10 w-full text-xs font-mono text-on-surface-variant">
          {/* Standalone brand logo instead of text */}
          <img
            src="/branding/sanktrix-logo.png"
            className="h-7 w-auto object-contain brightness-110"
            alt="Sanktrix Logo footer"
          />
          <div className="flex gap-8">
            <a className="text-outline hover:text-on-surface transition-colors font-code-sm text-code-sm hover:underline decoration-primary-container" href="#">Privacy Protocol</a>
            <a className="text-outline hover:text-on-surface transition-colors font-code-sm text-code-sm hover:underline decoration-primary-container" href="#">Service Terms</a>
            <a className="text-outline hover:text-on-surface transition-colors font-code-sm text-code-sm hover:underline decoration-primary-container" href="#">API Documentation</a>
            <a className="text-outline hover:text-on-surface transition-colors font-code-sm text-code-sm hover:underline decoration-primary-container" href="#">System Status</a>
          </div>
          <div className="text-secondary-fixed-dim font-code-sm text-code-sm uppercase tracking-widest">
            © 2026 SANKTRIX AGI OS. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>
    </div>
  );
}
