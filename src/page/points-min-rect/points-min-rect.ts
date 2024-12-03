import { Matrix } from 'pixi.js';
import { Point } from '../../type';
import { isPointInBox } from '../../geo';
import { uniqBy } from 'lodash';

export const getPolygonMinRectVertices = (polygon: Point[]) => {
  let minArea = Infinity;
  let rectVertices: Point[] = [];
  let minMatrix = new Matrix();
  let minAlignedPolygon: Point[] = [];

  // 遍历多边形的每条边
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
      minMatrix = matrix;
      minAlignedPolygon = alignedPolygon;
      rectVertices = [
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

  const dims = getSideDims(minAlignedPolygon, rectVertices);
  const inverseMatrix = minMatrix.invert();

  rectVertices = rectVertices.map((pt) => inverseMatrix.apply(pt));
  return {
    dims: dims.map((pt) => pt.map((items) => inverseMatrix.apply(items))),
    rectVertices,
    dirVecs: getPerpendicularVecs(rectVertices),
  };
};

const getSideDims = (polygon: Point[], boundingRectLine: Point[]) => {
  const sideDims: Point[][] = [];
  for (let i = 0; i < boundingRectLine.length; i++) {
    const rectSideLine = [
      boundingRectLine[i],
      boundingRectLine[(i + 1) % boundingRectLine.length],
    ];

    // TODO: 将多边形和边对齐到 y 正半轴，然后求交点数量，如果大于 1，就不符合要求

    let dimPts = [];
    for (let i = 0; i < polygon.length; i++) {
      const pt = polygon[i];
      if (isPointInSegment(pt, rectSideLine)) {
        dimPts.push(pt);
      }
    }
    dimPts.push(rectSideLine[0], rectSideLine[1]);
    dimPts = uniqBy(dimPts, (pt) => `${pt.x},${pt.y}`);
    sideDims.push(dimPts);

    if (i == 0) {
      console.log('dimPts', dimPts);
    }
  }
  return sideDims;
};

const crossProduct = (p1: Point, p2: Point, p3: Point): number => {
  const x1 = p2.x - p1.x;
  const y1 = p2.y - p1.y;
  const x2 = p3.x - p1.x;
  const y2 = p3.y - p1.y;
  return x1 * y2 - x2 * y1;
};

const isPointInSegment = (pt: Point, seg: Point[]) => {
  const isInLine = Math.abs(crossProduct(seg[0], seg[1], pt)) < 0.0001;

  if (isInLine) {
    const bbox = getPointsBbox([seg[0], seg[1]]);
    return isPointInBox(bbox, pt);
  }
  return false;
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

/**
 * pt 是 polygon 上的一个端点
 * 判断 [0, pt.y] 到 [pt.x, pt.y] 线段和 polygon 的交点个数
 *
 *
 *
 */
const getIntersectionPtCount = (polygon: Point[], pt: Point) => {
  // const getIntersectionPtCount = (polygon: Point[], pt: Point) => {
  let count = 0;
  for (let i = 0; i < polygon.length; i++) {
    let a = polygon[i];
    if (a.x === pt.x && a.y === pt.y) {
      count++;
      continue;
    }
    let b = polygon[(i + 1) % polygon.length];

    if (a.y > b.y) {
      [a, b] = [b, a];
    }

    if (a.y <= pt.y && b.y > pt.y) {
      // point 是否在 ab 的右侧，利用叉乘
      if (crossProduct(a, b, pt) >= 0) {
        count++;
      }
    }
  }

  return count;
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

export const getPerpendicularVecs = (rectVertices: Point[]) => {
  const vecs = [];
  for (let index = 0; index < rectVertices.length; index++) {
    const pt1 = rectVertices[index];
    const pt2 = rectVertices[(index + 1) % rectVertices.length];
    const distance = Math.sqrt(
      (pt2.x - pt1.x) * (pt2.x - pt1.x) + (pt2.y - pt1.y) * (pt2.y - pt1.y),
    );
    const dx = (pt2.x - pt1.x) / distance;
    const dy = (pt2.y - pt1.y) / distance;
    // 逆时针 90 度
    vecs.push({ x: dy, y: -dx });
  }
  return vecs;
};
