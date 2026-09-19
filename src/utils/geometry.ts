import { Waypoint } from '../types';

export interface RoutePointWithHeading {
  x: number;
  y: number;
  heading: number; // degrees
  distanceFromStart: number;
}

// Calculate total length of a series of waypoints
export function calculatePathLength(waypoints: Waypoint[]): number {
  if (waypoints.length < 2) return 0;
  let len = 0;
  for (let i = 0; i < waypoints.length - 1; i++) {
    const dx = waypoints[i + 1].x - waypoints[i].x;
    const dy = waypoints[i + 1].y - waypoints[i].y;
    len += Math.sqrt(dx * dx + dy * dy);
  }
  return len;
}

// Get interpolated position and tangent heading along waypoints for a given progress ratio (0 to 1)
export function getPointAlongPath(waypoints: Waypoint[], progress: number): RoutePointWithHeading {
  const clampedProgress = Math.max(0, Math.min(1, progress));
  if (waypoints.length === 0) {
    return { x: 0, y: 0, heading: 0, distanceFromStart: 0 };
  }
  if (waypoints.length === 1) {
    return { x: waypoints[0].x, y: waypoints[0].y, heading: 0, distanceFromStart: 0 };
  }

  const totalLength = calculatePathLength(waypoints);
  const targetDistance = clampedProgress * totalLength;

  let accumulated = 0;
  for (let i = 0; i < waypoints.length - 1; i++) {
    const p1 = waypoints[i];
    const p2 = waypoints[i + 1];
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const segmentLength = Math.sqrt(dx * dx + dy * dy);

    if (accumulated + segmentLength >= targetDistance || i === waypoints.length - 2) {
      const segmentProgress = segmentLength > 0 ? (targetDistance - accumulated) / segmentLength : 0;
      const clampedSegmentProg = Math.max(0, Math.min(1, segmentProgress));
      
      const x = p1.x + dx * clampedSegmentProg;
      const y = p1.y + dy * clampedSegmentProg;
      const heading = (Math.atan2(dy, dx) * 180) / Math.PI;

      return {
        x,
        y,
        heading,
        distanceFromStart: targetDistance
      };
    }
    accumulated += segmentLength;
  }

  const last = waypoints[waypoints.length - 1];
  const secondLast = waypoints[waypoints.length - 2];
  const heading = (Math.atan2(last.y - secondLast.y, last.x - secondLast.x) * 180) / Math.PI;
  return { x: last.x, y: last.y, heading, distanceFromStart: totalLength };
}

// Generate sample points along the route for drawing direction arrows
export function generateDirectionArrows(waypoints: Waypoint[], stepPixels = 60): Array<{ x: number; y: number; angle: number }> {
  const arrows: Array<{ x: number; y: number; angle: number }> = [];
  const totalLength = calculatePathLength(waypoints);
  if (totalLength < 40) return arrows;

  // Start after first 30px, end 30px before finish
  for (let d = 35; d < totalLength - 25; d += stepPixels) {
    const progress = d / totalLength;
    const pt = getPointAlongPath(waypoints, progress);
    arrows.push({
      x: pt.x,
      y: pt.y,
      angle: pt.heading
    });
  }

  return arrows;
}

// Convert waypoints array into an SVG path 'd' string
export function waypointsToSvgPath(waypoints: Waypoint[]): string {
  if (waypoints.length === 0) return '';
  if (waypoints.length === 1) return `M ${waypoints[0].x} ${waypoints[0].y}`;

  // Use smooth Catmull-Rom or cubic Bezier smoothing
  let d = `M ${waypoints[0].x} ${waypoints[0].y}`;
  for (let i = 1; i < waypoints.length; i++) {
    const prev = waypoints[i - 1];
    const curr = waypoints[i];
    const midX = (prev.x + curr.x) / 2;
    const midY = (prev.y + curr.y) / 2;
    d += ` Q ${prev.x} ${prev.y}, ${midX} ${midY}`;
  }
  const last = waypoints[waypoints.length - 1];
  d += ` L ${last.x} ${last.y}`;
  return d;
}
