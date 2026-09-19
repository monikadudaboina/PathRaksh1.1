import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { RoadCanvas } from '../components/RoadCanvas';
import {
  Car,
  Shield,
  Gauge,
  Clock,
  Navigation,
  Compass,
  Layers,
  Sparkles,
  ArrowRight,
  Eye,
  Cpu,
  Scan,
  TrendingUp,
  Brain,
  GitMerge,
  Sliders,
  RotateCw,
  AlertCircle
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    currentScenario,
    simulationRunning,
    simulationTimeFormatted,
    vehicle,
    riskLevel,
    decision,
    startSimulation,
    stopSimulation,
    triggerDemoMode,
    navigateToSection,
    emergencyBrakingActive,
    replanningActive
  } = useSimulation();

  // 8-stage autonomous pipeline
  const pipelineStages = [
    { name: 'PERCEPTION', icon: Eye, active: true },
    { name: 'SENSOR FUSION', icon: Cpu, active: true },
    { name: 'OBJECT DETECTION', icon: Scan, active: true },
    { name: 'MOTION PREDICTION', icon: TrendingUp, active: true },
    { name: 'DECISION MAKING', icon: Brain, active: true },
    { name: 'PATH PLANNING', icon: GitMerge, active: replanningActive || true },
    { name: 'VEHICLE CONTROL', icon: Sliders, active: simulationRunning },
    { name: 'REAL-TIME REPLANNING', icon: RotateCw, active: replanningActive }
  ];

  // Vehicle status text
  const vehicleStatusText = emergencyBrakingActive
    ? 'EMERGENCY BRAKING'
    : replanningActive
    ? 'REPLANNING ROUTE'
    : simulationRunning
    ? 'AUTONOMOUS CRUISE'
    : 'READY';

  // Safety status
  const safetyStatus = emergencyBrakingActive ? 'CRITICAL' : riskLevel === 'HIGH' ? 'HAZARD' : riskLevel === 'MEDIUM' ? 'CAUTION' : 'SAFE';
  const safetyBadgeColor =
    safetyStatus === 'SAFE'
      ? 'text-emerald-400 bg-emerald-950/70 border-emerald-500/40'
      : safetyStatus === 'CAUTION'
      ? 'text-amber-400 bg-amber-950/70 border-amber-500/40'
      : 'text-red-400 bg-red-950/70 border-red-500/40';

  return (
    <div className="space-y-6">
      {/* 1. Top Title & Status Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-[#0a1226]/80 to-slate-900/90 border border-cyan-900/40 shadow-xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-mono text-xs text-emerald-400 font-semibold tracking-wider">
              ● SYSTEM READY
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-xs text-cyan-400/90 font-mono">
              ADAPTIVE LATERAL & LONGITUDINAL CONTROLLER
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight mt-1">
            Adaptive Autonomous Driving System
          </h2>
          <p className="text-sm text-slate-400">
            Real-time adaptive path planning for unpredictable Indian roads.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateToSection('simulation')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-950/50 transition"
          >
            <Compass className="w-4 h-4" />
            <span>OPEN LIVE SIMULATION</span>
          </button>
        </div>
      </div>

      {/* 2. Key Dashboard HUD Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Vehicle Status */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono mb-1">
            <span>VEHICLE STATUS</span>
            <Car className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-sm sm:text-base font-bold text-white truncate">
            {vehicleStatusText}
          </div>
          <div className="text-[10px] text-cyan-400/80 mt-1 font-mono">
            {simulationRunning ? 'Controller Engaged' : 'Drive In Standby'}
          </div>
        </div>

        {/* Current Scenario */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono mb-1">
            <span>SCENARIO</span>
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-sm sm:text-base font-bold text-white truncate">
            {currentScenario.name.split(' - ')[0]}
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">
            {currentScenario.difficulty} Difficulty
          </div>
        </div>

        {/* Speed */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono mb-1">
            <span>SPEED</span>
            <Gauge className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-sm sm:text-base font-bold text-white">
            <span className="text-cyan-400 text-xl font-mono">{vehicle.speed}</span> <span className="text-xs text-slate-400">km/h</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">
            Limit: {currentScenario.defaultSpeed} km/h
          </div>
        </div>

        {/* Safety Status */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono mb-1">
            <span>SAFETY STATUS</span>
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="mt-0.5">
            <span className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-bold border ${safetyBadgeColor}`}>
              {safetyStatus}
            </span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">
            0 Collisions
          </div>
        </div>

        {/* Risk Level */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono mb-1">
            <span>RISK LEVEL</span>
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-sm sm:text-base font-bold text-white font-mono">
            <span
              className={
                riskLevel === 'HIGH' ? 'text-red-400' : riskLevel === 'MEDIUM' ? 'text-amber-400' : 'text-emerald-400'
              }
            >
              {riskLevel}
            </span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">
            Dynamic Assessment
          </div>
        </div>

        {/* Simulation Time */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono mb-1">
            <span>SIM TIME</span>
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-sm sm:text-base font-mono font-bold text-cyan-400">
            {simulationTimeFormatted}
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">
            Elapsed Timer
          </div>
        </div>
      </div>

      {/* 3. Hero Panel with Action Buttons */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c1630] via-[#091122] to-[#050b18] border border-cyan-900/50 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>HACKATHON SHOWCASE: ADAPTIVE COLLISION AVOIDANCE</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Adaptive Autonomous Driving Simulation
          </h3>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            &ldquo;AI-based perception, prediction and adaptive path planning for unstructured Indian road environments.&rdquo;
          </p>

          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Navigating roads where lane markings are absent, traffic is deeply heterogeneous (auto-rickshaws, cattle, pushcarts, two-wheelers), and pedestrians cross without notice. Watch our algorithm maintain a <strong>single continuous blue route</strong> and dynamically reshape it when unexpected obstacles appear.
          </p>

          {/* Working Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              id="hero-start-simulation-btn"
              onClick={() => {
                startSimulation();
                navigateToSection('simulation');
              }}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs sm:text-sm font-bold shadow-lg shadow-cyan-500/25 transition transform hover:-translate-y-0.5"
            >
              <Compass className="w-4 h-4" />
              <span>START SIMULATION</span>
            </button>

            <button
              id="hero-select-scenario-btn"
              onClick={() => navigateToSection('scenarios')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-semibold border border-slate-700 transition"
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>SELECT SCENARIO</span>
            </button>

            <button
              id="hero-demo-mode-btn"
              onClick={triggerDemoMode}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs sm:text-sm font-semibold shadow-md transition"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>DEMO MODE</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Complete 8-Stage Autonomous Pipeline Visualization */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-mono tracking-wider text-slate-400 uppercase">
            Closed-Loop Autonomous Architecture Pipeline
          </div>
          <span className="text-[11px] font-mono text-cyan-400">
            60 Hz Real-Time Synchronization
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {pipelineStages.map((stage, idx) => {
            const Icon = stage.icon;
            const isHighlight = stage.name === 'REAL-TIME REPLANNING' && replanningActive;
            return (
              <div
                key={stage.name}
                className={`p-3 rounded-xl border text-center transition-all ${
                  isHighlight
                    ? 'bg-amber-950/80 border-amber-500 text-amber-300 shadow-lg shadow-amber-950/60 animate-pulse'
                    : 'bg-[#080e1e] border-slate-800/90 text-slate-300'
                }`}
              >
                <div className="flex justify-center mb-1.5">
                  <div className={`p-1.5 rounded-lg ${isHighlight ? 'bg-amber-900/60 text-amber-400' : 'bg-slate-800 text-cyan-400'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-[10px] font-mono font-bold leading-tight">
                  {stage.name}
                </div>
                <div className="text-[9px] text-slate-500 mt-1 font-mono">
                  Stage {idx + 1}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Live Simulation Mini-Preview + Live Navigation Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Road Visualization Mini-Stage */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>Active Road & Route Visualizer</span>
            </div>
            <button
              onClick={() => navigateToSection('simulation')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1"
            >
              <span>Full Screen Simulation</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <RoadCanvas showControlsOverlay={true} />
        </div>

        {/* Live Navigation & Scenario Details Card */}
        <div className="space-y-4">
          {/* Navigation HUD Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900/95 to-[#080e1e] border border-cyan-900/40 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold">
                <Navigation className="w-4 h-4 text-cyan-400" />
                <span>LIVE NAVIGATION</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono text-[10px] border border-cyan-800/60">
                ACTIVE GPS ROUTE
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-[10px] font-mono text-slate-400 uppercase">CURRENT ROAD</div>
                <div className="text-sm font-bold text-white mt-0.5">
                  {currentScenario.currentRoadName}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-[10px] font-mono text-cyan-400 uppercase">NEXT DIRECTION</div>
                <div className="text-base font-extrabold text-cyan-300 mt-0.5">
                  {currentScenario.nextDirection}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <div className="text-[10px] font-mono text-slate-400">DISTANCE</div>
                  <div className="text-sm font-bold font-mono text-white mt-0.5">
                    {currentScenario.nextDistance}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-slate-400">DESTINATION</div>
                  <div className="text-sm font-bold font-mono text-white mt-0.5">
                    {currentScenario.totalDistance}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-800/60">
                <div>
                  <div className="text-[10px] font-mono text-slate-400">CURRENT SPEED</div>
                  <div className="text-sm font-bold font-mono text-cyan-400 mt-0.5">
                    {vehicle.speed} km/h
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-slate-400">ETA</div>
                  <div className="text-sm font-bold font-mono text-emerald-400 mt-0.5">
                    {currentScenario.eta}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Decision Summary Card */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="text-[11px] font-mono text-slate-400 uppercase">
              AI DECISION STATUS
            </div>
            <div className="text-sm font-bold text-cyan-300 font-mono">
              {decision}
            </div>
            <div className="text-xs text-slate-400 leading-relaxed">
              {currentScenario.description}
            </div>
          </div>
        </div>
      </div>

      {/* 6. Unstructured Indian Road Problem Specialization */}
      <div className="p-6 rounded-2xl bg-[#091124] border border-slate-800/90 space-y-4">
        <div>
          <h4 className="text-lg font-bold text-white">
            Designed Specifically for Unstructured Indian Road Conditions
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Standard Western autonomous algorithms fail when road lane markings vanish and heterogeneous mixed traffic takes over.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
            <div className="font-bold text-cyan-300 mb-1">Missing / Worn Lane Markings</div>
            <div className="text-slate-400 text-[11px] leading-relaxed">
              Synthesizes dynamic drivable road boundaries using roadside texture segmentation and elevation drop detection.
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
            <div className="font-bold text-cyan-300 mb-1">Unpredictable Auto-Rickshaws & Bikes</div>
            <div className="text-slate-400 text-[11px] leading-relaxed">
              Short-horizon intent modeling predicting sudden lane-weaving, unindicated right cuts, and opportunistic merges.
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
            <div className="font-bold text-cyan-300 mb-1">Pushcarts & Unmarked Pedestrians</div>
            <div className="text-slate-400 text-[11px] leading-relaxed">
              Dynamic lateral replanning maintaining safe 1.8m buffer around slow manual carts and pedestrians.
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
            <div className="font-bold text-cyan-300 mb-1">Sudden Livestock & Cattle Crossing</div>
            <div className="text-slate-400 text-[11px] leading-relaxed">
              Sub-second thermal and LiDAR cross-detection with emergency deceleration and non-threatening lateral detour.
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
            <div className="font-bold text-cyan-300 mb-1">Un-signaled 4-Way Junctions</div>
            <div className="text-slate-400 text-[11px] leading-relaxed">
              Probabilistic collision time-to-impact (TTC) yield calculator resolving deadlocks without traffic lights.
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
            <div className="font-bold text-cyan-300 mb-1">Single Active Route Guarantee</div>
            <div className="text-slate-400 text-[11px] leading-relaxed">
              Never displays confusing competing paths. The active blue route morphs smoothly to guide vehicle actuation.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
