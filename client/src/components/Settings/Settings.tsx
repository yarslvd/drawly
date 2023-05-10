import { useState, memo } from "react";

import styles from './Settings.module.scss';
import {ColorPicker} from "@/components/ColorPicker/ColorPicker";
import {WidthPicker} from "@/components/WidthPicker/WidthPicker";

export const Settings = memo(({ color, setColor, width, setWidth }) => {
    const handleChangeColor = (newColor) => {
        setColor(newColor.hex);
    };

    const handleChangeWidth = (newWidth) => {
        setWidth(newWidth);
    }

    return(
        <div className={styles.container}>
            <WidthPicker width={width} handleChange={handleChangeWidth} />
            <ColorPicker color={color} handleChange={handleChangeColor} />
        </div>
    );
});