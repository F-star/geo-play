import { Matrix } from 'pixi.js';
import { Point } from '../../type';

export const getPolygonMinRectVertices = (polygon: Point[]) => {
  let minArea = Infinity;
  let vertices: Point[] = [];
  let m = new Matrix();

  for (let i = 0; i < polygon.length; i++) {
    const alignedLine = [polygon[i], polygon[(i + 1) % polygon.length]];
    const angle = -Math.atan2(
      alignedLine[1].y - alignedLine[0].y,
      alignedLine[1].x - alignedLine[0].x,
    );
    const matrix = new Matrix()
      .translate(-alignedLine[0].x, -alignedLine[0].y)
      .rotate(angle);

    const alignedPolygon = polygon.map((pt) => matrix.apply(pt));

    const bbox = getPointsBbox(alignedPolygon);

    const area = (bbox.maxX - bbox.minX) * (bbox.maxY - bbox.minY);
    if (area < minArea) {
      minArea = area;
      m = matrix;
      vertices = [
        {
          x: bbox.minX,
          y: bbox.minY,
        },
        {
          x: bbox.maxX,
          y: bbox.minY,
        },
        {
          x: bbox.maxX,
          y: bbox.maxY,
        },
        {
          x: bbox.minX,
          y: bbox.maxY,
        },
      ];
    }
  }

  const inverseMatrix = m.clone().invert();
  return vertices.map((pt) => inverseMatrix.apply(pt));
};
const getPointsBbox = (points: Point[]) => {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const pt of points) {
    minX = Math.min(minX, pt.x);
    minY = Math.min(minY, pt.y);
    maxX = Math.max(maxX, pt.x);
    maxY = Math.max(maxY, pt.y);
  }

  return {
    minX,
    minY,
    maxX,
    maxY,
  };
};

// 这里取第一个条线段
// export const getPolygonMinRectVertices = (polygon: Point[]) => {
//   const alignedLine = polygon.slice(0, 2);
//   const angle = -Math.atan2(
//     alignedLine[1].y - alignedLine[0].y,
//     alignedLine[1].x - alignedLine[0].x,
//   );
//   const matrix = new Matrix()
//     .translate(-alignedLine[0].x, -alignedLine[0].y)
//     .rotate(angle);

//   const alignedPolygon = polygon.map((pt) => matrix.apply(pt));

//   const bbox = getPointsBbox(alignedPolygon);
//   const vertices = [
//     {
//       x: bbox.minX,
//       y: bbox.minY,
//     },
//     {
//       x: bbox.maxX,
//       y: bbox.minY,
//     },
//     {
//       x: bbox.maxX,
//       y: bbox.maxY,
//     },
//     {
//       x: bbox.minX,
//       y: bbox.maxY,
//     },
//   ];

//   const inverseMatrix = matrix.clone().invert();
//   return vertices.map((pt) => inverseMatrix.apply(pt));
// };
