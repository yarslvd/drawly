import { Point } from "framer-motion";
import { CanvasClass } from "../Canvas";
import { Shape } from "./Shape";

import { FigurePropsTypes } from "@/components/Canvas/Canvas";

export class Img extends Shape {
  protected image: HTMLImageElement;
  start: Point;

  width: number;
  height: number;

  filters: string;
  url: string;

  ctx: CanvasRenderingContext2D;

  // toJSON(): string {
  //   return `{"type":"Img",\
  //     "start":"${JSON.stringify(this.start)}"
  //     "leftTop":"${JSON.stringify(this.leftTop)}",\
  //     "rightBottom":"${JSON.stringify(this.rightBottom)}",\
  //     "name":${this.name},\
  //     "filters":"${this.filters}",\
  //     "url":"${this.url}",\
  //     "width":"${this.width}",\
  //     "height":"${this.height}"\
  //   }`;
  // }

  redrawImage(): void {
    if (!this.canvas) return;
    if (!this.start) return;
    if (!this.image) return;

    this.filters = this.canvas.options.imageFilters;

    // const img = new ImgShape(
    //     this.canvas,
    //     this.start,
    //     this.width,
    //     this.height,
    //     Object.assign(this.canvas.options),
    //     this.i
    // );
    this.onDraw();
  }
  toJSON(): string {
    return JSON.stringify({
      type: "Img",
      start: this.start,
      leftTop: this.leftTop,
      rightBottom: this.rightBottom,
      name: this.name,
      filters: this.filters,
      url: this.url,
      width: this.width,
      height: this.height,
    });
  }

  onDraw(): void {
    this.ctx.filter = this.filters;
    this.ctx.drawImage(
      this.image,
      this.leftTop.x,
      this.leftTop.y,
      this.width,
      this.height
    );
    this.ctx.filter = "none";
  }

  isPointInside(point: Point): boolean {
    const { x, y } = point;

    return (
      x >= this.leftTop.x &&
      x <= this.rightBottom.x &&
      y >= this.leftTop.y &&
      y <= this.rightBottom.y
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
    console.log({ width: this.width, height: this.height });
  }

  constructor(
    canvas: CanvasClass,
    start: Point,
    width: number,
    height: number,
    options: FigurePropsTypes,
    image: HTMLImageElement | null = null
  ) {
    super(canvas);

    this.start = start;
    this.width = width;
    this.height = height;

    this.ctx = this.canvas.getContext2D()!;

    this.filters = options.imageFilters;
    this.url = options.imageURL;

    console.log("image constructor");

    if (image == null) {
      this.image = new Image();
      this.image.src = this.url;
      this.image.onerror = () => {
        this.url = "";
      };

      this.image.onload = () => {
        console.log("loaded");
      };
    } else {
      this.image = image;
    }

    const ctx = this.canvas.getContext2D();
    if (ctx == null) return;
    // ctx.filter = this.filters;

    this.normalizeCorners();
  }
}
