import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import {
  LayoutDashboard,
  Compass,
  Layers,
  Radio,
  Scan,
  GitFork,
  BarChart3,
  Sliders,
  Car,
  Activity,
  CheckCircle2,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { currentSection, navigateToSection, currentScenario, riskLevel, vehicle } = useSimulation();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'simulation', label: 'Live Simulation', icon: Compass, badge: 'LIVE' },
    { id: 'scenarios', label: 'Scenarios', icon: Layers, count: '5' },
    { id: 'sensors', label: 'Sensor Fusion', icon: Radio },
    { id: 'objects', label: 'Detected Objects', icon: Scan },
    { id: 'planning', label: 'Path Planning', icon: GitFork },
    { id: 'results', label: 'Results & Metrics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Sliders }
  ];

  const handleNavClick = (id: string) => {
    navigateToSection(id);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs"
          aria-hidden="true"
        />
      )}

      <aside
        id="main-sidebar"
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-72 bg-[#060b18] border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top: Branding */}
        <div>
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-md shadow-cyan-950/50">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white tracking-wide">
                  ADAPTIVE DRIVE
                </div>
                <div className="text-[10px] text-cyan-400 font-mono">
                  INDIAN ROADS ADAS v2.4
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scenario Quick Card */}
          <div className="p-4 mx-3 mt-4 rounded-xl bg-slate-900/90 border border-slate-800/80 shadow-inner">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
              <span>ACTIVE SCENARIO</span>
              <span className="text-cyan-400 font-semibold">#{currentScenario.number}/5</span>
            </div>
            <div className="text-xs font-semibold text-white truncate">
              {currentScenario.name}
            </div>
            <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono">
              <span className="text-slate-400">CRUISE: {currentScenario.defaultSpeed} km/h</span>
              <span
                className={`px-1.5 py-0.2 rounded font-bold ${
                  riskLevel === 'HIGH'
                    ? 'text-red-400 bg-red-950/60'
                    : riskLevel === 'MEDIUM'
                    ? 'text-amber-400 bg-amber-950/60'
                    : 'text-emerald-400 bg-emerald-950/60'
                }`}
              >
                {riskLevel}
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1 mt-2">
            <div className="px-3 py-1.5 text-[10px] font-mono tracking-wider text-slate-500 uppercase">
              Core Modules
            </div>

            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;

              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-950/60'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {item.badge}
                    </span>
                  )}
                  {item.count && (
                    <span className="text-[11px] font-mono text-slate-500">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Hardware & System Status Footer */}
        <div className="p-4 m-3 rounded-xl bg-slate-950/80 border border-slate-900 text-xs">
          <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400 mb-1">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>AI STACK: NOMINAL</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Frenet Planner & Sensor Fusion running at 60 Hz
          </div>
          <div className="mt-2 text-[10px] text-slate-500 font-mono flex items-center justify-between">
            <span>ODOMETRY</span>
            <span className="text-cyan-400">{(vehicle.progress * 1.8).toFixed(2)} km</span>
          </div>
        </div>
      </aside>
    </>
  );
};
