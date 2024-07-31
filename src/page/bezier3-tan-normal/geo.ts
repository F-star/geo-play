import { distance, lerp } from '../../geo';
import { Point } from '../../type';

/** 计算三阶贝塞尔曲线 t 对应的点 */
export const getBezier3Point = (
  p1: Point,
  cp1: Point,
  cp2: Point,
  p2: Point,
  t: number,
) => {
  const a = lerp(p1, cp1, t);
  const b = lerp(cp1, cp2, t);
  const c = lerp(cp2, p2, t);

  const e = lerp(a, b, t);
  const f = lerp(b, c, t);
  return lerp(e, f, t);
};

/** 计算三阶贝塞尔曲线 t 位置的切线 */
export const getBezier3TangentLine = (
  p1: Point,
  cp1: Point,
  cp2: Point,
  p2: Point,
  t: number,
) => {
  const a = lerp(p1, cp1, t);
  const b = lerp(cp1, cp2, t);
  const c = lerp(cp2, p2, t);

  return [lerp(a, b, t), lerp(b, c, t)];
};

/** 计算 N 阶贝塞尔曲线 t 对应的点 */
export const getBezierNPoint = (pts: Point[], t: number) => {
  while (pts.length > 1) {
    const nextPts = [];
    for (let i = 0, size = pts.length - 1; i < size; i++) {
      nextPts.push(lerp(pts[i], pts[i + 1], t));
    }
    pts = nextPts;
  }
  return pts[0];
};

/** 计算三阶贝塞尔曲线 t 位置的切向量 */
export const getBezier3Tangent = (
  p1: Point,
  p2: Point,
  cp1: Point,
  cp2: Point,
  t: number,
) => {
  const [a, b] = getBezier3TangentLine(p1, p2, cp1, cp2, t);
  const dist = distance(a, b);
  return {
    x: (b.x - a.x) / dist,
    y: (b.y - a.y) / dist,
  };
};

/** 计算三阶贝塞尔曲线 t 位置的法向量 */
export const getBezier3Normal = (
  p1: Point,
  p2: Point,
  cp1: Point,
  cp2: Point,
  t: number,
) => {
  const tangent = getBezier3Tangent(p1, p2, cp1, cp2, t);
  return {
    x: -tangent.y,
    y: tangent.x,
  }
};
