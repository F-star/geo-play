import { distance } from '../../geo';
import { Point } from '../../type';

export const getArcPoint = (center: Point, radius: number, angle: number) => {
  // 弧度转方向向量
  const dir = {
    x: Math.cos(angle),
    y: Math.sin(angle),
  };
  return {
    x: center.x + radius * dir.x,
    y: center.y + radius * dir.y,
  };
};

export const getArc2Center = (
  start: Point,
  end: Point,
  radius: number,
  sweep: boolean,
  largeArc: boolean,
) => {
  const dist = distance(start, end);
  // 半径太小，无法构成圆。
  // 做特殊处理，radius 替换为 start 到 end 的距离除以 2
  // 此时圆心就是两点的中点
  if (radius * 2 < dist) {
    return {
      x: start.x / 2 + end.x / 2,
      y: start.y / 2 + end.y / 2,
    };
  }
  const cos = Math.min(dist / 2 / radius, 1);
  const dAngle = Math.acos(cos);
  const startToEndAngle = Math.atan((end.y - start.y) / (end.x - start.x));

  let angle = 0;
  if (sweep === largeArc) {
    angle = startToEndAngle - dAngle;
  } else {
    angle = startToEndAngle + dAngle;
  }

  return {
    x: start.x + radius * Math.cos(angle),
    y: start.y + radius * Math.sin(angle),
  };
};
