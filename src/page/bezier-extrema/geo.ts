import { Point } from '../../type';

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
  // 求根公式的分母 denominator
  const d = a - 2 * b + c;

  if (d !== 0) {
    // 正常的一元二次方程，有两个解

    // 一元二次方程组的判别式 delta 的的化简版的平方，常数提取出去了，并被约掉了。
    const deltaSquare = b * b - a * c;
    if (deltaSquare < 0) {
      // 负数，方程无实数根
      debugger;
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
    // debugger;
    // d 为 0，代表一元二次方程的 x^2 前面的系数也是 0，退化为一元一次方程，只有一个解
    // 但也要确保 x 前的系数不为 0，否则连一次方程都不是了
    console.log('??', -a / (b - a) / 2);
    return [-a / (b - a) / 2];
  } else {
    return [];
  }
};
