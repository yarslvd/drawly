import { useEffect, useRef } from "react";
import { Coordinates } from "@/types/types";

export const useOnDraw = (onDraw, mouseDownCallback, mouseUpCallback) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef<boolean>(false);
  const prevPointRef = useRef<Coordinates | null>(null);

  const mouseUpListenerRef = useRef<(e: any) => void>(null);
  const mouseMoveListenerRef = useRef<(e: any) => void>(null);

  const setCanvasRef = (ref) => {
    if (!ref) return;
    canvasRef.current = ref;
  };

  const onCanvasMouseDown = () => {
    mouseDownCallback && mouseDownCallback();
    isDrawingRef.current = true;
  };

  useEffect(() => {
    const initMouseMoveListener = () => {
      const mouseMoveListener = (e) => {
        if (isDrawingRef.current && canvasRef.current) {
          const point = getCanvasPoints(e.clientX, e.clientY);
          const ctx: CanvasRenderingContext2D | null =
            canvasRef.current?.getContext("2d");
          console.log(prevPointRef.current, point);
          if (onDraw) {
            onDraw(ctx, point, prevPointRef.current);
          }
          prevPointRef.current = point;
        }
      };

      mouseMoveListenerRef.current = mouseMoveListener;
      window.addEventListener("mousemove", mouseMoveListener);
    };

    const getCanvasPoints = (clientX, clientY): Coordinates | null => {
      if (canvasRef.current) {
        const bounds = canvasRef.current?.getBoundingClientRect();
        return {
          x: clientX - bounds.left,
          y: clientY - bounds.top,
        };
      } else {
        return null;
      }
    };

    const mouseUpListener = () => {
      const listener = () => {
        mouseUpCallback && mouseUpCallback();
        isDrawingRef.current = false;
        prevPointRef.current = null;
      };
      mouseUpListenerRef.current = listener;
      window.addEventListener("mouseup", listener);
    };

    initMouseMoveListener();
    mouseUpListener();

    return () => {
      if (mouseMoveListenerRef.current) {
        window.removeEventListener("mousemove", mouseMoveListenerRef.current);
      }
      if (mouseUpListenerRef.current) {
        window.removeEventListener("mouseup", mouseUpListenerRef.current);
      }
    };
  }, [onDraw]);

  return {
    setCanvasRef,
    onCanvasMouseDown,
    isDrawingRef,
    canvasRef,
  };
};
