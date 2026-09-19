import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { RoadCanvas } from '../components/RoadCanvas';
import {
  GitFork,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Compass,
  ArrowRight,
  Activity,
  Layers,
  Sparkles,
  Zap
} from 'lucide-react';

export const PathPlanningView: React.FC = () => {
  const {
    currentScenario,
    activeRoute,
    vehicle,
    isReplanned,
    replanningActive,
    emergencyBrakingActive,
    decision,
    forceReplan,
    metrics
  } = useSimulation();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0a1226] to-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold">
          <GitFork className="w-4 h-4" />
          <span>REAL-TIME TRAJECTORY SYNTHESIS</span>
        </div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight mt-1">
          Adaptive Path Planning Engine
        </h2>
        <p className="text-sm text-slate-400 max-w-3xl mt-1">
          Guaranteed <strong>single continuous blue route</strong> representation. When obstacles appear, the system solves a Frenet-frame polynomial optimization problem and updates the active path in under 150 ms.
        </p>
      </div>

      {/* Path Planning KPI HUD Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm">
          <div className="text-[10px] font-mono text-slate-400 uppercase">PATH STATUS</div>
          <div className="text-base font-extrabold text-cyan-400 mt-1 font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>ACTIVE (1 BLUE ROUTE)</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
            {activeRoute.length} Waypoints Synthesized
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm">
          <div className="text-[10px] font-mono text-slate-400 uppercase">ROUTE DISTANCE</div>
          <div className="text-base font-extrabold text-white mt-1 font-mono">
            {currentScenario.totalDistance}
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
            Remaining: {currentScenario.nextDistance}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm">
          <div className="text-[10px] font-mono text-slate-400 uppercase">NEXT ACTION</div>
          <div className="text-sm font-extrabold text-cyan-300 mt-1 truncate font-mono">
            {currentScenario.nextDirection}
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
            Speed: {vehicle.speed} km/h
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm">
          <div className="text-[10px] font-mono text-slate-400 uppercase">REPLANNING STATUS</div>
          <div className="text-base font-extrabold mt-1 font-mono flex items-center gap-1.5">
            {emergencyBrakingActive ? (
              <span className="text-red-400 animate-pulse">EMERGENCY HALT</span>
            ) : replanningActive ? (
              <span className="text-amber-400 animate-pulse">OPTIMIZING...</span>
            ) : isReplanned ? (
              <span className="text-emerald-400">EXECUTED (CLEAR)</span>
            ) : (
              <span className="text-slate-300">READY (STANDBY)</span>
            )}
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
            Latency: {metrics.replanningLatencyMs} ms
          </div>
        </div>
      </div>

      {/* Interactive Path Visualizer */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>Active Road Waypoints & Path Curvature (1 Solid Blue Line)</span>
          </div>

          <button
            onClick={forceReplan}
            disabled={isReplanned}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              isReplanned
                ? 'bg-slate-900 text-slate-500 border border-slate-800'
                : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>{isReplanned ? 'REPLANNING COMPLETED' : 'TRIGGER REPLANNING NOW'}</span>
          </button>
        </div>

        <RoadCanvas showControlsOverlay={true} />
      </div>

      {/* Path Planning Mathematical & Algorithmic Principles */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Frenet Frame Representation */}
        <div className="p-5 rounded-2xl bg-[#080f22] border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold">
            <Layers className="w-4 h-4" />
            <span>FRENET FRAME COORDINATES (s, d)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Instead of standard Cartesian $(x, y)$, the planner transforms vehicles into longitudinal distance $s$ along the road curve and lateral displacement $d$ from the road centerline.
          </p>
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-850 font-mono text-xs text-cyan-300 space-y-1">
            <div>s(t) = a₀ + a₁t + a₂t² + a₃t³ + a₄t⁴</div>
            <div>d(t) = b₀ + b₁t + b₂t² + b₃t³ + b₄t⁴</div>
            <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800">
              Quintic polynomials guarantee jerk-free smooth passenger comfort.
            </div>
          </div>
        </div>

        {/* Multi-Objective Cost Function */}
        <div className="p-5 rounded-2xl bg-[#080f22] border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold">
            <Activity className="w-4 h-4" />
            <span>COST FUNCTION MINIMIZATION</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Each candidate curve is scored against collision risk, road boundary proximity, curvature smoothness, and target velocity deviation.
          </p>
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-850 font-mono text-xs text-emerald-300 space-y-1">
            <div>J = w_s · J_smooth + w_c · J_collision</div>
            <div>&nbsp;&nbsp;&nbsp;+ w_d · J_lateral + w_v · J_speed</div>
            <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800">
              Weights: w_collision = 1000, w_smooth = 12.5, w_lat = 4.2
            </div>
          </div>
        </div>

        {/* Single Blue Route Invariant */}
        <div className="p-5 rounded-2xl bg-[#080f22] border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold">
            <Zap className="w-4 h-4" />
            <span>STRICT SINGLE ROUTE INVARIANT</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Many autonomous UI demos confuse viewers with green, red, and orange ghost routes. Our architecture enforces a strict single-path contract:
          </p>
          <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
            <li>Only the active executable path is drawn (Solid Blue).</li>
            <li>Direction chevrons are drawn directly along the curve.</li>
            <li>Replanning mutates the single active path seamlessly.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
