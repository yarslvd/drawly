import { Tool } from "@/data/ToolsClass";
import { Text as TextShape } from "../Shapes/Text";
import { Coordinates } from "@/types/types";

export class Text extends Tool {
  protected start: Coordinates | null = null;
  public text: string = "";
  protected textShape: TextShape | null = null;

  protected onDown(point: Coordinates): void {
    this.start = point;
    this.text = "";
    if(this.textShape) {
      this.textShape.isFocused = false;
      this.canvas.redrawCanvas();
    }
    const text = new TextShape(
      this.canvas,
      point,
      this.text,
      15,
      45,
      "black"
    );
    this.textShape = text;
    text.isFocused = true;
    text.onDraw();
    this.canvas.pushHistory(text);
  }

  protected onMove(start: Coordinates, end: Coordinates): void {
    // Not needed for text tool
  }

  protected onUp(point: Coordinates): void {
    // Not needed for text tool
    console.log({start: this.start})
  }

  protected onClick(point: Coordinates): void {
    // Not needed for text tool
  }

  protected onTextInput(event: any): void {
    console.log(this.start)
    if(!this.start) {
      return;
    }
    const regex = /[ -~]/;
    if(event.key == "Enter") {
      this.text += '\n';
    }
    else if(!regex.test(event.key) ||  event.key.length != 1) {
      return;
    }
    else {
      this.text += event.key;
    }
    console.log("start", this.start)
    this.canvas.undoShape();
    
    const text = new TextShape(
      this.canvas,
      this.start,
      this.text,
      15,
      45,
      "black"
    );
    this.textShape = text;
    text.isFocused = true;
    text.onDraw();

    this.canvas.pushHistory(text);
  }

  handleKeyDown(event: KeyboardEvent): void {
    if(!this.start) {
      return;
    }
    // Handle keyboard input here
    // For example, you can remove the last character from the text when the Backspace key is pressed
    if (event.key === "Backspace") {
      this.canvas.undoShape();
      this.text = this.text.slice(0, -1);
      const text = new TextShape(
        this.canvas,
        this.start,
        this.text,
        15,
        45,
        "black"
      );
      this.textShape = text;
      text.isFocused = true;
      text.onDraw();
      this.canvas.pushHistory(text);
      return;
    }
    this.onTextInput(event);
  }


  constructor(
    canvas
  ) {
    super(canvas);
  }
}