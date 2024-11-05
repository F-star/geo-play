export type IPathData = [string, ...number[]][];

export interface IDrawParams {
  canvas: HTMLCanvasElement;
  fill: number[];
  stroke: number[];
  paths: {
    path1: IPathData;
    path2: IPathData;
  }[];
}
