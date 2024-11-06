import { Point } from '../../type';

export const quadraticBezierToCubic = (
  p0: Point,
  p1: Point,
  p2: Point,
): [Point, Point, Point, Point] => {
  return [
    { x: p0.x, y: p0.y },
    {
      x: p0.x + (2 / 3) * (p1.x - p0.x),
      y: p0.y + (2 / 3) * (p1.y - p0.y),
    },
    {
      x: p2.x + (2 / 3) * (p1.x - p2.x),
      y: p2.y + (2 / 3) * (p1.y - p2.y),
    },
    { x: p2.x, y: p2.y },
  ];
};
