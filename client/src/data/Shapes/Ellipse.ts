import { Point } from "framer-motion";
import { CanvasClass } from "../Canvas";
import { Shape } from "./Shape";
import { FigurePropsTypes } from "@/components/Canvas/Canvas";

export class Ellipse extends Shape {
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

  // toJSON(): string {
  //   return `{"type":"Ellipse",\
  //     "start":"${JSON.stringify(this.start)}"
  //     "leftTop":"${JSON.stringify(this.leftTop)}",\
  //     "rightBottom":"${JSON.stringify(this.rightBottom)}",\
  //     "name":${this.name},\
  //     "borderWidth":"${this.borderWidth}",\
  //     "strokeColor":"${this.strokeColor}",\
  //     "fillColor":"${this.fillColor}",\
  //     "strokeOpacity":"${this.strokeOpacity}",\
  //     "fillOpacity":"${this.fillOpacity}",\
  //     "displayFill":"${this.displayFill}",\
  //     "displayStroke":"${this.displayStroke}",\
  //     "width":"${this.width}",\
  //     "height":"${this.height}"\
  //   }`;
  // }

  toJSON(): string {
    return JSON.stringify({
      type: "Ellipse",
      start: this.start,
      leftTop: this.leftTop,
      rightBottom: this.rightBottom,
      name: this.name,
      borderWidth: this.borderWidth,
      strokeColor: this.strokeColor,
      fillColor: this.fillColor,
      strokeOpacity: this.strokeOpacity,
      fillOpacity: this.fillOpacity,
      displayFill: this.displayFill,
      displayStroke: this.displayStroke,
      width: this.width,
      height: this.height,
    });
  }

  onDraw(): void {
    const ctx = this.canvas.getContext2D();
    if (ctx == null) {
      return;
    }

    ctx.beginPath();
    ctx.ellipse(
      this.start.x,
      this.start.y,
      Math.abs(this.width),
      Math.abs(this.height),
      0,
      0,
      2 * Math.PI
    );

    if (this.displayStroke) {
      //border opacity
      ctx.globalAlpha = this.strokeOpacity;
      ctx.lineWidth = this.borderWidth;
      ctx.strokeStyle = this.strokeColor;
      ctx.stroke();
    }

    if (this.displayFill) {
      //border opacity
      ctx.globalAlpha = this.fillOpacity;
      ctx.fillStyle = this.fillColor;
      ctx.fill();
    }
    ctx.closePath();

    // ctx.fillStyle = "black";
    // ctx?.beginPath();

    // ctx?.arc(this.start.x, this.start.y, 20 / 2, 0, 2 * Math.PI);
    // ctx?.fill();

    // ctx.closePath();
  }

  isPointInside(point: Point): boolean {
    if (!this.displayFill) {
      return this.isPointOnBorder(point);
    }
    const rx = Math.abs(this.width);
    const ry = Math.abs(this.height);
    const centerX = this.start.x;
    const centerY = this.start.y;

    // Normalize the point's coordinates with respect to the center of the ellipse
    const normalizedX = point.x - centerX;
    const normalizedY = point.y - centerY;

    // Check if the normalized point is inside the ellipse using the ellipse equation
    const distance = normalizedX ** 2 / rx ** 2 + normalizedY ** 2 / ry ** 2;

    return distance <= 1 || this.isPointOnBorder(point); // If distance <= 1, the point is inside the ellipse
  }

  isPointOnBorder(point: Point): boolean {
    const { x, y } = point;
    let { start, width: rx, height: ry, borderWidth } = this;
    const centerX = start.x;
    const centerY = start.y;

    rx = Math.abs(rx);
    ry = Math.abs(ry);

    var p =
      Math.pow(x - start.x, 2) / Math.pow(rx, 2) +
      Math.pow(y - start.y, 2) / Math.pow(ry, 2);

    const scaledBorderWidth = Math.abs(this.borderWidth) * 2;

    let innerArea = Math.abs(
      (rx - scaledBorderWidth) * (ry - scaledBorderWidth) * Math.PI
    );
    let outerArea = Math.abs(
      (rx + scaledBorderWidth) * (ry + scaledBorderWidth) * Math.PI
    );

    let pointArea = Math.abs(p * rx * ry * Math.PI);

    console.log({
      p,
      innerArea,
      outerArea,
      pointArea,
      must: innerArea / outerArea,
    });

    return pointArea >= innerArea && pointArea <= outerArea;
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
    this.width = (-this.leftTop.x + this.rightBottom.x) / 2;
    this.height = (-this.leftTop.y + this.rightBottom.y) / 2;
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
    this.width = Math.abs(width);
    this.height = Math.abs(height);

    this.borderWidth = options.borderWidth;
    this.fillColor = options.fillColor;
    this.strokeColor = options.strokeColor;
    this.strokeOpacity = options.strokeOpacity;
    this.fillOpacity = options.fillOpacity;
    this.displayFill = options.displayFill;
    this.displayStroke = options.displayStroke;

    const borderOffset = this.borderWidth * 2;

    this.leftTop = {
      x: start.x - this.width, // - borderOffset,
      y: start.y - this.height, // - borderOffset,
    };
    this.rightBottom = {
      x: start.x + this.width, // + borderOffset,
      y: start.y + this.height, // + borderOffset,
    };
  }
}
