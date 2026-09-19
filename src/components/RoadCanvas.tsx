import React, { useMemo } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { generateDirectionArrows, waypointsToSvgPath } from '../utils/geometry';
import { DetectedObject } from '../types';

export const RoadCanvas: React.FC<{
  className?: string;
  showControlsOverlay?: boolean;
}> = ({ className = '', showControlsOverlay = true }) => {
  const {
    currentScenario,
    vehicle,
    activeRoute,
    detectedObjects,
    riskLevel,
    decision,
    settings,
    isReplanned,
    replanningActive,
    emergencyBrakingActive,
    simulationRunning
  } = useSimulation();

  // Generate SVG path string for the ONE active blue route
  const routeSvgPath = useMemo(() => {
    return waypointsToSvgPath(activeRoute);
  }, [activeRoute]);

  // Generate direction arrows along the ONE active route
  const directionArrows = useMemo(() => {
    return generateDirectionArrows(activeRoute, 55);
  }, [activeRoute]);

  // Road background geometry based on scenario
  const renderRoadBackground = () => {
    const geo = currentScenario.roadGeometry;
    switch (geo.type) {
      case 'curved_road':
        return (
          <g id="road-curved-group">
            {/* Dirt/verge shoulder */}
            <path
              d="M 20 320 Q 180 310, 320 280 T 540 300 T 780 340 T 980 300"
              fill="none"
              stroke="#2e2316"
              strokeWidth="200"
              strokeLinecap="round"
            />
            {/* Main asphalt carriageway */}
            <path
              d="M 20 320 Q 180 310, 320 280 T 540 300 T 780 340 T 980 300"
              fill="none"
              stroke="#1e2533"
              strokeWidth={geo.width}
              strokeLinecap="round"
            />
            {/* Unmarked edge texture / rough asphalt seams */}
            <path
              d="M 20 320 Q 180 310, 320 280 T 540 300 T 780 340 T 980 300"
              fill="none"
              stroke="#2b3446"
              strokeWidth={geo.width - 12}
              strokeLinecap="round"
            />
            {/* Faded broken centerline if highway/cattle, else no marking */}
            {geo.centerlineStyle === 'faded_broken' && (
              <path
                d="M 20 320 Q 180 310, 320 280 T 540 300 T 780 340 T 980 300"
                fill="none"
                stroke="#64748b"
                strokeWidth="2.5"
                strokeDasharray="14 18"
                opacity="0.5"
              />
            )}
          </g>
        );

      case 'intersection':
        return (
          <g id="road-intersection-group">
            {/* Pavement surrounding intersection */}
            <rect x="0" y="0" width="1000" height="600" fill="#0d1527" />
            
            {/* Horizontal street */}
            <rect x="0" y="240" width="1000" height="180" fill="#1b2232" />
            {/* Vertical street */}
            <rect x="420" y="0" width="180" height="600" fill="#1b2232" />
            
            {/* Junction center blend */}
            <rect x="420" y="240" width="180" height="180" fill="#222c3f" />

            {/* Curbs with zebra crossing lines */}
            <line x1="0" y1="240" x2="420" y2="240" stroke="#475569" strokeWidth="4" />
            <line x1="600" y1="240" x2="1000" y2="240" stroke="#475569" strokeWidth="4" />
            <line x1="0" y1="420" x2="420" y2="420" stroke="#475569" strokeWidth="4" />
            <line x1="600" y1="420" x2="1000" y2="420" stroke="#475569" strokeWidth="4" />

            <line x1="420" y1="0" x2="420" y2="240" stroke="#475569" strokeWidth="4" />
            <line x1="600" y1="0" x2="600" y2="240" stroke="#475569" strokeWidth="4" />
            <line x1="420" y1="420" x2="420" y2="600" stroke="#475569" strokeWidth="4" />
            <line x1="600" y1="420" x2="600" y2="600" stroke="#475569" strokeWidth="4" />

            {/* Faded lane dividers */}
            <line x1="0" y1="330" x2="400" y2="330" stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="12 14" opacity="0.4" />
            <line x1="620" y1="330" x2="1000" y2="330" stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="12 14" opacity="0.4" />
            <line x1="510" y1="0" x2="510" y2="220" stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="12 14" opacity="0.4" />
            <line x1="510" y1="440" x2="510" y2="600" stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="12 14" opacity="0.4" />

            {/* Corner curbs */}
            <path d="M 420 240 Q 450 240 450 210" fill="none" stroke="#64748b" strokeWidth="3" />
            <path d="M 600 240 Q 570 240 570 210" fill="none" stroke="#64748b" strokeWidth="3" />
            <path d="M 420 420 Q 450 420 450 450" fill="none" stroke="#64748b" strokeWidth="3" />
            <path d="M 600 420 Q 570 420 570 450" fill="none" stroke="#64748b" strokeWidth="3" />
          </g>
        );

      case 'highway_merge':
        return (
          <g id="road-highway-group">
            {/* Background grass/terrain */}
            <rect x="0" y="0" width="1000" height="600" fill="#0d1a1b" />
            
            {/* Main highway carriageway (top) */}
            <rect x="0" y="160" width="1000" height="180" fill="#1b2434" />
            
            {/* Merge lane coming from bottom-left ramping into highway */}
            <path
              d="M 0 460 Q 220 430, 420 380 Q 540 340, 700 340 L 1000 340"
              fill="none"
              stroke="#1b2434"
              strokeWidth="90"
              strokeLinecap="round"
            />
            {/* Merge shoulder */}
            <path
              d="M 0 500 Q 220 470, 440 420 Q 560 385, 720 385 L 1000 385"
              fill="none"
              stroke="#334155"
              strokeWidth="6"
            />

            {/* Highway concrete center divider */}
            <rect x="0" y="152" width="1000" height="10" fill="#475569" />
            <line x1="0" y1="157" x2="1000" y2="157" stroke="#e2e8f0" strokeWidth="1.5" />

            {/* Lane 1 and Lane 2 dashed markers */}
            <line x1="0" y1="220" x2="1000" y2="220" stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="16 18" opacity="0.6" />
            <line x1="0" y1="280" x2="1000" y2="280" stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="16 18" opacity="0.6" />

            {/* Merge taper dashed line */}
            <path
              d="M 280 400 Q 420 350, 560 340"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.5"
              strokeDasharray="8 8"
              opacity="0.8"
            />
          </g>
        );

      case 'market_street':
        return (
          <g id="road-market-group">
            {/* Dense bazaar street background */}
            <rect x="0" y="0" width="1000" height="600" fill="#13161c" />
            
            {/* Shop awning corridor north & south */}
            <rect x="0" y="80" width="1000" height="120" fill="#1c1917" />
            <rect x="0" y="400" width="1000" height="120" fill="#1c1917" />
            
            {/* Main crowded road surface with uneven edges */}
            <path
              d="M 0 300 Q 250 290, 500 310 T 1000 300"
              fill="none"
              stroke="#212631"
              strokeWidth="190"
            />

            {/* Worn patch textures */}
            <ellipse cx="280" cy="270" rx="35" ry="15" fill="#1a1e27" opacity="0.7" />
            <ellipse cx="610" cy="330" rx="45" ry="18" fill="#1a1e27" opacity="0.7" />
            <ellipse cx="780" cy="285" rx="30" ry="12" fill="#1a1e27" opacity="0.7" />

            {/* Shop awnings stripes */}
            <line x1="0" y1="200" x2="1000" y2="200" stroke="#b45309" strokeWidth="8" strokeDasharray="25 15" opacity="0.8" />
            <line x1="0" y1="400" x2="1000" y2="400" stroke="#047857" strokeWidth="8" strokeDasharray="25 15" opacity="0.8" />
          </g>
        );
      default:
        return null;
    }
  };

  // Render scenery landmarks (trees, huts, tea stalls, etc.)
  const renderLandmarks = () => {
    return currentScenario.roadGeometry.landmarks.map((lm, idx) => {
      switch (lm.type) {
        case 'tree':
          return (
            <g key={`tree-${idx}`} transform={`translate(${lm.x}, ${lm.y})`} className="pointer-events-none">
              <circle cx="0" cy="0" r="28" fill="#14532d" opacity="0.85" />
              <circle cx="-6" cy="-6" r="20" fill="#15803d" opacity="0.9" />
              <circle cx="6" cy="4" r="16" fill="#166534" opacity="0.8" />
              <circle cx="0" cy="0" r="6" fill="#78350f" />
              {lm.label && (
                <text x="0" y="38" textAnchor="middle" fill="#86efac" fontSize="9" fontFamily="monospace" opacity="0.7">
                  {lm.label}
                </text>
              )}
            </g>
          );

        case 'hut':
          return (
            <g key={`hut-${idx}`} transform={`translate(${lm.x}, ${lm.y})`} className="pointer-events-none">
              <rect x="-24" y="-16" width="48" height="32" fill="#78350f" rx="3" stroke="#92400e" strokeWidth="1.5" />
              <polygon points="-28,-16 0,-30 28,-16" fill="#d97706" />
              <rect x="-8" y="0" width="16" height="16" fill="#1c1917" />
              {lm.label && (
                <text x="0" y="26" textAnchor="middle" fill="#fcd34d" fontSize="9" fontFamily="monospace" opacity="0.75">
                  {lm.label}
                </text>
              )}
            </g>
          );

        case 'stall':
          return (
            <g key={`stall-${idx}`} transform={`translate(${lm.x}, ${lm.y})`} className="pointer-events-none">
              <rect x="-22" y="-14" width="44" height="28" fill="#1e293b" rx="2" stroke="#38bdf8" strokeWidth="1" />
              <line x1="-22" y1="-14" x2="22" y2="-14" stroke="#f59e0b" strokeWidth="4" />
              {lm.label && (
                <text x="0" y="24" textAnchor="middle" fill="#7dd3fc" fontSize="9" fontFamily="monospace" opacity="0.8">
                  {lm.label}
                </text>
              )}
            </g>
          );

        case 'building':
          return (
            <g key={`bld-${idx}`} transform={`translate(${lm.x}, ${lm.y})`} className="pointer-events-none">
              <rect x="-40" y="-30" width="80" height="60" fill="#1e293b" rx="4" stroke="#475569" strokeWidth="2" />
              <rect x="-30" y="-20" width="20" height="15" fill="#38bdf8" opacity="0.3" />
              <rect x="10" y="-20" width="20" height="15" fill="#38bdf8" opacity="0.3" />
              {lm.label && (
                <text x="0" y="42" textAnchor="middle" fill="#cbd5e1" fontSize="9" fontFamily="monospace" opacity="0.7">
                  {lm.label}
                </text>
              )}
            </g>
          );

        case 'sign':
          return (
            <g key={`sign-${idx}`} transform={`translate(${lm.x}, ${lm.y})`} className="pointer-events-none">
              <rect x="-14" y="-14" width="28" height="28" fill="#0284c7" rx="3" stroke="#e0f2fe" strokeWidth="1.5" />
              <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
                {lm.label?.split(' ')[0] || 'NH'}
              </text>
              {lm.label && (
                <text x="0" y="24" textAnchor="middle" fill="#bae6fd" fontSize="9" fontFamily="monospace">
                  {lm.label}
                </text>
              )}
            </g>
          );

        default:
          return null;
      }
    });
  };

  // Render detected dynamic objects (Auto, Cow, Bike, Truck, etc.)
  const renderDetectedObjects = () => {
    return detectedObjects.map(obj => {
      const isHighRisk = obj.risk === 'HIGH';
      const isMedRisk = obj.risk === 'MEDIUM';
      const boxColor = isHighRisk ? '#ef4444' : isMedRisk ? '#f59e0b' : '#10b981';

      return (
        <g
          key={obj.id}
          transform={`translate(${obj.x}, ${obj.y})`}
          className="transition-transform duration-75"
        >
          {/* Motion prediction vector line */}
          {obj.vx !== undefined && (
            <line
              x1="0"
              y1="0"
              x2={(obj.vx || 0) * 22}
              y2={(obj.vy || 0) * 22}
              stroke={boxColor}
              strokeWidth="2"
              strokeDasharray="3 3"
              opacity="0.8"
            />
          )}

          {/* Object Visual Representation by Type */}
          {renderObjectSprite(obj)}

          {/* Detection Bounding Box if enabled */}
          {settings.detectionBoxes && (
            <g>
              <rect
                x={-obj.width / 2 - 4}
                y={-obj.height / 2 - 4}
                width={obj.width + 8}
                height={obj.height + 8}
                fill="none"
                stroke={boxColor}
                strokeWidth={isHighRisk ? 2.5 : 1.5}
                strokeDasharray={isHighRisk ? 'none' : '4 3'}
                rx="3"
                className={isHighRisk ? 'animate-pulse' : ''}
              />
              {/* Corner brackets */}
              <path
                d={`M ${-obj.width / 2 - 4} ${-obj.height / 2 + 2} L ${-obj.width / 2 - 4} ${-obj.height / 2 - 4} L ${-obj.width / 2 + 2} ${-obj.height / 2 - 4}`}
                stroke={boxColor}
                strokeWidth="2"
                fill="none"
              />
              <path
                d={`M ${obj.width / 2 + 4} ${-obj.height / 2 + 2} L ${obj.width / 2 + 4} ${-obj.height / 2 - 4} L ${obj.width / 2 - 2} ${-obj.height / 2 - 4}`}
                stroke={boxColor}
                strokeWidth="2"
                fill="none"
              />
              {/* Distance & Tag Badge */}
              <g transform={`translate(0, ${-obj.height / 2 - 10})`}>
                <rect
                  x="-35"
                  y="-10"
                  width="70"
                  height="13"
                  fill="#0b1329"
                  rx="2"
                  stroke={boxColor}
                  strokeWidth="1"
                  opacity="0.95"
                />
                <text
                  x="0"
                  y="-1"
                  textAnchor="middle"
                  fill={boxColor}
                  fontSize="8"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {obj.type.toUpperCase()} [{obj.distance}m]
                </text>
              </g>
            </g>
          )}

          {/* Trigger alert circle if this is the active blocking obstacle */}
          {obj.isTriggerObstacle && (replanningActive || emergencyBrakingActive) && (
            <circle
              cx="0"
              cy="0"
              r={obj.width * 0.9}
              fill="none"
              stroke="#ef4444"
              strokeWidth="2"
              className="animate-ping"
              opacity="0.6"
            />
          )}
        </g>
      );
    });
  };

  // Specific sprites for Indian traffic elements
  const renderObjectSprite = (obj: DetectedObject) => {
    switch (obj.type) {
      case 'cow':
        return (
          <g transform={`rotate(${obj.heading || 0})`}>
            {/* Body */}
            <ellipse cx="0" cy="0" rx="18" ry="11" fill="#e2e8f0" stroke="#475569" strokeWidth="1.5" />
            {/* Hump (Indian Zebu humped cow) */}
            <ellipse cx="-4" cy="-9" rx="6" ry="4" fill="#cbd5e1" />
            {/* Head & Horns */}
            <circle cx="15" cy="0" r="7" fill="#f1f5f9" stroke="#475569" strokeWidth="1" />
            <path d="M 17 -6 Q 20 -11 16 -13" stroke="#334155" strokeWidth="1.8" fill="none" />
            <path d="M 17 6 Q 20 11 16 13" stroke="#334155" strokeWidth="1.8" fill="none" />
            {/* Ears */}
            <ellipse cx="14" cy="-7" rx="4" ry="2" fill="#e2e8f0" />
            <ellipse cx="14" cy="7" rx="4" ry="2" fill="#e2e8f0" />
            {/* Tail */}
            <path d="M -18 0 Q -24 3 -22 6" stroke="#475569" strokeWidth="1.2" fill="none" />
          </g>
        );

      case 'auto':
        return (
          <g transform={`rotate(${obj.heading || 0})`}>
            {/* Yellow & Green Indian 3-Wheeler Auto-Rickshaw */}
            {/* Rear Wheels */}
            <rect x="-14" y="-12" width="6" height="3" fill="#0f172a" rx="1" />
            <rect x="-14" y="9" width="6" height="3" fill="#0f172a" rx="1" />
            {/* Front Wheel */}
            <rect x="11" y="-1.5" width="5" height="3" fill="#0f172a" rx="1" />
            {/* Body base (Green) */}
            <rect x="-14" y="-9" width="24" height="18" fill="#15803d" rx="4" stroke="#166534" strokeWidth="1" />
            {/* Hood top (Bright Yellow) */}
            <path d="M -13 -8 L 8 -7 L 12 0 L 8 7 L -13 8 Z" fill="#eab308" />
            {/* Windshield */}
            <line x1="5" y1="-6" x2="5" y2="6" stroke="#38bdf8" strokeWidth="2" opacity="0.9" />
          </g>
        );

      case 'bike':
        return (
          <g transform={`rotate(${obj.heading || 0})`}>
            {/* Motorcycle Wheels */}
            <rect x="-10" y="-1.5" width="6" height="3" fill="#020617" />
            <rect x="8" y="-1.5" width="6" height="3" fill="#020617" />
            {/* Frame / Tank (Red or Blue) */}
            <rect x="-6" y="-3" width="12" height="6" fill="#dc2626" rx="2" />
            {/* Handlebar */}
            <line x1="6" y1="-6" x2="6" y2="6" stroke="#94a3b8" strokeWidth="1.5" />
            {/* Rider Helmet */}
            <circle cx="0" cy="0" r="4.5" fill="#f8fafc" stroke="#1e293b" strokeWidth="1" />
          </g>
        );

      case 'truck':
        return (
          <g transform={`rotate(${obj.heading || 0})`}>
            {/* Heavy Indian Truck (Ashok Leyland style) */}
            {/* Wheels */}
            <rect x="-30" y="-15" width="10" height="3" fill="#0f172a" />
            <rect x="-30" y="12" width="10" height="3" fill="#0f172a" />
            <rect x="-18" y="-15" width="10" height="3" fill="#0f172a" />
            <rect x="-18" y="12" width="10" height="3" fill="#0f172a" />
            <rect x="22" y="-15" width="10" height="3" fill="#0f172a" />
            <rect x="22" y="12" width="10" height="3" fill="#0f172a" />
            {/* Cargo Bed (Wooden decorated yellow/blue) */}
            <rect x="-32" y="-13" width="46" height="26" fill="#d97706" rx="2" stroke="#92400e" strokeWidth="1.5" />
            <line x1="-20" y1="-13" x2="-20" y2="13" stroke="#78350f" strokeWidth="1" />
            <line x1="-6" y1="-13" x2="-6" y2="13" stroke="#78350f" strokeWidth="1" />
            {/* Cabin (Bright Orange/Blue) */}
            <rect x="14" y="-12" width="18" height="24" fill="#ea580c" rx="3" stroke="#c2410c" strokeWidth="1.5" />
            <rect x="20" y="-10" width="8" height="20" fill="#38bdf8" opacity="0.6" rx="1" />
          </g>
        );

      case 'pushcart':
        return (
          <g transform={`rotate(${obj.heading || 0})`}>
            {/* Wooden Fruit Pushcart (Thela) */}
            <rect x="-14" y="-10" width="28" height="20" fill="#78350f" rx="2" stroke="#92400e" strokeWidth="1" />
            {/* Fruit mounds */}
            <circle cx="-5" cy="-3" r="3" fill="#ef4444" />
            <circle cx="0" cy="-3" r="3" fill="#eab308" />
            <circle cx="5" cy="-3" r="3" fill="#22c55e" />
            <circle cx="-2" cy="4" r="3" fill="#f97316" />
            {/* Thela Spoke Wheels */}
            <line x1="-6" y1="-12" x2="6" y2="-12" stroke="#1c1917" strokeWidth="2.5" />
            <line x1="-6" y1="12" x2="6" y2="12" stroke="#1c1917" strokeWidth="2.5" />
            {/* Vendor standing behind cart */}
            <circle cx="-19" cy="0" r="4.5" fill="#f8fafc" stroke="#1e293b" strokeWidth="1" />
          </g>
        );

      case 'pedestrian':
        return (
          <g transform={`rotate(${obj.heading || 0})`}>
            {/* Pedestrian dot with shoulder direction */}
            <ellipse cx="0" cy="0" rx="4" ry="7" fill="#f8fafc" stroke="#334155" strokeWidth="1" />
            <circle cx="0" cy="0" r="3.5" fill="#f59e0b" />
          </g>
        );

      default:
        // Generic Car or Bus
        return (
          <g transform={`rotate(${obj.heading || 0})`}>
            <rect
              x={-obj.width / 2}
              y={-obj.height / 2}
              width={obj.width}
              height={obj.height}
              fill="#1e293b"
              rx="4"
              stroke="#64748b"
              strokeWidth="1.5"
            />
            <rect
              x={-obj.width / 4}
              y={-obj.height / 2 + 2}
              width={obj.width / 2}
              height={obj.height - 4}
              fill="#38bdf8"
              opacity="0.5"
              rx="2"
            />
          </g>
        );
    }
  };

  // Render the Autonomous Vehicle directly ON the active blue route
  const renderAutonomousVehicle = () => {
    const isBraking = emergencyBrakingActive;
    const isReplanning = replanningActive;

    return (
      <g
        id="autonomous-vehicle-group"
        transform={`translate(${vehicle.x}, ${vehicle.y}) rotate(${vehicle.heading})`}
        className="transition-transform duration-75"
      >
        {/* Forward Radar / LiDAR Perception Field Cone */}
        {settings.sensorFusion && (
          <g className="pointer-events-none">
            <path
              d="M 16 0 L 160 -65 A 180 180 0 0 1 160 65 Z"
              fill="url(#radarConeGrad)"
              opacity={simulationRunning ? 0.35 : 0.15}
            />
            {/* Sweeping Radar Arc */}
            <path
              d="M 100 -40 A 120 120 0 0 1 100 40"
              fill="none"
              stroke="#00f0ff"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              opacity="0.6"
            />
          </g>
        )}

        {/* Dynamic Safety Proximity Ring */}
        <circle
          cx="0"
          cy="0"
          r={isBraking ? 48 : isReplanning ? 42 : 36}
          fill="none"
          stroke={isBraking ? '#ef4444' : isReplanning ? '#f59e0b' : '#00f0ff'}
          strokeWidth={isBraking ? 2.5 : 1.5}
          strokeDasharray="5 3"
          opacity="0.8"
          className={isBraking ? 'animate-ping' : ''}
        />

        {/* Headlight beams */}
        <path d="M 22 -6 L 85 -22 L 85 -5 Z" fill="#fef08a" opacity="0.3" />
        <path d="M 22 6 L 85 5 L 85 22 Z" fill="#fef08a" opacity="0.3" />

        {/* Car Chassis (Sleek Futuristic Autonomous EV) */}
        {/* Shadow */}
        <rect x="-24" y="-14" width="48" height="28" fill="#000000" opacity="0.5" rx="7" filter="blur(2px)" />

        {/* Wheels */}
        <rect x="-18" y="-15" width="10" height="3.5" fill="#020617" rx="1" />
        <rect x="-18" y="11.5" width="10" height="3.5" fill="#020617" rx="1" />
        <rect x="10" y="-15" width="10" height="3.5" fill="#020617" rx="1" />
        <rect x="10" y="11.5" width="10" height="3.5" fill="#020617" rx="1" />

        {/* Car Body */}
        <rect
          x="-22"
          y="-13"
          width="44"
          height="26"
          fill="#0f172a"
          rx="6"
          stroke={isBraking ? '#ef4444' : isReplanning ? '#f59e0b' : '#00f0ff'}
          strokeWidth="1.8"
        />

        {/* Windshield & Panoramic Glass Roof */}
        <path
          d="M -10 -9 L 8 -9 L 14 -6 L 14 6 L 8 9 L -10 9 Z"
          fill="#1e293b"
          stroke="#38bdf8"
          strokeWidth="1"
          opacity="0.9"
        />
        {/* Front Windshield highlight */}
        <path d="M 8 -7 L 13 -4 L 13 4 L 8 7 Z" fill="#38bdf8" opacity="0.6" />

        {/* Brake lights at rear */}
        <rect
          x="-23"
          y="-11"
          width="2.5"
          height="6"
          fill={isBraking ? '#ef4444' : '#991b1b'}
          className={isBraking ? 'animate-pulse' : ''}
        />
        <rect
          x="-23"
          y="5"
          width="2.5"
          height="6"
          fill={isBraking ? '#ef4444' : '#991b1b'}
          className={isBraking ? 'animate-pulse' : ''}
        />

        {/* Headlights at front */}
        <rect x="21" y="-10" width="2" height="4" fill="#fef08a" />
        <rect x="21" y="6" width="2" height="4" fill="#fef08a" />

        {/* Rooftop LiDAR Dome */}
        <circle cx="0" cy="0" r="4.5" fill="#00f0ff" stroke="#0284c7" strokeWidth="1" />
        <circle cx="0" cy="0" r="2" fill="#ffffff" />
        {/* Rotating sensor pulse */}
        <circle
          cx="0"
          cy="0"
          r="8"
          fill="none"
          stroke="#00f0ff"
          strokeWidth="1"
          opacity="0.6"
          className="animate-ping"
        />
      </g>
    );
  };

  return (
    <div className={`relative w-full overflow-hidden rounded-2xl bg-[#070d1e] border border-cyan-950/60 shadow-2xl shadow-cyan-950/20 ${className}`}>
      {/* SVG Canvas Main Stage (1000 x 600 aspect-ratio) */}
      <svg
        id="autonomous-drive-stage"
        viewBox="0 0 1000 600"
        className="w-full h-auto block select-none"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Radar cone gradient */}
          <linearGradient id="radarConeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.4" />
            <stop offset="70%" stopColor="#0284c7" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.0" />
          </linearGradient>

          {/* Glow filter for the ONE active blue route */}
          <filter id="blueRouteGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. Road Background Geometry (Scenario specific) */}
        {renderRoadBackground()}

        {/* 2. Environment Landmarks (Trees, Huts, Stalls, Buildings) */}
        {renderLandmarks()}

        {/* 
          3. CRITICAL REQUIREMENT:
          THERE MUST BE ONLY ONE ROUTE LINE.
          SOLID BLUE.
          AND DIRECTION ARROWS ON THE SAME BLUE ROUTE.
        */}
        {settings.showRoute && (
          <g id="active-blue-route-group">
            {/* Outer subtle glow backing for the ONE blue route */}
            <path
              d={routeSvgPath}
              fill="none"
              stroke="#0284c7"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.4"
            />
            {/* The ONE SOLID BLUE ROUTE */}
            <path
              id="the-single-active-blue-route"
              d={routeSvgPath}
              fill="none"
              stroke="#00f0ff"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#blueRouteGlow)"
            />

            {/* Direction Arrows ON THE SAME BLUE ROUTE */}
            {directionArrows.map((arrow, idx) => (
              <g
                key={`dir-arrow-${idx}`}
                transform={`translate(${arrow.x}, ${arrow.y}) rotate(${arrow.angle})`}
                className="pointer-events-none"
              >
                {/* Clean white/cyan directional chevron */}
                <path
                  d="M -5 -4 L 2 0 L -5 4"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.9"
                />
              </g>
            ))}
          </g>
        )}

        {/* 4. Start & Destination Markers */}
        {activeRoute.length > 0 && (
          <g id="route-termini-group" className="pointer-events-none">
            {/* Start Marker */}
            <circle cx={activeRoute[0].x} cy={activeRoute[0].y} r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
            {/* Destination Marker */}
            <g transform={`translate(${activeRoute[activeRoute.length - 1].x}, ${activeRoute[activeRoute.length - 1].y})`}>
              <circle cx="0" cy="0" r="10" fill="#00f0ff" opacity="0.2" className="animate-ping" />
              <circle cx="0" cy="0" r="7" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
              <circle cx="0" cy="0" r="3" fill="#ffffff" />
              <text x="0" y="-12" textAnchor="middle" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">
                DEST
              </text>
            </g>
          </g>
        )}

        {/* 5. Detected Objects (Cow, Auto, Bike, Truck, Pushcart, Pedestrians) */}
        {renderDetectedObjects()}

        {/* 6. Autonomous Vehicle directly on the route */}
        {renderAutonomousVehicle()}
      </svg>

      {/* Real-time Status Overlay Banners (Emergency Braking & Replanning) */}
      {showControlsOverlay && (
        <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between pointer-events-none gap-2 z-10">
          {/* Active Mode / Event Pill */}
          <div className="flex items-center gap-2 pointer-events-auto">
            {emergencyBrakingActive ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-950/90 border border-red-500 text-red-300 font-mono text-xs font-bold animate-pulse shadow-lg shadow-red-950/50">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                <span>⚠ EMERGENCY BRAKING ACTIVE: OBSTACLE IMMINENT</span>
              </div>
            ) : replanningActive ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-950/90 border border-amber-500 text-amber-300 font-mono text-xs font-bold animate-pulse shadow-lg shadow-amber-950/50">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <span>REPLANNING ACTIVE ROUTE... FRENET POLYNOMIAL SYNTHESIS</span>
              </div>
            ) : isReplanned ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-950/85 border border-cyan-500/60 text-cyan-300 font-mono text-xs font-semibold backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                <span>ACTIVE: REPLANNED COLLISION-FREE ROUTE (1 SOLID BLUE PATH)</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/85 border border-slate-700/60 text-slate-300 font-mono text-xs backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>NOMINAL TRACKING: ACTIVE BLUE ROUTE</span>
              </div>
            )}
          </div>

          {/* Telemetry Corner Badges */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <div className="px-2.5 py-1 rounded-md bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-cyan-400 backdrop-blur-sm">
              SPEED: <span className="text-white font-bold">{vehicle.speed} km/h</span>
            </div>
            <div className="px-2.5 py-1 rounded-md bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-300 backdrop-blur-sm">
              RISK:{' '}
              <span
                className={`font-bold ${
                  riskLevel === 'HIGH' ? 'text-red-400' : riskLevel === 'MEDIUM' ? 'text-amber-400' : 'text-emerald-400'
                }`}
              >
                {riskLevel}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom overlay: Single Route Confirmation legend */}
      <div className="absolute bottom-2 left-3 flex items-center gap-2 pointer-events-none text-[10px] font-mono text-cyan-300/80 bg-slate-950/70 px-2.5 py-1 rounded border border-cyan-900/40 backdrop-blur-sm">
        <span className="w-4 h-1 rounded bg-[#00f0ff]"></span>
        <span>SINGLE ACTIVE BLUE ROUTE (ROAD-ALIGNED WAYPOINTS)</span>
      </div>
    </div>
  );
};
