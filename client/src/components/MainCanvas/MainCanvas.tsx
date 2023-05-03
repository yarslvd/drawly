import React, {CSSProperties, MouseEventHandler, useEffect, useRef, useState} from "react";
import {ChromePicker, ColorChangeHandler} from 'react-color';
import styles from "./MainCanvas.module.scss";

interface Coordinates {
    x: number;
    y: number;
}
export const MainCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [canvasCtx, setCanvasCtx] = useState<CanvasRenderingContext2D | null>(null);

    const [mouseCoordinates, setMouseCoordinates] = useState<Coordinates>({ x: 0, y: 0 });

    const [color, setColor] = useState("#000000");
    const [width, setWidth] = useState(4.5);
    const [scale, setScale] = useState(1);

    // console.log(mouseCoordinates);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas!.getContext("2d");
        canvas!.width = window.innerWidth;
        canvas!.height = window.innerHeight;
        setCanvasCtx(ctx);
    }, [canvasRef]);

    const Draw = (event :React.MouseEvent) => {
        if (event.buttons !== 1) return;
        const context = canvasCtx;
        if (context) {
            context.strokeStyle = color;
            context.lineJoin = 'round';
            context.lineWidth = width;

            context.beginPath();
            context.moveTo(mouseCoordinates.x, mouseCoordinates.y);
            SetMousePosition(event);
            context.lineTo(event.clientX, event.clientY);

            context.closePath();
            context.stroke();
        }

    };

    const SetMousePosition = (event :React.MouseEvent) => {
        event.preventDefault();
        setMouseCoordinates({
            x: event.clientX,
            y: event.clientY,
        });
    };

    const changeWidth = (event: React.ChangeEvent<HTMLInputElement>) => {
        setWidth(parseFloat(event.target.value));
    };

    useEffect(() => {
        const handleScaling = (e) => {
            e.preventDefault();
            if(e.ctrlKey) {
                console.log(scale);
                if(e.deltaY > 0) {
                    setScale(state => state - 0.1);
                }
                else if(e.deltaY < 0) {
                    setScale(state => state + 0.1);
                }
            }
        }

        window.addEventListener('wheel', handleScaling, { passive: false });

        return () => {
            window.removeEventListener('keydown', handleScaling);
        }
    }, [])

    // const handleScaling = (e) => {
    //     e.preventDefault();
    //     if(e.ctrlKey) {
    //         if(e.deltaY > 0) {
    //             setScale(state => state - 0.1);
    //         }
    //         else if(e.deltaY < 0) {
    //             setScale(state => state + 0.1);
    //         }
    //     }
    //     //setScale(scale => scale + e.deltaY * 0.01);
    //     console.log(scale, e.deltaY);
    // }

    return (
        <div>
            <div style={{ position: 'absolute', zIndex: '100' }}>
                <span>Slider to chang line width</span>
                <input
                    type='range'
                    onChange={changeWidth}
                    min={0.1}
                    max={10}
                    step={0.2}
                    value={width}
                />
            </div>
            <div style={{ position: 'absolute', zIndex: '100' }}>
                <span>Colour picker to change line colour</span>
                <ChromePicker
                    color={color}
                    onChange={(e) => {setColor(e.hex)}}
                />
            </div>
            <div style={{ transform: `scale(${scale})` }}>
                <canvas
                    ref={canvasRef}
                    onMouseEnter={(e :React.MouseEvent<HTMLCanvasElement>) => SetMousePosition(e)}
                    onMouseMove={(e :React.MouseEvent<HTMLCanvasElement>) => {
                        e.preventDefault();
                        SetMousePosition(e);
                        Draw(e);
                    }}
                     onMouseDown={(e :React.MouseEvent<HTMLCanvasElement>) => SetMousePosition(e)}
                    style={{ backgroundColor: '#eee' }}
                />
            </div>
        </div>
    )
}