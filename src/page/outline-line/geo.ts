import { Point } from "../../type";

// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineCap

export const outlineLineWithButtCap = (p1: Point, p2: Point, width: number) => {
  const tan = {
    x: p2.x - p1.x,
    y: p2.y - p2.y
  }

  // 求直线法向量
  const t = width / 2 / Math.sqrt(tan.x * tan.x + tan.y * tan.y)
  const normal = {
    x: tan.y * t,
    y: tan.x * t,
  }
  const vertexes = [
    { x: p1.x + normal.x, y: p1.y + normal.y },
    { x: p2.x + normal.x, y: p2.y + normal.y },
    { x: p2.x - normal.x, y: p2.y - normal.y },
    { x: p1.x - normal.x, y: p1.y - normal.y }
  ]

  return vertexes
}

export const outlineLineWithSquareCap = (p1: Point, p2: Point, width: number) => {
  const tan = {
    x: p2.x - p1.x,
    y: p2.y - p2.y
  }

  // 求直线法向量
  const t = width / 2 / Math.sqrt(tan.x * tan.x + tan.y * tan.y)
  const normal = {
    x: tan.y * t,
    y: tan.x * t,
  }
  const vertexes = [
    { x: p1.x + normal.x, y: p1.y + normal.y },
    { x: p2.x + normal.x, y: p2.y + normal.y },
    { x: p2.x - normal.x, y: p2.y - normal.y },
    { x: p1.x - normal.x, y: p1.y - normal.y }
  ]

  return vertexes
}