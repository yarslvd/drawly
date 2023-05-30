import styles from "./Canvas.module.scss";
import React, { FC, useEffect, useRef, useState } from "react";
import { Tool } from "@/data/ToolsClass";
import { Coordinates, NameTool } from "@/types/types";
import { Keyboard, MimeTypes, Tools } from "@/data/Constants";
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
  setCanvas,
  setBorderRadius,
  setText,
} from "@/store/slices/dataSlice";
import { updateShapeProps } from "../../utils/updateShapeProps";
import { Button } from "@mui/material";
import {
  useAddCanvasMutation,
  useGetCanvasMutation,
  useGetFirstCanvasMutation,
  useUpdateCanvasMutation,
} from "@/store/api/fetchCanvasApi";
import { useRouter } from "next/router";
import { selectIsAuthMe } from "@/store/slices/authSlice";

import imgbbUploader from "imgbb-uploader";

const uploadImage = async (canvasHTML: HTMLCanvasElement) => {
  try {
    const options = {
      apiKey: process.env.NEXT_PUBLIC_IMGBB_API_KEY, // MANDATORY
      base64string: canvasHTML.toDataURL(MimeTypes.PNG).split(",")[1],
    };
    const response = await imgbbUploader(options);

    console.log("Image uploaded successfully:", response);
    return response.display_url;
  } catch (error) {
    console.error("Failed to upload image:", error.message);
  }
};

export interface CanvasProps {
  tool: string;
  widthCanvas: string;
  heightCanvas: string;
  fillColor: string;
  width: number;
  canvasId: string;
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
  canvasId,
}) => {
  const dispatch = useDispatch();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [scale, setScale] = useState<number>(1);
  const [id, setId] = useState<number | null>(null);

  const isAuth = useSelector(selectIsAuthMe);

  let { userInfo, error } = useSelector((state) => state.auth);

  const fillColor = useSelector((state) => state.data.fillColor);
  const strokeColor = useSelector((state) => state.data.strokeColor);
  const borderWidth = useSelector((state) => state.data.borderWidth);
  const strokeOpacity = useSelector((state) => state.data.strokeOpacity);
  const fillOpacity = useSelector((state) => state.data.fillOpacity);
  const displayFill = useSelector((state) => state.data.displayFill);
  const displayStroke = useSelector((state) => state.data.displayStroke);
  const imageURL = useSelector((state) => state.data.imageURL);
  const imageFilters = useSelector((state) => state.data.imageFilters);
  const text = useSelector((state) => state.data.text);
  //const borderRadius = useSelector((state) => state.data.borderRadius);

  const [createCanvas] = useAddCanvasMutation();
  const [updateCanvas] = useUpdateCanvasMutation();
  const [getCanvas] = useGetCanvasMutation();
  const [getFirstCanvas] = useGetFirstCanvasMutation();
  //let id = null; //"6c14428c-f73b-42af-a928-8480317df238";

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
    text,
    //borderRadius
  };

  useEffect(() => {
    setId(canvasId);
    if (canvas) {
      canvas.id = canvasId;
    }
  }, [canvasId]);

  useEffect(() => {
    const canvasHTML = canvasRef.current;
    if (!canvasHTML) return;

    if (!canvas) {
      console.log("new canvas 1");
      canvas = new CanvasClass(canvasHTML, id);
      console.log(id, canvas);
      canvas.setCanvasProps(figureProps);

      dispatch(setCanvas(canvas));
    }

    if (id || canvasId) {
      (async () => {
        console.log({ id, canvasId });
        const canvasData = await getCanvas(id || canvasId);
        // console.log({canvasData});
        // console.log(JSON.parse(canvasData.data.canvases.content));
        // console.log((JSON.parse(canvasData.data.canvases.content)[0][0]));
        // console.log(JSON.parse(JSON.parse(canvasData.data.canvases.content)[0][0]));
        canvas.setLayersData(canvasData.data.canvases.content);
      })();

      return;
    }

    console.log({ userInfo, id });
    if (userInfo && !id && !canvasId) {
      (async () => {
        const canvasData = await getFirstCanvas([]);
        console.log("fetch first 1", { id, canvasId });

        if (canvasData?.data?.canvases?.id == null) {
          return;
        }
        console.log("fetch first 2");
        canvas.setLayersData(canvasData.data.canvases.content);
        setId(canvasData.data.canvases.id);
        if (canvas) {
          canvas.id = canvasId;
        }
      })();
    }
  }, [id]);

  // useEffect(() => {
  //   console.log({ userInfo, id });
  //   if (isAuth && userInfo && !id && !canvasId && canvas) {
  //     (async () => {
  //       const canvasData = await getFirstCanvas([]);
  //       console.log("fetch first 1", {id, canvasId});

  //       if (canvasData?.data?.canvases?.id == null) {
  //         return;
  //       }
  //       console.log("fetch first 2", canvasData);

  //       canvas.setLayersData(canvasData.data.canvases.content);
  //       setId(canvasData.data.canvases.id);
  //       // console.log({id});
  //     })();
  //   }
  // }, [isAuth]);

  //HANDLING OPTIONS CHANGE
  useEffect(() => {
    const canvasHTML = canvasRef.current;
    if (!canvasHTML) return;

    canvas.setCanvasProps(figureProps);

    if (canvas.selectedShape) {
      updateShapeProps(canvas, figureProps);
      canvas.redrawCanvas();
    }
  }, [figureProps, canvas]);

  //HANDLE DYNAMIC FILTER CHANGE
  useEffect(() => {
    const canvasHTML = canvasRef.current;
    if (!canvasHTML) return;

    canvas!.setCanvasProps(figureProps);

    if (canvas!.selectedShape) {
      if (canvas!.selectedShape.name === "Img") {
        canvas.selectedShape.redrawImage();
      }
    }
  }, [figureProps.imageFilters]);

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
    dispatch(setText(optionsObj.text));
    //dispatch(setBorderRadius(optionsObj.borderRadius));
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
          canvas.selectedShapeIndex = i;
          canvas.selectedShape = canvas.history[i];
          dispatch(
            setSelectedShape(
              Object.getPrototypeOf(canvas.selectedShape).constructor.name
            )
          );
          canvas.selectedShapeDiv.leftTop = canvas.selectedShape.leftTop;
          canvas.selectedShapeDiv.rightBottom =
            canvas.selectedShape.rightBottom;
          console.log(canvas.selectedShape);
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
            text: canvas.selectedShape.text,
            //borderRadius: canvas.selectedShape.radius,
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
      dispatch(setCanvas(canvas));
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
    newScale >= 1 && setScale((prev) => prev - 0.1);
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

  // const saveCanvas = async () => {
  //   console.log("save");
  //   const previewURL = await uploadImage(canvas!.canvasHTML!);
  //   if (!id) {
  //     console.log("create", { id });
  //     await createCanvas({
  //       canvas,
  //       title: "canvas title",
  //       preview: previewURL,
  //     });
  //     return;
  //   }
  //
  //   console.log("update", { id });
  //   uploadImage(canvas!.canvasHTML!);
  //   await updateCanvas({ id, canvas, preview: previewURL });
  // };

  return (
    <>
      {
        // <Button variant="contained" onClick={saveCanvas}>
        //   Save
        // </Button>
      }
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
    </>
  );
};
