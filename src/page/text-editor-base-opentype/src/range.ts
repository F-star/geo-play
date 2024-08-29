import { Editor } from './editor';

interface IRange {
  startIndex: number;
  endIndex: number;
}

/**
 * 选区
 */
class RangeManager {
  private range: IRange = {
    startIndex: -1,
    endIndex: -1,
  };
  constructor(editor: Editor) {
    // ...
  }
}
