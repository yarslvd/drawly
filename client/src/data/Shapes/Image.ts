import { Point } from "framer-motion";
import { CanvasClass } from "../Canvas";
import { Shape } from "./Shape";

import { FigurePropsTypes } from "@/components/Canvas/Canvas";

// import imgur from 'imgur';

// const imgurClient = new imgur({ clientId: process.env.NEXT_PUBLIC_IMGUR_ID });

import imgbbUploader from "imgbb-uploader";

async function blobUrlToBase64(blobUrl) {
  try {
    // Fetch the blob data from the provided URL
    const response = await fetch(blobUrl);
    const blobData = await response.blob();

    // Create a FileReader object
    const fileReader = new FileReader();

    // Create a Promise for reading the file data
    const readPromise = new Promise((resolve, reject) => {
      fileReader.onloadend = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = reject;
    });

    // Read the blob data as a base64 string
    fileReader.readAsDataURL(blobData);

    // Wait for the file data to be read and return the base64 string
    const base64Data = await readPromise;
    return base64Data;
  } catch (error) {
    console.error("Error converting blob URL to base64:", error);
    throw error;
  }
}

export class Img extends Shape {
  protected image: HTMLImageElement;
  start: Point;

  width: number;
  height: number;

  filters: string;
  url: string;

  ctx: CanvasRenderingContext2D;

  private uploadImage = async (dataURL) => {
    try {
      console.log({ dataURL });
      const options = {
        apiKey: process.env.NEXT_PUBLIC_IMGBB_API_KEY,
        base64string: (await blobUrlToBase64(dataURL)).split(",")[1],
      };
      const response = await imgbbUploader(options);

      console.log("Image uploaded successfully:", response);
      // const imageUrl = response.display_url;
      this.url = response.display_url;
    } catch (error) {
      console.error("Failed to upload image:", error.message);
    }
  };

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
    this.url = options.imageURL || options.url;

    console.log("image constructor");

    if (image == null) {
      this.image = new Image();
      this.image.crossOrigin = "anonymous";
      this.image.src = this.url;

      this.image.onerror = () => {
        this.url = "";
      };

      this.image.onload = () => {
        console.log("loaded");
        console.log({ url: this.url });
        this.canvas.redrawCanvas();
        if (this.url.includes("blob:")) {
          this.uploadImage(this.image.src);
        }
      };
    } else {
      this.image = image;
      console.log({ url: this.url });
      if (this.url.includes("blob:")) {
        this.uploadImage(this.image.src);
      }
    }

    const ctx = this.canvas.getContext2D();
    if (ctx == null) return;
    // ctx.filter = this.filters;

    this.normalizeCorners();
  }
}
