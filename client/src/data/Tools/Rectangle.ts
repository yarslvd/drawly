import { Tool } from "@/data/ToolsClass";
import { Rectangle as RectangleShape } from "../Shapes/Rectangle";
import { Coordinates } from "@/types/types";

export class Rectangle extends Tool {
  protected start: Coordinates | null = null;

  protected onDown(point: Coordinates): void {
    this.start = point;
    const rectangle = new RectangleShape(
      this.canvas,
      this.start,
      0,
      0,
      this.canvas.options,
    );
    this.canvas.pushHistory(rectangle);
  }

  protected onMove(start: Coordinates, end: Coordinates): void {
    if (!this.canvas) return;
    if (!this.start) return;

    const context = this.canvas.getContext2D();
    if (!context) return;

    const width = end.x - this.start.x;
    const height = end.y - this.start.y;

    this.canvas.undoShape();
    const rectangle = new RectangleShape(
      this.canvas,
      this.start,
      width,
      height,
      this.canvas.options,
    );
    rectangle.onDraw();

    this.canvas.pushHistory(rectangle);
  }

  protected onUp(point: Coordinates): void {
    if (!this.canvas) return;
    if (!this.start) return;

    const context = this.canvas.getContext2D();
    if (!context) return;

    const width = point.x - this.start.x;
    const height = point.y - this.start.y;

    this.canvas.undoShape();

    const rectangle = new RectangleShape(
      this.canvas,
      this.start,
      width,
      height,
      this.canvas.options,
    );
    rectangle.onDraw();

    this.canvas.pushHistory(rectangle);
  }

  protected onClick(point: Coordinates): void {
    // not implemented
  }
}
