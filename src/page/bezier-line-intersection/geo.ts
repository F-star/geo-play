import { Matrix } from 'pixi.js';
import { Point } from '../../type';
import { getPointsBbox, isPointInBox } from '../../geo';

export const getBezierAndLineIntersection = (
  bezier: Point[],
  line: Point[],
) => {
  // 1. bezier 和 line 一起旋转对齐 x 轴
  const angle = -Math.atan2(line[1].y - line[0].y, line[1].x - line[0].x);
  const matrix = new Matrix().translate(-line[0].x, -line[0].y).rotate(angle);

  const alignedBezier = bezier.map((pt) => matrix.apply(pt));
  // const alignedBezier = bezier.map((pt) => {
  //   return {
  //     x:
  //       (pt.x - line[0].x) * Math.cos(angle) -
  //       (pt.y - line[0].y) * Math.sin(angle),
  //     y:
  //       (pt.x - line[0].x) * Math.sin(angle) +
  //       (pt.y - line[0].y) * Math.cos(angle),
  //   };
  // });
  const [y0, y1, y2, y3] = alignedBezier.map((pt) => pt.y);

  // 2. 求对齐后的贝塞尔曲线和直线 y=0 的交点
  // 其实就是找贝塞尔曲线上，y 为 0 的点
  const a = -y0 + 3 * y1 - 3 * y2 + y3;
  const b = 3 * y0 - 6 * y1 + 3 * y2;
  const c = -3 * y0 + 3 * y1;
  const d = y0;

  const tArr = roots3(a, b, c, d);
  const lineBbox = getPointsBbox(line);

  return tArr
    .filter((t) => t >= 0 && t <= 1)
    .map((t) => {
      // 计算 t 对应的坐标
      return {
        t,
        point: getBezier3Point(bezier, t),
      };
    })
    .filter((item) => {
      // 点也需要在线段内（需要判断点是否在线段包围盒内）
      return isPointInBox(lineBbox, item.point);
    });
};

/** 求一元三次方程的根 */
const roots3 = (w: number, a: number, b: number, c: number) => {
  if (w !== 0) {
    // 三次方程
    // https://www.trans4mind.com/personal_development/mathematics/polynomials/cubicAlgebra.htm
    // 转成 x^3 + a * x^2 + b * x + c 的格式（三次项系数变成 1）
    a /= w;
    b /= w;
    c /= w;

    // 使用 "Cardano formula" 求根，转成没有二次项的形式（Depressed Cubic）
    // t ^ 3 + p * t + q = 0
    // 令 x = t - a / 3
    const p = (3 * b - a * a) / 3;
    const q = (2 * a * a * a - 9 * a * b + 27 * c) / 27;

    // 判别式 delta
    const delta = (q * q) / 4 + (p * p * p) / 27;
    // 根有三个。
    if (delta === 0) {
      // 根都是实数根，且两个根相等，共两个不同的实数根
      const t = cubicRoot(-q / 2);
      const x1 = 2 * t - a / 3;
      const x2 = t - a / 3;
      return [x1, x2];
    }
    if (delta > 0) {
      // 一个实数根，两个复数根（复数根我们不需要，直接丢掉）
      const halfQ = q / 2;
      const sqrtDelta = Math.sqrt(delta);
      return [
        cubicRoot(-halfQ + sqrtDelta) - cubicRoot(halfQ + sqrtDelta) - a / 3,
      ];
    }
    // 三个不同实根
    const r = Math.sqrt(Math.pow(-p / 3, 3));
    // De Moivre's formula（棣莫弗公式）
    const cosVal = Math.max(Math.min(-q / (2 * r), 1), -1); // 处理误差超出 cos 值区间的情况
    const angle = Math.acos(cosVal);
    const x1 = 2 * cubicRoot(r) * Math.cos(angle / 3) - a / 3;
    const x2 = 2 * cubicRoot(r) * Math.cos((angle + Math.PI * 2) / 3) - a / 3;
    const x3 = 2 * cubicRoot(r) * Math.cos((angle + Math.PI * 4) / 3) - a / 3;
    return [x1, x2, x3];
  } else {
    // 退化为二次方程
    return roots2(a, b, c);
  }
};

const cubicRoot = (num: number) => {
  // num 如果是负数，Math.pow 就会返回 NaN，即使是开立方。
  // 所以要特殊处理下，先转成正数计算完再把符号加上
  return num > 0 ? Math.pow(num, 1 / 3) : -Math.pow(-num, 1 / 3);
};

/** 求一元二次方程的根 */
const roots2 = (a: number, b: number, c: number) => {
  if (a !== 0) {
    // const delta = c * c - 4 * b * c;
    const delta = b * b - 4 * a * c;
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

const getBezier3Point = (pts: Point[], t: number) => {
  const [p1, cp1, cp2, p2] = pts;

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

/** 判断点是否在线段内（已知点在直线上） */
// const isPtInSegment = () => {

// }

/** 求一元三次方程的根 */
// const roots3_old = (a: number, b: number, c: number, d: number) => {
//   if (a !== 0) {
//     // 三次方程
//     // 转成三次项系数为 1 的形式
//     const p = (3 * a * c - b * b) / (3 * a * a);
//     const q =
//       (2 * b * b * b - 9 * a * b * c + 27 * a * a * d) / (27 * a * a * a);

//     // 使用 "Cardano formula" 求根

//     // 判别式
//     const delta = (q * q) / 4 + (p * p * p) / 27;
//     if (delta >= 0) {
//       // 3 个解？
//       const halfQ = -q / 2;
//       const deltaSqrt = Math.sqrt(delta);
//       const u = cubicRoot(halfQ + deltaSqrt);
//       const v = cubicRoot(halfQ - deltaSqrt);
//       const t = u + v;
//       return [t].filter((v) => v - b / (3 * a));
//     }
//     // TODO: 待完成
//     return [];

//     // 转成没有二次项的形式
//   } else {
//     // 退化为二次方程
//     return roots2(b, c, d);
//   }
// };
