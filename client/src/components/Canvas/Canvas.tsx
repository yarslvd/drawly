import styles from "./Canvas.module.scss";
import React, { FC, useEffect, useRef, useState } from "react";
import { Tool } from "@/data/ToolsClass";
import { Coordinates, NameTool } from "@/types/types";
import { Keyboard, Tools } from "@/data/Constants";
import { getCanvasPoints } from "@/utils/getCanvasPoints";
import { CanvasClass } from "@/data/Canvas";

import Shapes from "@/data/Shapes";
import { useDispatch, useSelector } from "react-redux";
import { Text } from "@/data/Tools";
import { Text as TextShape } from "@/data/Shapes/Text";

import {
  setSelectedShape,
  setFillColor,
  setFillOpacity,
  setStrokeColor,
  setDisplayFill,
  setStrokeOpacity,
  setDisplayStroke,
  setBorderWidth,
} from "@/store/slices/dataSlice";
import { updateShapeProps } from "../../utils/updateShapeProps";

export interface CanvasProps {
  tool: string;
  widthCanvas: string;
  heightCanvas: string;
  fillColor: string;
  width: number;
}

export interface FigurePropsTypes {
  fillColor: string;
  strokeColor: string;
  borderWidth: number;
  strokeOpacity: number;
  fillOpacity: number;
  displayStroke: boolean;
  displayFill: boolean;
  imageURL: string;
  imageFilters: string;
}

let canvas: CanvasClass | null;

export const Canvas: FC<CanvasProps> = ({
  tool,
  widthCanvas,
  heightCanvas,
  width,
}) => {
  const dispatch = useDispatch();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [scale, setScale] = useState<number>(1);

  const fillColor = useSelector((state) => state.data.fillColor);
  const strokeColor = useSelector((state) => state.data.strokeColor);
  const borderWidth = useSelector((state) => state.data.borderWidth);
  const strokeOpacity = useSelector((state) => state.data.strokeOpacity);
  const fillOpacity = useSelector((state) => state.data.fillOpacity);
  const displayFill = useSelector((state) => state.data.displayFill);
  const displayStroke = useSelector((state) => state.data.displayStroke);
  const imageURL = useSelector((state) => state.data.imageURL);
  const imageFilters = useSelector((state) => state.data.imageFilters);

  //OBJECT WITH OPTIONS PROPS
  const figureProps: FigurePropsTypes = {
    fillColor,
    strokeColor,
    borderWidth,
    strokeOpacity,
    fillOpacity,
    displayStroke,
    displayFill,
    imageURL,
    imageFilters,
  };

  useEffect(() => {
    const canvasHTML = canvasRef.current;
    if (!canvasHTML) return;

    if (!canvas) {
      console.log("new canvas 1");
      canvas = new CanvasClass(canvasHTML);
      canvas.setCanvasProps(figureProps);
    }
  }, []);

  //HANDLING OPTIONS CHANGE
  useEffect(() => {
    const canvasHTML = canvasRef.current;
    if (!canvasHTML || !canvas) return;
    console.log(canvas);

    canvas.setCanvasProps(figureProps);

    if (canvas.selectedShape) {
      updateShapeProps(canvas, figureProps);
      canvas.redrawCanvas();
    }
  }, [figureProps, canvas]);

  let isResize: boolean = false;
  let isMove: boolean = false;

  let moveStart: Coordinates = { x: Infinity, y: Infinity };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const point = getCanvasPoints(
      { clientX: event.clientX, clientY: event.clientY },
      canvasRef,
      scale
    );
    if (!point) {
      return;
    }
    if (canvas?.selectedShape) {
      if (canvas.selectedShapeDiv.isPointOnCircle(point) != -1) {
        isResize = true;
      } else if (canvas.selectedShapeDiv.isPointInside(point)) {
        moveStart = point;
        isMove = true;
      } else if (canvas.selectedShapeDiv.isPointOnCircle(point) == -1) {
        canvas.selectedShape = null;
        canvas.redrawCanvas();
      }
    }
    if (selectedTool && point) {
      selectedTool.onMouseDown(point);
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const point = getCanvasPoints(
      { clientX: event.clientX, clientY: event.clientY },
      canvasRef,
      scale
    );
    if (canvas?.selectedShape && point) {
      if (isResize) {
        canvas.selectedShapeDiv.handleResize(point);
      } else if (isMove) {
        console.log("move");
        canvas.selectedShapeDiv.handleMove(moveStart, point);
        moveStart = point;
      }
      return;
    }
    if (selectedTool && point) {
      selectedTool.onMouseMove(point);
    }
  };

  const handleMouseUp = () => {
    if (canvas?.selectedShape) {
      canvas.selectedShapeDiv.onMouseUp();
      isResize = false;
      isMove = false;

      moveStart = { x: Infinity, y: Infinity };

      return;
    }
    if (selectedTool) {
      selectedTool.onMouseUp();
    }
  };

  const setOptions = (optionsObj) => {
    dispatch(setFillColor(optionsObj.fillColor));
    dispatch(setStrokeColor(optionsObj.strokeColor));
    dispatch(setStrokeOpacity(optionsObj.strokeOpacity));
    dispatch(setFillOpacity(optionsObj.fillOpacity));
    dispatch(setDisplayFill(optionsObj.displayFill));
    dispatch(setDisplayStroke(optionsObj.displayStroke));
    dispatch(setBorderWidth(optionsObj.borderWidth));
  };

  const handleOnClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (selectedTool && tool == Tools.CURVE_LINE) {
      const point = getCanvasPoints(
        { clientX: event.clientX, clientY: event.clientY },
        canvasRef,
        scale
      );
      point && selectedTool.onMouseClick(point);
      return;
    }

    if (canvas && tool == Tools.MOVE) {
      const point = getCanvasPoints(
        { clientX: event.clientX, clientY: event.clientY },
        canvasRef,
        scale
      );

      console.log("handle select");
      for (let i = canvas.history.length - 1; i >= 0; i--) {
        if (point && canvas.history[i].isPointInside(point)) {
          console.log("Selected shape", i);
          console.log();
          //dispatch(setSelectedShape(canvas.history[i].canvas.selectedShape));
          canvas.selectedShapeIndex = i;
          canvas.selectedShape = canvas.history[i];
          canvas.selectedShapeDiv.leftTop = canvas.selectedShape.leftTop;
          canvas.selectedShapeDiv.rightBottom =
            canvas.selectedShape.rightBottom;
          const optionsObj = {
            fillColor: canvas.selectedShape.fillColor,
            strokeColor: canvas.selectedShape.strokeColor,
            borderWidth: canvas.selectedShape.borderWidth,
            strokeOpacity: canvas.selectedShape.strokeOpacity,
            fillOpacity: canvas.selectedShape.fillOpacity,
            displayStroke: canvas.selectedShape.displayStroke,
            displayFill: canvas.selectedShape.displayFill,
            imageURL: canvas.selectedShape.imageURL,
            imageFilters: canvas.selectedShape.imageFilters,
          };
          setOptions(optionsObj);
          canvas.redrawCanvas();
          return;
        }
      }

      canvas.selectedShapeIndex = -1;
      canvas.selectedShape = null;
      dispatch(setSelectedShape(null));
      canvas.redrawCanvas();
    }
  };

  // useEffect(() => {
  //   const canvasHTML = canvasRef.current;
  //   if (!canvasHTML) return;
  //
  //   if (!canvas) {
  //     console.log("new canvas COLOR");
  //     canvas = new CanvasClass(canvasHTML);
  //     canvas.setFigureColor(fillColor);
  //   }
  //
  //   canvas.setFigureColor(fillColor);
  // }, [fillColor]);
  //
  // useEffect(() => {
  //   const canvasHTML = canvasRef.current;
  //   if (!canvasHTML) return;
  //
  //   if (!canvas) {
  //     console.log("new canvas COLOR");
  //     canvas = new CanvasClass(canvasHTML);
  //     canvas.setWidth(width);
  //   }
  //
  //   canvas.setWidth(width);
  // }, [width]);

  useEffect(() => {
    const canvasHTML = canvasRef.current;
    if (!canvasHTML) return;

    if (!canvas) {
      console.log("new canvas 2");
      canvas = new CanvasClass(canvasHTML);
    }
    // const context = canvas.getContext("2d");
    // if (!context) return;

    // context.lineWidth = 2;
    // context.strokeStyle = "#000";
    // canvas.history = canvas.history.filter((shape) => {
    //   console.log({shape});
    //   if(shape instanceof TextShape) {
    //     const text = shape as TextShape
    //     return text.text.trim().length > 0;
    //   }

    //   return true;
    // });

    if (canvas.history[canvas.history.length - 1] instanceof TextShape) {
      const text = canvas.history[canvas.history.length - 1] as TextShape;
      if (text.text.trim().length == 0) {
        canvas.undoShape();
      } else {
        text.isFocused = false;
      }
    }

    // canvas.redrawCanvas();

    let currentTool = NameTool.get(tool);
    if (!currentTool) return;
    const selectedTool_ = currentTool(canvas);
    setSelectedTool(selectedTool_);
    console.log(currentTool);
    canvas.selectedTool = selectedTool_;
  }, [tool]);

  const handleWheel = (event: WheelEvent) => {
    event.preventDefault();

    if (!event.ctrlKey) return;

    const canvas = canvasRef.current;

    event.deltaY > 0 ? handleZoomOut() : handleZoomIn();
    // console.log(
    //   canvasRef?.current && Math.round(canvasRef.current.clientWidth * scale)
    // );

    // canvas.width = Math.round(canvas.clientWidth * scale);
    // canvas.height = Math.round(canvas.clientHeight * scale);
  };

  const handleZoomIn = () => {
    const newScale = scale + 0.1;
    newScale < 4 && setScale((prev) => prev + 0.1);
  };

  const handleZoomOut = () => {
    const newScale = scale - 0.1;
    newScale > 0.2 && setScale((prev) => prev - 0.1);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    event.preventDefault();
    console.log("key down", selectedTool);
    switch (event.ctrlKey) {
      case event.key === Keyboard.Z || event.code === Keyboard.KEY_Z:
        event.shiftKey
          ? canvas?.redoShape() // redoLastLine();
          : canvas?.undoShape(); // undoLastLine();
        break;
      case event.key === Keyboard.Y || event.code === Keyboard.KEY_Y:
        console.log("ctrl + y");
        canvas?.redoShape();
        break;
      case event.code === Keyboard.EQUAL: // +
        handleZoomIn();
        break;
      case event.code === Keyboard.MINUS: // -
        handleZoomOut();
        break;
      default:
        return;
    }
  };

  const handleTextKeyDown = (event: KeyboardEvent) => {
    event.preventDefault();
    // console.log("here 1", canvas?.selectedTool)
    const tool = canvas?.selectedTool;
    if (tool instanceof Text) {
      console.log("here 2");
      let textTool = tool as Text;
      textTool.handleKeyDown(event);
    }
  };

  const getShapeConstructorArgs = (className: string, instance: any): any[] => {
    switch (className) {
      case "BrushLine": {
        return [canvas, instance.points, canvas?.width, canvas?.fillColor];
      }
      case "CurveLine": {
        return [canvas, instance.points, canvas?.width, canvas?.fillColor];
      }
      case "Line": {
        return [
          canvas,
          instance.start,
          instance.end,
          canvas?.width,
          canvas?.fillColor,
        ];
      }
      case "Rectangle": {
        return [
          canvas,
          instance.start,
          instance.width,
          instance.height,
          canvas?.width,
          canvas?.fillColor,
        ];
      }
      case "Ellipse": {
        return [
          canvas,
          instance.start,
          instance.width,
          instance.height,
          canvas?.width,
          canvas?.fillColor,
        ];
      }
    }
    return [];
  };

  useEffect(() => {
    window.addEventListener("keydown", (e) =>
      e.ctrlKey
        ? handleKeyDown(e)
        : canvas?.selectedTool instanceof Text
        ? handleTextKeyDown(e)
        : null
    );
    window.addEventListener("wheel", handleWheel, { passive: false });

    document.addEventListener("figure-settings", () => {
      console.log("figure-settings");
      if (canvas?.selectedShape) {
        console.log(
          "selected shape",
          canvas.history[canvas.selectedShapeIndex].constructor.name
        );
        const index = canvas.selectedShapeIndex;
        const className =
          canvas.history[canvas.selectedShapeIndex].constructor.name;
        console.log(Shapes);
        const ShapeClass = Shapes[className];
        console.log("Shape class", ShapeClass);
        const args = getShapeConstructorArgs(className, canvas.history[index]);
        canvas.history[index] = new ShapeClass(...args);
        canvas.redrawCanvas();
      }
    });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keydown", handleTextKeyDown);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [scale]);

  return (
    <canvas
      width={widthCanvas}
      height={heightCanvas}
      className={styles.canvas}
      style={{ transform: `scale(${scale})` }}
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handleOnClick}
    />
  );
};
