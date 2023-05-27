import { Point } from "framer-motion";
import { CanvasClass } from "../Canvas";
import { Shape } from "./Shape";

export class Text extends Shape {
  start: Point;
  borderWidth: number = 2;
  borderColor: string = "black";

  width: number = 20;
  height: number = 20;

  text: string;
  fontWeight: number;
  fontSize: number;
  color: string;

  isFocused: boolean = false;

  // Event listeners
  handleMouseDown = (event) => {
    const { offsetX, offsetY } = event;
    if (
      offsetX >= this.start.x &&
      offsetX <= this.start.x + this.width &&
      offsetY >= this.start.y &&
      offsetY <= this.start.y + this.height
    ) {
      this.isFocused = true;
      this.onDraw();
    } else {
      this.isFocused = false;
      this.onDraw();
    }
  };

  handleKeyDown = (event) => {
    if (this.isFocused) {
      if (event.key === "Backspace") {
        this.text = this.text.slice(0, -1);
        this.onDraw();
      } else if (event.key === "Enter") {
        this.isFocused = false;
        this.onDraw();
      }
    }
  };

  handleTextInput = (event) => {
    if (this.isFocused) {
      this.text += event.data;
      this.onDraw();
    }
  };

  onDraw(): void {
    const ctx = this.canvas.getContext2D();
    if (ctx == null) {
      return;
    }

    // Calculate input field width based on text size
    // const textWidth = ctx.measureText(this.text).width;
    // this.width = textWidth + 10;

    // this.height = this.fontSize + 10;

    // // Draw input field border
    // ctx.lineWidth = this.borderWidth;
    // ctx.strokeStyle = this.borderColor;
    // ctx.strokeRect(
    //   this.start.x,
    //   this.start.y,
    //   this.width,
    //   this.height
    // );

    // // Draw input text
    // ctx.font = `${this.fontWeight} ${this.fontSize}px Arial`;
    // ctx.fillStyle = this.color;
    // ctx.fillText(
    //   this.text,
    //   this.start.x + 5,
    //   this.start.y + this.height / 2 + 5
    // );

    // // Draw cursor if focused
    // if (this.isFocused) {
    //   const cursorX =
    //     this.start.x + textWidth + 5;
    //   const cursorY = this.start.y + 5;
    //   ctx.beginPath();
    //   ctx.moveTo(cursorX, cursorY);
    //   ctx.lineTo(cursorX, cursorY + this.height - 10);
    //   ctx.stroke();
    // }

    const lines = this.text.split("\n");
    const lineHeight = this.fontSize;
    const startY = this.start.y;

    ctx.font = `${this.fontSize}px sans-serif`;
    ctx.fillStyle = this.color;

    let maxLineWidth = 0;

    lines.forEach((line, index) => {
      const lineY = startY + index * lineHeight;
      ctx.fillText(line, this.start.x, lineY);
      const lineWidth = ctx.measureText(line).width;
      if (lineWidth > maxLineWidth) {
        maxLineWidth = lineWidth;
      }
    });

    if (this.isFocused) {
      const borderHeight = lines.length * lineHeight;
      ctx.strokeStyle = this.color;
      ctx.lineWidth = this.borderWidth;
      ctx.strokeRect(
        this.start.x,
        startY - lineHeight,
        maxLineWidth,
        borderHeight
      );
    }
  }

  isPointInside(point: Point): boolean {
    this.calcBoundingBox();
    const { x, y } = point;

    return (
      x >= this.leftTop.x &&
      x <= this.rightBottom.x &&
      y >= this.leftTop.y &&
      y <= this.rightBottom.y
    );
  }

  calcBoundingBox() {
    const ctx = this.canvas.getContext2D();
    if (ctx == null) {
      return;
    }

    const lines = this.text.split("\n");
    const lineHeight = this.fontSize;

    let maxLineWidth: number = -Infinity;
    const borderHeight = lines.length * lineHeight;

    lines.forEach((line, index) => {
      const lineWidth = ctx.measureText(line).width;
      if (lineWidth > maxLineWidth) {
        maxLineWidth = lineWidth;
      }
    });

    this.leftTop = { x: this.start.x, y: this.start.y - lineHeight };
    this.rightBottom = {
      x: this.start.x + maxLineWidth,
      y: this.start.y + borderHeight - lineHeight / 2,
    };

    if (this.leftTop.x > this.rightBottom.x) {
      const swap = this.leftTop.x;
      this.leftTop.x = this.rightBottom.x;
      this.rightBottom.x = swap;
    }

    if (this.leftTop.y > this.rightBottom.y) {
      const swap = this.leftTop.y;
      this.leftTop.y = this.rightBottom.y;
      this.rightBottom.y = swap;
    }
  }

  constructor(
    canvas: CanvasClass,
    start: Point,
    text: string,
    fontWeight: number,
    fontSize: number,
    color: string
  ) {
    super(canvas);

    this.start = { x: start.x, y: start.y + fontSize / 2 };

    this.text = text;
    this.fontWeight = fontWeight;
    this.color = color;
    this.fontSize = fontSize;

    // Add event listeners
  }
}
