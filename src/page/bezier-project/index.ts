import {
  drawBezier,
  drawLine,
  drawText,
  fillPoints,
  strokeCircle,
} from '../../draw-util';
import { Point } from '../../type';
import { calcBezier3Project } from './geo';

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

// 光标点
const targetPt = {
  x: 400,
  y: 100,
};

const lookupTable: { t: number; pt: Point }[] = [];

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const projectInfo = calcBezier3Project(
    p1,
    cp1,
    cp2,
    p2,
    targetPt,
    lookupTable,
  );

  // console.log('projectInfo', projectInfo);

  ctx.strokeStyle = '#666';
  drawBezier(ctx, p1, cp1, cp2, p2);

  ctx.strokeStyle = '#f048';
  strokeCircle(ctx, targetPt, projectInfo.dist);

  drawLine(ctx, targetPt, projectInfo.point);

  drawText(ctx, projectInfo.point, `t=${parseFloat(projectInfo.t.toFixed(3))}`);

  // 绘制点
  fillPoints(ctx, [targetPt, projectInfo.point], 6);
  ctx.restore();
};

draw();

canvas.addEventListener('pointermove', (e: PointerEvent) => {
  targetPt.x = e.clientX;
  targetPt.y = e.clientY;
  draw();
});
