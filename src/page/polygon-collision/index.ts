import { drawText, strokePolygon } from '../../draw-util';
import { isConvexPolygonIntersect } from '../../geo';

const canvas = document.querySelector('canvas')!;
const ctx = canvas.getContext('2d')!;
// 坐标系原点移动到画布中心

const polygon1 = [
  { x: 200, y: 27 },
  { x: 233, y: 110 },
  { x: 176, y: 181 },
  { x: 98, y: 138 },
  { x: 95, y: 68 },
];

const polygon2 = [
  { x: 167, y: 173 },
  { x: 244, y: 186 },
  { x: 189, y: 265 },
  { x: 135, y: 282 },

  { x: 99, y: 267 },
  { x: 98, y: 226 },
  { x: 118, y: 184 },
];

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  strokePolygon(ctx, polygon1);

  ctx.save();
  ctx.strokeStyle = 'red';
  strokePolygon(ctx, polygon2);

  const isCollision = isConvexPolygonIntersect(polygon1, polygon2);
  drawText(ctx, { x: 50, y: 50 }, isCollision ? '碰撞' : '未碰撞');

  ctx.restore();
};

draw();

canvas.addEventListener('pointermove', (e: PointerEvent) => {
  // start.x = e.clientX;
  // start.y = e.clientY;
  draw();
});

canvas.addEventListener('click', () => {
  // TODO:
  draw();
});
