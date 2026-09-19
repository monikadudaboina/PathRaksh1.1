import { ScenarioDefinition, ScenarioId } from '../types';

export const SCENARIOS: Record<ScenarioId, ScenarioDefinition> = {
  village: {
    id: 'village',
    number: 1,
    name: 'Village Road - Unmarked',
    subtitle: 'Narrow winding rural path with missing lane markings and sudden domestic animal straying',
    environmentType: 'Unpaved rural village stretch with kachha/earthen shoulders and scattered mud huts',
    description: 'Narrow winding Indian village road without center or edge markings. Features sudden pedestrian crossings, stray cows near the ditch, and oncoming two-wheelers taking wide turns.',
    difficulty: 'Moderate',
    speedRange: '20-35 km/h',
    defaultSpeed: 28,
    initialRisk: 'LOW',
    initialDecision: 'NORMAL DRIVING',
    currentRoadName: 'Village Link Road (Rampur-Kheri)',
    nextDirection: '↑ Continue Winding Road',
    nextDistance: '180 m',
    totalDistance: '1.4 km',
    eta: '03:12',
    keyChallenges: [
      'Zero road markings or retroreflective studs',
      'Unpaved dirt shoulders with sudden 15cm road-edge drops',
      'Stray cattle grazing close to drivable surface',
      'Mixed traffic: bicycles, pedestrians with loads, oncoming motorcycles'
    ],
    objectsSummary: ['Pedestrian (child)', 'Motorcycle (Hero Splendor)', 'Stray Cow (Desi humped)', 'Bicycle'],
    roadGeometry: {
      type: 'curved_road',
      width: 140,
      shoulderType: 'dirt',
      centerlineStyle: 'none',
      landmarks: [
        { type: 'tree', x: 120, y: 140, label: 'Banyan Tree' },
        { type: 'hut', x: 260, y: 110, label: 'Village Hut' },
        { type: 'tree', x: 420, y: 480, label: 'Neem Tree' },
        { type: 'hut', x: 620, y: 150, label: 'Tea Stall' },
        { type: 'tree', x: 780, y: 510, label: 'Peepal Tree' },
        { type: 'hut', x: 920, y: 130, label: 'Farm Shed' }
      ]
    },
    // Winding path through the canvas (1000 x 600)
    baseRoute: [
      { x: 50, y: 320, label: 'Start' },
      { x: 180, y: 310 },
      { x: 320, y: 280 },
      { x: 460, y: 300 }, // Obstacle location near x=540, y=310
      { x: 550, y: 310 }, // Directly blocked by stray cow / pedestrian
      { x: 680, y: 340 },
      { x: 800, y: 330 },
      { x: 950, y: 300, label: 'Destination' }
    ],
    replannedRoute: [
      { x: 50, y: 320, label: 'Start' },
      { x: 180, y: 310 },
      { x: 320, y: 280 },
      { x: 440, y: 275 },
      { x: 540, y: 245 }, // Smooth detour around obstacle on the clear upper road section
      { x: 650, y: 285 },
      { x: 760, y: 330 },
      { x: 950, y: 300, label: 'Destination' }
    ],
    initialObjects: [
      {
        id: 'obj-cow-1',
        type: 'cow',
        name: 'Stray Cow on Roadway',
        x: 550,
        y: 315,
        width: 38,
        height: 24,
        distance: 28,
        relativeSpeed: -1.2,
        risk: 'MEDIUM',
        predictedMovement: 'Stationary on center asphalt, shifting left toward ditch',
        heading: 10,
        laneOrLocation: 'Center Carriageway',
        isTriggerObstacle: true
      },
      {
        id: 'obj-ped-1',
        type: 'pedestrian',
        name: 'Village Pedestrian',
        x: 380,
        y: 220,
        vx: 0.3,
        vy: 0.2,
        width: 16,
        height: 16,
        distance: 19,
        relativeSpeed: -3.5,
        risk: 'LOW',
        predictedMovement: 'Walking along dirt shoulder toward tea shop',
        heading: 85,
        laneOrLocation: 'North Dirt Shoulder'
      },
      {
        id: 'obj-bike-1',
        type: 'bike',
        name: 'Oncoming Hero Splendor',
        x: 820,
        y: 360,
        vx: -2.5,
        vy: 0,
        width: 24,
        height: 14,
        distance: 54,
        relativeSpeed: -38,
        risk: 'LOW',
        predictedMovement: 'Approaching in oncoming lane at ~35 km/h',
        heading: 185,
        laneOrLocation: 'Opposing Path'
      }
    ],
    triggerEvent: {
      atProgress: 0.38,
      obstacleId: 'obj-cow-1',
      alertTitle: 'LIVESTOCK BLOCKING CENTER PATH',
      alertMessage: 'Stray animal detected stationary in path at 28m. Initiating speed reduction and dynamic lateral replanning.',
      decision: 'REPLANNING',
      targetRisk: 'MEDIUM',
      replanDelayMs: 900
    }
  },

  intersection: {
    id: 'intersection',
    number: 2,
    name: 'Urban Intersection - No Signals',
    subtitle: 'High-density 4-way un-signaled junction with cross-cutting motorcycles and aggressive auto-rickshaws',
    environmentType: 'Semi-urban crossroad junction with chaotic vehicular merges, missing yellow lines and no traffic police',
    description: 'Busy Indian urban intersection without operational traffic signals. Vehicles merge opportunistically from all 4 branches. A speeding two-wheeler cuts abruptly across the autonomous vehicle path while making an un-signaled right cut.',
    difficulty: 'High',
    speedRange: '15-30 km/h',
    defaultSpeed: 22,
    initialRisk: 'LOW',
    initialDecision: 'NORMAL DRIVING',
    currentRoadName: 'M.G. Road & Station Road Junction',
    nextDirection: '↗ Turn Right into North Arterial',
    nextDistance: '45 m',
    totalDistance: '850 m',
    eta: '02:05',
    keyChallenges: [
      'Unsignalized round-about / 4-way deadlock risk',
      'Two-wheelers executing blind right turns across forward traffic',
      'Auto-rickshaws suddenly stopping mid-junction for passengers',
      'No lane priority discipline or stop signs obeyed'
    ],
    objectsSummary: ['Auto-Rickshaw (Bajaj RE)', 'Motorcycle (Cutting path)', 'City Car (Maruti Swift)', '2 Pedestrians'],
    roadGeometry: {
      type: 'intersection',
      width: 160,
      shoulderType: 'curb',
      centerlineStyle: 'faded_broken',
      landmarks: [
        { type: 'building', x: 180, y: 120, label: 'Commercial Complex' },
        { type: 'building', x: 820, y: 120, label: 'Medical Store' },
        { type: 'stall', x: 210, y: 490, label: 'Chai Point' },
        { type: 'building', x: 820, y: 490, label: 'Electronics Plaza' }
      ]
    },
    // Vehicle enters from bottom/left, approaches intersection center, makes safe right turn
    baseRoute: [
      { x: 60, y: 340, label: 'Approach' },
      { x: 240, y: 340 },
      { x: 420, y: 340 },
      { x: 500, y: 320 }, // Junction center point
      { x: 530, y: 250 }, // Normal planned turn
      { x: 540, y: 120 },
      { x: 540, y: 50, label: 'Destination' }
    ],
    replannedRoute: [
      { x: 60, y: 340, label: 'Approach' },
      { x: 240, y: 340 },
      { x: 390, y: 345 }, // Yielding & wide arc to give motorcycle clearance
      { x: 480, y: 360 }, // Slow yield arc
      { x: 560, y: 290 }, // Smooth turn behind crossing bike
      { x: 540, y: 140 },
      { x: 540, y: 50, label: 'Destination' }
    ],
    initialObjects: [
      {
        id: 'obj-bike-cross',
        type: 'bike',
        name: 'Speeding Pulsar 150 (Cutting Across)',
        x: 520,
        y: 220,
        vx: 0,
        vy: 2.8,
        width: 24,
        height: 14,
        distance: 21,
        relativeSpeed: -28,
        risk: 'HIGH',
        predictedMovement: 'Cutting perpendicularly from North across junction without yielding',
        heading: 260,
        laneOrLocation: 'Intersection Center Gap',
        isTriggerObstacle: true
      },
      {
        id: 'obj-auto-1',
        type: 'auto',
        name: 'Auto-Rickshaw (Green/Yellow Bajaj)',
        x: 420,
        y: 430,
        vx: 0.5,
        vy: -1.2,
        width: 32,
        height: 20,
        distance: 32,
        relativeSpeed: 14,
        risk: 'MEDIUM',
        predictedMovement: 'Slow turning left into east arm',
        heading: 45,
        laneOrLocation: 'South Junction Arm'
      },
      {
        id: 'obj-car-1',
        type: 'car',
        name: 'White Maruti Dzire',
        x: 740,
        y: 310,
        vx: -1.8,
        vy: 0,
        width: 44,
        height: 24,
        distance: 48,
        relativeSpeed: -24,
        risk: 'LOW',
        predictedMovement: 'Waiting at junction mouth to enter',
        heading: 180,
        laneOrLocation: 'East Junction Approach'
      }
    ],
    triggerEvent: {
      atProgress: 0.35,
      obstacleId: 'obj-bike-cross',
      alertTitle: 'SUDDEN CROSS-TRAFFIC CONFLICT',
      alertMessage: 'Motorcycle cutting across active turn trajectory at 32 km/h. Executing YIELD & replanning trajectory arc.',
      decision: 'YIELD',
      targetRisk: 'HIGH',
      replanDelayMs: 800
    }
  },

  highway: {
    id: 'highway',
    number: 3,
    name: 'Highway Merge - Slow Vehicle',
    subtitle: 'Entry ramp onto dual carriageway blocked by overloaded slow-moving commercial truck',
    environmentType: 'National Highway corridor with accelerating on-ramp, concrete divider and heavy intercity traffic',
    description: 'Autonomous vehicle is on an acceleration slip-lane merging onto NH44. A heavily overloaded, slow-moving open-bed Ashok Leyland truck in the left lane is traveling at only 25 km/h, blocking the preferred lane entry. The system dynamically adjusts merge speed and computes an extended merge path into the right corridor.',
    difficulty: 'Moderate',
    speedRange: '50-80 km/h',
    defaultSpeed: 64,
    initialRisk: 'LOW',
    initialDecision: 'NORMAL DRIVING',
    currentRoadName: 'NH-44 Expressway Merge Ramp',
    nextDirection: '↗ Merge Right onto Main Expressway',
    nextDistance: '120 m',
    totalDistance: '2.4 km',
    eta: '01:45',
    keyChallenges: [
      'Speed differential (25 km/h truck vs 70 km/h cruising traffic)',
      'Blind spots caused by oversized vehicle cargo',
      'Fast-approaching passenger vehicles in express passing lane',
      'Short merge taper requiring decisive path optimization'
    ],
    objectsSummary: ['Overloaded Truck (Ashok Leyland)', 'Intercity Volvo Bus', 'Fast Sedan (Honda City)', 'Commuter Bike'],
    roadGeometry: {
      type: 'highway_merge',
      width: 220,
      shoulderType: 'paved',
      centerlineStyle: 'solid_white',
      landmarks: [
        { type: 'sign', x: 260, y: 140, label: 'Speed Limit 80' },
        { type: 'divider', x: 500, y: 200, label: 'Median Barrier' },
        { type: 'sign', x: 680, y: 140, label: 'Merge Ahead 100m' }
      ]
    },
    // Merging ramp on lower branch merging into top multi-lane highway
    baseRoute: [
      { x: 50, y: 440, label: 'Ramp' },
      { x: 200, y: 420 },
      { x: 380, y: 380 },
      { x: 520, y: 330 }, // Original planned merge spot blocked by slow truck
      { x: 660, y: 320 },
      { x: 820, y: 310 },
      { x: 950, y: 310, label: 'Expressway' }
    ],
    replannedRoute: [
      { x: 50, y: 440, label: 'Ramp' },
      { x: 200, y: 420 },
      { x: 380, y: 390 }, // Extended slip taper
      { x: 540, y: 380 }, // Passes safely behind truck
      { x: 690, y: 270 }, // Accelerates and merges smoothly into outer open lane
      { x: 830, y: 250 },
      { x: 950, y: 250, label: 'Expressway Lane 2' }
    ],
    initialObjects: [
      {
        id: 'obj-truck-1',
        type: 'truck',
        name: 'Overloaded Ashok Leyland Truck',
        x: 560,
        y: 330,
        vx: 1.0,
        vy: 0,
        width: 72,
        height: 28,
        distance: 38,
        relativeSpeed: -38,
        risk: 'HIGH',
        predictedMovement: 'Slow steady trajectory in lane 1 carrying protruding iron bars',
        heading: 0,
        laneOrLocation: 'Highway Lane 1 Merge Confluence',
        isTriggerObstacle: true
      },
      {
        id: 'obj-bus-1',
        type: 'bus',
        name: 'KSRTC Intercity Bus',
        x: 340,
        y: 250,
        vx: 2.8,
        vy: 0,
        width: 80,
        height: 30,
        distance: 65,
        relativeSpeed: 6,
        risk: 'LOW',
        predictedMovement: 'Cruising in central lane at 72 km/h',
        heading: 0,
        laneOrLocation: 'Highway Main Corridor'
      },
      {
        id: 'obj-car-express',
        type: 'car',
        name: 'Honda City (Fast Passing)',
        x: 180,
        y: 190,
        vx: 3.5,
        vy: 0,
        width: 46,
        height: 24,
        distance: 82,
        relativeSpeed: 18,
        risk: 'LOW',
        predictedMovement: 'Fast overtaking in median lane at 85 km/h',
        heading: 0,
        laneOrLocation: 'Fast Lane'
      }
    ],
    triggerEvent: {
      atProgress: 0.36,
      obstacleId: 'obj-truck-1',
      alertTitle: 'MERGE LANE DEFICIT & VELOCITY MISMATCH',
      alertMessage: 'Slow heavy commercial vehicle occupies merge zone at 24 km/h. Replanning dynamic acceleration trajectory to Lane 2.',
      decision: 'REPLANNING',
      targetRisk: 'HIGH',
      replanDelayMs: 900
    }
  },

  market: {
    id: 'market',
    number: 4,
    name: 'Dense Market Area - Mixed Traffic',
    subtitle: 'Crowded bazaar corridor with pushcarts, roadside vendors, darting shoppers, and three-wheelers',
    environmentType: 'High-density urban market street with encroachments, parked scooters, pedestrians, and fruit carts',
    description: 'A bustling traditional bazaar street where the carriageway is severely narrowed by wooden pushcarts (thelas) and shoppers stepping into traffic. A vendor pushing a loaded fruit cart abruptly pulls across the vehicle’s drivable corridor to set up near a fruit shop.',
    difficulty: 'High',
    speedRange: '10-25 km/h',
    defaultSpeed: 16,
    initialRisk: 'MEDIUM',
    initialDecision: 'SLOW DOWN',
    currentRoadName: 'Chandni Chowk Bazaar Corridor',
    nextDirection: '↑ Thread Through Market Gap',
    nextDistance: '35 m',
    totalDistance: '620 m',
    eta: '03:40',
    keyChallenges: [
      'Extreme pedestrian density without designated footpaths',
      'Unpredictable manual pushcarts (thelas) with zero turn indicators',
      'Parked mopeds eating into 30% of drivable road width',
      'High acoustic noise masking vehicular presence'
    ],
    objectsSummary: ['Fruit Pushcart (Vendor)', '2 Auto-Rickshaws', '5 Walking Pedestrians', 'Parked Mopeds'],
    roadGeometry: {
      type: 'market_street',
      width: 150,
      shoulderType: 'market_stalls',
      centerlineStyle: 'none_crowded',
      landmarks: [
        { type: 'stall', x: 120, y: 160, label: 'Spice Shop' },
        { type: 'stall', x: 280, y: 150, label: 'Textile Emporium' },
        { type: 'stall', x: 480, y: 155, label: 'Fruit Stall' },
        { type: 'stall', x: 700, y: 160, label: 'Sweet Mart' },
        { type: 'stall', x: 220, y: 440, label: 'Vegetable Cart' },
        { type: 'stall', x: 520, y: 445, label: 'Tea Stall' },
        { type: 'stall', x: 800, y: 440, label: 'Flower Vendor' }
      ]
    },
    // Tight snaking corridor through market stalls
    baseRoute: [
      { x: 50, y: 300, label: 'Bazaar Entry' },
      { x: 200, y: 300 },
      { x: 360, y: 295 },
      { x: 500, y: 290 }, // Blocked by fruit pushcart
      { x: 650, y: 300 },
      { x: 800, y: 300 },
      { x: 950, y: 300, label: 'Square Exit' }
    ],
    replannedRoute: [
      { x: 50, y: 300, label: 'Bazaar Entry' },
      { x: 200, y: 300 },
      { x: 340, y: 295 },
      { x: 440, y: 345 }, // Weaves downward through temporary open clearance gap
      { x: 560, y: 350 },
      { x: 670, y: 310 },
      { x: 800, y: 300 },
      { x: 950, y: 300, label: 'Square Exit' }
    ],
    initialObjects: [
      {
        id: 'obj-pushcart-1',
        type: 'pushcart',
        name: 'Loaded Fruit Pushcart (Thela)',
        x: 490,
        y: 285,
        vx: 0.1,
        vy: -0.1,
        width: 34,
        height: 26,
        distance: 14,
        relativeSpeed: -1.5,
        risk: 'HIGH',
        predictedMovement: 'Vendor pulling wooden cart diagonally across road toward fruit shop',
        heading: 320,
        laneOrLocation: 'Center Drivable Corridor',
        isTriggerObstacle: true
      },
      {
        id: 'obj-ped-group',
        type: 'pedestrian',
        name: 'Shoppers with Grocery Bags',
        x: 370,
        y: 235,
        vx: 0.2,
        vy: 0.3,
        width: 18,
        height: 18,
        distance: 11,
        relativeSpeed: -2.8,
        risk: 'MEDIUM',
        predictedMovement: 'Stepping into road to bypass vegetable basket',
        heading: 110,
        laneOrLocation: 'North Shop Edge'
      },
      {
        id: 'obj-auto-market',
        type: 'auto',
        name: 'CNG Auto Honking Behind Cart',
        x: 680,
        y: 330,
        vx: -0.8,
        vy: 0,
        width: 32,
        height: 20,
        distance: 29,
        relativeSpeed: -12,
        risk: 'MEDIUM',
        predictedMovement: 'Creeping through oncoming shoppers',
        heading: 180,
        laneOrLocation: 'East Corridor'
      }
    ],
    triggerEvent: {
      atProgress: 0.34,
      obstacleId: 'obj-pushcart-1',
      alertTitle: 'PUSHCART ENCROACHMENT IN TIGHT CORRIDOR',
      alertMessage: 'Vendor pushcart occupies primary lane clearance (1.8m margin). Slowing to 12 km/h and replanning detour through southern clearance.',
      decision: 'REPLANNING',
      targetRisk: 'MEDIUM',
      replanDelayMs: 850
    }
  },

  cattle: {
    id: 'cattle',
    number: 5,
    name: 'Sudden Cattle Crossing',
    subtitle: 'High-speed rural highway with surprise sacred cow bolting directly into the vehicle braking distance',
    environmentType: 'Semi-rural open highway with green road verges, bushes, and no animal fencing',
    description: 'The autonomous vehicle is driving steadily at 45 km/h. Suddenly, a large indigenous cow bolts out from roadside vegetation directly into the vehicle’s forward stopping zone. The collision avoidance system detects the thermal and radar reflection, triggers millisecond EMERGENCY BRAKING, halts safely, recalculates a safe lateral detour, and resumes progression once the cattle clears.',
    difficulty: 'Extreme',
    speedRange: '0-45 km/h (Braking to 0)',
    defaultSpeed: 45,
    initialRisk: 'HIGH',
    initialDecision: 'EMERGENCY BRAKING',
    currentRoadName: 'State Highway 17 (Cattle Sanctuary Stretch)',
    nextDirection: '↑ Emergency Brake & Recalculate Path',
    nextDistance: '18 m',
    totalDistance: '3.1 km',
    eta: '04:15',
    keyChallenges: [
      'Unpredictable domestic animal gait and sudden stops',
      'Very short stopping sight distance (SSD < 22m)',
      'High mass obstacle (350+ kg) requiring complete collision prevention',
      'Dynamic re-planning without scaring or hitting animal'
    ],
    objectsSummary: ['Indigenous Cow (Stray)', 'Calf near shoulder', 'Local Farmer Calling Cow', 'Trailing Moped'],
    roadGeometry: {
      type: 'curved_road',
      width: 170,
      shoulderType: 'dirt',
      centerlineStyle: 'faded_broken',
      landmarks: [
        { type: 'tree', x: 220, y: 130, label: 'Mango Grove' },
        { type: 'tree', x: 460, y: 130, label: 'Thick Shrubs (Cow Origin)' },
        { type: 'sign', x: 380, y: 470, label: 'Animal Crossing Sign' },
        { type: 'tree', x: 740, y: 480, label: 'Banyan Tree' }
      ]
    },
    // Road through countryside
    baseRoute: [
      { x: 50, y: 310, label: 'Cruising' },
      { x: 200, y: 310 },
      { x: 360, y: 310 },
      { x: 480, y: 310 }, // Direct collision waypoint with crossing cow!
      { x: 620, y: 310 },
      { x: 780, y: 310 },
      { x: 950, y: 310, label: 'Clear Highway' }
    ],
    replannedRoute: [
      { x: 50, y: 310, label: 'Cruising' },
      { x: 200, y: 310 },
      { x: 350, y: 310 }, // Braking point
      { x: 420, y: 360 }, // Slow crawl curve to the right side of the wide carriageway
      { x: 540, y: 375 }, // Safely passes behind the standing cow with >3.2m clearance
      { x: 680, y: 330 },
      { x: 800, y: 310 },
      { x: 950, y: 310, label: 'Clear Highway' }
    ],
    initialObjects: [
      {
        id: 'obj-cow-sudden',
        type: 'cow',
        name: 'Desi Cow (Sudden Bolt from Bushes)',
        x: 480,
        y: 295,
        vx: 0,
        vy: 1.1,
        width: 42,
        height: 26,
        distance: 17,
        relativeSpeed: -45,
        risk: 'HIGH',
        predictedMovement: 'Bolting from bushes into center lane, freezing upon headlight beam',
        heading: 270,
        laneOrLocation: 'Forward Stopping Zone',
        isTriggerObstacle: true
      },
      {
        id: 'obj-ped-farmer',
        type: 'pedestrian',
        name: 'Farmer Shouting to Herd',
        x: 440,
        y: 190,
        vx: 0.4,
        vy: 0.1,
        width: 16,
        height: 16,
        distance: 24,
        relativeSpeed: -4,
        risk: 'MEDIUM',
        predictedMovement: 'Running along ditch waving stick',
        heading: 80,
        laneOrLocation: 'North Grass Verge'
      },
      {
        id: 'obj-bike-trail',
        type: 'bike',
        name: 'Trailing Hero Splendor',
        x: 120,
        y: 350,
        vx: 1.2,
        vy: 0,
        width: 22,
        height: 14,
        distance: 35,
        relativeSpeed: -15,
        risk: 'LOW',
        predictedMovement: 'Braking behind autonomous vehicle',
        heading: 0,
        laneOrLocation: 'Rear Lane Corridor'
      }
    ],
    triggerEvent: {
      atProgress: 0.32,
      obstacleId: 'obj-cow-sudden',
      alertTitle: '⚠ EMERGENCY OBSTACLE DETECTED: CATTLE CROSSING',
      alertMessage: 'Thermal-LiDAR cross-validation: 380kg bovine obstacle at 17.2m. Deceleration command: -6.8 m/s² (FULL STOP). Safe lateral bypass queued.',
      decision: 'EMERGENCY BRAKING',
      targetRisk: 'HIGH',
      replanDelayMs: 1200
    }
  }
};
