import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { SCENARIOS } from '../data/scenarios';
import { ScenarioId } from '../types';
import { Layers, Play, AlertCircle, Gauge, ShieldAlert, ArrowRight } from 'lucide-react';

export const ScenariosView: React.FC = () => {
  const { loadScenario, navigateToSection, currentScenario } = useSimulation();

  const scenariosList = Object.values(SCENARIOS);

  const handleStartScenario = (id: ScenarioId) => {
    loadScenario(id, true);
    navigateToSection('simulation');
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-[#0a1226] to-slate-900/90 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold">
          <Layers className="w-4 h-4" />
          <span>5 UNSTRUCTURED INDIAN ROAD TEST CASES</span>
        </div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight mt-1">
          Select Autonomous Drive Scenario
        </h2>
        <p className="text-sm text-slate-400 max-w-3xl mt-1">
          Each scenario presents unique chaos characteristics of Indian driving conditions: missing markings, unexpected cattle crossings, dense bazaars, non-signalized junctions, and high-speed merges with overloaded freight.
        </p>
      </div>

      {/* 5 Scenario Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {scenariosList.map(scen => {
          const isCurrent = currentScenario.id === scen.id;
          const diffColor =
            scen.difficulty === 'Extreme'
              ? 'text-red-400 bg-red-950/80 border-red-800/80'
              : scen.difficulty === 'High'
              ? 'text-amber-400 bg-amber-950/80 border-amber-800/80'
              : 'text-emerald-400 bg-emerald-950/80 border-emerald-800/80';

          return (
            <div
              key={scen.id}
              className={`rounded-2xl border transition-all flex flex-col justify-between overflow-hidden shadow-xl ${
                isCurrent
                  ? 'bg-slate-900/95 border-cyan-500 shadow-cyan-950/40 ring-1 ring-cyan-500/50'
                  : 'bg-[#080f22]/90 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Card Header & Visual Badge */}
              <div className="p-5 border-b border-slate-800/80 bg-slate-950/40">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800/60 text-cyan-300 font-mono text-sm font-bold flex items-center justify-center">
                    0{scen.number}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${diffColor}`}>
                      {scen.difficulty}
                    </span>
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded bg-cyan-500 text-slate-950 font-mono text-[10px] font-bold">
                        ACTIVE
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mt-3">
                  {scen.name}
                </h3>
                <p className="text-xs text-cyan-400/80 font-mono mt-0.5">
                  {scen.subtitle}
                </p>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4 flex-1">
                <p className="text-xs text-slate-300 leading-relaxed">
                  {scen.description}
                </p>

                {/* Key specs */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-slate-800/60">
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-900">
                    <span className="text-slate-500 text-[10px] block">CRUISING SPEED</span>
                    <span className="text-white font-bold">{scen.speedRange}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-900">
                    <span className="text-slate-500 text-[10px] block">INITIAL DECISION</span>
                    <span className="text-cyan-300 font-bold">{scen.initialDecision}</span>
                  </div>
                </div>

                {/* Objects list */}
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase mb-1.5">
                    Traffic Objects Present:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {scen.objectsSummary.map((item, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 text-[10px] font-mono"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Challenges */}
                <div className="space-y-1 pt-1">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Key Challenges:</div>
                  {scen.keyChallenges.slice(0, 2).map((ch, i) => (
                    <div key={i} className="text-[11px] text-slate-400 flex items-start gap-1.5">
                      <span className="text-cyan-400">•</span>
                      <span>{ch}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer Button */}
              <div className="p-4 bg-slate-950/80 border-t border-slate-800/80">
                <button
                  id={`scenario-launch-btn-${scen.id}`}
                  onClick={() => handleStartScenario(scen.id)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-950/50 transition transform hover:-translate-y-0.5"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>START SCENARIO</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
