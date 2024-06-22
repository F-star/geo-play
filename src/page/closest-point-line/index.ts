import { drawLine, drawText, fillPoints } from '../../draw-util';
import { closestPointOnLine } from '../../geo';

const canvas = document.querySelector('canvas')!;
const ctx = canvas.getContext('2d')!;

const p1 = { x: 140, y: 142 };
const p2 = { x: 310, y: 290 };
// const p1 = { x: randInt(0, canvas.width), y: randInt(0, canvas.height) };
// const p2 = { x: randInt(0, canvas.width), y: randInt(0, canvas.height) };
const p = { x: 300, y: 100 };
let canOutside = true;

const draw = () => {
  const { point: closetPt, t, d } = closestPointOnLine(p1, p2, p, canOutside);
  // console.log({ closetPt, t, d });

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 目标直线
  drawLine(ctx, p1, p2);

  ctx.save();
  ctx.setLineDash([5, 5]);
  drawLine(ctx, p, closetPt);
  ctx.restore();

  fillPoints(ctx, [p], 12);

  ctx.save();
  ctx.fillStyle = 'red';
  fillPoints(ctx, [closetPt], 12);
  ctx.restore();

  drawText(ctx, closetPt, `t: ${t.toFixed(3)}`, 'red');
  drawText(ctx, closetPt, `dist: ${d.toFixed(3)}`, 'red', undefined, -30);
  drawText(
    ctx,
    closetPt,
    `point: (${closetPt.x.toFixed(1)}, ${closetPt.y.toFixed(1)})`,
    'red',
    undefined,
    -50,
  );
  drawText(ctx, p1, 'p0');
  drawText(ctx, p2, 'p1');
  drawText(ctx, p, 'p');
};

draw();

canvas.addEventListener('pointermove', (e: PointerEvent) => {
  p.x = e.clientX;
  p.y = e.clientY;
  draw();
});

canvas.addEventListener('click', () => {
  canOutside = !canOutside;
  draw();
});
