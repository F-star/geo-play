import { distance } from '../../geo';
import { Point } from '../../type';

/** 计算三阶贝塞尔曲线 t 对应的点（套用参数方程公式） */
export const getBezier3Point = (
  p1: Point,
  cp1: Point,
  cp2: Point,
  p2: Point,
  t: number,
) => {
  const t2 = t * t;
  const ct = 1 - t;
  const ct2 = ct * ct;
  const a = ct2 * ct;
  const b = 3 * t * ct2;
  const c = 3 * t2 * ct;
  const d = t2 * t;

  return {
    x: a * p1.x + b * cp1.x + c * cp2.x + d * p2.x,
    y: a * p1.y + b * cp1.y + c * cp2.y + d * p2.y,
  };
};

/**
 * 牛顿迭代法
 * 当然贝塞尔曲线的参数方程并不单调，所以实际运算量还是很大，但能规避一些不必要的区域
 * https://www.bilibili.com/video/BV1HQ4y1q78v/
 *
 * 一个 C 的算法库
 * https://github.com/recp/cglm
 */
export const calcBezier3Project = (
  p1: Point,
  cp1: Point,
  cp2: Point,
  p2: Point,
  targetPt: Point,
  lookupTable: { t: number; pt: Point }[] = [],
) => {
  const count = 100;

  if (lookupTable.length === 0) {
    // 第一步是一定要执行的，缓存起来。
    // 因为 t += step 这种写法会不断累加浮点数误差，稍微换成 i / count 的写法
    for (let i = 0; i <= count; i++) {
      const t = i / count;
      const pt = getBezier3Point(p1, cp1, cp2, p2, t);
      lookupTable[i] = { t, pt };
    }
  }

  let minDist = Number.MAX_SAFE_INTEGER;
  let minIndex = -1;

  for (let i = 0; i < lookupTable.length; i++) {
    const item = lookupTable[i];
    const dist = distance(targetPt, item.pt);
    if (dist < minDist) {
      minDist = dist;
      minIndex = i;
      // 找到 0 距离点，提前结束
      if (dist === 0) {
        break;
      }
    }
  }

  if (minDist === 0) {
    const projectPt = getBezier3Point(
      p1,
      cp1,
      cp2,
      p2,
      lookupTable[minIndex].t,
    );
    return {
      point: projectPt,
      t: lookupTable[minIndex].t,
      dist: distance(targetPt, projectPt),
    };
  }

  let minT = lookupTable[minIndex].t;

  const t1 = minIndex > 0 ? lookupTable[minIndex - 1].t : minT;
  const t2 =
    minIndex < lookupTable.length - 1 ? lookupTable[minIndex + 1].t : minT;

  let step = 0.001; // 原来的 1/10
  for (let t = t1; t <= t2; t += step) {
    const pt = getBezier3Point(p1, cp1, cp2, p2, t);
    const dist = distance(targetPt, pt);
    if (dist < minDist) {
      minDist = dist;
      minT = t;
      // 找到 0 距离点，提前结束
      if (dist === 0) {
        break;
      }
    }
  }

  if (minT < 0) {
    minT = 0;
  }
  if (minT > 1) {
    minT = 1;
  }
  const projectPt = getBezier3Point(p1, cp1, cp2, p2, minT);
  return {
    point: projectPt,
    t: minT,
    dist: distance(targetPt, projectPt),
  };
};
