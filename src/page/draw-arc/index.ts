import { drawNumText, fillPoints } from '../../draw-util';
import { getArc2Center, getArcPoint } from './geo';

const canvas = document.querySelector('canvas')!;
const ctx = canvas.getContext('2d')!;

/*********** 方式 1 **********/
const drawArc1 = (ctx: CanvasRenderingContext2D) => {
  const center = { x: 150, y: 150 };
  const radius = 100;
  const startAngle = 0;
  const endAngle = Math.PI * 2 * (5 / 7);

  ctx.arc(center.x, center.y, radius, startAngle, endAngle);
  ctx.stroke();

  const startPt = getArcPoint(center, radius, startAngle);
  const endPt = getArcPoint(center, radius, endAngle);
  fillPoints(ctx, [center, startPt, endPt]);
  drawNumText(ctx, center, 'center');
  drawNumText(ctx, startPt, 'start');
  drawNumText(ctx, endPt, 'end');
};

drawArc1(ctx);

/*********** 方式 2 **********/
const drawArc2 = () => {
  const start = { x: 100, y: 100 };
  const end = { x: 250, y: 200 };
  const radius = 100;
  const sweep = true;
  const largeArc = false;

  const d = `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${
    largeArc ? 1 : 0
  } ${sweep ? 1 : 0} ${end.x} ${end.y}`;

  const center = getArc2Center(start, end, radius, sweep, largeArc);
  console.log(center);

  const pathElement = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'path',
  );
  pathElement.setAttributeNS(null, 'd', d);
  pathElement.setAttributeNS(null, 'stroke', 'black');
  pathElement.setAttributeNS(null, 'fill', 'none');

  const pointElement = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'circle',
  );
  pointElement.setAttributeNS(null, 'cx', '' + center.x);
  pointElement.setAttributeNS(null, 'cy', '' + center.y);
  pointElement.setAttributeNS(null, 'r', '5');

  const svgElement = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'svg',
  );
  svgElement.setAttributeNS(null, 'width', '500');
  svgElement.setAttributeNS(null, 'height', '500');
  svgElement.appendChild(pathElement);
  svgElement.appendChild(pointElement);
  document.body.appendChild(svgElement);
};

drawArc2();
