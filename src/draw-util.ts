import { Point } from './type';

export const fillPolygon = (ctx: CanvasRenderingContext2D, points: Point[]) => {
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  points.slice(1).forEach((p) => ctx.lineTo(p.x, p.y));
  ctx.closePath();
  ctx.fill();
};

export const strokePolygon = (
  ctx: CanvasRenderingContext2D,
  points: Point[],
  closed = true,
) => {
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  points.slice(1).forEach((p) => ctx.lineTo(p.x, p.y));
  if (closed) {
    ctx.closePath();
  }
  ctx.stroke();
};

export const fillPoints = (
  ctx: CanvasRenderingContext2D,
  p: Point[],
  size = 10,
) => {
  const radius = size / 2;
  p.forEach((p) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
    ctx.fill();
  });
};

export const drawLine = (
  ctx: CanvasRenderingContext2D,
  p1: Point,
  p2: Point,
) => {
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();
};

export const drawBezier = (
  ctx: CanvasRenderingContext2D,
  p1: Point,
  p2: Point,
  p3: Point,
  p4: Point,
) => {
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.bezierCurveTo(p2.x, p2.y, p3.x, p3.y, p4.x, p4.y);
  ctx.stroke();
};

export const drawTextInCenter = (
  ctx: CanvasRenderingContext2D,
  p: Point,
  text: string,
  size: number,
) => {
  ctx.font = `${size}px sans-serif`;
  // 水平垂直居中绘制文字
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillText(text, p.x, p.y);
};
