import { distance, getSweepAngle } from '../../geo';
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
