import { drawPolygon, drawPolyline, fillPoints } from '../../draw-util';
import { Point } from '../../type';
import {
  outlineLineWithButtCap,
  outlineLineWithRoundCap,
  outlineLineWithSquareCap,
} from './geo';

const canvas = document.querySelector('canvas')!;
const ctx = canvas.getContext('2d')!;

const pts: Point[] = [
  { x: 200, y: 220 },
  { x: 400, y: 400 },
];
const width = 50;

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = 'gray';

  drawPolyline(ctx, pts);

  // // ---> butt
  const buttOutline = outlineLineWithButtCap(pts[0], pts[1], width);
  ctx.save();
  ctx.fillStyle = 'blue';
  ctx.strokeStyle = 'blue';
  drawPolygon(ctx, buttOutline);
  fillPoints(ctx, buttOutline, 5);
  ctx.restore();

  // // ---> square
  const squareOutline = outlineLineWithSquareCap(pts[0], pts[1], width);
  ctx.save();
  ctx.fillStyle = 'green';
  ctx.strokeStyle = 'green';
  drawPolygon(ctx, squareOutline);
  fillPoints(ctx, squareOutline, 5);
  ctx.restore();

  // --> round
  const roundOutline = outlineLineWithRoundCap(pts[0], pts[1], width);
  drawRoundOutlineBySVG(roundOutline);
};

const drawRoundOutlineBySVG = (
  outline: {
    x: number;
    y: number;
    radius?: number;
    largeArc?: boolean;
    sweep?: boolean;
  }[],
) => {
  let d = `M ${outline[0].x} ${outline[0].y} `;

  for (let i = 1; i < outline.length; i++) {
    const seg = outline[i];
    if ('radius' in seg) {
      d += `A ${seg.radius} ${seg.radius} 0 ${seg.largeArc ? 1 : 0} ${
        seg.sweep ? 1 : 0
      } ${seg.x} ${seg.y} `;
    } else {
      d += `L ${seg.x} ${seg.y} `;
    }
  }
  d += 'Z';

  const pathElement =
    document.querySelector('path') ??
    document.createElementNS('http://www.w3.org/2000/svg', 'path');
  pathElement.setAttributeNS(null, 'd', d);
  pathElement.setAttributeNS(null, 'stroke', 'red');
  pathElement.setAttributeNS(null, 'fill', 'none');

  const svgElement =
    document.querySelector('svg') ??
    document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgElement.setAttributeNS(null, 'width', '500');
  svgElement.setAttributeNS(null, 'height', '500');

  svgElement.appendChild(pathElement);
  document.body.appendChild(svgElement);
};

draw();

canvas.addEventListener('pointermove', (e: PointerEvent) => {
  pts[1].x = e.clientX;
  pts[1].y = e.clientY;
  draw();
});
