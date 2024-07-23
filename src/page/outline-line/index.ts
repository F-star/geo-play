import { drawPolyline } from '../../draw-util';
import { Point } from '../../type';

const canvas = document.querySelector('canvas')!;
const ctx = canvas.getContext('2d')!;

const pts: Point[] = [
  { x: 100, y: 150 },
  { x: 200, y: 400 },
]

const draw = () => {
  ctx.save();
  ctx.strokeStyle = 'gray';

  drawPolyline(ctx, pts);
};

draw();
