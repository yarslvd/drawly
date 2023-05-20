import { Coordinates } from "@/types/types";
import { Tool } from "@/data/ToolsClass";
import { CurveLine as CurveLineShape } from "../Shapes/CurveLine";

export class CurveLine extends Tool {
  points: Coordinates[] = [];

  protected onMove(start: Coordinates, end: Coordinates): void {
    // console.log("on move")
    if (!this.canvas || !this.points) return;

    const context = this.canvas.getContext2D();
    if (!context) return;

    if (this.points.length > 0) {
      this.canvas.undoShape();
    }

    const line = new CurveLineShape(
      this.canvas,
      [...this.points, end],
      this.canvas.options,
    );

    line.onDraw();

    this.canvas.pushHistory(line);
  }

  protected onDown(point: Coordinates): void {}

  protected onUp(point: Coordinates): void {}

  protected onClick(point: Coordinates): void {
    // console.log("curve line on click");
    this.isActing = true;
    this.lastPoint = point;
    if (!this.canvas) return;

    const context = this.canvas.getContext2D();
    if (!context) return;

    if (
      this.points.length > 0 &&
      JSON.stringify(point) ==
        JSON.stringify(this.points[this.points.length - 1])
    ) {
      this.points = [];
      this.isActing = false;
      this.lastPoint = null;
      return;
    }

    this.points.push(point);

    if (this.points.length > 1) {
      this.canvas.undoShape();
    }

    const curveLine = new CurveLineShape(
      this.canvas,
      this.points,
      this.canvas.options,
    );
    // console.log(this.points);
    curveLine.onDraw();

    this.canvas.pushHistory(curveLine);
  }
}
