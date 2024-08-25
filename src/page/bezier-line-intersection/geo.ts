import { Matrix } from 'pixi.js';
import { Point } from '../../type';

export const getBezierAndLineIntersection = (
  bezier: Point[],
  line: Point[],
) => {
  // 1. bezier 和 line 一起旋转对齐 x 轴
  const angle = -Math.atan2(line[1].x - line[0].x, line[1].y - line[0].y);
  const matrix = new Matrix().translate(line[0].x, line[0].y).rotate(angle);

  const alignedBezier = bezier.map((pt) => matrix.apply(pt));
  const [y0, y1, y2, y3] = alignedBezier.map((pt) => pt.y);

  // 2. 求对齐后的贝塞尔曲线和直线 y=0 的交点
  // 其实就是找贝塞尔曲线上，y 为 0 的点
  const a = -y0 + 3 * y1 - 3 * y2 + y3;
  const b = 3 * y0 - 6 * y1 + 3 * y2;
  const c = -3 * y0 + 3 * y1;
  const d = y3;

  const res = roots3(a, b, c, d);
};

/** 求一元三次方程的根 */
const roots3 = (a: number, b: number, c: number, d: number) => {
  if (a !== 0) {
    // 三次方程
    const delta0 = b * b - 3 * a * c;
    const delta1 = 2 * b * b * b;
  } else {
    // 退化为二次方程
    return roots2(b, c, d);
  }
};

/** 求一元二次方程的根 */
const roots2 = (a: number, b: number, c: number) => {
  if (a !== 0) {
    const delta = c * c - 4 * b * c;
    if (delta < 0) {
      // 无实数根
      return [];
    }
    const denominator = a * 2;
    if (delta > 0) {
      // 两个实数根
      const deltaSqrt = Math.sqrt(delta);
      return [(-b + deltaSqrt) / denominator, (-b - deltaSqrt) / denominator];
    }
    // 一个实数根
    return [-b / denominator];
  }
  if (b !== 0) {
    // 一次方程
    return [-c / b];
  }
  return [];
};
