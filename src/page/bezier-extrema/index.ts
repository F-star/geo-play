import { Bezier } from 'bezier-js';
import { drawBezier, drawLine, drawText, fillPoints } from '../../draw-util';
import { bezier3Extrema } from './geo';
import { getBezier3Point } from '../bezier-project/geo';
import { distance } from '../../geo';

const canvas = document.querySelector('canvas')!;
const ctx = canvas.getContext('2d')!;

// https://stackoverflow.com/questions/4089443/find-the-tangent-of-a-point-on-a-cubic-bezier-curve

// const p1 = {
//   x: 100,
//   y: 206,
// };
// const cp1 = {
//   x: 328,
//   y: 82,
// };
// const cp2 = {
//   x: 145,
//   y: 427,
// };
// const p2 = {
//   x: 420,
//   y: 388,
// };

// 特殊的点
const p1 = {
  x: 100,
  y: 206,
};
const cp1 = {
  x: 328,
  y: 82,
};
const cp2 = {
  x: 424,
  y: 209,
};
const p2 = {
  x: 388,
  y: 394,
};

const draw = () => {
  // 求极限值
  // const bezier = new Bezier([p1, cp1, cp2, p2]);
  // const { values: extrema } = bezier.extrema();
  const extrema = bezier3Extrema([p1, cp1, cp2, p2]);
  console.log('extrema', extrema);
  const extremaPts = extrema.map((t) => getBezier3Point(p1, cp1, cp2, p2, t));

  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // const pt = getBezier3Point(p1, cp1, cp2, p2, t);
  // const pt = getBezierNPoint([p1, cp1, cp2, p2], t);

  // 贝塞尔曲线
  ctx.strokeStyle = '#666';
  drawBezier(ctx, p1, cp1, cp2, p2);

  ctx.strokeStyle = '#ccc';
  drawLine(ctx, p1, cp1);
  drawLine(ctx, cp2, p2);

  // 绘制点
  fillPoints(ctx, [p1, cp1, cp2, p2], 6);

  ctx.fillStyle = 'red';
  fillPoints(ctx, extremaPts, 6);

  ctx.restore();
};

draw();

canvas.addEventListener('mousedown', (e) => {
  const cursorPt = {
    x: e.clientX,
    y: e.clientY,
  };
  let movedPt: Point | null = null;
  [p1, cp1, cp2, p2].some((p) => {
    if (distance(cursorPt, p) < 10) {
      movedPt = p;
      return true;
    }
  });

  if (!movedPt) return;

  const onMouseover = (e: MouseEvent) => {
    console.log('移动');
    movedPt.x = e.clientX;
    movedPt.y = e.clientY;
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
  for (const p of [p1, cp1, cp2, p2]) {
    if (distance(cursorPt, p) < 10) {
      canvas.style.cursor = 'pointer';
      return true;
    }
  }
  canvas.style.cursor = '';
});
