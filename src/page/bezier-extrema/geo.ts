import { getPointsBbox } from '../../geo';
import { Point } from '../../type';

const getBezier3Point = (pts: Point[], t: number) => {
  const t2 = t * t;
  const ct = 1 - t;
  const ct2 = ct * ct;
  const a = ct2 * ct;
  const b = 3 * t * ct2;
  const c = 3 * t2 * ct;
  const d = t2 * t;

  const [p1, cp1, cp2, p2] = pts;

  return {
    x: a * p1.x + b * cp1.x + c * cp2.x + d * p2.x,
    y: a * p1.y + b * cp1.y + c * cp2.y + d * p2.y,
  };
};

export const getBezier3Bbox = (pts: Point[]) => {
  const extremas = bezier3Extrema(pts);
  const extremaPts = extremas.map((t) => getBezier3Point(pts, t));
  return getPointsBbox([...extremaPts, pts[0], pts[pts.length - 1]]);
};

export const bezier3Extrema = (pts: Point[]) => {
  // 先求 x 纬度的极值
  const extrema = getRoot(
    3 * (pts[1].y - pts[0].y),
    3 * (pts[2].y - pts[1].y),
    3 * (pts[3].y - pts[2].y),
  );

  extrema.push(
    ...getRoot(
      3 * (pts[1].x - pts[0].x),
      3 * (pts[2].x - pts[1].x),
      3 * (pts[3].x - pts[2].x),
    ),
  );

  return extrema.filter((t) => t >= 0 && t <= 1);
};

const getRoot = (a: number, b: number, c: number) => {
  // 二次项系数，同时求根公式的分母 denominator
  const d = a - 2 * b + c;

  if (d !== 0) {
    // 正常的一元二次方程
    // 一元二次方程组的判别式 delta 的的化简版的平方，常数提取出去了，并被约掉了。
    const deltaSquare = b * b - a * c;
    if (deltaSquare < 0) {
      // 负数，方程无实数根，无解
      return [];
    }
    const delta = Math.sqrt(deltaSquare);
    const m = a - b;
    if (delta === 0) {
      // 两个相等的实数根
      return [(m - delta) / d];
    } else {
      // 两个不等的实数根
      return [(m - delta) / d, (m + delta) / d];
    }
  } else if (a !== b) {
    // d 为 0，代表一元二次方程的 x^2 前面的系数也是 0，退化为一元一次方程，只有一个解
    // 但也要确保 x 前的系数不为 0，否则连一次方程都不是了
    return [a / (a - b) / 2];
  } else {
    return [];
  }
};

export const getXCurve = (pts: Point[], step = 100) => {
  const curve = {
    x: [] as Point[],
    y: [] as Point[],
  };
  for (let i = 0; i <= 100; i++) {
    const t = i / 100;
    const p = getBezier3Point(pts, t);
    curve.x.push({ x: t * 200, y: p.x });
    curve.y.push({ x: t * 200, y: p.y });
  }
  return curve;
};
