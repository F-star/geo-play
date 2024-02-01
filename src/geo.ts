import { Point } from "./type";

const distance = (p1: Point, p2: Point) => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

// 计算等边三角形
export const getEquilateralTriangle = (
  p1: Point,
  p2: Point,
  width: number
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
