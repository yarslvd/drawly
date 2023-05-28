import { SelectedShape } from "./Shapes/SelectedShape";
import { Shape } from "./Shapes/Shape";
import { FigurePropsTypes } from "@/components/Canvas/Canvas";
import { Tool } from "./ToolsClass";
import { BrushLine } from "./Shapes/BrushLine";
import { CurveLine } from "./Shapes/CurveLine";
import { Ellipse } from "./Shapes/Ellipse";
import { Img } from "./Shapes/Image";
import { Line } from "./Shapes/Line";
import { Rectangle } from "./Shapes/Rectangle";
import { Text } from "./Shapes/Text";

export class CanvasClass {
  protected context: CanvasRenderingContext2D | null = null;
  public canvasHTML: HTMLCanvasElement | null = null;

  layers: Shape[][] = [];

  history: Shape[];
  removedHistory: Shape[];
  selectedShapeIndex: number = -1;
  selectedShape: Shape | null;
  selectedShapeDiv: SelectedShape;

  selectedTool: Tool | null = null;

  //options
  options: FigurePropsTypes;

  getContext2D(): CanvasRenderingContext2D | null {
    return this.context;
  }

  redrawCanvas(): void {
    const ctx = this.context;
    if (this.canvasHTML == null || ctx == null) {
      return;
    }

    ctx.clearRect(0, 0, this.canvasHTML?.width, this.canvasHTML?.height);

    this.layers.map((history) => {
      history.forEach((shape: Shape) => {
        shape.onDraw();
      });
    });

    this.selectedShapeIndex != -1 && this.selectedShapeDiv?.onDraw();
  }

  pushHistory(shape: Shape): void {
    this.history.push(shape);
  }

  undoShape(): void {
    if (this.canvasHTML == null) {
      return;
    }

    const ctx = this.canvasHTML.getContext("2d");
    if (this.history.length > 0 && this.canvasHTML && ctx) {
      // console.log("undo", this.history)
      this.removedHistory.unshift(this.history[this.history.length - 1]);
      this.history.pop();

      this.redrawCanvas();
    }
  }

  redoShape(): void {
    if (this.canvasHTML == null) {
      return;
    }

    const ctx = this.canvasHTML.getContext("2d");
    if (this.removedHistory.length > 0 && this.canvasHTML && ctx) {
      // console.log("redo", this.removedHistory)
      const shape = this.removedHistory[0];
      this.history.push(shape);
      this.removedHistory.shift();

      shape.onDraw();
    }
  }

  setCanvasProps(obj): void {
    this.options = obj;
  }

  setLayersData(layers): void {
    for (let i = 0; i < layers.length; i++) {
      for (let j = 0; j < layers[i].length; j++) {
        console.log(layers[i][j]);
        let shapeData = JSON.parse(layers[i][j]);
        let shape: Shape;
        switch (shapeData.type) {
          case "BrushLine": {
            const { type, points, ...rest } = shapeData;
            shape = new BrushLine(this, points, rest);
            break;
          }
          case "CurveLine": {
            const { type, points, ...rest } = shapeData;
            shape = new CurveLine(this, points, rest);
            break;
          }
          case "Ellipse": {
            const { type, start, width, height, ...rest } = shapeData;
            shape = new Ellipse(this, start, width, height, rest);
            break;
          }
          case "Img": {
            const { type, start, width, height, ...rest } = shapeData;
            shape = new Img(this, start, width, height, rest);
            break;
          }
          case "Line": {
            const { type, start, end, ...rest } = shapeData;
            shape = new Line(this, start, end, rest);
            break;
          }
          case "Rectangle": {
            const { type, start, width, height, ...rest } = shapeData;
            shape = new Rectangle(this, start, width, height, rest);
            break;
          }
          case "Text": {
            const { type, start, text, fontWeight, fontSize, color } =
              shapeData;
            shape = new Text(this, start, text, fontWeight, fontSize, color);
            break;
          }
        }

        this.layers[i].push(shape);
      }
      this.layers.push([]);
    }

    this.redrawCanvas();
  }

  constructor(canvasHTML: HTMLCanvasElement) {
    this.canvasHTML = canvasHTML;
    this.context = canvasHTML.getContext("2d");

    // basic setup
    if (this.context) {
      this.context.imageSmoothingEnabled = true;
      this.context.imageSmoothingQuality = "medium";
    }

    this.layers.push([]);
    this.history = this.layers[0];
    this.removedHistory = [];
    this.selectedShape = null;

    this.selectedShapeDiv = new SelectedShape(this, 3);
  }
}
