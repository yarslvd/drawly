import { Point } from "framer-motion";
import { CanvasClass } from "../Canvas";
import { BrushPoint } from "./BrushPoint";
import { Shape } from "./Shape";
import { FigurePropsTypes } from "@/components/Canvas/Canvas";

export class BrushLine extends Shape {
  points: Point[];

  borderWidth: number;
  strokeColor: string;
  strokeOpacity: number;

  // toJSON(): string {
  //   return `{"type":"BrushLine",\
  //   "leftTop":"${JSON.stringify(this.leftTop)}",\
  //   "rightBottom":"${JSON.stringify(this.rightBottom)}",\
  //   "name":${this.name},\
  //   "borderWidth":"${this.borderWidth}",\
  //   "strokeColor":"${this.strokeColor}",\
  //   "strokeOpacity":"${this.strokeOpacity}",\
  //   "points":"${JSON.stringify(this.points)}"\
  // }`;
  // }

  toJSON(): string {
    return JSON.stringify({
      type: "BrushLine",
      leftTop: this.leftTop,
      rightBottom: this.rightBottom,
      name: this.name,
      borderWidth: this.borderWidth,
      strokeColor: this.strokeColor,
      strokeOpacity: this.strokeOpacity,
      points: this.points,
    });
  }

  onDraw(): void {
    const ctx = this.canvas.getContext2D();
    if (ctx == null) {
      return;
    }
    const points = this.points;

    // (new BrushPoint(this.canvas, point, this.brushSize, this.brushColor)).onDraw();
    ctx.globalAlpha = this.strokeOpacity;
    ctx.strokeStyle = this.strokeColor;
    ctx.lineWidth = this.borderWidth;

    const point = this.points[0];
    console.log(point);
    ctx.beginPath();
    ctx.fillStyle = this.strokeColor;
    ctx.arc(point.x, point.y, this.borderWidth / 2, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    this.handleBorderPoints(points[0]);

    for (let i = 1; i < this.points.length - 2; i++) {
      const xc = (points[i].x + points[i + 1].x) / 2;
      const yc = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
      this.handleBorderPoints(points[i]);
    }

    ctx.lineTo(
      points[this.points.length - 1].x,
      points[this.points.length - 1].y
    );
    this.handleBorderPoints(points[this.points.length - 1]);

    ctx.stroke();
  }

  isPointInside(point: Point): boolean {
    const tolerance = this.borderWidth / 2;

    for (let i = 1; i < this.points.length; i++) {
      const startPoint = this.points[i - 1];
      const endPoint = this.points[i];

      const distance = this.distanceToLineSegment(point, startPoint, endPoint);

      if (distance <= tolerance) {
        return true;
      }
    }

    return false;
  }

  distanceToLineSegment(
    point: Point,
    startPoint: Point,
    endPoint: Point
  ): number {
    const dx = endPoint.x - startPoint.x;
    const dy = endPoint.y - startPoint.y;
    const lengthSquared = dx ** 2 + dy ** 2;

    if (lengthSquared === 0) {
      return Math.sqrt(
        (point.x - startPoint.x) ** 2 + (point.y - startPoint.y) ** 2
      );
    }

    const t =
      ((point.x - startPoint.x) * dx + (point.y - startPoint.y) * dy) /
      lengthSquared;
    const clampedT = Math.max(0, Math.min(1, t));
    const projectedX = startPoint.x + clampedT * dx;
    const projectedY = startPoint.y + clampedT * dy;

    const distanceToLine = Math.sqrt(
      (point.x - projectedX) ** 2 + (point.y - projectedY) ** 2
    );
    const distanceToSegment =
      (distanceToLine * Math.sqrt(lengthSquared)) /
      Math.sqrt(lengthSquared + 1);

    return distanceToSegment;
  }

  calcBoundingBox(): void {
    this.leftTop = { x: Infinity, y: Infinity };
    this.rightBottom = { x: -Infinity, y: -Infinity };

    for (let i = 0; i < this.points.length; i++) {
      this.handleBorderPoints(this.points[i]);
    }
  }

  constructor(canvas: CanvasClass, points: Point[], options: FigurePropsTypes) {
    super(canvas);

    this.points = points;
    this.borderWidth = options.borderWidth;
    this.strokeColor = options.strokeColor;
    this.strokeOpacity = options.strokeOpacity;
  }
}
