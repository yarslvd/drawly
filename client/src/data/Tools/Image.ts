import { Tool } from "@/data/ToolsClass";
import { Coordinates } from "@/types/types";
import { CanvasClass } from "@/data/Canvas";
import { Img as ImgShape } from "@/data/Shapes/Image";

export class Img extends Tool {
  protected start: Coordinates | null = null;
  protected image: HTMLImageElement;
  protected filters: string = "none";
  protected url: string;
  flag: boolean = false;

  private setImage(): void {
    this.url = this.canvas.options.imageURL;
    this.filters = this.canvas.options.imageFilters;

    this.image.src = this.url;
    this.image.onerror = () => {
      this.url = "";
    };

    let ctx = this.canvas.getContext2D()!;
    ctx.filter = this.filters;
  }

  private removeFilters(): void {
    let ctx = this.canvas.getContext2D()!;
    ctx.filter = "none";
  }

  constructor(canvas: CanvasClass) {
    super(canvas);

    this.url = canvas.options.imageURL;
    this.filters = canvas.options.imageFilters;

    this.image = new Image();
    this.setImage();

    if (this.canvas.getContext2D()) {
      this.canvas.getContext2D()!.filter = this.filters;
    }
  }

  protected onDown(point: Coordinates): void {
    this.setImage();
    if (this.url === "") return;

    this.start = point;
    this.flag = true;
    const img = new ImgShape(
      this.canvas,
      this.start,
      0,
      0,
      Object.assign(this.canvas.options)
    );
    this.canvas.pushHistory(img);
  }

  protected onMove(start: Coordinates, end: Coordinates): void {
    if (!this.canvas) return;
    if (!this.start) return;

    this.setImage();
    if (this.url === "") return;

    const context = this.canvas.getContext2D();
    if (!context) return;

    const width = end.x - this.start.x;
    const height = end.y - this.start.y;

    this.canvas.undoShape();
    const img = new ImgShape(
      this.canvas,
      this.start,
      width,
      height,
      Object.assign(this.canvas.options)
    );
    img.onDraw();

    this.flag = false;
    this.canvas
      .getContext2D()!
      .drawImage(this.image, this.start.x, this.start.y, width, height);
    this.removeFilters();

    this.canvas.pushHistory(img);
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
      Object.assign(this.canvas.options)
    );
    img.onDraw();

    this.canvas
      .getContext2D()!
      .drawImage(this.image, this.start.x, this.start.y, width, height);
    this.removeFilters();

    this.canvas.pushHistory(img);
  }

  protected onClick(point: Coordinates): void {
    // not implemented
  }
}
