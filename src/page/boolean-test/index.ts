import { Matrix } from 'pixi.js';
import { canvaskitDraw } from './canvaskit-draw';
import { testData } from './data';
import { debounce, throttle } from 'lodash';
import InitCanvasKit from 'canvaskit-wasm';

// const fill: number[] = [0, 0.4, 1, 0.5]; // rgba
// const stroke: number[] = [0, 0, 0, 1];

let viewMatrix = new Matrix();
const zoomStep = 0.2325;

const main = async () => {
  const canvas = document.querySelector('#canvasKit') as HTMLCanvasElement;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const CanvasKit = await InitCanvasKit({
    locateFile: (file) => '/node_modules/canvaskit-wasm/bin/' + file,
  });

  let surface = CanvasKit.MakeWebGLCanvasSurface(canvas)!;

  const canvaskitDrawNow = () => {
    canvaskitDraw(CanvasKit, surface, testData, viewMatrix);
  };
  canvaskitDrawNow();

  const canvaskitDrawThrottle = throttle(canvaskitDrawNow, 0);

  /************* 缩放逻辑 *************/
  canvas.addEventListener('wheel', (event: WheelEvent) => {
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

    canvaskitDrawThrottle();
  });

  canvas.addEventListener('mousedown', (e) => {
    const startPos = { x: e.clientX, y: e.clientY };
    const startMatrix = viewMatrix.clone();

    const onMousemove = (e: MouseEvent) => {
      viewMatrix = startMatrix
        .clone()
        .translate(e.clientX - startPos.x, e.clientY - startPos.y);

      canvaskitDrawThrottle();
    };
    document.addEventListener('mousemove', onMousemove);

    const onMouseup = () => {
      document.removeEventListener('mousemove', onMousemove);
      document.removeEventListener('mouseup', onMouseup);
    };
    document.addEventListener('mouseup', onMouseup);
  });

  canvas.addEventListener('contextmenu', (e) => e.preventDefault());

  /******* 页面缩放，canvas 跟随修改宽高 *******/
  const handleResize = debounce(() => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    surface.delete();
    surface = CanvasKit.MakeWebGLCanvasSurface(canvas)!;

    canvaskitDrawNow();
  }, 100);

  window.addEventListener('resize', handleResize);
};

const getScaleFromMatrix = (m: Matrix) => {
  const { a, b } = m;
  return Math.sqrt(a * a + b * b);
};

main();
