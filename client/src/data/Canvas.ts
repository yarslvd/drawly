import { SelectedShape } from "./Shapes/SelectedShape";
import { Shape } from "./Shapes/Shape";
import { FigurePropsTypes } from "@/components/Canvas/Canvas";

export class CanvasClass {
  protected context: CanvasRenderingContext2D | null = null;
  public canvasHTML: HTMLCanvasElement | null = null;

  history: Shape[];
  removedHistory: Shape[];
  selectedShapeIndex: number = -1;
  selectedShape: Shape | null;
  selectedShapeDiv: SelectedShape;

  //options
  options: FigurePropsTypes;

  getContext2D(): CanvasRenderingContext2D | null {
    return this.context;
  }

  redrawCanvas(): void {
    const ctx = this.context;
    if (this.canvasHTML == null || ctx == null) {
      return;
    }

    ctx.clearRect(0, 0, this.canvasHTML?.width, this.canvasHTML?.height);

    this.history.forEach((shape: Shape) => {
      shape.onDraw();
    });

    this.selectedShapeIndex != -1 && this.selectedShapeDiv?.onDraw();
  }

  pushHistory(shape: Shape): void {
    this.history.push(shape);
  }

  undoShape(): void {
    if (this.canvasHTML == null) {
      return;
    }

    const ctx = this.canvasHTML.getContext("2d");
    if (this.history.length > 0 && this.canvasHTML && ctx) {
      // console.log("undo", this.history)
      this.removedHistory.unshift(this.history[this.history.length - 1]);
      this.history.pop();

      ctx.clearRect(0, 0, this.canvasHTML?.width, this.canvasHTML?.height);

      this.history.forEach((shape: Shape) => {
        shape.onDraw();
      });
    }
  }

  redoShape(): void {
    if (this.canvasHTML == null) {
      return;
    }

    const ctx = this.canvasHTML.getContext("2d");
    if (this.removedHistory.length > 0 && this.canvasHTML && ctx) {
      // console.log("redo", this.removedHistory)
      const shape = this.removedHistory[0];
      this.history.push(shape);
      this.removedHistory.shift();

      shape.onDraw();
    }
  }

  setCanvasProps(obj): void {
    this.options = obj;
  }

  constructor(canvasHTML: HTMLCanvasElement) {
    this.canvasHTML = canvasHTML;
    this.context = canvasHTML.getContext("2d");

    // basic setup
    if (this.context) {
      this.context.imageSmoothingEnabled = true;
      this.context.imageSmoothingQuality = "medium";
    }

    this.history = [];
    this.removedHistory = [];
    this.selectedShape = null;

    this.selectedShapeDiv = new SelectedShape(this, 5);
  }
}
