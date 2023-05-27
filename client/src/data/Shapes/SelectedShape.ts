import { Point } from "framer-motion";
import { CanvasClass } from "../Canvas";
import { Shape } from "./Shape";
import { Line } from "./Line";
import { Rectangle } from "./Rectangle";
import { Ellipse } from "./Ellipse";
import { CurveLine } from "./CurveLine";
import { getCanvasPoints } from "@/utils/getCanvasPoints";
import { useDispatch } from "react-redux";
import { setSelectedShape } from "@/store/slices/dataSlice";
import { Img } from "./Image";
import { BrushLine } from "./BrushLine";
import { Text } from "./Text";

interface Circle {
  center: Point;
  radius: number;
}

export class SelectedShape extends Shape {
  private width: number = 0;
  private height: number = 0;
  private outlineColor: string = "#00B2FF";

  private circles: Circle[] = [];
  private selectedCircle: Circle | null = null;

  borderWidth: number;
  // drawCircle(
  //   ctx: CanvasRenderingContext2D,
  //   center: Point,
  //   radius: number,
  //   color: string
  // ): void {
  //   ctx.beginPath();
  //   ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
  //   ctx.fillStyle = color;
  //   ctx.fill();
  //
  //   this.circles.push({ center, radius });
  // }
  drawRect(
    ctx: CanvasRenderingContext2D,
    center: Point,
    fillColor: string,
    borderColor: string
  ): void {
    ctx.fillStyle = fillColor;
    ctx.strokeStyle = borderColor;
    const width = 10;
    const height = 10;
    ctx.fillRect(center.x - width / 2, center.y - height / 2, width, height);
    ctx.strokeRect(center.x - width / 2, center.y - height / 2, width, height);

    this.circles.push({ center, radius: 8 });
  }

  onDraw(): void {
    // if(this.canvas.selectedShape) {
    //   this.canvas.selectedShape.fillColor = this.canvas.options.fillColor;
    // }
    this.circles = [];
    const ctx = this.canvas.getContext2D();
    if (ctx == null || this.canvas.selectedShape == null) {
      return;
    }

    this.width = this.rightBottom.x - this.leftTop.x;
    this.height = this.rightBottom.y - this.leftTop.y;

    ctx.lineWidth = this.borderWidth;

    if (this.canvas.selectedShape instanceof Line) {
      const line = this.canvas.selectedShape as Line;
      this.drawRect(ctx, line.start, "#fff", this.outlineColor);
      this.drawRect(ctx, line.end, "#fff", this.outlineColor);
      return;
    }
    //
    ctx.strokeRect(this.leftTop.x, this.leftTop.y, this.width, this.height);
    ctx.strokeStyle = this.outlineColor;
    this.drawRect(
      ctx,
      { x: this.leftTop.x, y: this.leftTop.y },
      "#fff",
      this.outlineColor
    );
    this.drawRect(
      ctx,
      { x: this.rightBottom.x, y: this.leftTop.y },
      "#fff",
      this.outlineColor
    );
    this.drawRect(
      ctx,
      { x: this.rightBottom.x, y: this.rightBottom.y },
      "#fff",
      this.outlineColor
    );
    this.drawRect(
      ctx,
      { x: this.leftTop.x, y: this.rightBottom.y },
      "#fff",
      this.outlineColor
    );
    // this.drawCircle(
    //   ctx,
    //   { x: this.leftTop.x, y: this.leftTop.y },
    //   4,
    //   this.color
    // );
    // this.drawCircle(
    //   ctx,
    //   { x: this.rightBottom.x, y: this.leftTop.y },
    //   4,
    //   this.color
    // );
    // this.drawCircle(
    //   ctx,
    //   { x: this.rightBottom.x, y: this.rightBottom.y },
    //   4,
    //   this.color
    // );
    // this.drawCircle(
    //   ctx,
    //   { x: this.leftTop.x, y: this.rightBottom.y },
    //   4,
    //   this.color
    // );
  }

  // handleCursorChangeOn(e): void {
  //   const rect = this.canvas.canvasHTML?.getBoundingClientRect();
  //   const mouseX = e.clientX - rect.left;
  //   const mouseY = e.clientY - rect.top;
  //   console.log(mouseX, mouseY);
  //   console.log(this.canvas.selectedShape)
  //   // const point = getCanvasPoints(
  //   //     { clientX: event.clientX, clientY: event.clientY },
  //   //     this.canvas.canvasHTML,
  //   //     scale
  //   // );
  //   // if (this.isPointOnCircle()) {
  //   //   this.canvas.canvasHTML.style.cursor = 'pointer'; // Set cursor style to pointer
  //   // } else {
  //   //   this.canvas.canvasHTML.style.cursor = 'default'; // Set cursor style to default
  //   // }
  // }

  isPointInside(point: Point): boolean {
    if (this.canvas.selectedShape instanceof Line) {
      const line = this.canvas.selectedShape as Line;
      return line.isPointInside(point);
    }

    const { x, y } = point;

    if (
      x >= this.leftTop.x &&
      x <= this.rightBottom.x &&
      y >= this.leftTop.y &&
      y <= this.rightBottom.y
    ) {
      return true;
    }

    return false;
  }

  isPointOnCircle(point: Point): number {
    console.log("isPointOnCircle");
    this.selectedCircle = null;
    console.log(this.circles.length);
    for (let i = 0; i < this.circles.length; i++) {
      const distance = Math.sqrt(
        Math.pow(point.x - this.circles[i].center.x, 2) +
          Math.pow(point.y - this.circles[i].center.y, 2)
      );
      if (distance < this.circles[i].radius) {
        this.selectedCircle = this.circles[i];
        return i;
      }
    }

    return -1;
  }
  //
  // isPointOnRect(point: Point): number {
  //   console.log("isPointOnCircle");
  //   this.selectedCircle = null;
  //   for (let i = 0; i < this.circles.length; i++) {
  //     console.log(this.circles.length);
  //         // const distance = Math.sqrt(
  //         //   Math.pow(point.x - this.circles[i].center.x, 2) +
  //         //     Math.pow(point.y - this.circles[i].center.y, 2)
  //         // );
  //         //
  //         // if (distance < this.circles[i].radius) {
  //         //   this.selectedCircle = this.circles[i];
  //         //   return i;
  //         // }
  //   }
  //
  //       return -1;
  // }

  movedPoint: Point | null = null;

  handleResize(point: Point) {
    if (!this.selectedCircle) {
      return;
    }
    // if(this.canvas) {
    //   this.canvas.canvasHTML.addEventListener('mousemove', this.handleCursorChangeOn.bind(this.canvas.selectedShape));
    // }
    const shape = this.canvas.selectedShape;
    const center = this.selectedCircle?.center;
    switch (true) {
      case shape instanceof Line: {
        const line = shape as Line;
        if (line.start.x == center.x && line.start.y == center.y) {
          this.movedPoint = line.start;
        } else {
          this.movedPoint = line.end;
        }

        this.movedPoint.x = point.x;
        this.movedPoint.y = point.y;

        this.canvas.redrawCanvas();

        break;
      }
      case shape instanceof Img:
      case shape instanceof Rectangle: {
        const rect =
          shape instanceof Rectangle ? (shape as Rectangle) : (shape as Img);
        // Determine which corner of the rectangle is being resized
        const topLeft = rect.leftTop;
        const topRight = { x: rect.rightBottom.x, y: rect.leftTop.y };
        const bottomRight = rect.rightBottom;
        const bottomLeft = { x: rect.leftTop.x, y: rect.rightBottom.y };

        if (center.x === topLeft.x && center.y === topLeft.y) {
          // rect.width += (topLeft.x - point.x);
          rect.leftTop.x = point.x;
          rect.leftTop.y = point.y;
          rect.start.x = point.x;
          rect.start.y = point.y;
        } else if (center.x === topRight.x && center.y === topRight.y) {
          rect.start.y = point.y;
          rect.leftTop.y = point.y;
          rect.rightBottom.x = point.x;
        } else if (center.x === bottomRight.x && center.y === bottomRight.y) {
          rect.rightBottom.x = point.x;
          rect.rightBottom.y = point.y;
        } else if (center.x === bottomLeft.x && center.y === bottomLeft.y) {
          rect.rightBottom.y = point.y;
          rect.leftTop.x = point.x;
        }

        center.x = point.x;
        center.y = point.y;

        rect.normalizeSize();
        if (rect.width < 0) {
          const swap = rect.leftTop.x;
          rect.leftTop.x = rect.rightBottom.x;
          rect.rightBottom.x = swap;
        }
        if (rect.height < 0) {
          const swap = rect.leftTop.y;
          rect.leftTop.y = rect.rightBottom.y;
          rect.rightBottom.y = swap;
        }
        this.canvas.redrawCanvas();

        break;
      }
      case shape instanceof Ellipse: {
        const ellipse = shape as Ellipse;

        const topLeft = ellipse.leftTop;
        const topRight = { x: ellipse.rightBottom.x, y: ellipse.leftTop.y };
        const bottomRight = ellipse.rightBottom;
        const bottomLeft = { x: ellipse.leftTop.x, y: ellipse.rightBottom.y };

        if (center.x === topLeft.x && center.y === topLeft.y) {
          ellipse.start.x += (-ellipse.leftTop.x + point.x) / 2;
          ellipse.start.y += (-ellipse.leftTop.y + point.y) / 2;

          ellipse.leftTop.x = point.x;
          ellipse.leftTop.y = point.y;
        } else if (center.x === topRight.x && center.y === topRight.y) {
          ellipse.start.x += (-ellipse.rightBottom.x + point.x) / 2;
          ellipse.start.y += (-ellipse.leftTop.y + point.y) / 2;

          ellipse.leftTop.y = point.y;
          ellipse.rightBottom.x = point.x;
        } else if (center.x === bottomRight.x && center.y === bottomRight.y) {
          ellipse.start.x += (-ellipse.rightBottom.x + point.x) / 2;
          ellipse.start.y += (-ellipse.rightBottom.y + point.y) / 2;

          ellipse.rightBottom.x = point.x;
          ellipse.rightBottom.y = point.y;
        } else if (center.x === bottomLeft.x && center.y === bottomLeft.y) {
          ellipse.start.x += (-ellipse.leftTop.x + point.x) / 2;
          ellipse.start.y += (-ellipse.rightBottom.y + point.y) / 2;

          ellipse.rightBottom.y = point.y;
          ellipse.leftTop.x = point.x;
        }

        center.x = point.x;
        center.y = point.y;

        ellipse.normalizeSize();
        this.canvas.redrawCanvas();
        break;
      }
      case shape instanceof CurveLine: {
        // const curve = shape as CurveLine;

        // const topLeft = curve.leftTop;
        // const topRight = { x: curve.rightBottom.x, y: curve.leftTop.y };
        // const bottomRight = curve.rightBottom;
        // const bottomLeft = { x: curve.leftTop.x, y: curve.rightBottom.y };

        // if (center.x === topLeft.x && center.y === topLeft.y) {
        //   curve.start.x += (-curve.leftTop.x + point.x)/2;
        //   curve.start.y += (-curve.leftTop.y + point.y)/2;

        //   curve.leftTop.x = point.x;
        //   curve.leftTop.y = point.y;
        // } else if (center.x === topRight.x && center.y === topRight.y) {
        //   curve.start.x += (-curve.rightBottom.x + point.x)/2;
        //   curve.start.y += (-curve.leftTop.y + point.y)/2;

        //   curve.leftTop.y = point.y;
        //   curve.rightBottom.x = point.x;
        // } else if (center.x === bottomRight.x && center.y === bottomRight.y) {
        //   curve.start.x += (-curve.rightBottom.x + point.x)/2;
        //   curve.start.y += (-curve.rightBottom.y + point.y)/2;

        //   curve.rightBottom.x = point.x;
        //   curve.rightBottom.y = point.y;
        // } else if (center.x === bottomLeft.x && center.y === bottomLeft.y) {
        //   curve.start.x += (-curve.leftTop.x + point.x)/2;
        //   curve.start.y += (-curve.rightBottom.y + point.y)/2;

        //   curve.rightBottom.y = point.y;
        //   curve.leftTop.x = point.x;
        // }

        // center.x = point.x;
        // center.y = point.y;

        // curve.normalizeSize();
        // this.canvas.redrawCanvas();
        break;
      }
    }
  }

  handleMove(start: Point, point: Point) {
    console.log("handleMove");

    const dx = point.x - start.x;
    const dy = point.y - start.y;

    const shape = this.canvas.selectedShape;
    console.log({ dx, dy });

    switch (true) {
      case shape instanceof Line: {
        const line = shape as Line;

        line.start.x += dx;
        line.start.y += dy;

        line.end.x += dx;
        line.end.y += dy;

        console.log("move line");

        this.canvas.redrawCanvas();

        break;
      }
      case shape instanceof Img:
      case shape instanceof Rectangle: {
        const rect =
          shape instanceof Rectangle ? (shape as Rectangle) : (shape as Img);

        rect.start.x += dx;
        rect.start.y += dy;

        rect.leftTop.x += dx;
        rect.leftTop.y += dy;

        rect.rightBottom.x += dx;
        rect.rightBottom.y += dy;

        rect.normalizeCorners();

        this.canvas.redrawCanvas();

        this.leftTop = rect.leftTop;
        this.rightBottom = rect.rightBottom;

        break;
      }
      case shape instanceof Ellipse: {
        const ellipse = shape as Ellipse;

        ellipse.start.x += dx;
        ellipse.start.y += dy;

        ellipse.leftTop.x += dx;
        ellipse.leftTop.y += dy;

        ellipse.rightBottom.x += dx;
        ellipse.rightBottom.y += dy;

        this.leftTop = ellipse.leftTop;
        this.rightBottom = ellipse.rightBottom;

        this.canvas.redrawCanvas();

        break;
      }
      case shape instanceof CurveLine: {
        const curve = shape as CurveLine;

        const points = curve.points;

        for (let i = 0; i < points.length; i++) {
          points[i].x += dx;
          points[i].y += dy;
        }

        curve.calcBoundingBox();

        this.leftTop = curve.leftTop;
        this.rightBottom = curve.rightBottom;

        this.canvas.redrawCanvas();

        break;
      }
      case shape instanceof BrushLine: {
        const brush = shape as BrushLine;

        const points = brush.points;

        for (let i = 0; i < points.length; i++) {
          points[i].x += dx;
          points[i].y += dy;
        }

        brush.calcBoundingBox();

        this.leftTop = brush.leftTop;
        this.rightBottom = brush.rightBottom;

        this.canvas.redrawCanvas();

        break;
      }
      case shape instanceof Text: {
        const text = shape as Text;

        text.start.x += dx;
        text.start.y += dy;

        text.calcBoundingBox();

        this.leftTop = text.leftTop;
        this.rightBottom = text.rightBottom;

        this.canvas.redrawCanvas();

        break;
      }
    }
  }

  onMouseUp() {
    this.selectedCircle = null;
  }

  constructor(canvas: CanvasClass, borderWidth: number) {
    super(canvas);

    this.borderWidth = 2;
  }
}
