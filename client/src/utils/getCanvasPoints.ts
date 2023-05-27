import { Coordinates } from "@/types/types";

export const getCanvasPoints = (
  { clientX, clientY },
  canvasRef,
  scale
): Coordinates | null => {
  if (canvasRef.current) {
    const bounds = canvasRef.current?.getBoundingClientRect();
    //console.log(Math.abs(bounds.left - clientX), Math.abs( bounds.top - clientY));
    // console.log((bounds.left + clientX) * scale,( bounds.top + clientY) * scale);
    if (scale > 1) {
      return {
        x: (Math.abs(bounds.left - clientX) / scale / 1000) * 1920,
        y: (Math.abs(bounds.top - clientY) / scale / 700) * 1080,
      };
    } else if (scale <= 1) {
      return {
        x: (Math.abs(bounds.left - clientX) / 1000) * 1920,
        y: (Math.abs(bounds.top - clientY) / 700) * 1080,
      };
    }
  } else {
    return null;
  }
};

