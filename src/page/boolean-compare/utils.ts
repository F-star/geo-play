import { IPathData } from './type';

const k = 0.5522847498307936; // (-4 + 4 * Math.sqrt(2)) / 3

/** 1/4 圆弧拟合 */
export const ellipseToCubic = (
  cx: number,
  cy: number,
  rx: number,
  ry: number,
): IPathData => {
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
