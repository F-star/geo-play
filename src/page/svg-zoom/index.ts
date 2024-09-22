import { SVG } from '@svgdotjs/svg.js';
import { Matrix } from 'pixi.js';

const draw = SVG().addTo('body').size(700, 600);

const sceneGraph = draw.group();

const rect = sceneGraph.rect(200, 100).move(20, 20).attr({
  stroke: '#000',
  fill: 'none',
  // 'vector-effect': 'non-scaling-stroke',
});

const circle = sceneGraph
  .circle(150)
  .center(200, 200)
  .attr({ stroke: '#000', fill: 'none' });

let viewMatrix = new Matrix();
const zoomStep = 0.2325;

const getScaleFromMatrix = (m: Matrix) => {
  const { a, b } = m;
  return Math.sqrt(a * a + b * b);
};

const matrixToArr = (m: Matrix) => {
  return [m.a, m.b, m.c, m.d, m.tx, m.ty];
};

const svgEl = draw.node;

svgEl.addEventListener('wheel', (event: WheelEvent) => {
  let isZoomOut = event.deltaY > 0;
  const zoom = getScaleFromMatrix(viewMatrix);
  let newZoom: number;
  if (isZoomOut) {
    newZoom = zoom / (1 + zoomStep);
  } else {
    newZoom = zoom * (1 + zoomStep);
  }
  const deltaZoom = newZoom / zoom;
  viewMatrix
    .translate(-event.clientX, -event.clientY)
    .scale(deltaZoom, deltaZoom)
    .translate(event.clientX, event.clientY);

  sceneGraph.matrix(matrixToArr(viewMatrix));
});

svgEl.addEventListener('mousedown', (e) => {
  const startPos = { x: e.clientX, y: e.clientY };
  const startMatrix = viewMatrix.clone();

  const onMousemove = (e: MouseEvent) => {
    viewMatrix = startMatrix
      .clone()
      .translate(e.clientX - startPos.x, e.clientY - startPos.y);
    // console.log(e.clientX - startPos.x, e.clientY - startPos.y);
    console.log('???', viewMatrix.toString());
    sceneGraph.matrix(matrixToArr(viewMatrix));
  };
  document.addEventListener('mousemove', onMousemove);

  const onMouseup = () => {
    document.removeEventListener('mousemove', onMousemove);
    document.removeEventListener('mouseup', onMouseup);
  };
  document.addEventListener('mouseup', onMouseup);
});

svgEl.addEventListener('contextmenu', (e) => e.preventDefault());
