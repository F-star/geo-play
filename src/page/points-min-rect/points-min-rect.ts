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

    // 对齐到 x 轴
    const angle = -Math.atan2(
      rectSideLine[1].y - rectSideLine[0].y,
      rectSideLine[1].x - rectSideLine[0].x,
    );
    const matrix = new Matrix()
      .translate(-rectSideLine[0].x, -rectSideLine[0].y)
      .rotate(angle);

    const alignedPolygon = polygon.map((pt) => matrix.apply(pt));

    // 将 rectSideLine 对齐到 x 正半轴
    const alignedLine = rectSideLine.map((pt) => matrix.apply(pt));

    let dimPts: Point[] = [];
    for (let i = 0; i < alignedPolygon.length; i++) {
      const pt = alignedPolygon[i];
      // if (isPointInSegment(pt, alignedLine)) {
      //   dimPts.push(pt);
      // } else
      if (hasOneIntersectedCountPt(alignedPolygon, pt)) {
        dimPts.push({
          x: pt.x,
          y: 0,
        });
      }
    }
    dimPts.push(alignedLine[0], alignedLine[1]);

    console.log('dimPts', dimPts);
    // 排序
    dimPts = dimPts.sort((a, b) => a.x - b.x);

    // 添加首尾（不需要了）

    // 去重
    const precision = 8;
    dimPts = uniqBy(
      dimPts,
      (pt) =>
        `${Number(pt.x.toFixed(precision))},${Number(pt.y.toFixed(precision))}`,
    );

    const inverseMatrix = matrix.invert();
    dimPts = dimPts.map((pt) => inverseMatrix.apply(pt));

    sideDims.push(dimPts);
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
  const isInLine = Math.abs(crossProduct(seg[0], seg[1], pt)) === 0;

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
 */
const hasOneIntersectedCountPt = (polygon: Point[], pt: Point): boolean => {
  for (let i = 0; i < polygon.length; i++) {
    let a = polygon[i];
    let b = polygon[(i + 1) % polygon.length];

    // 确保 a 在 b 的左侧
    if (a.x > b.x) {
      [a, b] = [b, a];
    }

    if (a.x < pt.x && b.x > pt.x) {
      if (isSegmentIntersect([a, b], [pt, { x: pt.x, y: 0 }])) {
        return false;
      }
    }
  }

  // console.log('count', count);
  return true;
};

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

function isSegmentIntersect(
  seg1: [Point, Point],
  seg2: [Point, Point],
): boolean {
  const [a, b] = seg1;
  const [c, d] = seg2;

  const d1 = crossProduct(a, b, c);
  const d2 = crossProduct(a, b, d);
  const d3 = crossProduct(c, d, a);
  const d4 = crossProduct(c, d, b);

  return d1 * d2 < 0 && d3 * d4 < 0;
}
