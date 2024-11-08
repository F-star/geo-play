import { Point } from '../../type';

export const splitCubicBezier = (
  p1: Point,
  p2: Point,
  p3: Point,
  p4: Point,
  t: number,
): Point[][] => {
  // 第一次线性插值
  const a = lerp(p1, p2, t);
  const b = lerp(p2, p3, t);
  const c = lerp(p3, p4, t);

  // 第二次线性插值
  const d = lerp(a, b, t);
  const e = lerp(b, c, t);

  // 第三次线性插值
  const f = lerp(d, e, t);

  return [
    [p1, a, d, f],
    [f, e, c, p4],
  ];
};

/**
 * 拆分任意阶贝塞尔曲线
 * @param points 控制点数组
 * @param t 拆分参数 [0,1]
 * @returns [左半段控制点数组, 右半段控制点数组]
 */
export const splitBezier = (points: Point[], t: number): [Point[], Point[]] => {
  const degree = points.length - 1; // 贝塞尔阶数
  const layers: Point[][] = [[...points]]; // 存储每一层的插值点

  // 计算 de Casteljau 三角形
  for (let i = 1; i <= degree; i++) {
    const currentLayer: Point[] = [];
    const prevLayer = layers[i - 1];

    // 计算当前层的插值点
    for (let j = 0; j < degree - i + 1; j++) {
      currentLayer.push(lerp(prevLayer[j], prevLayer[j + 1], t));
    }

    layers.push(currentLayer);
  }

  const leftPoints: Point[] = [];
  for (let i = 0; i <= degree; i++) {
    leftPoints.push(layers[i][0]);
  }

  const rightPoints: Point[] = [];
  for (let i = degree; i >= 0; i--) {
    rightPoints.push(layers[i][layers[i].length - 1]);
  }

  return [leftPoints, rightPoints];
};

// 线性插值函数
const lerp = (p1: Point, p2: Point, t: number): Point => {
  return {
    x: p1.x + (p2.x - p1.x) * t,
    y: p1.y + (p2.y - p1.y) * t,
  };
};
