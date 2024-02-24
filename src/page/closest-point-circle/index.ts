import {
  drawLine,
  drawNumText,
  fillPoints,
  strokeCircle,
} from '../../draw-util';
import { closestPointOnCircle } from '../../geo';

const canvas = document.querySelector('canvas')!;
const ctx = canvas.getContext('2d')!;

const center = { x: 250, y: 250 };
const radius = 120;

const p = { ...center };

const draw = () => {
  const { point: closetPt, d } = closestPointOnCircle(center, radius, p);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  strokeCircle(ctx, center, radius);

  ctx.save();
  ctx.setLineDash([5, 5]);
  drawLine(ctx, p, closetPt);
  ctx.restore();

  fillPoints(ctx, [center, p], 12);

  ctx.save();
  ctx.fillStyle = 'red';
  fillPoints(ctx, [closetPt], 12);
  ctx.restore();

  drawNumText(ctx, center, 'center');
  drawNumText(ctx, closetPt, `dist: ${d.toFixed(3)}`, 'red', undefined, -30);
  drawNumText(
    ctx,
    closetPt,
    `point: (${closetPt.x.toFixed(1)}, ${closetPt.y.toFixed(1)})`,
    'red',
    undefined,
    -50,
  );
  drawNumText(ctx, p, 'p');
};

draw();

canvas.addEventListener('pointermove', (e: PointerEvent) => {
  p.x = e.clientX;
  p.y = e.clientY;
  draw();
});
