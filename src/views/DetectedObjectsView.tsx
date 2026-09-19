import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Scan, TrendingUp, AlertTriangle, ShieldCheck, Filter } from 'lucide-react';

export const DetectedObjectsView: React.FC = () => {
  const { detectedObjects, currentScenario, riskLevel } = useSimulation();

  // Aggregate counts by type across current active objects
  const typeCounts = {
    car: detectedObjects.filter(o => o.type === 'car').length,
    auto: detectedObjects.filter(o => o.type === 'auto').length,
    bike: detectedObjects.filter(o => o.type === 'bike').length,
    pedestrian: detectedObjects.filter(o => o.type === 'pedestrian').length,
    cow: detectedObjects.filter(o => o.type === 'cow').length,
    pushcart: detectedObjects.filter(o => o.type === 'pushcart').length,
    truck: detectedObjects.filter(o => o.type === 'truck').length,
    bus: detectedObjects.filter(o => o.type === 'bus').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0a1226] to-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold">
          <Scan className="w-4 h-4" />
          <span>REAL-TIME TRACKED SURROUNDING ENTITIES</span>
        </div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight mt-1">
          Detected Objects & Motion Prediction
        </h2>
        <p className="text-sm text-slate-400 max-w-3xl mt-1">
          Active multi-object tracking for <strong>{currentScenario.name}</strong>. The system evaluates intent and velocity vectors for each unique vehicle or pedestrian class in the scene.
        </p>
      </div>

      {/* Aggregate Counts by Traffic Class Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
          <div className="text-[10px] font-mono text-slate-400 uppercase">CAR</div>
          <div className="text-xl font-bold font-mono text-cyan-400 mt-1">{typeCounts.car}</div>
          <div className="text-[10px] text-slate-500 font-mono">objects</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
          <div className="text-[10px] font-mono text-slate-400 uppercase">AUTO</div>
          <div className="text-xl font-bold font-mono text-yellow-400 mt-1">{typeCounts.auto}</div>
          <div className="text-[10px] text-slate-500 font-mono">3-wheelers</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
          <div className="text-[10px] font-mono text-slate-400 uppercase">BIKE</div>
          <div className="text-xl font-bold font-mono text-cyan-400 mt-1">{typeCounts.bike}</div>
          <div className="text-[10px] text-slate-500 font-mono">motorcycles</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
          <div className="text-[10px] font-mono text-slate-400 uppercase">PEDESTRIAN</div>
          <div className="text-xl font-bold font-mono text-cyan-400 mt-1">{typeCounts.pedestrian}</div>
          <div className="text-[10px] text-slate-500 font-mono">persons</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
          <div className="text-[10px] font-mono text-slate-400 uppercase">ANIMAL / COW</div>
          <div className="text-xl font-bold font-mono text-rose-400 mt-1">{typeCounts.cow}</div>
          <div className="text-[10px] text-slate-500 font-mono">cattle</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
          <div className="text-[10px] font-mono text-slate-400 uppercase">PUSHCART</div>
          <div className="text-xl font-bold font-mono text-amber-400 mt-1">{typeCounts.pushcart}</div>
          <div className="text-[10px] text-slate-500 font-mono">vendors</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
          <div className="text-[10px] font-mono text-slate-400 uppercase">TRUCK / BUS</div>
          <div className="text-xl font-bold font-mono text-orange-400 mt-1">{typeCounts.truck + typeCounts.bus}</div>
          <div className="text-[10px] text-slate-500 font-mono">heavy commercial</div>
        </div>
      </div>

      {/* Detailed Live Objects Table */}
      <div className="p-5 rounded-2xl bg-[#080f22] border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Scan className="w-4 h-4 text-cyan-400" />
            <span>Active Tracking List ({detectedObjects.length} Targets)</span>
          </div>
          <span className="text-xs font-mono text-cyan-400">Kalman Filter Estimated Trajectories</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="pb-3 font-semibold">ENTITY ID & TYPE</th>
                <th className="pb-3 font-semibold">CLASSIFICATION NAME</th>
                <th className="pb-3 font-semibold">DISTANCE</th>
                <th className="pb-3 font-semibold">REL. SPEED</th>
                <th className="pb-3 font-semibold">LOCATION / ZONE</th>
                <th className="pb-3 font-semibold">RISK LEVEL</th>
                <th className="pb-3 font-semibold">MOTION PREDICTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {detectedObjects.map(obj => {
                const riskBadge =
                  obj.risk === 'HIGH'
                    ? 'text-red-400 bg-red-950/80 border-red-800/80'
                    : obj.risk === 'MEDIUM'
                    ? 'text-amber-400 bg-amber-950/80 border-amber-800/80'
                    : 'text-emerald-400 bg-emerald-950/80 border-emerald-800/80';

                return (
                  <tr key={obj.id} className="hover:bg-slate-900/50 transition">
                    <td className="py-3 font-bold text-cyan-300">
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                        {obj.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 text-white font-sans font-semibold">
                      {obj.name}
                    </td>
                    <td className="py-3 text-cyan-400 font-bold">
                      {obj.distance} m
                    </td>
                    <td className="py-3 text-slate-300">
                      {obj.relativeSpeed > 0 ? `+${obj.relativeSpeed}` : obj.relativeSpeed} km/h
                    </td>
                    <td className="py-3 text-slate-400">
                      {obj.laneOrLocation}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${riskBadge}`}>
                        {obj.risk}
                      </span>
                    </td>
                    <td className="py-3 text-slate-300 font-sans text-xs max-w-xs">
                      {obj.predictedMovement}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Motion Prediction Architecture Section */}
      <div className="p-6 rounded-2xl bg-[#091124] border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-white">
            Unstructured Motion Prediction Engine
          </h3>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
          Unlike structured Western highways where cars stay inside lanes, Indian traffic entities move with high lateral entropy. Our model utilizes a <strong>Behavioral Intent Graph (BIG)</strong>:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-yellow-400 font-mono">Auto-Rickshaws</div>
            <div className="text-xs text-slate-400">
              Anticipates sudden curbside pull-overs, abrupt U-turns, and squeezing through narrow sub-2.2m gaps between heavy vehicles.
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-cyan-400 font-mono">Motorcycles & Scooters</div>
            <div className="text-xs text-slate-400">
              Models rapid lane-splitting trajectories and un-signaled lateral shifts to bypass potholes or water accumulation.
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-rose-400 font-mono">Cattle & Stray Animals</div>
            <div className="text-xs text-slate-400">
              Biomechanical gait tracking: cows often freeze under headlights or reverse direction unexpectedly when startled by acoustic noise.
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-amber-400 font-mono">Pedestrians & Pushcarts</div>
            <div className="text-xs text-slate-400">
              Predicts unmarked diagonal street crossings, roadside vendor cart stalls, and shoppers walking against oncoming traffic flow.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
