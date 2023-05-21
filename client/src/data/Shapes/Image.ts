import { Point } from "framer-motion";
import { CanvasClass } from "../Canvas";
import { Shape } from "./Shape";

import { FigurePropsTypes } from "@/components/Canvas/Canvas";

export class Img extends Shape {
  start: Point;

  width: number;
  height: number;

  filters: string;
  url: string;

  onDraw(): void {}

  isPointInside(point: Point): boolean {
    const { x, y } = point;

    return (
      x >= this.leftTop.x &&
      x <= this.rightBottom.x &&
      y >= this.leftTop.y &&
      y <= this.rightBottom.y
    );
  }

  constructor(
    canvas: CanvasClass,
    start: Point,
    width: number,
    height: number,
    options: FigurePropsTypes
  ) {
    super(canvas);

    this.start = start;
    this.width = width;
    this.height = height;

    this.filters = options.imageFilters;
    this.url = options.imageURL;

    const ctx = this.canvas.getContext2D();
    if (ctx == null) return;
    ctx.filter = this.filters;

    this.leftTop = start;
    this.rightBottom = { x: start.x + width, y: start.y + height };
  }
}
