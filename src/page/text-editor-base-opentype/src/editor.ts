export class Editor {
  private ctx: CanvasRenderingContext2D;

  constructor(private canvas: HTMLCanvasElement, private width: number) {
    this.ctx = canvas.getContext('2d')!;
  }

  draw() {
    // ...
  }
}
