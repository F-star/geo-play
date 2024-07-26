import { drawBezier, drawLine } from "../../draw-util";
import { getBezier3TangentLine } from "./geo";

const canvas = document.querySelector('canvas')!;
const ctx = canvas.getContext('2d')!;


// https://stackoverflow.com/questions/4089443/find-the-tangent-of-a-point-on-a-cubic-bezier-curve

const p1 = {
  x: 100, y: 200,
}
const p2 = {
  x: 400, y: 300
}
const cp1 = {
  x: 110, y: 300
}
const cp2 = {
  x: 390, y: 100
}

const draw = () => {
  drawBezier(ctx, p1, p2, cp1, cp2);
  const tanLine = getBezier3TangentLine(p1, p2, cp1, cp2, 0.5);

  ctx.save();
  ctx.strokeStyle = '#f04';
  drawLine(ctx, tanLine[0], tanLine[1]);
  ctx.restore();
};

draw();
