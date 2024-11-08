import { Point } from '../../type';
import { calcBezier3Project } from '../bezier-project/geo';
import { splitCubicBezier } from './bezier-split';

const canvas = document.querySelector('canvas')!;
const ctx = canvas.getContext('2d')!;

const p1 = { x: 100, y: 50 };
const cp1 = { x: 120, y: 160 };
const cp2 = { x: 350, y: 100 };
const p2 = { x: 300, y: 50 };

let mousePos: Point = { x: 200, y: 100 };

const draw = () => {
  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const project = calcBezier3Project(p1, cp1, cp2, p2, mousePos);

  const [left, right] = splitCubicBezier(p1, cp1, cp2, p2, project.t);

  drawBezier(ctx, [p1, cp1, cp2, p2]);
  // 绘制投影点
  drawPoint(ctx, project.point, '#fff', '#000');

  ctx.font = '14px sans-serif';
  ctx.fillText(
    `t = ${project.t.toFixed(2)}`,
    project.point.x + 10,
    project.point.y - 10,
  );

  ctx.translate(0, 140);
  drawBezier(ctx, [p1, cp1, cp2, p2], '#0003', false);
  drawBezier(ctx, left, '#f00');

  ctx.translate(0, 140);
  drawBezier(ctx, [p1, cp1, cp2, p2], '#0003', false);
  drawBezier(ctx, right, '#00f');
  ctx.restore();
};

const drawBezier = (
  ctx: CanvasRenderingContext2D,
  pts: Point[],
  color: string = '#000',
  showControlLine = true,
) => {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  ctx.bezierCurveTo(pts[1].x, pts[1].y, pts[2].x, pts[2].y, pts[3].x, pts[3].y);
  ctx.stroke();

  drawPoint(ctx, pts[0], color);
  drawPoint(ctx, pts[3], color);

  // 绘制控制线
  if (showControlLine) {
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    ctx.lineTo(pts[1].x, pts[1].y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(pts[2].x, pts[2].y);
    ctx.lineTo(pts[3].x, pts[3].y);
    ctx.stroke();

    // 绘制控制点
    drawPoint(ctx, pts[1], color);
    drawPoint(ctx, pts[2], color);
  }

  ctx.restore();
};

const drawPoint = (
  ctx: CanvasRenderingContext2D,
  pt: Point,
  fill: string,
  stroke?: string,
) => {
  ctx.save();
  ctx.fillStyle = fill;
  if (stroke) {
    ctx.strokeStyle = stroke;
  }
  ctx.beginPath();
  ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
  ctx.fill();
  if (stroke) {
    ctx.stroke();
  }
  ctx.restore();
};

draw();

canvas.addEventListener('mousemove', (e) => {
  const x = e.clientX;
  const y = e.clientY;

  mousePos = { x, y };

  draw();
});
