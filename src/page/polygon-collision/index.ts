import { strokePolygon } from '../../draw-util';

const canvas = document.querySelector('canvas')!;
const ctx = canvas.getContext('2d')!;
// 坐标系原点移动到画布中心

const polygon1 = [
  { x: 0, y: 0 },
  { x: 100, y: 0 },
  { x: 100, y: 100 },
  { x: 0, y: 200 },
];

const polygon2 = [
  { x: 110, y: 120 },
  { x: 230, y: 270 },
  { x: 100, y: 100 },
  { x: 200, y: 100 },
];

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  strokePolygon(ctx, polygon1);

  ctx.save();
  ctx.strokeStyle = 'red';
  strokePolygon(ctx, polygon2);
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
