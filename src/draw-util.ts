import { Point, Rect } from './type';

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

export const strokeBox = (
  ctx: CanvasRenderingContext2D,
  box: { minX: number; minY: number; maxX: number; maxY: number },
) => {
  ctx.strokeRect(box.minX, box.minY, box.maxX - box.minX, box.maxY - box.minY);
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

export const strokeCircle = (
  ctx: CanvasRenderingContext2D,
  center: Point,
  radius: number,
) => {
  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
  ctx.stroke();
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

export const drawPolyline = (ctx: CanvasRenderingContext2D, pts: Point[]) => {
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) {
    ctx.lineTo(pts[i].x, pts[i].y);
  }
  ctx.stroke();
};

export const drawPolygon = (ctx: CanvasRenderingContext2D, pts: Point[]) => {
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) {
    ctx.lineTo(pts[i].x, pts[i].y);
  }
  ctx.closePath();
  ctx.stroke();
};

export const drawBezier = (
  ctx: CanvasRenderingContext2D,
  p1: Point,
  cp1: Point,
  cp2: Point,
  p2: Point,
) => {
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, p2.x, p2.y);
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

export const drawText = (
  ctx: CanvasRenderingContext2D,
  p: Point,
  text: string,
  color?: string,
  offsetX = -3,
  offsetY = -10,
) => {
  ctx.save();
  if (color) {
    ctx.fillStyle = color;
  }
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 2;
  ctx.font = '18px sans-serif';
  ctx.strokeText(text, p.x + offsetX, p.y + offsetY);
  ctx.fillText(
    // `${text} (${parseFloat(p.x.toFixed(1))}, ${parseFloat(p.y.toFixed(1))})`,
    text,
    p.x + offsetX,
    p.y + offsetY,
  );

  ctx.restore();
};

export const drawImg = (
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  rect: Rect,
) => {
  ctx.drawImage(img, rect.x, rect.y, rect.width, rect.height);
};
