import { Tool } from "@/data/ToolsClass";
import { Coordinates } from "@/types/types";
import { CanvasClass } from "@/data/Canvas";
import { Img as ImgShape } from "@/data/Shapes/Image";

export class Img extends Tool {
  protected start: Coordinates | null = null;
  protected filters: string = "none";
  protected url: string;
  protected currentImgShape: ImgShape | null = null;
  protected cachedImage: HTMLImageElement | null = null;
  protected animationFrameId: number | null = null;
  flag: boolean = false;

  private setImage(): void {
    this.url = this.canvas.options.imageURL;
    this.filters = this.canvas.options.imageFilters;

    this.cachedImage = new Image();
    this.cachedImage.src = this.url;
    this.cachedImage.onerror = () => {
      this.url = "";
      console.log("error");
    };

    this.cachedImage.onload = () => {
      console.log("loaded");
    };

    // let ctx = this.canvas.getContext2D()!;
    // ctx.filter = this.filters;
  }

  private removeFilters(): void {
    let ctx = this.canvas.getContext2D()!;
    ctx.filter = "none";
  }

  constructor(canvas: CanvasClass) {
    super(canvas);

    this.url = canvas.options.imageURL;
    this.filters = canvas.options.imageFilters;

    this.setImage();
  }

  protected onDown(point: Coordinates): void {
    this.setImage();
    if (this.url === "") return;

    console.log("OnDown");

    this.start = point;
    this.currentImgShape = new ImgShape(
      this.canvas,
      this.start,
      0,
      0,
      Object.assign(this.canvas.options),
      this.cachedImage
    );
    this.canvas.pushHistory(this.currentImgShape);

    this.updateCanvas();
  }

  protected onMove(start: Coordinates, end: Coordinates): void {
    if (!this.canvas) return;
    if (!this.start) return;
    if (!this.currentImgShape) return;

    // this.setImage();
    if (this.url === "") return;

    const image = this.canvas.history[
      this.canvas.history.length - 1
    ] as ImgShape;

    const width = end.x - this.start.x;
    const height = end.y - this.start.y;

    image.rightBottom = end;

    image.width = width;
    image.height = height;

    image.leftTop = this.start;
    image.rightBottom = end;

    image.normalizeCorners();

    if (image.width < 0) {
      const swap = image.leftTop.x;
      image.leftTop.x = image.rightBottom.x;
      image.rightBottom.x = swap;
    }
    if (image.height < 0) {
      const swap = image.leftTop.y;
      image.leftTop.y = image.rightBottom.y;
      image.rightBottom.y = swap;
    }
    // this.canvas.redrawCanvas();
  }

  private updateCanvas(): void {
    if (!this.canvas) return;
    if (!this.start) return;
    if (!this.currentImgShape) return;

    this.canvas.redrawCanvas();
    console.log("redraw");
    // Request the next frame update
    this.animationFrameId = requestAnimationFrame(() => {
      this.updateCanvas();
    });
  }

  protected onUp(point: Coordinates): void {
    if (!this.canvas) return;
    if (!this.start) return;

    this.setImage();
    if (this.url === "") return;

    const context = this.canvas.getContext2D();
    if (!context) return;

    const width = point.x - this.start.x;
    const height = point.y - this.start.y;

    this.canvas.undoShape();

    const img = new ImgShape(
      this.canvas,
      this.start,
      width,
      height,
      Object.assign(this.canvas.options),
      this.cachedImage
    );
    img.onDraw();
    this.currentImgShape?.normalizeCorners();

    this.removeFilters();

    this.canvas.pushHistory(img);

    cancelAnimationFrame(this.animationFrameId!);
    this.animationFrameId = null;
  }

  protected onClick(point: Coordinates): void {
    // not implemented
  }
}
