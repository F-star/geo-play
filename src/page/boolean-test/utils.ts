import { IPathData } from './type';

export const ellipseToPath = (
  cx: number,
  cy: number,
  rx: number,
  ry: number,
): IPathData => {
  const k = 0.5522847498307936; // (-4 + 4 * Math.sqrt(2)) / 3

  const lx = rx * k;
  const ly = ry * k;

  const pathData: IPathData = [];

  // 起点为正右方，方向为顺时针
  pathData.push(['M', cx + rx, cy]);
  pathData.push(['C', cx + rx, cy + ly, cx + lx, cy + ry, cx, cy + ry]);
  pathData.push(['C', cx - lx, cy + ry, cx - rx, cy + ly, cx - rx, cy]);
  pathData.push(['C', cx - rx, cy - ly, cx - lx, cy - ry, cx, cy - ry]);
  pathData.push(['C', cx + lx, cy - ry, cx + rx, cy - ly, cx + rx, cy]);
  pathData.push(['Z']);

  return pathData;
};

// 矩形转 path
export const rectToPath = (
  x: number,
  y: number,
  width: number,
  height: number,
): IPathData => {
  const pathData: IPathData = [];
  pathData.push(['M', x, y]);
  pathData.push(['L', x + width, y]);
  pathData.push(['L', x + width, y + height]);
  pathData.push(['L', x, y + height]);
  pathData.push(['Z']);
  return pathData;
};

// 解析 svg 的 path 字符串，转为数组形式
export const strToPath = (svgPath: string): IPathData => {
  const pathData: IPathData = [];

  // 移除多余空格并分割命令和数字
  const tokens = svgPath
    .replace(/([A-Za-z])/g, ' $1 ')
    .replace(/,/g, ' ')
    .trim()
    .split(/\s+/);

  let currentCommand = '';
  let numbers: number[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    // 如果是命令字符
    if (/^[A-Za-z]$/.test(token)) {
      currentCommand = token;
      numbers = [];
    }
    // 如果是数字
    else {
      numbers.push(parseFloat(token));

      // 根据不同命令处理对应数量的参数
      switch (currentCommand) {
        case 'M': // 移动到
        case 'L': // 画线到
          if (numbers.length === 2) {
            pathData.push([currentCommand, numbers[0], numbers[1]]);
            numbers = [];
          }
          break;
        case 'H': // 水平线，要转为 L 命令
          if (numbers.length === 1) {
            // 相对上一个点进行水平移动
            pathData.push(['L', numbers[0], pathData[pathData.length - 1][2]]);
            numbers = [];
          }
          break;
        case 'V': // 垂直线，要转为 L 命令
          if (numbers.length === 1) {
            // 相对上一个点进行垂直移动
            pathData.push(['L', pathData[pathData.length - 1][1], numbers[0]]);
            numbers = [];
          }
          break;
        case 'C': // 三次贝塞尔曲线
          if (numbers.length === 6) {
            pathData.push([
              currentCommand,
              numbers[0],
              numbers[1],
              numbers[2],
              numbers[3],
              numbers[4],
              numbers[5],
            ]);
            numbers = [];
          }
          break;

        case 'Z': // 闭合路径
        case 'z':
          pathData.push(['Z']);
          numbers = [];
          break;
      }
    }
  }

  return pathData;
};
