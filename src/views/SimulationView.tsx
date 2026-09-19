import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { RoadCanvas } from '../components/RoadCanvas';
import { ScenarioId } from '../types';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Layers,
  Compass,
  AlertTriangle,
  Brain,
  ListFilter,
  Navigation,
  Gauge,
  Activity,
  Sliders,
  Radio,
  Zap,
  ShieldCheck,
  RotateCw
} from 'lucide-react';

export const SimulationView: React.FC = () => {
  const {
    currentScenario,
    simulationRunning,
    simulationTimeFormatted,
    vehicle,
    riskLevel,
    decision,
    activeRoute,
    detectedObjects,
    eventLog,
    startSimulation,
    stopSimulation,
    resetSimulation,
    triggerDemoMode,
    loadScenario,
    forceReplan,
    isReplanned,
    replanningActive,
    emergencyBrakingActive,
    settings,
    updateSettings
  } = useSimulation();

  return (
    <div className="space-y-5">
      {/* 1. Simulation Top Control Bar */}
      <div className="p-4 rounded-2xl bg-[#091124] border border-cyan-950/80 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left: Scenario Selector & Status */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono text-slate-400">SCENARIO:</span>
            <select
              id="sim-scenario-selector"
              value={currentScenario.id}
              onChange={e => loadScenario(e.target.value as ScenarioId, false)}
              className="bg-transparent text-sm font-bold text-white focus:outline-none cursor-pointer"
            >
              <option value="village" className="bg-slate-900 text-white">1. Village Road - Unmarked</option>
              <option value="intersection" className="bg-slate-900 text-white">2. Urban Intersection - No Signals</option>
              <option value="highway" className="bg-slate-900 text-white">3. Highway Merge - Slow Vehicle</option>
              <option value="market" className="bg-slate-900 text-white">4. Dense Market Area - Mixed Traffic</option>
              <option value="cattle" className="bg-slate-900 text-white">5. Sudden Cattle Crossing</option>
            </select>
          </div>

          {/* Simulation Status Pill */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono">
            <span className={`w-2 h-2 rounded-full ${simulationRunning ? 'bg-cyan-400 animate-ping' : 'bg-slate-500'}`}></span>
            <span className="text-slate-400">STATUS:</span>
            <span className={`font-bold ${simulationRunning ? 'text-cyan-300' : 'text-slate-300'}`}>
              {simulationRunning ? 'RUNNING' : 'PAUSED'}
            </span>
          </div>

          <div className="px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-300">
            TIME: <span className="text-cyan-400 font-bold">{simulationTimeFormatted}</span>
          </div>
        </div>

        {/* Right: Simulation Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {simulationRunning ? (
            <button
              id="sim-stop-btn"
              onClick={stopSimulation}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-lg shadow-amber-950/50 transition"
            >
              <Pause className="w-4 h-4" />
              <span>STOP SIMULATION</span>
            </button>
          ) : (
            <button
              id="sim-start-btn"
              onClick={startSimulation}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-950/50 transition"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>START SIMULATION</span>
            </button>
          )}

          <button
            id="sim-reset-btn"
            onClick={resetSimulation}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET</span>
          </button>

          {/* Replan test button */}
          <button
            id="sim-replan-btn"
            onClick={forceReplan}
            disabled={isReplanned}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition ${
              isReplanned
                ? 'bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed'
                : 'bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/60 text-indigo-300'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>{isReplanned ? 'REPLANNED' : 'TEST REPLAN'}</span>
          </button>

          <button
            id="sim-demo-btn"
            onClick={triggerDemoMode}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-medium shadow transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>DEMO MODE</span>
          </button>

          {/* Speed selector */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-mono">
            {(['slow', 'normal', 'fast'] as const).map(spd => (
              <button
                key={spd}
                onClick={() => updateSettings({ simulationSpeed: spd })}
                className={`px-2 py-1 rounded-lg uppercase ${
                  settings.simulationSpeed === spd
                    ? 'bg-cyan-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {spd === 'slow' ? '0.5x' : spd === 'normal' ? '1x' : '2x'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Main Visualizer Stage + Telemetry Cockpit */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
        {/* Large Live Simulation Canvas (3 cols on XL) */}
        <div className="xl:col-span-3 space-y-4">
          <RoadCanvas showControlsOverlay={true} />

          {/* Vehicle Telemetry Cockpit HUD */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
            {/* Speed & Throttle */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-850">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                <span>SPEEDOMETER</span>
                <Gauge className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="text-xl font-mono font-bold text-cyan-300">
                {vehicle.speed} <span className="text-xs text-slate-400">km/h</span>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-cyan-400 h-full rounded-full transition-all duration-100"
                  style={{ width: `${Math.min(100, (vehicle.speed / 80) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Throttle vs Brake */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-850">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                <span>ACTUATION DYNAMICS</span>
                <Sliders className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="flex items-center justify-between text-xs font-mono mt-1">
                <span className="text-emerald-400">THR: {vehicle.throttle}%</span>
                <span className={vehicle.brake > 0 ? 'text-red-400 font-bold' : 'text-slate-500'}>
                  BRK: {vehicle.brake}%
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1 mt-2">
                <div className="bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full" style={{ width: `${vehicle.throttle}%` }}></div>
                </div>
                <div className="bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-red-500 h-full" style={{ width: `${vehicle.brake}%` }}></div>
                </div>
              </div>
            </div>

            {/* Steering & Heading */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-850">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                <span>STEERING ANGLE</span>
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="text-xl font-mono font-bold text-white">
                {vehicle.steeringAngle > 0 ? `+${vehicle.steeringAngle}°` : `${vehicle.steeringAngle}°`}
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-1">
                Heading: {Math.round(vehicle.heading)}° (Road-Aligned)
              </div>
            </div>

            {/* Route Traversal Progress */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-850">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                <span>ROUTE PROGRESS</span>
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="text-xl font-mono font-bold text-cyan-400">
                {Math.round(vehicle.progress * 100)}%
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-75"
                  style={{ width: `${vehicle.progress * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Side Column: AI Decision Engine & Live Navigation */}
        <div className="space-y-4">
          {/* Live Navigation Card */}
          <div className="p-4 rounded-2xl bg-[#091124] border border-cyan-950/80 shadow-md space-y-3">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-cyan-400 border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5" />
                LIVE NAVIGATION
              </span>
              <span className="text-[10px] text-slate-400">ONE BLUE ROUTE</span>
            </div>

            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">CURRENT ROAD</div>
              <div className="text-xs font-bold text-white mt-0.5">
                {currentScenario.currentRoadName}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] font-mono text-cyan-400 uppercase">NEXT DIRECTION</div>
              <div className="text-sm font-extrabold text-cyan-300 mt-0.5">
                {currentScenario.nextDirection}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div>
                <span className="text-slate-500 text-[10px] block">DISTANCE</span>
                <span className="text-white font-bold">{currentScenario.nextDistance}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">ETA</span>
                <span className="text-emerald-400 font-bold">{currentScenario.eta}</span>
              </div>
            </div>
          </div>

          {/* Dedicated AI Decision Engine Panel */}
          <div className="p-4 rounded-2xl bg-[#091124] border border-cyan-950/80 shadow-md space-y-3">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-cyan-400 border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5" />
                AI DECISION ENGINE
              </span>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  riskLevel === 'HIGH'
                    ? 'bg-red-950 text-red-300 border border-red-800'
                    : riskLevel === 'MEDIUM'
                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}
              >
                {riskLevel} RISK
              </span>
            </div>

            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">CURRENT STATE</div>
              <div
                className={`text-sm font-extrabold font-mono mt-0.5 ${
                  decision === 'EMERGENCY BRAKING'
                    ? 'text-red-400 animate-pulse'
                    : decision === 'REPLANNING'
                    ? 'text-amber-400'
                    : decision === 'YIELD'
                    ? 'text-yellow-300'
                    : 'text-emerald-400'
                }`}
              >
                {decision}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] font-mono text-slate-400 uppercase">DETECTED EVENT</div>
              <div className="text-xs text-slate-200 mt-0.5">
                {replanningActive || emergencyBrakingActive
                  ? currentScenario.triggerEvent.alertTitle
                  : isReplanned
                  ? 'Obstacle bypassed. Following updated single blue trajectory.'
                  : 'Clear forward corridor. Tracking road boundaries.'}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">ACTION</div>
              <div className="text-xs text-cyan-300 font-mono mt-0.5">
                {emergencyBrakingActive
                  ? 'Decelerate at -6.8 m/s² → STOP → Replan'
                  : replanningActive
                  ? 'Synthesizing collision-free lateral path'
                  : 'Follow Active Blue Route'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Panels: Real-time Event Log & Detected Objects in Current Scenario */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Real-time Event Log (Newest first) */}
        <div className="p-5 rounded-2xl bg-[#080e1e] border border-slate-800 shadow-lg flex flex-col h-72">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>REAL-TIME SYSTEM EVENT LOG</span>
            </div>
            <span className="text-[10px] font-mono text-cyan-400">NEWEST EVENTS FIRST</span>
          </div>

          <div className="flex-1 overflow-y-auto mt-2 space-y-1.5 pr-1 font-mono text-xs">
            {eventLog.map(evt => {
              const badgeStyle =
                evt.type === 'danger'
                  ? 'text-red-400 bg-red-950/80 border-red-800/80'
                  : evt.type === 'warning'
                  ? 'text-amber-400 bg-amber-950/80 border-amber-800/80'
                  : evt.type === 'replan'
                  ? 'text-indigo-300 bg-indigo-950/80 border-indigo-800/80'
                  : evt.type === 'success'
                  ? 'text-emerald-400 bg-emerald-950/80 border-emerald-800/80'
                  : 'text-slate-300 bg-slate-900/80 border-slate-800';

              return (
                <div
                  key={evt.id}
                  className={`p-2 rounded-lg border flex items-start gap-2 ${badgeStyle}`}
                >
                  <span className="text-[10px] text-slate-400 shrink-0 select-none">
                    [{evt.timestamp}]
                  </span>
                  <span className="leading-snug">{evt.message}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Detected Objects in Scenario */}
        <div className="p-5 rounded-2xl bg-[#080e1e] border border-slate-800 shadow-lg flex flex-col h-72">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300">
              <Radio className="w-4 h-4 text-cyan-400" />
              <span>DETECTED OBJECTS ({detectedObjects.length})</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">LiDAR & RADAR TRACKING</span>
          </div>

          <div className="flex-1 overflow-y-auto mt-2 space-y-2 pr-1">
            {detectedObjects.map(obj => (
              <div
                key={obj.id}
                className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white font-mono uppercase">{obj.type}</span>
                    <span className="text-slate-400 text-[11px] truncate max-w-[160px]">{obj.name}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                    Motion: {obj.predictedMovement}
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className="text-cyan-300 font-bold">{obj.distance} m</div>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                      obj.risk === 'HIGH'
                        ? 'text-red-400 bg-red-950'
                        : obj.risk === 'MEDIUM'
                        ? 'text-amber-400 bg-amber-950'
                        : 'text-emerald-400 bg-emerald-950'
                    }`}
                  >
                    {obj.risk}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
