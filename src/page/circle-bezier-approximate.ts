import { Matrix } from 'pixi.js';

const k = 0.5522847498307936; // (-4 + 4 * Math.sqrt(2)) / 3

/** 1/4 圆弧拟合 */
export const quarterCircleToCubic = (cx: number, cy: number, r: number) => {
  const l = k * r;

  const pathData: [string, ...number[]][] = [];

  // 起点为正右方，方向为顺时针
  pathData.push(['M', cx + r, cy]);
  pathData.push(['C', cx + r, cy + l, cx + l, cy + r, cx, cy + r]);

  return pathData;
};

export const circleToCubic = (cx: number, cy: number, r: number) => {
  const l = k * r;

  const pathData: [string, ...number[]][] = [];

  // 起点为正右方，方向为顺时针
  pathData.push(['M', cx + r, cy]);
  pathData.push(['C', cx + r, cy + l, cx + l, cy + r, cx, cy + r]);
  pathData.push(['C', cx - l, cy + r, cx - r, cy + l, cx - r, cy]);
  pathData.push(['C', cx - r, cy - l, cx - l, cy - r, cx, cy - r]);
  pathData.push(['C', cx + l, cy - r, cx + r, cy - l, cx + r, cy]);
  pathData.push(['Z']);

  return pathData;
};

export const ellipseToCubic = (
  cx: number,
  cy: number,
  rx: number,
  ry: number,
) => {
  const lx = rx * k;
  const ly = ry * k;

  const pathData: [string, ...number[]][] = [];

  // 起点为正右方，方向为顺时针
  pathData.push(['M', cx + rx, cy]);
  pathData.push(['C', cx + rx, cy + ly, cx + lx, cy + ry, cx, cy + ry]);
  pathData.push(['C', cx - lx, cy + ry, cx - rx, cy + ly, cx - rx, cy]);
  pathData.push(['C', cx - rx, cy - ly, cx - lx, cy - ry, cx, cy - ry]);
  pathData.push(['C', cx + lx, cy - ry, cx + rx, cy - ly, cx + rx, cy]);
  pathData.push(['Z']);

  return pathData;
};

/**
 * 对任意圆弧进行拟合
 * 极轴坐标系规定：起点为正右方，方向为顺时针
 */
export const arcToCubic = (
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
) => {
  const pathData: [string, ...number[]][] = [];

  // 计算 k
  const sweepAngle = endAngle - startAngle;
  const halfSweepAngle = sweepAngle / 2;
  const k =
    (4 * (1 - Math.cos(halfSweepAngle))) / (3 * Math.sin(halfSweepAngle));

  const matrix = new Matrix().rotate(startAngle).scale(r, r).translate(cx, cy);

  // 先把 startAngle 旋转对其到正右方，endAngle 也跟随旋转
  endAngle -= startAngle;
  startAngle = 0;

  const p1 = matrix.apply({
    x: 1,
    y: 0,
  });
  const p2 = matrix.apply({
    x: 1,
    y: k,
  });

  const p3 = matrix.apply({
    x: Math.cos(sweepAngle) + k * Math.sin(sweepAngle),
    y: Math.sin(sweepAngle) - k * Math.cos(sweepAngle),
  });

  const p4 = matrix.apply({
    x: Math.cos(sweepAngle),
    y: Math.sin(sweepAngle),
  });

  // 起点为正右方，方向为顺时针
  pathData.push(['M', p1.x, p1.y]);
  pathData.push(['C', p2.x, p2.y, p3.x, p3.y, p4.x, p4.y]);

  return pathData;
};
