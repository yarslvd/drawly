import { Point } from "framer-motion";
import { CanvasClass } from "../Canvas";
import { Shape } from "./Shape";

export class Text extends Shape {
  start: Point;

  width: number = 20;
  height: number = 20;

  text: string;
  fontWeight: number;
  color: string;

  isFocused: boolean = false;
  // Input field properties
  inputField = {
    x: 100,
    y: 100,
    width: 200,
    height: 30,
    border: {
      color: "black",
      width: 2,
    },
    isFocused: false,
  };

  // Event listeners
  handleMouseDown = (event) => {
    const { offsetX, offsetY } = event;
    if (
      offsetX >= this.start.x &&
      offsetX <= this.start.x + this.inputField.width &&
      offsetY >= this.start.y &&
      offsetY <= this.start.y + this.inputField.height
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

    // Clear canvas
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw input field border
    ctx.lineWidth = 5;
    ctx.strokeStyle = "black";
    ctx.strokeRect(
      this.start.x,
      this.start.y,
      this.inputField.width,
      this.inputField.height
    );

    // Draw input text
    ctx.font = `${this.fontWeight} 16px Arial`;
    ctx.fillStyle = this.color;
    ctx.fillText(
      this.text,
      this.start.x + 5,
      this.start.y + this.inputField.height / 2 + 5
    );

    // Draw cursor if focused
    if (this.isFocused) {
      const cursorX = this.start.x + ctx.measureText(this.text).width + 5;
      const cursorY = this.start.y + 5;
      ctx.beginPath();
      ctx.moveTo(cursorX, cursorY);
      ctx.lineTo(cursorX, cursorY + this.inputField.height - 10);
      ctx.stroke();
    }
  }

  isPointInside(point: Point): boolean {
    return false;
  }

  constructor(
    canvas: CanvasClass,
    start: Point,
    text: string,
    fontWeight: number,
    color: string
  ) {
    super(canvas);

    this.start = start;

    this.text = text;
    this.fontWeight = fontWeight;
    this.color = color;

    // Add event listeners
    // canvas.addEventListener("mousedown", this.handleMouseDown);
    // canvas.addEventListener("keydown", this.handleKeyDown);
    // canvas.addEventListener("textInput", this.handleTextInput);
  }
}
