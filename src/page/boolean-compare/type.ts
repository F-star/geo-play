export type IPathData = [string, ...number[]][];

export type IPathOp = 'intersect' | 'union' | 'xor' | 'difference';

export interface IDrawParams {
  canvas: HTMLCanvasElement;
  fill: number[];
  stroke: number[];
  op: IPathOp;
  paths: {
    path1: IPathData;
    path2: IPathData;
  }[];
}
