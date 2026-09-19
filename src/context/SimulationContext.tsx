import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import {
  ScenarioId,
  ScenarioDefinition,
  DetectedObject,
  Waypoint,
  RiskLevel,
  AIDecision,
  SensorStatus,
  PerformanceMetrics,
  SimulationSettings,
  EventLogEntry
} from '../types';
import { SCENARIOS } from '../data/scenarios';
import { getPointAlongPath } from '../utils/geometry';

interface VehicleState {
  x: number;
  y: number;
  heading: number;
  speed: number; // km/h
  progress: number; // 0 to 1
  throttle: number; // 0 to 100 %
  brake: number; // 0 to 100 %
  steeringAngle: number; // degrees (-30 to +30)
}

interface SimulationContextType {
  currentScenario: ScenarioDefinition;
  simulationRunning: boolean;
  simulationTimeSec: number;
  simulationTimeFormatted: string;
  vehicle: VehicleState;
  activeRoute: Waypoint[];
  isReplanned: boolean;
  replanningActive: boolean;
  emergencyBrakingActive: boolean;
  detectedObjects: DetectedObject[];
  riskLevel: RiskLevel;
  decision: AIDecision;
  sensors: SensorStatus;
  metrics: PerformanceMetrics;
  settings: SimulationSettings;
  eventLog: EventLogEntry[];
  currentSection: string;
  loadScenario: (scenarioId: ScenarioId, autoStart?: boolean) => void;
  startSimulation: () => void;
  stopSimulation: () => void;
  resetSimulation: () => void;
  triggerDemoMode: () => void;
  updateSettings: (newSettings: Partial<SimulationSettings>) => void;
  addEvent: (message: string, type?: EventLogEntry['type']) => void;
  navigateToSection: (section: string) => void;
  forceReplan: () => void;
}

const defaultSensors: SensorStatus = {
  camera: { status: 'ACTIVE', confidence: 98.4, fps: 60 },
  lidar: { status: 'ACTIVE', rangeMeters: 80, pointsPerSec: '1.2M' },
  radar: { status: 'ACTIVE', trackedCount: 24, frequencyGhz: 77 },
  ultrasonic: { status: 'ACTIVE', minDistanceM: 4.8 },
  sensorFusion: 'ACTIVE',
  objectTracking: 'ACTIVE',
  motionPrediction: 'ACTIVE',
  pathPlanner: 'ACTIVE',
  vehicleController: 'ACTIVE'
};

const defaultMetrics: PerformanceMetrics = {
  scenarioCompletionRate: 100,
  collisionRate: 0.0,
  replanningLatencyMs: 142,
  pathSmoothnessPct: 94.6,
  safeDistanceCompliancePct: 99.8,
  obstacleDetectionAccuracyPct: 96.4,
  emergencyResponseTimeSec: 0.74
};

const defaultSettings: SimulationSettings = {
  simulationSpeed: 'normal',
  autoReplanning: true,
  sensorFusion: true,
  detectionBoxes: true,
  showRoute: true,
  demoMode: false,
  weatherCondition: 'clear'
};

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScenarioId, setCurrentScenarioId] = useState<ScenarioId>('village');
  const [simulationRunning, setSimulationRunning] = useState<boolean>(false);
  const [simulationTimeSec, setSimulationTimeSec] = useState<number>(0);
  const [currentSection, setCurrentSection] = useState<string>('dashboard');

  const scenario = SCENARIOS[currentScenarioId];

  // Active route state - strictly ONE route
  const [activeRoute, setActiveRoute] = useState<Waypoint[]>(scenario.baseRoute);
  const [isReplanned, setIsReplanned] = useState<boolean>(false);
  const [replanningActive, setReplanningActive] = useState<boolean>(false);
  const [emergencyBrakingActive, setEmergencyBrakingActive] = useState<boolean>(false);

  // Vehicle state
  const initialPoint = getPointAlongPath(scenario.baseRoute, 0);
  const [vehicle, setVehicle] = useState<VehicleState>({
    x: initialPoint.x,
    y: initialPoint.y,
    heading: initialPoint.heading,
    speed: scenario.defaultSpeed,
    progress: 0,
    throttle: 65,
    brake: 0,
    steeringAngle: 0
  });

  // Objects in environment
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>(scenario.initialObjects);

  // Risk and Decision
  const [riskLevel, setRiskLevel] = useState<RiskLevel>(scenario.initialRisk);
  const [decision, setDecision] = useState<AIDecision>(scenario.initialDecision);

  // Hardware and pipeline status
  const [sensors, setSensors] = useState<SensorStatus>(defaultSensors);
  const [metrics, setMetrics] = useState<PerformanceMetrics>(defaultMetrics);
  const [settings, setSettings] = useState<SimulationSettings>(defaultSettings);

  // Event Log (newest first)
  const [eventLog, setEventLog] = useState<EventLogEntry[]>([
    {
      id: 'init-1',
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      timeSec: 0,
      message: `System initialized. Loaded scenario: ${scenario.name}`,
      type: 'info'
    },
    {
      id: 'init-2',
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      timeSec: 0,
      message: `Single active GPS-style blue path synthesized with ${scenario.baseRoute.length} road-aligned waypoints`,
      type: 'info'
    }
  ]);

  // Handle hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (hash) {
        setCurrentSection(hash);
      } else {
        setCurrentSection('dashboard');
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToSection = (section: string) => {
    const sanitized = section.replace('#/', '').replace('#', '');
    window.location.hash = `#/${sanitized}`;
    setCurrentSection(sanitized);
  };

  const addEvent = useCallback((message: string, type: EventLogEntry['type'] = 'info') => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
    setEventLog(prev => [
      {
        id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: timeStr,
        timeSec: simulationTimeSec,
        message,
        type
      },
      ...prev.slice(0, 49) // Keep last 50 events
    ]);
  }, [simulationTimeSec]);

  // Load Scenario cleanly
  const loadScenario = useCallback((newScenarioId: ScenarioId, autoStart = false) => {
    const newScen = SCENARIOS[newScenarioId];
    setCurrentScenarioId(newScenarioId);
    setSimulationRunning(false);
    setSimulationTimeSec(0);
    setIsReplanned(false);
    setReplanningActive(false);
    setEmergencyBrakingActive(false);

    setActiveRoute(newScen.baseRoute);
    const startPt = getPointAlongPath(newScen.baseRoute, 0);
    setVehicle({
      x: startPt.x,
      y: startPt.y,
      heading: startPt.heading,
      speed: newScen.defaultSpeed,
      progress: 0,
      throttle: 65,
      brake: 0,
      steeringAngle: 0
    });

    setDetectedObjects(newScen.initialObjects.map(obj => ({ ...obj })));
    setRiskLevel(newScen.initialRisk);
    setDecision(newScen.initialDecision);

    // Update scenario-adjusted metrics
    const scenarioLatency = newScenarioId === 'cattle' ? 118 : newScenarioId === 'highway' ? 154 : 142;
    setMetrics(prev => ({
      ...prev,
      replanningLatencyMs: scenarioLatency,
      emergencyResponseTimeSec: newScenarioId === 'cattle' ? 0.68 : 0.76
    }));

    addEvent(`Scenario switched to: ${newScen.name} (${newScen.speedRange})`, 'info');
    addEvent(`Road geometry loaded: ${newScen.roadGeometry.type} with ${newScen.roadGeometry.shoulderType} boundary`, 'info');

    if (autoStart) {
      setTimeout(() => {
        setSimulationRunning(true);
        addEvent(`Simulation auto-started for ${newScen.name}`, 'info');
      }, 100);
    }
  }, [addEvent]);

  const startSimulation = () => {
    setSimulationRunning(true);
    addEvent(`Simulation execution initiated. Autonomous controller active.`, 'info');
  };

  const stopSimulation = () => {
    setSimulationRunning(false);
    addEvent(`Simulation execution paused by operator.`, 'warning');
  };

  const resetSimulation = () => {
    const scen = SCENARIOS[currentScenarioId];
    setSimulationRunning(false);
    setSimulationTimeSec(0);
    setIsReplanned(false);
    setReplanningActive(false);
    setEmergencyBrakingActive(false);

    setActiveRoute(scen.baseRoute);
    const startPt = getPointAlongPath(scen.baseRoute, 0);
    setVehicle({
      x: startPt.x,
      y: startPt.y,
      heading: startPt.heading,
      speed: scen.defaultSpeed,
      progress: 0,
      throttle: 65,
      brake: 0,
      steeringAngle: 0
    });

    setDetectedObjects(scen.initialObjects.map(obj => ({ ...obj })));
    setRiskLevel(scen.initialRisk);
    setDecision(scen.initialDecision);

    addEvent(`Simulation reset to initial state for ${scen.name}`, 'info');
  };

  const forceReplan = () => {
    if (isReplanned) return;
    const scen = SCENARIOS[currentScenarioId];
    setReplanningActive(true);
    setDecision('REPLANNING');
    setRiskLevel('HIGH');
    addEvent(`Manual operator triggered dynamic path replanning.`, 'replan');

    setTimeout(() => {
      setActiveRoute(scen.replannedRoute);
      setIsReplanned(true);
      setReplanningActive(false);
      setDecision('SAFE PATH GENERATED');
      setRiskLevel('LOW');
      addEvent(`New collision-free route generated. Active path geometry updated.`, 'success');
    }, 600);
  };

  const triggerDemoMode = () => {
    setSettings(s => ({ ...s, demoMode: true }));
    loadScenario('cattle', true);
    navigateToSection('simulation');
    addEvent(`HACKATHON DEMO MODE activated: Running Cattle Crossing automated showcase.`, 'info');
  };

  const updateSettings = (newSettings: Partial<SimulationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    addEvent(`System settings updated: ${Object.keys(newSettings).join(', ')}`, 'info');
  };

  // Main simulation loop ref
  const animFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const secondTimerRef = useRef<number>(0);

  // Trigger state guards
  const triggerFiredRef = useRef<boolean>(false);
  useEffect(() => {
    triggerFiredRef.current = false;
  }, [currentScenarioId]);

  useEffect(() => {
    if (!simulationRunning) {
      lastTimestampRef.current = null;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      return;
    }

    const speedMultiplier = settings.simulationSpeed === 'slow' ? 0.5 : settings.simulationSpeed === 'fast' ? 2.0 : 1.0;

    const loop = (timestamp: number) => {
      if (!lastTimestampRef.current) {
        lastTimestampRef.current = timestamp;
      }
      const deltaMs = Math.min(100, timestamp - lastTimestampRef.current);
      lastTimestampRef.current = timestamp;

      // Update simulation second counter
      secondTimerRef.current += deltaMs;
      if (secondTimerRef.current >= 1000) {
        setSimulationTimeSec(s => s + 1);
        secondTimerRef.current -= 1000;
      }

      // Compute progress increment
      // Whole path traversal takes ~20 seconds at normal speed
      const baseProgressStep = (deltaMs / 22000) * speedMultiplier;

      setVehicle(prevVeh => {
        let currentSpeed = prevVeh.speed;
        let currentThrottle = prevVeh.throttle;
        let currentBrake = prevVeh.brake;

        // Check if approaching trigger event
        const trigger = scenario.triggerEvent;
        const reachedTrigger = prevVeh.progress >= trigger.atProgress && !triggerFiredRef.current;

        if (reachedTrigger) {
          triggerFiredRef.current = true;
          // Trigger obstacle event
          setRiskLevel(trigger.targetRisk);
          setDecision(trigger.decision);

          if (currentScenarioId === 'cattle') {
            setEmergencyBrakingActive(true);
            addEvent(`⚠ ${trigger.alertTitle}`, 'danger');
            addEvent(trigger.alertMessage, 'warning');
            addEvent(`Deceleration command: -6.8 m/s² (EMERGENCY BRAKING)`, 'danger');
          } else {
            addEvent(`${trigger.alertTitle}`, 'warning');
            addEvent(trigger.alertMessage, 'info');
          }

          // Schedule path replanning
          setTimeout(() => {
            setReplanningActive(true);
            setDecision('REPLANNING');
            addEvent(`Cost-function evaluation: J_lateral + J_obstacle + J_smoothness computed`, 'replan');
            addEvent(`Frenet trajectory replanning underway. Replacing active route...`, 'replan');

            setTimeout(() => {
              setActiveRoute(scenario.replannedRoute);
              setIsReplanned(true);
              setReplanningActive(false);
              setEmergencyBrakingActive(false);
              setDecision('SAFE PATH GENERATED');
              setRiskLevel('MEDIUM');
              addEvent(`Single blue active route geometry updated. Collision avoidance active.`, 'success');

              setTimeout(() => {
                setDecision('NORMAL DRIVING');
                setRiskLevel('LOW');
                addEvent(`Vehicle resumed normal driving along replanned route.`, 'success');
              }, 1200);
            }, trigger.replanDelayMs);
          }, 600);
        }

        // Adjust speed and braking dynamics
        if (emergencyBrakingActive) {
          currentSpeed = Math.max(0, currentSpeed - (deltaMs * 0.08));
          currentThrottle = 0;
          currentBrake = 100;
        } else if (replanningActive) {
          currentSpeed = Math.max(12, currentSpeed - (deltaMs * 0.03));
          currentThrottle = 20;
          currentBrake = 40;
        } else if (isReplanned) {
          // Speed recovery
          if (currentSpeed < scenario.defaultSpeed) {
            currentSpeed = Math.min(scenario.defaultSpeed, currentSpeed + (deltaMs * 0.02));
            currentThrottle = 70;
            currentBrake = 0;
          }
        }

        // Calculate new progress along activeRoute
        const speedFactor = currentSpeed > 0 ? (currentSpeed / scenario.defaultSpeed) : 0;
        const newProgress = Math.min(1.0, prevVeh.progress + (baseProgressStep * speedFactor));

        const pointData = getPointAlongPath(activeRoute, newProgress);
        const steeringDelta = Math.max(-25, Math.min(25, (pointData.heading - prevVeh.heading) * 1.5));

        if (newProgress >= 1.0 && prevVeh.progress < 1.0) {
          // Destination reached!
          setSimulationRunning(false);
          setDecision('NORMAL DRIVING');
          setRiskLevel('LOW');
          addEvent(`Destination waypoint reached safely. Zero collisions registered.`, 'success');
        }

        return {
          x: pointData.x,
          y: pointData.y,
          heading: pointData.heading,
          speed: Math.round(currentSpeed * 10) / 10,
          progress: newProgress,
          throttle: Math.round(currentThrottle),
          brake: Math.round(currentBrake),
          steeringAngle: Math.round(steeringDelta * 10) / 10
        };
      });

      // Animate detected objects slightly for realistic organic motion
      setDetectedObjects(prevObjs =>
        prevObjs.map(obj => {
          let nx = obj.x;
          let ny = obj.y;
          if (obj.vx) nx += obj.vx * 0.15;
          if (obj.vy) ny += obj.vy * 0.15;

          // Compute distance to vehicle
          const dx = nx - vehicle.x;
          const dy = ny - vehicle.y;
          const distMeters = Math.max(3, Math.round(Math.sqrt(dx * dx + dy * dy) * 0.12 * 10) / 10);

          return {
            ...obj,
            x: nx,
            y: ny,
            distance: distMeters
          };
        })
      );

      // Pulse sensors
      setSensors(prev => ({
        ...prev,
        camera: { ...prev.camera, confidence: Math.round((98 + Math.sin(timestamp / 500) * 1.2) * 10) / 10 },
        radar: { ...prev.radar, trackedCount: 22 + Math.floor(Math.sin(timestamp / 800) * 3) }
      }));

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [
    simulationRunning,
    settings.simulationSpeed,
    scenario,
    currentScenarioId,
    activeRoute,
    emergencyBrakingActive,
    replanningActive,
    isReplanned,
    addEvent,
    vehicle.x,
    vehicle.y
  ]);

  const formatSimulationTime = (totalSeconds: number): string => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SimulationContext.Provider
      value={{
        currentScenario: scenario,
        simulationRunning,
        simulationTimeSec,
        simulationTimeFormatted: formatSimulationTime(simulationTimeSec),
        vehicle,
        activeRoute,
        isReplanned,
        replanningActive,
        emergencyBrakingActive,
        detectedObjects,
        riskLevel,
        decision,
        sensors,
        metrics,
        settings,
        eventLog,
        currentSection,
        loadScenario,
        startSimulation,
        stopSimulation,
        resetSimulation,
        triggerDemoMode,
        updateSettings,
        addEvent,
        navigateToSection,
        forceReplan
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = (): SimulationContextType => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};
