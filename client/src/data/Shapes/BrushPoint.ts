import { Point } from "framer-motion";
import { CanvasClass } from "../Canvas";
import { Shape } from "./Shape";
import {FigurePropsTypes} from "@/components/Canvas/Canvas";

export class BrushPoint extends Shape {
  point: Point;

  borderWidth: number;
  strokeColor: string;
  strokeOpacity: number;

  onDraw(): void {
    const ctx = this.canvas.getContext2D();
    if (ctx == null) {
      return;
    }

    ctx.strokeStyle = this.strokeColor;
    ctx.globalAlpha = this.strokeOpacity;
    ctx.beginPath();

    ctx.arc(this.point.x, this.point.y, this.borderWidth / 2, 0, 2 * Math.PI);
    ctx.fill();
  }

  isPointInside(point: Point): boolean {
    return false;
  }

  constructor(
      canvas: CanvasClass,
      point: Point,
      options: FigurePropsTypes,
  ) {
    super(canvas);

    this.point = point;
    this.borderWidth = options.borderWidth;
    this.strokeColor = options.strokeColor;
    this.strokeOpacity = options.strokeOpacity;
  }
}
