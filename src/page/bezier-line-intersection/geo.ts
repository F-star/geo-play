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

  // 2. 求对齐后的贝塞尔曲线和直线 y=0 的交点
  // 其实就是找贝塞尔曲线上，y 为 0 的点
};
