import {
  drawLine,
  drawText,
  strokeCircle,
  strokePolygon,
} from '../../draw-util';
import {
  getExternalTanRegularPolygon,
  getInternalTanRegularPolygon,
} from '../../geo';

const canvas = document.querySelector('canvas')!;
const ctx = canvas.getContext('2d')!;
// 坐标系原点移动到画布中心

let type = 0; // 0=>内切 1=>外切 2=>内外切
const count = 5;
const center = { x: canvas.width / 2, y: canvas.height / 2 };
const start = { x: 280, y: 380 };

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.strokeStyle = '#999';
  drawLine(ctx, center, start);
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = '#999';
  strokeCircle(
    ctx,
    center,
    Math.sqrt((start.x - center.x) ** 2 + (start.y - center.y) ** 2),
  );
  ctx.restore();

  if (type === 0 || type === 2) {
    ctx.save();
    ctx.strokeStyle = '#f00';
    const intPolygon = getInternalTanRegularPolygon(center, start, count);
    strokePolygon(ctx, intPolygon, true);
    ctx.restore();
  }

  if (type === 1 || type === 2) {
    ctx.save();
    ctx.strokeStyle = '#00f';
    const extPolygon = getExternalTanRegularPolygon(center, start, count);
    strokePolygon(ctx, extPolygon, true);
    ctx.restore();
  }

  drawText(ctx, center, 'center');
  drawText(ctx, start, 'start');
  drawText(ctx, { x: 20, y: 50 }, `count: ${count}`);
};

draw();

canvas.addEventListener('pointermove', (e: PointerEvent) => {
  start.x = e.clientX;
  start.y = e.clientY;
  draw();
});

canvas.addEventListener('click', () => {
  type = (type + 1) % 3;
  draw();
});
