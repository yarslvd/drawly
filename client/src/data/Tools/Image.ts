import { Tool } from "@/data/ToolsClass";
import { Rectangle as RectangleShape } from "../Shapes/Rectangle";
import { Coordinates } from "@/types/types";

export class Img extends Tool {
  protected start: Coordinates | null = null;
  protected filters: string = "none";
  protected image: string =
    "https://www.simplilearn.com/ice9/free_resources_article_thumb/what_is_image_Processing.jpg";
  // const image = new Image();
  //   image.src = 'https://www.simplilearn.com/ice9/free_resources_article_thumb/what_is_image_Processing.jpg';
  //   image.onload = () => {
  //     ctx!.filter = 'brightness(200%)' //<-- set this
  //     ctx?.drawImage(image, 0, 0); // Draw the image at coordinates (0, 0)
  //     ctx!.filter = 'brightness(100%)' //<-- set this
  //   };
  protected onDown(point: Coordinates): void {
    this.start = point;
    const rectangle = new RectangleShape(
      this.canvas,
      this.start,
      0,
      0,
      this.canvas.width,
      this.canvas.color
    );
    console.log("HERE IMAGE");
    this.canvas.pushHistory(rectangle);
  }

  protected onMove(start: Coordinates, end: Coordinates): void {
    if (!this.canvas) return;
    if (!this.start) return;

    const context = this.canvas.getContext2D();
    if (!context) return;

    const width = end.x - this.start.x;
    const height = end.y - this.start.y;

    this.canvas.undoShape();

    const rectangle = new RectangleShape(
      this.canvas,
      this.start,
      width,
      height,
      this.canvas.width,
      this.canvas.color
    );
    rectangle.onDraw();

    this.canvas.pushHistory(rectangle);
  }

  protected onUp(point: Coordinates): void {
    if (!this.canvas) return;
    if (!this.start) return;

    const context = this.canvas.getContext2D();
    if (!context) return;

    const width = point.x - this.start.x;
    const height = point.y - this.start.y;

    this.canvas.undoShape();

    const rectangle = new RectangleShape(
      this.canvas,
      this.start,
      width,
      height,
      this.canvas.width,
      this.canvas.color
    );
    rectangle.onDraw();

    const image = new Image();
    image.src =
      "https://www.simplilearn.com/ice9/free_resources_article_thumb/what_is_image_Processing.jpg";
    //   image.onload = () => {
    //     ctx!.filter = 'brightness(200%)' //<-- set this
    let ctx = this.canvas.getContext2D();
    ctx?.drawImage(image, this.start.x, this.start.y, width, height); // Draw the image at coordinates (0, 0)
    //     ctx!.filter = 'brightness(100%)' //<-- set this
    //   };

    // this.canvas.pushHistory(rectangle);
    this.canvas.undoShape();
  }

  protected onClick(point: Coordinates): void {
    // not implemented
  }
}
