export type ScenarioId = 'village' | 'intersection' | 'highway' | 'market' | 'cattle';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type AIDecision = 
  | 'NORMAL DRIVING'
  | 'SLOW DOWN'
  | 'YIELD'
  | 'REPLANNING'
  | 'EMERGENCY BRAKING'
  | 'AVOIDANCE MANEUVER'
  | 'SAFE PATH GENERATED';

export type ObjectType = 
  | 'car'
  | 'auto'
  | 'bike'
  | 'pedestrian'
  | 'cow'
  | 'pushcart'
  | 'truck'
  | 'bus';

export interface Waypoint {
  x: number;
  y: number;
  label?: string;
  speedLimit?: number;
}

export interface DetectedObject {
  id: string;
  type: ObjectType;
  name: string;
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  width: number;
  height: number;
  distance: number; // in meters
  relativeSpeed: number; // in km/h
  risk: RiskLevel;
  predictedMovement: string;
  heading: number; // degrees
  laneOrLocation: string;
  isTriggerObstacle?: boolean;
}

export interface ScenarioDefinition {
  id: ScenarioId;
  number: number;
  name: string;
  subtitle: string;
  environmentType: string;
  description: string;
  difficulty: 'Moderate' | 'High' | 'Extreme';
  speedRange: string;
  defaultSpeed: number;
  initialRisk: RiskLevel;
  initialDecision: AIDecision;
  currentRoadName: string;
  nextDirection: string;
  nextDistance: string;
  totalDistance: string;
  eta: string;
  keyChallenges: string[];
  objectsSummary: string[];
  // Road polygon or boundary paths for canvas drawing
  roadGeometry: {
    type: 'curved_road' | 'intersection' | 'highway_merge' | 'market_street';
    width: number;
    shoulderType: 'dirt' | 'curb' | 'paved' | 'market_stalls';
    centerlineStyle: 'none' | 'faded_broken' | 'solid_white' | 'none_crowded';
    landmarks: Array<{
      type: 'tree' | 'hut' | 'stall' | 'sign' | 'building' | 'divider';
      x: number;
      y: number;
      label?: string;
    }>;
  };
  // Base default blue route waypoints
  baseRoute: Waypoint[];
  // Replanned alternative blue route waypoints (activates when obstacle triggers)
  replannedRoute: Waypoint[];
  // Initial objects in the scene
  initialObjects: DetectedObject[];
  // Trigger event configuration
  triggerEvent: {
    atProgress: number; // 0.0 to 1.0 along the route
    obstacleId: string;
    alertTitle: string;
    alertMessage: string;
    decision: AIDecision;
    targetRisk: RiskLevel;
    replanDelayMs: number;
  };
}

export interface EventLogEntry {
  id: string;
  timestamp: string;
  timeSec: number;
  message: string;
  type: 'info' | 'warning' | 'danger' | 'success' | 'replan';
}

export interface SensorStatus {
  camera: { status: 'ACTIVE' | 'CALIBRATING' | 'ERROR'; confidence: number; fps: number };
  lidar: { status: 'ACTIVE' | 'STANDBY'; rangeMeters: number; pointsPerSec: string };
  radar: { status: 'ACTIVE' | 'TRACKING'; trackedCount: number; frequencyGhz: number };
  ultrasonic: { status: 'ACTIVE' | 'CLEAR'; minDistanceM: number };
  sensorFusion: 'ACTIVE' | 'DEGRADED';
  objectTracking: 'ACTIVE' | 'SYNCHRONIZING';
  motionPrediction: 'ACTIVE' | 'COMPUTING';
  pathPlanner: 'ACTIVE' | 'REPLANNING';
  vehicleController: 'ACTIVE' | 'HOLD';
}

export interface PerformanceMetrics {
  scenarioCompletionRate: number; // e.g. 100%
  collisionRate: number; // e.g. 0.0%
  replanningLatencyMs: number; // e.g. 142 ms
  pathSmoothnessPct: number; // e.g. 94.5%
  safeDistanceCompliancePct: number; // e.g. 99.8%
  obstacleDetectionAccuracyPct: number; // e.g. 96.2%
  emergencyResponseTimeSec: number; // e.g. 0.74s
}

export interface SimulationSettings {
  simulationSpeed: 'slow' | 'normal' | 'fast';
  autoReplanning: boolean;
  sensorFusion: boolean;
  detectionBoxes: boolean;
  showRoute: boolean;
  demoMode: boolean;
  weatherCondition: 'clear' | 'monsoon' | 'dusty';
}
