import { Tool } from "@/data/ToolsClass";
import { Rectangle as RectangleShape } from "../Shapes/Rectangle";
import { Coordinates } from "@/types/types";

export class Rectangle extends Tool {
  protected start: Coordinates | null = null;

  flag: boolean = false;

  protected onDown(point: Coordinates): void {
    this.start = point;
    this.flag = true;
    const rectangle = new RectangleShape(
      this.canvas,
      this.start,
      0,
      0,
      Object.assign(this.canvas.options),
    );
    this.canvas.pushHistory(rectangle);

    console.log({opt: this.canvas.options});
  }

  protected onMove(start: Coordinates, end: Coordinates): void {
    if (!this.canvas) return;
    if (!this.start) return;

    const context = this.canvas.getContext2D();
    if (!context) return;

    if(this.flag) {
      console.log(this.canvas.history);
    }

    const width = end.x - this.start.x;
    const height = end.y - this.start.y;

    this.canvas.undoShape();
    const rectangle = new RectangleShape(
      this.canvas,
      this.start,
      width,
      height,
      Object.assign(this.canvas.options),
    );
    rectangle.onDraw();

    this.flag = false;

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
      Object.assign(this.canvas.options),
    );
    rectangle.onDraw();

    this.canvas.pushHistory(rectangle);
  }

  protected onClick(point: Coordinates): void {
    // not implemented
  }
}
