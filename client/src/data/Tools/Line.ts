import { Coordinates } from "@/types/types";
import { Tool } from "@/data/ToolsClass";
import { Line as LineShape } from "../Shapes/Line";

export class Line extends Tool {
  start: Coordinates | null = null;
  end: Coordinates | null = null;

  protected onMove(start: Coordinates, end: Coordinates): void {
    if (!this.canvas || !this.start) return;

    const context = this.canvas.getContext2D();
    if (!context) return;

    this.end = end;

    this.canvas.undoShape();

    const line = new LineShape(
      this.canvas,
      this.start,
      this.end,
      this.canvas.options
    );

    line.onDraw();

    this.canvas.pushHistory(line);
  }

  protected onDown(point: Coordinates): void {
    if (!this.canvas) return;

    const context = this.canvas.getContext2D();
    if (!context) return;

    //TODO: weight and height the same as the lineWidth, remember to upd after adding styles

    this.start = point;

    const line = new LineShape(
      this.canvas,
      this.start,
      this.start,
      this.canvas.options
    );

    this.canvas.pushHistory(line);
  }

  protected onUp(point: Coordinates): void {
    this.start = null;
    this.end = null;
  }

  protected onClick(point: Coordinates): void {
    // not implemented
  }
}
