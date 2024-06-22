import { drawLine, drawText, fillPoints } from '../../draw-util';
import { calcRoundCorner } from './geo';

const canvas = document.querySelector('canvas')!;
const ctx = canvas.getContext('2d')!;

const p1 = {
  x: 164,
  y: 350,
};

const p2 = {
  x: 307,
  y: 155,
};

const p3 = {
  x: 307,
  y: 155,
};

const p4 = {
  x: 371,
  y: 323,
};

const radius = 50;

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawLine(ctx, p1, p2);
  drawLine(ctx, p3, p4);
  fillPoints(ctx, [p1, p2, p4]);

  const info = calcRoundCorner(p1, p2, p3, p4, radius);
  if (info) {
    const {
      offsetLine1,
      offsetLine2,
      circleCenter,
      start,
      end,
      startAngle,
      endAngle,
      angleDir,
    } = info;
    ctx.save();
    ctx.strokeStyle = 'red';
    drawLine(ctx, offsetLine1[0], offsetLine1[1]);
    drawLine(ctx, offsetLine2[0], offsetLine2[1]);
    ctx.fillStyle = 'red';
    fillPoints(ctx, [circleCenter]);
    ctx.fillStyle = 'blue';
    fillPoints(ctx, [start, end]);

    ctx.beginPath();
    ctx.strokeStyle = 'blue';
    ctx.setLineDash([10, 8]);
    ctx.moveTo(start.x, start.y);
    ctx.arc(
      circleCenter.x,
      circleCenter.y,
      radius,
      startAngle,
      endAngle,
      !angleDir,
    );
    ctx.stroke();

    ctx.restore();
  }

  drawText(ctx, p1, 'p1');
  drawText(ctx, p2, 'p2 (p3)');
  drawText(ctx, p4, 'p4');
};

draw();

canvas.addEventListener('pointermove', (e: PointerEvent) => {
  p4.x = e.clientX;
  p4.y = e.clientY;
  draw();
});
