import { Coordinates } from "@/types/types";
import { Tool } from "../ToolsClass";
import { BrushLine } from "../Shapes/BrushLine";

export class Brush extends Tool {
  points: Coordinates[] = [];

  protected onMove(start: Coordinates, end: Coordinates): void {
    if (!this.canvas) return;

    const context = this.canvas.getContext2D();
    if (!context) return;

    this.points.push(end);

    this.canvas.undoShape();

    const line = new BrushLine(this.canvas, this.points, this.canvas.options);

    line.onDraw();

    this.canvas.pushHistory(line);
  }

  protected onDown(point: Coordinates): void {
    if (!this.canvas) return;

    const context = this.canvas.getContext2D();
    if (!context) return;

    //TODO: weight and height the same as the lineWidth, remember to upd after adding styles

    this.points.push(point);

    const line = new BrushLine(this.canvas, this.points, 5, "black");
    line.onDraw();
    this.canvas.pushHistory(line);
  }

  protected onUp(point: Coordinates): void {
    this.points = [];
  }

  protected onClick(point: Coordinates): void {
    // not implemented
  }
}
