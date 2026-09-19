import React, { useState } from 'react';
import { SimulationProvider, useSimulation } from './context/SimulationContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './views/DashboardView';
import { SimulationView } from './views/SimulationView';
import { ScenariosView } from './views/ScenariosView';
import { SensorFusionView } from './views/SensorFusionView';
import { DetectedObjectsView } from './views/DetectedObjectsView';
import { PathPlanningView } from './views/PathPlanningView';
import { ResultsView } from './views/ResultsView';
import { SettingsView } from './views/SettingsView';

const MainAppContent: React.FC = () => {
  const { currentSection } = useSimulation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderActiveSection = () => {
    switch (currentSection) {
      case 'simulation':
        return <SimulationView />;
      case 'scenarios':
        return <ScenariosView />;
      case 'sensors':
        return <SensorFusionView />;
      case 'objects':
        return <DetectedObjectsView />;
      case 'planning':
        return <PathPlanningView />;
      case 'results':
        return <ResultsView />;
      case 'settings':
        return <SettingsView />;
      case 'dashboard':
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#040814] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Header */}
      <Header onToggleSidebar={() => setSidebarOpen(prev => !prev)} />

      {/* Main Container: Sidebar + Page View */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-[#050b18] via-[#040814] to-[#030610]">
          <div className="max-w-7xl mx-auto space-y-6">
            {renderActiveSection()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <SimulationProvider>
      <MainAppContent />
    </SimulationProvider>
  );
}
