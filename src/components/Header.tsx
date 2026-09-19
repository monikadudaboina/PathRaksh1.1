import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { ScenarioId } from '../types';
import { Play, Pause, RotateCcw, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';

export const Header: React.FC<{ onToggleSidebar?: () => void }> = ({ onToggleSidebar }) => {
  const {
    currentScenario,
    simulationRunning,
    startSimulation,
    stopSimulation,
    resetSimulation,
    triggerDemoMode,
    loadScenario,
    riskLevel,
    simulationTimeFormatted
  } = useSimulation();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-[#070d1e]/90 backdrop-blur-md px-4 sm:px-6 py-3">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        {/* Left: Brand title, mobile toggle, subtitle & status */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-cyan-400 focus:outline-none"
              aria-label="Toggle Navigation"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                <span className="text-cyan-400">Adaptive Autonomous</span> Drive
              </h1>

              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[11px] font-mono font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>SYSTEM READY</span>
              </div>

              <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-cyan-300">
                <span>SIMULATION / HACKATHON PROTOTYPE</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 tracking-wide mt-0.5 hidden sm:block">
              Adaptive Path Planning & Collision Avoidance for Unstructured Indian Roads
            </p>
          </div>
        </div>

        {/* Right: Quick Scenario Selector & Simulation Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-between sm:justify-end">
          {/* Scenario Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs">
            <span className="text-slate-400 font-mono text-[11px] hidden md:inline">SCENARIO:</span>
            <select
              id="header-scenario-dropdown"
              value={currentScenario.id}
              onChange={e => loadScenario(e.target.value as ScenarioId, false)}
              className="bg-transparent text-cyan-300 font-medium focus:outline-none cursor-pointer text-xs"
            >
              <option value="village" className="bg-slate-900 text-white">1. Village Road (Unmarked)</option>
              <option value="intersection" className="bg-slate-900 text-white">2. Urban Intersection (No Signals)</option>
              <option value="highway" className="bg-slate-900 text-white">3. Highway Merge (Slow Truck)</option>
              <option value="market" className="bg-slate-900 text-white">4. Dense Market (Mixed Traffic)</option>
              <option value="cattle" className="bg-slate-900 text-white">5. Sudden Cattle Crossing</option>
            </select>
          </div>

          {/* Clock Timer */}
          <div className="px-2.5 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 font-mono text-xs text-slate-300">
            TIME: <span className="text-cyan-400 font-semibold">{simulationTimeFormatted}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5">
            {simulationRunning ? (
              <button
                id="header-stop-btn"
                onClick={stopSimulation}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600/90 hover:bg-amber-500 text-white text-xs font-semibold shadow-md shadow-amber-950/40 transition"
              >
                <Pause className="w-3.5 h-3.5" />
                <span>PAUSE</span>
              </button>
            ) : (
              <button
                id="header-start-btn"
                onClick={startSimulation}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-950/40 transition"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>START SIMULATION</span>
              </button>
            )}

            <button
              id="header-reset-btn"
              onClick={resetSimulation}
              title="Reset simulation state"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              id="header-demo-btn"
              onClick={triggerDemoMode}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-medium shadow-md transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>DEMO MODE</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
