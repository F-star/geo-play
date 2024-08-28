import { Matrix } from 'pixi.js';
import { Box, Point } from './type';

export const distance = (p1: Point, p2: Point) => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
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

export const closestPointOnLine = (
  p1: Point,
  p2: Point,
  p: Point,
  /** 是否限制在在线段之内 */
  canOutside = false,
) => {
  if (p1.x === p2.x && p1.y === p2.y) {
    return {
      t: 0,
      d: distance(p1, p),
      point: { x: p1.x, y: p1.y },
    };
  }
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  let t = ((p.x - p1.x) * dx + (p.y - p1.y) * dy) / (dx * dx + dy * dy);
  if (!canOutside) {
    t = Math.max(0, Math.min(1, t));
  }
  const closestPt = {
    x: p1.x + t * dx,
    y: p1.y + t * dy,
  };
  return {
    t,
    d: distance(p, closestPt),
    point: closestPt,
  };
};

export const closestPointOnCircle = (
  center: Point,
  radius: number,
  p: Point,
) => {
  const dx = p.x - center.x;
  const dy = p.y - center.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const t = dist === 0 ? 0 : radius / dist;
  const closestPt = {
    x: center.x + dx * t,
    y: center.y + dy * t,
  };
  return {
    d: Math.abs(dist - radius),
    point: closestPt,
  };
};

export const lerp = (p1: Point, p2: Point, t: number) => {
  return {
    x: (1 - t) * p1.x + t * p2.x,
    y: (1 - t) * p1.y + t * p2.y,
  };
};

/**
 * 插值算法
 * 已知 p1 和 p2，求 p1 到 p2 方向，距离 dist 的点 p
 * dist 可以为负
 */
export const interpolate = (p1: Point, p2: Point, dist: number) => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const d = Math.sqrt(dx * dx + dy * dy);
  const t = dist / d;
  return {
    x: p1.x + dx * t,
    y: p1.y + dy * t,
  };
};

/** 求两个向量的夹角 */
export const getAngle = (a: Point, b: Point) => {
  // FIXME: 注意零向量问题

  // 使用点乘求夹角
  const dot = a.x * b.x + a.y * b.y;
  const d = Math.sqrt(a.x * a.x + a.y * a.y) * Math.sqrt(b.x * b.x + b.y * b.y);
  let cosTheta = dot / d;
  // 修正精度问题导致的 cosTheta 超出 [-1, 1] 的范围
  // 导致 Math.acos(cosTheta) 的结果为 NaN
  if (cosTheta > 1) {
    cosTheta = 1;
  } else if (cosTheta < -1) {
    cosTheta = -1;
  }
  return Math.acos(cosTheta);
};

/**
 * 求向量 a 到向量 b 扫过的夹角
 * 这里假设为 x时针方向为正
 */
export const getSweepAngle = (a: Point, b: Point) => {
  // FIXME: 注意零向量问题

  // 使用点乘求夹角
  const dot = a.x * b.x + a.y * b.y;
  const d = Math.sqrt(a.x * a.x + a.y * a.y) * Math.sqrt(b.x * b.x + b.y * b.y);
  let cosTheta = dot / d;
  // 修正精度问题导致的 cosTheta 超出 [-1, 1] 的范围
  // 导致 Math.acos(cosTheta) 的结果为 NaN
  if (cosTheta > 1) {
    cosTheta = 1;
  } else if (cosTheta < -1) {
    cosTheta = -1;
  }

  let theta = Math.acos(cosTheta);
  // 通过叉积判断方向
  // 如果 b 在 a 的左边，则取负值
  if (a.x * b.y - a.y * b.x < 0) {
    theta = -theta;
  }

  return theta;
};

// 弧度转角度
export const radToDeg = (rad: number) => {
  return (rad * 180) / Math.PI;
};

const rotate = (p: Point, center: Point, rad: number) => {
  const dx = p.x - center.x;
  const dy = p.y - center.y;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return {
    x: center.x + dx * cos - dy * sin,
    y: center.y + dx * sin + dy * cos,
  };
};

const rotateWithMatrix = (p: Point, center: Point, rad: number) => {
  const matrix = new Matrix()
    .translate(-center.x, -center.y) // (3) 坐标轴回到原来位置
    .rotate(rad) // (2) 旋转
    .translate(center.x, center.y); // (1) 坐标轴原点移动到 center

  return matrix.apply(p);
};

/**
 * 计算和圆内切的正多边形
 * @param center 圆心
 * @param start 起点
 * @param count 边数
 */
export const getInternalTanRegularPolygon = (
  center: Point,
  start: Point,
  count: number,
) => {
  const points: Point[] = [{ ...start }];
  const step = (Math.PI * 2) / count;
  for (let i = 1; i < count; i++) {
    points.push(rotate(start, center, step * i));
  }
  return points;
};

export const getInternalTanRegularPolygon2 = (
  center: Point,
  start: Point,
  count: number,
) => {
  const points: Point[] = [{ ...start }];
  const step = (Math.PI * 2) / count;
  for (let i = 1; i < count; i++) {
    points.push(rotate(points[i - 1], center, step));
  }
  return points;
};

/**
 * 计算和圆外切的正多边形
 * @param center 圆心
 * @param start 起点
 * @param count 边数
 */
export const getExternalTanRegularPolygon = (
  center: Point,
  start: Point,
  count: number,
) => {
  // 转换为内切多边形，计算新的 start
  const offsetAngle = Math.PI / count;
  start = rotate(start, center, offsetAngle);
  const t = 1 / Math.cos(offsetAngle);
  start = {
    x: center.x + (start.x - center.x) * t,
    y: center.y + (start.y - center.y) * t,
  };

  return getInternalTanRegularPolygon(center, start, count);
};

/**
 * 两个凸多边形是否相交
 */
export const isConvexPolygonIntersect = (
  polygon1: Point[],
  polygon2: Point[],
) => {
  // 分离轴定理
  const axes = [
    ...getConvexPolygonAxes(polygon1),
    ...getConvexPolygonAxes(polygon2),
  ];
  for (const axis of axes) {
    const projection1 = projectPolygon(axis, polygon1);
    const projection2 = projectPolygon(axis, polygon2);
    if (!isOverlap(projection1, projection2)) {
      return false;
    }
  }
};

/**
 * 获取凸多边形的所有轴
 */
const getConvexPolygonAxes = (polygon: Point[]) => {
  const axes: Point[] = [];
  for (let i = 0; i < polygon.length; i++) {
    const p1 = polygon[i];
    const p2 = polygon[(i + 1) % polygon.length];
    const edge = { x: p2.x - p1.x, y: p2.y - p1.y };
    const axis = { x: -edge.y, y: edge.x };
    axes.push(normalize(axis));
  }
  return axes;
};

/**
 * 投影多边形到轴上
 */
const projectPolygon = (axis: Point, polygon: Point[]) => {
  let min = Infinity;
  let max = -Infinity;
  for (const p of polygon) {
    const dot = p.x * axis.x + p.y * axis.y;
    min = Math.min(min, dot);
    max = Math.max(max, dot);
  }
  return { min, max };
};

/**
 * 判断两个投影是否重叠
 */
const isOverlap = (
  projection1: { min: number; max: number },
  projection2: { min: number; max: number },
) => {
  return (
    projection1.min <= projection2.max && projection2.min <= projection1.max
  );
};

/**
 * 归一化向量
 */
const normalize = (vector: Point) => {
  const d = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
  return { x: vector.x / d, y: vector.y / d };
};

/**
 * 求两条直线交点
 */
export const getLineIntersection = (
  p1: Point,
  p2: Point,
  p3: Point,
  p4: Point,
): Point | null => {
  const { x: x1, y: y1 } = p1;
  const { x: x2, y: y2 } = p2;
  const { x: x3, y: y3 } = p3;
  const { x: x4, y: y4 } = p4;

  const a = y2 - y1;
  const b = x1 - x2;
  const c = x1 * y2 - x2 * y1;

  const d = y4 - y3;
  const e = x3 - x4;
  const f = x3 * y4 - x4 * y3;

  // 计算分母
  const denominator = a * e - b * d;

  // 判断分母是否为 0（代表平行）
  if (Math.abs(denominator) < 0.000000001) {
    // 这里有个特殊的重叠但只有一个交点的情况，可以考虑处理一下
    return null;
  }

  const px = (c * e - f * b) / denominator;
  const py = (a * f - c * d) / denominator;

  return { x: px, y: py };
};

export const getPointsBbox = (points: Point[]) => {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const pt of points) {
    minX = Math.min(minX, pt.x);
    minY = Math.min(minY, pt.y);
    maxX = Math.max(maxX, pt.x);
    maxY = Math.max(maxY, pt.y);
  }

  return {
    minX,
    minY,
    maxX,
    maxY,
  };
};

export const isPointInBox = (box: Box, point: Point, tol = 0) => {
  return (
    point.x >= box.minX - tol &&
    point.y >= box.minY - tol &&
    point.x <= box.maxX + tol &&
    point.y <= box.maxY + tol
  );
};
