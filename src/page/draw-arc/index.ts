import { drawNumText, fillPoints } from '../../draw-util';
import { distance } from '../../geo';
import { Point } from '../../type';
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
const drawArc2 = (
  start: Point,
  end: Point,
  radius: number,
  sweep: boolean,
  largeArc: boolean,
) => {
  const d = `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${
    largeArc ? 1 : 0
  } ${sweep ? 1 : 0} ${end.x} ${end.y}`;

  const center = getArc2Center(start, end, radius, sweep, largeArc);

  const pathElement = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'path',
  );
  pathElement.setAttributeNS(null, 'd', d);
  pathElement.setAttributeNS(null, 'stroke', 'black');
  pathElement.setAttributeNS(null, 'fill', 'none');

  const centerPtElement = createSVGPoint(center);
  const startPtElement = createSVGPoint(start);
  const startTextElement = createSVGText(start, 'start');

  const endPtElement = createSVGPoint(end);
  const endTextElement = createSVGText(end, 'end');

  const svgElement = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'svg',
  );
  svgElement.setAttributeNS(null, 'width', '500');
  svgElement.setAttributeNS(null, 'height', '500');
  svgElement.appendChild(pathElement);
  svgElement.appendChild(centerPtElement);
  svgElement.appendChild(startPtElement);
  svgElement.appendChild(startTextElement);
  svgElement.appendChild(endPtElement);
  svgElement.appendChild(endTextElement);
  document.body.appendChild(svgElement);
};

const createSVGPoint = (pt: Point) => {
  const el = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  el.setAttributeNS(null, 'cx', '' + pt.x);
  el.setAttributeNS(null, 'cy', '' + pt.y);
  el.setAttributeNS(null, 'r', '5');
  return el;
};

const createSVGText = (pt: Point, content: string) => {
  const el = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  el.setAttributeNS(null, 'x', '' + pt.x);
  el.setAttributeNS(null, 'y', '' + (pt.y + 20));
  el.innerHTML = content;
  return el;
};

const start = { x: 100, y: 100 };
const end = { x: 250, y: 200 };
const radius = 95;
const sweep = true;
const largeArc = true;
drawArc2(start, end, radius, sweep, largeArc);

const drawArc3 = () => {
  const start = { x: 100, y: 100 };
  const end = { x: 250, y: 200 };
  const bulge: number = -1.6;

  if (bulge === 0) {
    console.log('表达的是直线');
    return;
  }

  const sweep = bulge > 0 ? false : true;
  const largeArc = Math.abs(bulge) > 1 ? true : false;
  const sweepAngle = Math.atan(Math.abs(bulge)) * 4;
  const radius = distance(start, end) / 2 / Math.sin(sweepAngle / 2);
  drawArc2(start, end, radius, sweep, largeArc);
};

drawArc3();
