import { Coordinates } from "@/types/types";
import { CanvasClass } from "./Canvas";

export abstract class Tool {
  protected canvas: CanvasClass;
  protected isActing: boolean = false;
  protected lastPoint: Coordinates | null = null;

  constructor(canvas: CanvasClass) {
    this.canvas = canvas;
  }

  public onMouseDown(point: Coordinates): void {
    console.log(point);
    this.isActing = true;
    this.lastPoint = point;
    this.onDown(point);
  }

  public onMouseMove(newPoint: Coordinates): void {
    if (!this.isActing) return;
    if (!this.lastPoint) return;

    this.onMove(this.lastPoint, newPoint);
    this.lastPoint = newPoint;
  }

  public onMouseUp(): void {
    this.isActing = false;
    this.onUp(this.lastPoint!);
    this.lastPoint = null;
  }

  public onMouseClick(point: Coordinates): void {
    this.onClick(point);
  }

  protected abstract onMove(start: Coordinates, end: Coordinates): void;
  protected abstract onUp(point: Coordinates): void;
  protected abstract onDown(point: Coordinates): void;
  protected abstract onClick(point: Coordinates): void;
}
