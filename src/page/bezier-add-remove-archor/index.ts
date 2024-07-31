import { drawBezier, drawLine, fillPoints } from '../../draw-util';
import { Point } from '../../type';
import { calcBezier3Project } from '../bezier-project/geo';

const canvas = document.querySelector('canvas')!;
const ctx = canvas.getContext('2d')!;

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

/**
 * snapsvg 有个 getSubPath 方法，用于加一个锚点。
 *
 * http://snapsvg.io/docs/#Element.getSubpath
 *
 * 减少一个锚点呢。。。
 */

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const { point: projectPt } = calcBezier3Project(
    p1,
    cp1,
    cp2,
    p2,
    targetPt,
    lookupTable,
  );

  ctx.strokeStyle = '#666';
  drawBezier(ctx, p1, cp1, cp2, p2);

  drawLine(ctx, targetPt, projectPt);

  fillPoints(ctx, [projectPt], 6);

  ctx.restore();
};

draw();

canvas.addEventListener('pointermove', (e: PointerEvent) => {
  targetPt.x = e.clientX;
  targetPt.y = e.clientY;
  draw();
});
