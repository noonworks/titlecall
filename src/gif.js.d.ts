declare class GIF {
  constructor(options?: any);
  running: boolean;
  addFrame(context: CanvasRenderingContext2D, options: any);
  on(type: string, callback: any);
  render();
}
