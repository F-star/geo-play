import { drawLine, fillPoints, fillPolygon } from "./draw-util";
import { getEquilateralTriangle, getAdjSquare } from "./geo";

import { Point } from "./type";

const canvas = document.querySelector("canvas")!;
const ctx = canvas.getContext("2d")!;



const strokePolygon = (points: Point[]) => {
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  points.slice(1).forEach((p) => ctx.lineTo(p.x, p.y));
  ctx.closePath();
  ctx.stroke();
}


const endPos = { x: 400, y: 400 };

const draw = () => {
  const startPos = { x: 250, y: 250 };
  const triangle = getEquilateralTriangle(startPos, endPos, 60);
  fillPolygon(ctx, triangle);

  drawLine(ctx, startPos, endPos);

  ctx.save();
  ctx.fillStyle = "red";
  fillPoints(ctx, [startPos, endPos]);
  ctx.restore();


  const square = getAdjSquare(startPos, endPos, 60);
  strokePolygon(square)
};

draw();

canvas.addEventListener("mousemove", (e) => {
  endPos.x = e.clientX;
  endPos.y = e.clientY;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  draw();
});
