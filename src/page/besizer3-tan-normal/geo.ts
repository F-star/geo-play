import { lerp } from "../../geo";
import { Point } from "../../type";

/** 计算三阶贝塞尔曲线 t 位置的切线 */
export const getBezier3TangentLine = (p1: Point, p2: Point, cp1: Point, cp2: Point, t: number) => {
  // FIXME: t 为 0 和 1 时，就有点问题，切线会退化为一个点，需要特殊处理。


  const a = lerp(p1, cp1, t);
  const b = lerp(cp1, cp2, t);
  const c = lerp(cp2, p2, t);

  return [
    lerp(a, b, t),
    lerp(b, c, t)
  ]
}

/** 找到 t 上的点 */
export const getBezier3Point = (p1: Point, p2: Point, cp1: Point, cp2: Point, t: number) => {
  // ...
}