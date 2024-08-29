import { drawBezier, drawLine, drawText, fillPoints } from '../../draw-util';
import { distance } from '../../geo';
import { Point } from '../../type';
import { getBezierAndLineIntersection } from './geo';

const canvas = document.querySelector('canvas')!;
const ctx = canvas.getContext('2d')!;

// https://stackoverflow.com/questions/4089443/find-the-tangent-of-a-point-on-a-cubic-bezier-curve

const bezierPts = [
  {
    x: 124,
    y: 219,
  },
  {
    x: 269,
    y: 63,
  },
  {
    x: 157,
    y: 480,
  },
  {
    x: 379,
    y: 275,
  },
];

const line = [
  {
    x: 80,
    y: 159,
  },
  {
    x: 381,
    y: 344,
  },
];

const draw = () => {
  // 交点
  const intersectionPts = getBezierAndLineIntersection(bezierPts, line);

  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 贝塞尔曲线
  ctx.strokeStyle = '#666';
  drawBezier(ctx, bezierPts[0], bezierPts[1], bezierPts[2], bezierPts[3]);
  // drawBezier(
  //   ctx,
  //   alignedBezier[0],
  //   alignedBezier[1],
  //   alignedBezier[2],
  //   alignedBezier[3],
  // );
  // 绘制控制点线
  ctx.setLineDash([8]);
  drawLine(ctx, bezierPts[0], bezierPts[1]);
  drawLine(ctx, bezierPts[2], bezierPts[3]);

  ctx.setLineDash([]);
  // 直线
  drawLine(ctx, line[0], line[1]);

  // 绘制点
  fillPoints(ctx, [...bezierPts, ...line], 6);

  ctx.fillStyle = '#f04';
  fillPoints(
    ctx,
    intersectionPts.map((item) => item.point),
    8,
  );
  intersectionPts.forEach((item) => {
    drawText(ctx, item.point, item.t.toFixed(4));
  });

  ctx.restore();
};

draw();

canvas.addEventListener('mousedown', (e) => {
  const cursorPt = {
    x: e.clientX,
    y: e.clientY,
  };
  let movedPt: Point | null = null;
  [...bezierPts, ...line].some((p) => {
    if (distance(cursorPt, p) < 10) {
      movedPt = p;
      return true;
    }
  });

  if (!movedPt) return;

  const onMouseover = (e: MouseEvent) => {
    if (movedPt) {
      movedPt.x = e.clientX;
      movedPt.y = e.clientY;
    }
    draw();
  };
  const onMouseup = () => {
    window.removeEventListener('mousemove', onMouseover);
    window.removeEventListener('mouseup', onMouseup);
    movedPt = null;
  };

  window.addEventListener('mousemove', onMouseover);
  window.addEventListener('mouseup', onMouseup);
});

canvas.addEventListener('mousemove', (e) => {
  const cursorPt = {
    x: e.clientX,
    y: e.clientY,
  };
  for (const p of [...bezierPts, ...line]) {
    if (distance(cursorPt, p) < 10) {
      canvas.style.cursor = 'pointer';
      return true;
    }
  }
  canvas.style.cursor = '';
});
