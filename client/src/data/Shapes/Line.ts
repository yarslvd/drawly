import { Point } from "framer-motion";
import { CanvasClass } from "../Canvas";
import { Shape } from "./Shape";
import { FigurePropsTypes } from "@/components/Canvas/Canvas";

export class Line extends Shape {
  start: Point;
  end: Point;

  borderWidth: number;
  strokeColor: string;
  strokeOpacity: number;
  displayStroke: boolean;

  // toJSON(): string {
  //   return `{"type":"Line",\
  //   "start":"${JSON.stringify(this.start)}",\
  //   "end":"${JSON.stringify(this.end)}",\
  //   "leftTop":"${JSON.stringify(this.leftTop)}",\
  //   "rightBottom":"${JSON.stringify(this.rightBottom)}",\
  //   "name":${this.name},\
  //   "borderWidth":"${this.borderWidth}",\
  //   "strokeColor":"${this.strokeColor}",\
  //   "strokeOpacity":"${this.strokeOpacity}",\
  //   "displayStroke":"${this.displayStroke}"\
  // }`;
  // }

  toJSON(): string {
    return JSON.stringify({
      type: "Line",
      start: this.start,
      end: this.end,
      leftTop: this.leftTop,
      rightBottom: this.rightBottom,
      name: this.name,
      borderWidth: this.borderWidth,
      strokeColor: this.strokeColor,
      strokeOpacity: this.strokeOpacity,
      displayStroke: this.displayStroke,
    });
  }

  onDraw(): void {
    const ctx = this.canvas.getContext2D();
    if (ctx == null) {
      return;
    }

    this.handleBorderPoints(this.start);
    this.handleBorderPoints(this.end);

    if (this.displayStroke) {
      ctx.beginPath();
      ctx.globalAlpha = this.strokeOpacity;
      ctx.lineWidth = this.borderWidth;
      ctx.strokeStyle = this.strokeColor;
      ctx.moveTo(this.start.x, this.start.y);
      ctx.lineTo(this.end.x, this.end.y);
      ctx.stroke();
    }
  }

  isPointInside(point: Point): boolean {
    const ctx = this.canvas.getContext2D();
    if (ctx == null) {
      return false;
    }

    const distance = this.distanceToPoint(point, this.start, this.end);

    console.log("Line isPointInside", distance);

    return distance <= this.borderWidth;
  }

  distanceToPoint(point: Point, start: Point, end: Point): number {
    const { x: px, y: py } = point;
    const { x: x1, y: y1 } = start;
    const { x: x2, y: y2 } = end;

    const dx = x2 - x1;
    const dy = y2 - y1;

    const lengthSquared = dx * dx + dy * dy;
    if (lengthSquared === 0) {
      return Math.sqrt((px - x1) * (px - x1) + (py - y1) * (py - y1));
    }

    const t = ((px - x1) * dx + (py - y1) * dy) / lengthSquared;
    const projectionX = x1 + t * dx;
    const projectionY = y1 + t * dy;

    return Math.sqrt(
      (px - projectionX) * (px - projectionX) +
        (py - projectionY) * (py - projectionY)
    );
  }

  constructor(
    canvas: CanvasClass,
    start: Point,
    end: Point,
    options: FigurePropsTypes
  ) {
    super(canvas);

    this.start = start;
    this.end = end;

    this.borderWidth = options.borderWidth;
    this.strokeColor = options.strokeColor;
    this.strokeOpacity = options.strokeOpacity;
    this.displayStroke = options.displayStroke;
  }
}
