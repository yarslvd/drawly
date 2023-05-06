import {Coordinates} from "@/types/types";

export const getCanvasPoints = ({clientX, clientY}, canvasRef, scale): Coordinates | null => {
    if(canvasRef.current) {
        const bounds = canvasRef.current?.getBoundingClientRect();
        //console.log(Math.abs(bounds.left - clientX), Math.abs( bounds.top - clientY));
        // console.log((bounds.left + clientX) * scale,( bounds.top + clientY) * scale);
        if(scale > 1) {
            return {
                x: Math.abs(bounds.left - clientX) / scale,
                y: Math.abs( bounds.top - clientY) /scale
            }
        }
        else if (scale <= 1) {
            return {
                x: Math.abs(bounds.left - clientX),
                y: Math.abs( bounds.top - clientY)
            }
        }
    }
    else {
        return null;
    }
}