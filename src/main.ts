import { drawLine, fillPoints, fillPolygon, strokePolygon } from './draw-util';
import { getEquilateralTriangle, getAdjSquare } from './geo';

const canvas = document.querySelector('canvas')!;
const ctx = canvas.getContext('2d')!;

const endPos = { x: 400, y: 400 };

const draw = () => {
  const startPos = { x: canvas.width / 2, y: canvas.height / 2 };
  const size = 50;
  const triangle = getEquilateralTriangle(startPos, endPos, size);
  fillPolygon(ctx, triangle);

  drawLine(ctx, startPos, endPos);

  ctx.save();
  ctx.fillStyle = 'red';
  fillPoints(ctx, [startPos, endPos]);
  ctx.restore();

  const { points: squarePoints } = getAdjSquare(startPos, endPos, size);
  strokePolygon(ctx, squarePoints);
};

draw();

canvas.addEventListener('mousemove', (e) => {
  endPos.x = e.clientX;
  endPos.y = e.clientY;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  draw();
});
