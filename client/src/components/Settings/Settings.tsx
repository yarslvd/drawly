import styles from './Settings.module.scss';

import { useState } from "react";
import { SketchPicker } from 'react-color';

export const Settings = ({ color, setColor }) => {
    const handleChange = (newColor) => {
        setColor(newColor.hex);
    };

    return(
        <div className={styles.container}>
            <SketchPicker  color={color} onChange={handleChange} />
        </div>
    );
}