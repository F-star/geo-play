// import { RoughCanvas } from 'roughjs/bin/canvas';
import rough from 'roughjs';

const canvas = document.querySelector('canvas')!;
const ctx = canvas.getContext('2d')!;

// ctx.lineWidth = 3;
// ctx.strokeStyle = 'blue';
// ctx.strokeRect(95, 95, 210, 210);

const roughCanvas = rough.canvas(canvas);

const seed = rough.newSeed();

console.log('seed', seed);

roughCanvas.rectangle(80, 80, 200, 120, {
  fill: 'red',
  fillStyle: 'hachure',
  fillWeight: 2,
  disableMultiStroke: true,
  hachureGap: 10,
  // zigzagOffset: 10,
  // strokeWidth: 2,
});

// roughCanvas.circle(130, 130, 200, { fill: 'red' });

// const circle = roughCanvas.generator.circle(130, 130, 200, {
//   fill: 'red',
//   roughness: 2,
// });
// console.log(circle);

// roughCanvas.draw(circle);

// const rect = roughCanvas.generator.rectangle(310, 310, 100, 100, {
//   fill: '#0f4',
// });
// console.log(rect);
// roughCanvas.draw(rect);
