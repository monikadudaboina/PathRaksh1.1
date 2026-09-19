import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import {
  Camera,
  Radio,
  Wifi,
  Cpu,
  Layers,
  Activity,
  CheckCircle2,
  Scan,
  ShieldCheck,
  Zap,
  TrendingUp,
  Brain,
  GitMerge,
  Sliders
} from 'lucide-react';

export const SensorFusionView: React.FC = () => {
  const { sensors, simulationRunning } = useSimulation();

  const primarySensors = [
    {
      name: 'CAMERA (4K HDR SURROUND)',
      icon: Camera,
      status: sensors.camera.status,
      metric1: `Confidence: ${sensors.camera.confidence}%`,
      metric2: `Refresh: ${sensors.camera.fps} FPS`,
      role: 'Optical semantic segmentation, pavement edge boundary detection, pedestrian and animal silhouette classification.'
    },
    {
      name: 'LiDAR (32-BEAM SOLID STATE)',
      icon: Scan,
      status: sensors.lidar.status,
      metric1: `Range: ${sensors.lidar.rangeMeters}m`,
      metric2: `Points: ${sensors.lidar.pointsPerSec}/s`,
      role: 'High-precision 3D spatial depth mapping, road elevation drop profiling, obstacle point-cloud geometry.'
    },
    {
      name: 'RADAR (77 GHz DOPPLER)',
      icon: Radio,
      status: sensors.radar.status,
      metric1: `Tracking: ${sensors.radar.trackedCount} objects`,
      metric2: `Frequency: ${sensors.radar.frequencyGhz} GHz`,
      role: 'Instantaneous relative velocity estimation, adverse weather penetration (monsoon rain, heavy dust/smog).'
    },
    {
      name: 'ULTRASONIC PERIMETER',
      icon: Wifi,
      status: sensors.ultrasonic.status,
      metric1: `Min Range: ${sensors.ultrasonic.minDistanceM}m`,
      metric2: 'Perimeter: 360° Ring',
      role: 'Near-field curb proximity, squeeze margin verification in crowded bazaars and tight auto-rickshaw overtakes.'
    }
  ];

  const systemModules = [
    { name: 'SENSOR FUSION', status: sensors.sensorFusion, role: 'Kalman Filter & Bayesian Spatial Fusion' },
    { name: 'OBJECT TRACKING', status: sensors.objectTracking, role: 'Hungarian Data Association & Track IDs' },
    { name: 'MOTION PREDICTION', status: sensors.motionPrediction, role: 'Unstructured Indian Traffic Trajectory Model' },
    { name: 'PATH PLANNER', status: sensors.pathPlanner, role: 'Dubins & Frenet Frame Collision-Free Optimization' },
    { name: 'VEHICLE CONTROLLER', status: sensors.vehicleController, role: 'Model Predictive Control (MPC) Steer & Speed' }
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-[#091124] to-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold">
          <Cpu className="w-4 h-4" />
          <span>MULTI-MODAL PERCEPTION SUITE</span>
        </div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight mt-1">
          Sensor Fusion Architecture
        </h2>
        <p className="text-sm text-slate-400 max-w-3xl mt-1">
          Indian road conditions demand redundant multi-modal sensor fusion. When lane lines disappear, the system combines Camera optical boundaries, LiDAR 3D point-cloud curbs, and Doppler Radar relative velocities to maintain a single collision-free drivable corridor.
        </p>
      </div>

      {/* Primary 4 Hardware Sensors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {primarySensors.map(sensor => {
          const Icon = sensor.icon;
          return (
            <div
              key={sensor.name}
              className="p-5 rounded-2xl bg-[#080f22] border border-slate-800 shadow-lg space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono font-bold">
                    <span className={`w-1.5 h-1.5 rounded-full bg-emerald-400 ${simulationRunning ? 'animate-pulse' : ''}`}></span>
                    <span>{sensor.status}</span>
                  </span>
                </div>

                <div className="text-xs font-bold text-white font-mono mt-3">
                  {sensor.name}
                </div>

                <div className="mt-2 space-y-1 font-mono text-xs">
                  <div className="text-cyan-300 font-bold">{sensor.metric1}</div>
                  <div className="text-slate-400 text-[11px]">{sensor.metric2}</div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 leading-relaxed pt-3 border-t border-slate-800/80">
                {sensor.role}
              </div>
            </div>
          );
        })}
      </div>

      {/* System Core AI Pipeline Status Modules */}
      <div className="p-6 rounded-2xl bg-[#080f22] border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Autonomous Software Modules</span>
          </h3>
          <span className="text-xs font-mono text-cyan-400">All Nodes Synchronized @ 60 Hz</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {systemModules.map(mod => (
            <div
              key={mod.name}
              className="p-4 rounded-xl bg-slate-950/80 border border-slate-850 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500 uppercase">Module</span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full bg-emerald-400 ${simulationRunning ? 'animate-ping' : ''}`}></span>
                  <span>{mod.status}</span>
                </span>
              </div>
              <div className="text-xs font-bold text-white font-mono">
                {mod.name}
              </div>
              <div className="text-[10px] text-slate-400 leading-snug">
                {mod.role}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sensor Fusion Technical Specifications for Judges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#080f22] border border-slate-800 space-y-2">
          <div className="text-xs font-mono text-cyan-400 uppercase font-bold">
            1. Spatial-Temporal Alignment
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Camera and LiDAR coordinate systems are calibrated to a common vehicle center frame using extrinsic transformation matrices T_cam_to_lidar, enabling instant 3D bounding box projection onto optical camera feeds.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#080f22] border border-slate-800 space-y-2">
          <div className="text-xs font-mono text-cyan-400 uppercase font-bold">
            2. Heterogeneous Entity Modeling
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Tailored neural classification models trained specifically on Indian objects (auto-rickshaws, pushcarts, non-standard bicycles, cattle, cycle-rickshaws) that are often misclassified by Western self-driving models.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#080f22] border border-slate-800 space-y-2">
          <div className="text-xs font-mono text-cyan-400 uppercase font-bold">
            3. Graceful Sensor Degradation
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            If heavy dust or monsoon rain impairs camera vision (&lt;70% confidence), radar doppler reflections and LiDAR proximity immediately take primary weight in the dynamic cost-function evaluation.
          </p>
        </div>
      </div>
    </div>
  );
};
