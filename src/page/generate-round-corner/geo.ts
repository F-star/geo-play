import {
  closestPointOnLine,
  distance,
  getLineIntersection,
  getSweepAngle,
} from '../../geo';
import { Point } from '../../type';

export const calcRoundCorner = (
  p1: Point,
  p2: Point,
  p3: Point,
  p4: Point,
  radius: number,
) => {
  // p2 到 p1 向量
  const v1 = {
    x: p1.x - p2.x,
    y: p1.y - p2.y,
  };

  // p2 到 p3 的向量
  const v2 = {
    x: p4.x - p3.x,
    y: p4.y - p3.y,
  };

  // 求叉积
  const cp = v1.x * v2.y - v2.x * v1.y;
  if (cp === 0) {
    // 平行，无法生成圆角
    return null;
  }
  let normalVec1: Point;
  let normalVec2: Point;
  // v2 在 v1 的左边
  if (cp < 0) {
    // 求 v1 向左法向量
    normalVec1 = {
      x: v1.y,
      y: -v1.x,
    };
    // 求 v2 向右法向量
    normalVec2 = {
      x: -v2.y,
      y: v2.x,
    };
  }
  // v2 在 v1 的右边
  else {
    normalVec1 = {
      x: -v1.y,
      y: v1.x,
    };
    normalVec2 = {
      x: v2.y,
      y: -v2.x,
    };
  }

  // 求沿法向量偏移半径长度的 line1
  const t1 = radius / distance(p1, p2);
  const d = {
    x: normalVec1.x * t1,
    y: normalVec1.y * t1,
  };
  const offsetLine1 = [
    {
      x: p1.x + d.x,
      y: p1.y + d.y,
    },
    {
      x: p2.x + d.x,
      y: p2.y + d.y,
    },
  ];

  // 求沿法向量偏移半径长度的 line1
  const t2 = radius / distance(p3, p4);
  const d2 = {
    x: normalVec2.x * t2,
    y: normalVec2.y * t2,
  };
  const offsetLine2 = [
    {
      x: p3.x + d2.x,
      y: p3.y + d2.y,
    },
    {
      x: p4.x + d2.x,
      y: p4.y + d2.y,
    },
  ];

  // 求偏移后两条直线的交点，这个交点就是圆心
  const circleCenter = getLineIntersection(
    offsetLine1[0],
    offsetLine1[1],
    offsetLine2[0],
    offsetLine2[1],
  )!;

  // 求圆心到两条线的垂足
  const { point: start } = closestPointOnLine(p1, p2, circleCenter, true);
  const { point: end } = closestPointOnLine(p3, p4, circleCenter, true);

  // 圆心到垂足的弧度
  const angleBase = { x: 1, y: 0 };
  const startAngle = getSweepAngle(angleBase, {
    x: start.x - circleCenter.x,
    y: start.y - circleCenter.y,
  });
  const endAngle = getSweepAngle(angleBase, {
    x: end.x - circleCenter.x,
    y: end.y - circleCenter.y,
  });

  return {
    offsetLine1,
    offsetLine2,
    circleCenter,
    start,
    end,
    startAngle,
    endAngle,
    angleDir: cp < 0, // 正 -> 顺时针
  };
};
