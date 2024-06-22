import { RoughCanvas } from 'roughjs/bin/canvas';

const roughCanvas = new RoughCanvas(document.querySelector('canvas')!);

roughCanvas.rectangle(100, 100, 200, 200, { fill: 'red' });

const rect = roughCanvas.generator.rectangle(310, 310, 100, 100, {
  fill: '#0f4',
});

roughCanvas.draw(rect);
