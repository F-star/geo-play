import { canvaskitDraw } from './canvaskit-draw';
import { testData } from './data';

const fill: number[] = [1, 0, 0, 1]; // rgba
const stroke: number[] = [0, 0, 0, 1];

const main = () => {
  canvaskitDraw({
    canvas: document.querySelector('#canvasKit') as HTMLCanvasElement,
    fill,
    stroke,
    op: 'intersect',
    paths: testData,
  });
};

main();
