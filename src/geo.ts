import { Point } from './type';

const distance = (p1: Point, p2: Point) => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

// 计算等边三角形
export const getEquilateralTriangle = (
  p1: Point,
  p2: Point,
  width: number,
): [Point, Point, Point] => {
  const dist = distance(p1, p2);
  const halfWidth = width / 2;

  const triangleHeight = halfWidth / Math.tan(Math.PI / 6);
  const t = triangleHeight / dist;
  p2 = {
    x: p1.x + (p2.x - p1.x) * t,
    y: p1.y + (p2.y - p1.y) * t,
  };
  const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
  const angle90 = angle + Math.PI / 2;

  const dx = Math.cos(angle90) * halfWidth;
  const dy = Math.sin(angle90) * halfWidth;

  return [
    { x: p1.x + dx, y: p1.y + dy },
    { x: p1.x - dx, y: p1.y - dy },
    { x: p2.x, y: p2.y },
  ];
};

/**
 * 给一条线 p1-p2，求延长线经过大小为 size 的中心的邻接矩形
 */
export const getAdjSquare = (p1: Point, p2: Point, size: number) => {
  const halfSize = size / 2;
  const vector = { x: p2.x - p1.x, y: p2.y - p1.y };

  let dx = 0;
  let dy = 0;
  // 注意矢量为零的情况，此时我希望矩形靠上方
  if (Math.abs(vector.x) > Math.abs(vector.y)) {
    dx = Math.sign(vector.x) * halfSize;
    dy = vector.x === 0 ? 0 : (dx * vector.y) / vector.x;
  } else {
    dy = (Math.sign(vector.y) || -1) * halfSize;
    dx = vector.y === 0 ? 0 : (dy * vector.x) / vector.y;
  }

  const center = {
    x: p2.x + dx,
    y: p2.y + dy,
  };

  return {
    center,
    points: [
      {
        x: center.x - halfSize,
        y: center.y - halfSize,
      },
      {
        x: center.x + halfSize,
        y: center.y - halfSize,
      },
      {
        x: center.x + halfSize,
        y: center.y + halfSize,
      },
      {
        x: center.x - halfSize,
        y: center.y + halfSize,
      },
    ],
  };
};

/**
 * 计算贝塞尔曲线的连续多个点，用于绘制贝塞尔曲线
 * （直接代入公式）
 */
export const getBezierPoints = (
  p1: Point,
  cp1: Point,
  cp2: Point,
  p2: Point,
  step = 0.01,
): Point[] => {
  const points: Point[] = [];
  for (let t = 0; t <= 1.00000001; t += step) {
    console.log(t);
    const x =
      (1 - t) ** 3 * p1.x +
      3 * (1 - t) ** 2 * t * cp1.x +
      3 * (1 - t) * t ** 2 * cp2.x +
      t ** 3 * p2.x;
    const y =
      (1 - t) ** 3 * p1.y +
      3 * (1 - t) ** 2 * t * cp1.y +
      3 * (1 - t) * t ** 2 * cp2.y +
      t ** 3 * p2.y;
    points.push({ x, y });
  }
  return points;
};

export const nearestPointOnLine = (
  p1: Point,
  p2: Point,
  p: Point,
  /** 可以在线段之外 */
  canOutside = true,
) => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  let t = ((p.x - p1.x) * dx + (p.y - p1.y) * dy) / (dx * dx + dy * dy);
  if (!canOutside) {
    t = Math.max(0, Math.min(1, t));
  }
  return {
    x: p1.x + t * dx,
    y: p1.y + t * dy,
  };
};

export const nearestPointOnCircle = (
  center: Point,
  radius: number,
  p: Point,
) => {
  const dx = p.x - center.x;
  const dy = p.y - center.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist <= radius) {
    return p;
  }
  return {
    x: center.x + (dx * radius) / dist,
    y: center.y + (dy * radius) / dist,
  };
};

// 插值算法
// 已知 p1 和 p2，求 p1 到 p2 方向，距离 dist 的点 p
export const interpolate = (p1: Point, p2: Point, dist: number) => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const d = Math.sqrt(dx * dx + dy * dy);
  return {
    x: p1.x + (dx * dist) / d,
    y: p1.y + (dy * dist) / d,
  };
};
