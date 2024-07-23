import { Point } from '../../type';

// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineCap

export const outlineLineWithButtCap = (p1: Point, p2: Point, width: number) => {
  const tan = {
    x: p2.x - p1.x,
    y: p2.y - p1.y,
  };
  const t = width / 2 / Math.sqrt(tan.x * tan.x + tan.y * tan.y);
  // 求法向量，模长为 width /2
  const normal = {
    x: tan.y * t,
    y: -tan.x * t,
  };

  const vertexes = [
    { x: p1.x + normal.x, y: p1.y + normal.y },
    { x: p2.x + normal.x, y: p2.y + normal.y },
    { x: p2.x - normal.x, y: p2.y - normal.y },
    { x: p1.x - normal.x, y: p1.y - normal.y },
  ];

  return vertexes;
};

export const outlineLineWithSquareCap = (
  p1: Point,
  p2: Point,
  width: number,
) => {
  const tan = {
    x: p2.x - p1.x,
    y: p2.y - p1.y,
  };
  const t = width / 2 / Math.sqrt(tan.x * tan.x + tan.y * tan.y);

  const dx = tan.x * t;
  const dy = tan.y * t;

  p2 = {
    x: p2.x + dx,
    y: p2.y + dy,
  };

  p1 = {
    x: p1.x - dx,
    y: p1.y - dy,
  };

  return outlineLineWithButtCap(p1, p2, width);
};

export const outlineLineWithRoundCap = (
  p1: Point,
  p2: Point,
  width: number,
) => {
  const buttOutline = outlineLineWithButtCap(p1, p2, width);

  return [
    buttOutline[0],
    buttOutline[1],
    {
      ...buttOutline[2],
      radius: width / 2,
      largeArc: true,
      sweep: true,
    },
    buttOutline[3],
    {
      ...buttOutline[0],
      radius: width / 2,
      largeArc: true,
      sweep: true,
    },
  ];
};
