import { Point } from '../../type';
import { getPolygonMinRectVertices } from './points-min-rect';

const canvas = document.querySelector('canvas')!;
const ctx = canvas.getContext('2d')!;

const points: Point[] = [];
// [
//   {
//     x: 82,
//     y: 279,
//   },
//   {
//     x: 212,
//     y: 446,
//   },
//   {
//     x: 340,
//     y: 425,
//   },
//   {
//     x: 383,
//     y: 310,
//   },
//   {
//     x: 430,
//     y: 352,
//   },
//   {
//     x: 492,
//     y: 215,
//   },
//   {
//     x: 418,
//     y: 266,
//   },
//   {
//     x: 330,
//     y: 184,
//   },
//   {
//     x: 267,
//     y: 316,
//   },
//   { x: 158, y: 205 },
// ];
let nextPoint: Point | null = null;

const d = 24;

const draw = () => {
  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 绘制多边形
  const allPoints = [...points];
  if (nextPoint) {
    allPoints.push(nextPoint);
  }
  drawPolygon(ctx, allPoints);
  if (allPoints.length > 2) {
    const { dims, dirVecs, rectVertices } =
      getPolygonMinRectVertices(allPoints);

    // console.log('dirVecs', dirVecs);

    ctx.strokeStyle = 'red';
    ctx.fillStyle = 'red';
    drawPolygon(ctx, rectVertices, true);

    ctx.strokeStyle = 'blue';
    ctx.fillStyle = 'blue';
    console.log('dims', dims);
    for (let i = 0; i < dims.length; i++) {
      // 偏移 d 距离
      dims[i].forEach((pt) => {
        pt.x += d * dirVecs[i].x;
        pt.y += d * dirVecs[i].y;
      });
      drawPolygon(ctx, dims[i], true);
    }
  }

  ctx.restore();
};

const drawLine = (ctx: CanvasRenderingContext2D, p1: Point, p2: Point) => {
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();
};

const drawPoint = (ctx: CanvasRenderingContext2D, pt: Point) => {
  ctx.beginPath();
  ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
  ctx.fill();
};

const drawPolygon = (
  ctx: CanvasRenderingContext2D,
  pts: Point[],
  showIndex = false,
) => {
  for (let i = 0; i < pts.length; i++) {
    // 绘制点
    drawPoint(ctx, pts[i]);
    drawLine(ctx, pts[i], pts[(i + 1) % pts.length]);

    if (showIndex) {
      ctx.fillText(`${i}`, pts[i].x + 5, pts[i].y - 5);
    }
  }
};

draw();

canvas.addEventListener('mousedown', (e) => {
  points.push({
    x: e.clientX,
    y: e.clientY,
  });
  draw();
});

canvas.addEventListener('mousemove', (e) => {
  const x = e.clientX;
  const y = e.clientY;
  nextPoint = { x, y };
  draw();
});
