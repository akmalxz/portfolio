export interface RoomPoint {
  x: number;
  y: number;
}

export interface RoomRect {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export const WALKABLE_BOUNDS: RoomRect = {
  minX: 28,
  maxX: 512,
  minY: 28,
  maxY: 352,
};

/**
 * Padded 2D obstacle rectangles in `.iso-world` floor coordinates (540x380).
 * Padding accounts for the character's ~16px half-width footprint so paths
 * stay visually clear of furniture edges and corners.
 */
export const ROOM_OBSTACLES: readonly RoomRect[] = [
  // Desk (actual: x 22..194, y 8..92)
  { minX: 0, maxX: 208, minY: 0, maxY: 108 },
  // Desk chair (actual: x 90..142, y 114..156) — bridged to desk so character walks around
  { minX: 74, maxX: 158, minY: 98, maxY: 170 },
  // Edge NAS appliance (actual: x 224..278, y 10..58) — bridged to desk gap
  { minX: 206, maxX: 292, minY: 0, maxY: 74 },
  // Rectangular holotable (actual: x 126..262, y 230..298)
  { minX: 108, maxX: 276, minY: 214, maxY: 316 },
  // Server rack plinth (actual: x 454..526, y 54..344)
  { minX: 434, maxX: 540, minY: 38, maxY: 360 },
];

const CORNER_OFFSET = 2;
const EPS = 1e-6;

function isInsideRect(p: RoomPoint, r: RoomRect): boolean {
  return p.x > r.minX && p.x < r.maxX && p.y > r.minY && p.y < r.maxY;
}

function isWalkablePoint(p: RoomPoint): boolean {
  if (
    p.x < WALKABLE_BOUNDS.minX ||
    p.x > WALKABLE_BOUNDS.maxX ||
    p.y < WALKABLE_BOUNDS.minY ||
    p.y > WALKABLE_BOUNDS.maxY
  ) {
    return false;
  }
  return !ROOM_OBSTACLES.some((rect) => isInsideRect(p, rect));
}

export function clampToWalkableFloor(rawX: number, rawY: number): RoomPoint {
  const clamped: RoomPoint = {
    x: Math.max(WALKABLE_BOUNDS.minX, Math.min(WALKABLE_BOUNDS.maxX, Math.round(rawX))),
    y: Math.max(WALKABLE_BOUNDS.minY, Math.min(WALKABLE_BOUNDS.maxY, Math.round(rawY))),
  };

  if (isWalkablePoint(clamped)) {
    return clamped;
  }

  // Project onto every obstacle's outer boundary + walkable corners and pick the closest valid spot
  const candidates: RoomPoint[] = [...getVisibilityCorners()];
  for (const r of ROOM_OBSTACLES) {
    const clampedX = Math.max(r.minX - CORNER_OFFSET, Math.min(r.maxX + CORNER_OFFSET, clamped.x));
    const clampedY = Math.max(r.minY - CORNER_OFFSET, Math.min(r.maxY + CORNER_OFFSET, clamped.y));
    const edgePoints: RoomPoint[] = [
      { x: r.minX - CORNER_OFFSET, y: clampedY },
      { x: r.maxX + CORNER_OFFSET, y: clampedY },
      { x: clampedX, y: r.minY - CORNER_OFFSET },
      { x: clampedX, y: r.maxY + CORNER_OFFSET },
    ];
    for (const pt of edgePoints) {
      if (isWalkablePoint(pt)) {
        candidates.push(pt);
      }
    }
  }

  if (candidates.length === 0) return clamped;

  let best = candidates[0];
  let bestDist = Math.hypot(best.x - clamped.x, best.y - clamped.y);
  for (let i = 1; i < candidates.length; i += 1) {
    const d = Math.hypot(candidates[i].x - clamped.x, candidates[i].y - clamped.y);
    if (d < bestDist) {
      bestDist = d;
      best = candidates[i];
    }
  }

  return { x: Math.round(best.x), y: Math.round(best.y) };
}

function segmentIntersectsRect(a: RoomPoint, b: RoomPoint, r: RoomRect): boolean {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  let tEnter = 0;
  let tExit = 1;

  if (Math.abs(dx) < EPS) {
    if (a.x <= r.minX || a.x >= r.maxX) return false;
  } else {
    let t1 = (r.minX - a.x) / dx;
    let t2 = (r.maxX - a.x) / dx;
    if (t1 > t2) [t1, t2] = [t2, t1];
    tEnter = Math.max(tEnter, t1);
    tExit = Math.min(tExit, t2);
    if (tEnter >= tExit - EPS) return false;
  }

  if (Math.abs(dy) < EPS) {
    if (a.y <= r.minY || a.y >= r.maxY) return false;
  } else {
    let t1 = (r.minY - a.y) / dy;
    let t2 = (r.maxY - a.y) / dy;
    if (t1 > t2) [t1, t2] = [t2, t1];
    tEnter = Math.max(tEnter, t1);
    tExit = Math.min(tExit, t2);
    if (tEnter >= tExit - EPS) return false;
  }

  return tEnter < tExit - EPS;
}

function isSegmentClear(a: RoomPoint, b: RoomPoint): boolean {
  return !ROOM_OBSTACLES.some((rect) => segmentIntersectsRect(a, b, rect));
}

function getVisibilityCorners(): RoomPoint[] {
  const corners: RoomPoint[] = [];
  for (const r of ROOM_OBSTACLES) {
    const candidates: RoomPoint[] = [
      { x: r.minX - CORNER_OFFSET, y: r.minY - CORNER_OFFSET },
      { x: r.maxX + CORNER_OFFSET, y: r.minY - CORNER_OFFSET },
      { x: r.minX - CORNER_OFFSET, y: r.maxY + CORNER_OFFSET },
      { x: r.maxX + CORNER_OFFSET, y: r.maxY + CORNER_OFFSET },
    ];
    for (const c of candidates) {
      if (isWalkablePoint(c)) {
        corners.push(c);
      }
    }
  }
  return corners;
}

/**
 * Computes the shortest obstacle-free polyline from `from` to `to` over a
 * visibility graph built from padded obstacle corners.
 */
export function findRoomPath(from: RoomPoint, to: RoomPoint): RoomPoint[] {
  const start = isWalkablePoint(from) ? from : clampToWalkableFloor(from.x, from.y);
  const goal = isWalkablePoint(to) ? to : clampToWalkableFloor(to.x, to.y);

  if (Math.hypot(goal.x - start.x, goal.y - start.y) < 2) {
    return [goal];
  }

  if (isSegmentClear(start, goal)) {
    return [goal];
  }

  const nodes: RoomPoint[] = [start, ...getVisibilityCorners(), goal];
  const n = nodes.length;
  const dist = new Array<number>(n).fill(Infinity);
  const prev = new Array<number>(n).fill(-1);
  const visited = new Array<boolean>(n).fill(false);

  dist[0] = 0;

  for (let iter = 0; iter < n; iter += 1) {
    let u = -1;
    let best = Infinity;
    for (let i = 0; i < n; i += 1) {
      if (!visited[i] && dist[i] < best) {
        best = dist[i];
        u = i;
      }
    }
    if (u === -1 || u === n - 1) break;
    visited[u] = true;

    for (let v = 0; v < n; v += 1) {
      if (visited[v]) continue;
      if (!isSegmentClear(nodes[u], nodes[v])) continue;
      const alt = dist[u] + Math.hypot(nodes[v].x - nodes[u].x, nodes[v].y - nodes[u].y);
      if (alt < dist[v]) {
        dist[v] = alt;
        prev[v] = u;
      }
    }
  }

  if (prev[n - 1] === -1) {
    return [goal];
  }

  const waypoints: RoomPoint[] = [];
  let curr = n - 1;
  while (curr > 0) {
    waypoints.push(nodes[curr]);
    curr = prev[curr];
  }
  waypoints.reverse();
  return waypoints;
}
