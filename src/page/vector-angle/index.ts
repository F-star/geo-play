import { drawLine, drawText, fillPoints } from '../../draw-util';
import { getAngle, getSweepAngle, radToDeg } from '../../geo';

const canvas = document.querySelector('canvas')!;
const ctx = canvas.getContext('2d')!;
// 坐标系原点移动到画布中心

let isCalcSweepAngle = false;
const a = { x: 140, y: 142 };
const b = { x: -20, y: 90 };
const origin = { x: 0, y: 0 };

const draw = () => {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.translate(canvas.width / 2, canvas.height / 2);

  drawLine(ctx, a, origin);
  drawLine(ctx, b, origin);

  fillPoints(ctx, [origin, a, b], 12);

  drawText(ctx, a, 'a');
  drawText(ctx, b, 'b');
  drawText(ctx, origin, 'origin');

  const angle = isCalcSweepAngle ? getSweepAngle(a, b) : getAngle(a, b);
  drawText(
    ctx,
    { x: -100, y: -100 },
    `${isCalcSweepAngle ? '扫过的夹角' : '普通夹角'}: ${radToDeg(angle).toFixed(
      5,
    )}`,
  );
};

draw();

canvas.addEventListener('pointermove', (e: PointerEvent) => {
  b.x = e.clientX - canvas.width / 2;
  b.y = e.clientY - canvas.height / 2;
  draw();
});

canvas.addEventListener('click', () => {
  isCalcSweepAngle = !isCalcSweepAngle;
  draw();
});
