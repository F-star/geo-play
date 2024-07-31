import { drawBezier, drawLine, drawText, fillPoints } from '../../draw-util';
import {
  getBezier3Normal,
  getBezier3Point,
  getBezier3Tangent,
  getBezier3TangentLine,
  getBezierNPoint,
} from './geo';

const canvas = document.querySelector('canvas')!;
const ctx = canvas.getContext('2d')!;

// https://stackoverflow.com/questions/4089443/find-the-tangent-of-a-point-on-a-cubic-bezier-curve

const p1 = {
  x: 100,
  y: 206,
};
const p2 = {
  x: 420,
  y: 388,
};
const cp1 = {
  x: 328,
  y: 82,
};
const cp2 = {
  x: 145,
  y: 427,
};

let t = 0.6;

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // const pt = getBezier3Point(p1, cp1, cp2, p2, t);
  const pt = getBezierNPoint([p1, cp1, cp2, p2], t);

  // 贝塞尔曲线
  ctx.strokeStyle = '#666';
  drawBezier(ctx, p1, cp1, cp2, p2);

  drawText(ctx, { x: 250, y: 150 }, `t=${t}`);

  // 绘制切线
  // const tangentLine = getBezier3TangentLine(p1, cp1, cp2, p2, t);
  const tangent = getBezier3Tangent(p1, cp1, cp2, p2, t);
  const tangentLine = [
    {
      x: pt.x - tangent.x * 50,
      y: pt.y - tangent.y * 50,
    },
    {
      x: pt.x + tangent.x * 50,
      y: pt.y + tangent.y * 50,
    },
  ];
  ctx.save();
  ctx.strokeStyle = '#f04';
  drawLine(ctx, tangentLine[0], tangentLine[1]);

  // 绘制法线
  const normal = getBezier3Normal(p1, cp1, cp2, p2, t);
  console.log(normal);
  ctx.strokeStyle = 'green';
  drawLine(ctx, pt, { x: pt.x + normal.x * 40, y: pt.y + normal.y * 40 });

  // 绘制点
  fillPoints(ctx, [pt], 6);
  ctx.restore();
};

draw();

const startAnimation = () => {
  t = 0;

  const timer = setInterval(() => {
    if (t >= 1) {
      clearInterval(timer);
    } else {
      t += 0.01;
      // t = parseFloat(t.toFixed(2))
    }
    draw();
  }, 70);
};

document.querySelector('button')!.addEventListener('click', () => {
  startAnimation();
});
