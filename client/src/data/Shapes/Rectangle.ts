import { Point } from "framer-motion";
import { CanvasClass } from "../Canvas";
import { Shape } from "./Shape";

import { FigurePropsTypes } from "@/components/Canvas/Canvas";

export class Rectangle extends Shape {
  start: Point;

  width: number;
  height: number;

  borderWidth: number;
  strokeColor: string;
  fillColor: string;
  strokeOpacity: number;
  fillOpacity: number;
  displayFill: boolean;
  displayStroke: boolean;

  radius: number = 0;

  onDraw(): void {
    const ctx = this.canvas.getContext2D();
    if (ctx == null) {
      return;
    }

    if (this.radius != 0) {
      ctx.beginPath();
      ctx.roundRect(
        this.leftTop.x,
        this.leftTop.y,
        this.width,
        this.height,
        this.radius
      );
      ctx.closePath();
      ctx.stroke();
      ctx.fill();

      return;
    }

    ctx.beginPath();

    if (this.displayStroke) {
      //border opacity
      ctx.globalAlpha = this.strokeOpacity;
      ctx.lineWidth = this.borderWidth;
      ctx.strokeStyle = this.strokeColor;
      ctx.strokeRect(this.leftTop.x, this.leftTop.y, this.width, this.height);
    }

    if (this.displayFill) {
      //fill opacity
      ctx.globalAlpha = this.fillOpacity;
      ctx.fillStyle = this.fillColor;
      ctx.fillRect(this.leftTop.x, this.leftTop.y, this.width, this.height);
    }

    ctx.closePath();
  }

  isPointInside(point: Point): boolean {
    if (!this.displayFill) {
      return this.isPointInsideBorder(point);
    }

    const { x, y } = point;

    if (
      x >= this.leftTop.x &&
      x <= this.rightBottom.x &&
      y >= this.leftTop.y &&
      y <= this.rightBottom.y
    )
      return true;
    else {
      return this.isPointInsideBorder(point);
    }
  }

  isPointInsideBorder(point: Point): boolean {
    const start = this.leftTop;

    const leftBoundary = start.x;
    const rightBoundary = start.x + this.width;
    const topBoundary = start.y;
    const bottomBoundary = start.y + this.height;

    const borderOffset = this.borderWidth / 2;

    const withinLeftBorder =
      point.x >= leftBoundary - borderOffset &&
      point.x <= leftBoundary + borderOffset;
    const withinRightBorder =
      point.x >= rightBoundary - borderOffset &&
      point.x <= rightBoundary + borderOffset;
    const withinTopBorder =
      point.y >= topBoundary && point.y <= topBoundary + borderOffset;
    const withinBottomBorder =
      point.y >= bottomBoundary - borderOffset &&
      point.y <= bottomBoundary + borderOffset;

    return (
      withinLeftBorder ||
      withinRightBorder ||
      withinTopBorder ||
      withinBottomBorder
    );
  }

  normalizeCorners() {
    this.leftTop = { x: Infinity, y: Infinity };
    this.rightBottom = { x: Infinity, y: Infinity };

    if (this.width < 0) {
      this.width = Math.abs(this.width);
      this.leftTop.x = this.start.x - this.width;
      this.rightBottom.x = this.start.x;
    } else {
      this.leftTop.x = this.start.x;
      this.rightBottom.x = this.start.x + this.width;
    }
    if (this.height < 0) {
      this.height = Math.abs(this.height);
      this.leftTop.y = this.start.y - this.height;
      this.rightBottom.y = this.start.y;
    } else {
      this.leftTop.y = this.start.y;
      this.rightBottom.y = this.start.y + this.height;
    }

    this.normalizeSize();
  }

  normalizeSize() {
    this.width = -this.leftTop.x + this.rightBottom.x;
    this.height = -this.leftTop.y + this.rightBottom.y;
  }

  constructor(
    canvas: CanvasClass,
    start: Point,
    width: number,
    height: number,
    options: FigurePropsTypes
  ) {
    super(canvas);

    this.start = Object.assign(start);
    this.width = width;
    this.height = height;

    this.borderWidth = options.borderWidth;
    this.fillColor = options.fillColor;
    this.strokeColor = options.strokeColor;
    this.strokeOpacity = options.strokeOpacity;
    this.fillOpacity = options.fillOpacity;
    this.displayFill = options.displayFill;
    this.displayStroke = options.displayStroke;

    this.normalizeCorners();
  }
}
