import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Sliders, Sparkles, CheckCircle2, RotateCcw, Shield } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, resetSimulation, addEvent } = useSimulation();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0a1226] to-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold">
          <Sliders className="w-4 h-4" />
          <span>SIMULATION PARAMETERS & SENSOR TOGGLES</span>
        </div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight mt-1">
          System Settings & Simulation Controls
        </h2>
        <p className="text-sm text-slate-400 max-w-3xl mt-1">
          Configure real-time simulation speeds, sensor fusion visual overlays, bounding box displays, and autonomous path replanning behaviors. Changes take effect immediately in the live simulation canvas.
        </p>
      </div>

      {/* Settings Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1. Simulation Speed */}
        <div className="p-6 rounded-2xl bg-[#080f22] border border-slate-800 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white font-mono uppercase">Simulation Speed</span>
            <span className="text-xs font-mono text-cyan-400 uppercase font-bold">{settings.simulationSpeed}</span>
          </div>
          <p className="text-xs text-slate-400">
            Adjust the velocity time-step for vehicle motion and dynamic traffic obstacle movements.
          </p>

          <div className="grid grid-cols-3 gap-2 pt-2">
            {(['slow', 'normal', 'fast'] as const).map(speed => (
              <button
                key={speed}
                onClick={() => updateSettings({ simulationSpeed: speed })}
                className={`py-2.5 rounded-xl font-mono text-xs font-bold transition ${
                  settings.simulationSpeed === speed
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950/50'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {speed === 'slow' ? 'Slow (0.5x)' : speed === 'normal' ? 'Normal (1x)' : 'Fast (2x)'}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Auto Replanning Toggle */}
        <div className="p-6 rounded-2xl bg-[#080f22] border border-slate-800 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white font-mono uppercase">Auto Replanning</span>
            <button
              onClick={() => updateSettings({ autoReplanning: !settings.autoReplanning })}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                settings.autoReplanning ? 'bg-cyan-600' : 'bg-slate-800'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.autoReplanning ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
          <p className="text-xs text-slate-400">
            When ON, triggers instant dynamic path re-routing around detected stationary or crossing obstacles on the road.
          </p>
          <div className="text-[11px] font-mono text-slate-400 pt-1">
            Status: <span className={settings.autoReplanning ? 'text-emerald-400 font-bold' : 'text-slate-500'}>{settings.autoReplanning ? 'AUTOMATED DYNAMIC REPLAN' : 'MANUAL OVERRIDE ONLY'}</span>
          </div>
        </div>

        {/* 3. Sensor Fusion Overlay */}
        <div className="p-6 rounded-2xl bg-[#080f22] border border-slate-800 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white font-mono uppercase">Sensor Fusion & Radar Cones</span>
            <button
              onClick={() => updateSettings({ sensorFusion: !settings.sensorFusion })}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                settings.sensorFusion ? 'bg-cyan-600' : 'bg-slate-800'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.sensorFusion ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
          <p className="text-xs text-slate-400">
            Displays forward radar perception sweeps, LiDAR 360-degree point-cloud arcs, and proximity buffer circles around the vehicle.
          </p>
          <div className="text-[11px] font-mono text-slate-400 pt-1">
            Status: <span className={settings.sensorFusion ? 'text-emerald-400 font-bold' : 'text-slate-500'}>{settings.sensorFusion ? 'PERCEPTION FIELD VISIBLE' : 'HIDDEN'}</span>
          </div>
        </div>

        {/* 4. Detection Bounding Boxes */}
        <div className="p-6 rounded-2xl bg-[#080f22] border border-slate-800 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white font-mono uppercase">Detection Bounding Boxes</span>
            <button
              onClick={() => updateSettings({ detectionBoxes: !settings.detectionBoxes })}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                settings.detectionBoxes ? 'bg-cyan-600' : 'bg-slate-800'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.detectionBoxes ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
          <p className="text-xs text-slate-400">
            Shows 2D bounding boxes with real-time distance tags [m] and motion vector arrows for auto-rickshaws, cattle, bicycles, and pushcarts.
          </p>
          <div className="text-[11px] font-mono text-slate-400 pt-1">
            Status: <span className={settings.detectionBoxes ? 'text-emerald-400 font-bold' : 'text-slate-500'}>{settings.detectionBoxes ? 'BOXES & TAGS ACTIVE' : 'MINIMALIST VIEW'}</span>
          </div>
        </div>

        {/* 5. Show Route Toggle */}
        <div className="p-6 rounded-2xl bg-[#080f22] border border-slate-800 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white font-mono uppercase">Show Active Blue Route</span>
            <button
              onClick={() => updateSettings({ showRoute: !settings.showRoute })}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                settings.showRoute ? 'bg-cyan-600' : 'bg-slate-800'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.showRoute ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
          <p className="text-xs text-slate-400">
            Displays the single solid blue GPS trajectory line with integrated direction arrows. (Strictly one route line).
          </p>
          <div className="text-[11px] font-mono text-slate-400 pt-1">
            Status: <span className={settings.showRoute ? 'text-emerald-400 font-bold' : 'text-slate-500'}>{settings.showRoute ? 'SOLID BLUE ROUTE DISPLAYED' : 'ROUTE HIDDEN'}</span>
          </div>
        </div>

        {/* 6. Hackathon Demo Mode */}
        <div className="p-6 rounded-2xl bg-[#080f22] border border-slate-800 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-xs font-bold text-white font-mono uppercase">Hackathon Demo Mode</span>
            </div>
            <button
              onClick={() => updateSettings({ demoMode: !settings.demoMode })}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                settings.demoMode ? 'bg-cyan-600' : 'bg-slate-800'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.demoMode ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
          <p className="text-xs text-slate-400">
            Auto-runs orchestrated showcase scenario with timed detection events and emergency braking sequence for judging demonstrations.
          </p>
          <div className="text-[11px] font-mono text-slate-400 pt-1">
            Status: <span className={settings.demoMode ? 'text-cyan-400 font-bold' : 'text-slate-500'}>{settings.demoMode ? 'DEMO MODE ACTIVE' : 'STANDARD SIMULATION'}</span>
          </div>
        </div>
      </div>

      {/* System Reset & Calibration Panel */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="text-xs font-bold text-white font-mono">Reset Simulation Stack</div>
          <div className="text-xs text-slate-400">Restores all waypoints, vehicle coordinates, and object states to defaults.</div>
        </div>
        <button
          onClick={() => {
            resetSimulation();
            addEvent('Operator triggered complete simulation stack reset', 'warning');
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
        >
          <RotateCcw className="w-4 h-4" />
          <span>RESET ALL STATES</span>
        </button>
      </div>
    </div>
  );
};
