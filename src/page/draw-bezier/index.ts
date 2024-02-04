import {
  drawBezier,
  drawLine,
  fillPoints,
  strokePolygon,
} from '../../draw-util';
import { getBezierPoints } from '../../geo';

const canvas = document.querySelector('canvas')!;
const ctx = canvas.getContext('2d')!;

const p1 = { x: 180, y: 319 };
const cp1 = { x: 92, y: 133 };
const cp2 = { x: 387, y: 213 };
const p2 = { x: 287, y: 405 };

const draw = () => {
  ctx.save();
  // ctx.setLineDash([5]);
  ctx.strokeStyle = 'gray';
  drawLine(ctx, p1, cp1);
  drawLine(ctx, p2, cp2);
  ctx.restore();

  // drawBezier(ctx, p1, cp1, cp2, p2);
  fillPoints(ctx, [p1, cp1, cp2, p2]);

  const bezierPts = getBezierPoints(p1, cp1, cp2, p2, 0.01);
  ctx.save();
  // ctx.fillStyle = 'red';
  strokePolygon(ctx, bezierPts, false);
  ctx.restore();
};

draw();

canvas.addEventListener('pointerdown', (e) => {
  const points = [p1, cp1, cp2, p2];
  const index = points.findIndex((p) => {
    return Math.abs(p.x - e.clientX) < 6 && Math.abs(p.y - e.clientY) < 6;
  });
  if (index === -1) {
    return;
  }
  const move = (e: PointerEvent) => {
    points[index].x = e.clientX;
    points[index].y = e.clientY;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw();
  };
  const up = () => {
    canvas.removeEventListener('pointermove', move);
    window.removeEventListener('pointerup', up);
  };

  canvas.addEventListener('pointermove', move);
  window.addEventListener('pointerup', up);
});
