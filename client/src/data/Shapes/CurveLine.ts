import { Point } from "framer-motion";
import { CanvasClass } from "../Canvas";
import { Shape } from "./Shape";

export class CurveLine extends Shape {
  points: Point[];

  onDraw(): void {
    const ctx = this.canvas.getContext2D();
    if (this.points.length < 2 || ctx == null) {
      return;
    }

    const start = this.points[0];
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#000";
    ctx.moveTo(start.x, start.y);

    for (let i = 1; i < this.points.length - 1; i++) {
      const point = this.points[i];
      const next = this.points[i + 1];
      const controlX = (point.x + next.x) / 2;
      const controlY = (point.y + next.y) / 2;
      ctx.quadraticCurveTo(point.x, point.y, controlX, controlY);
    }

    const end = this.points[this.points.length - 1];
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  }

  isPointInside(point: Point): boolean {
    return false;
  }

  constructor(canvas: CanvasClass, points: Point[]) {
    super(canvas);

    this.points = points;
  }
}
