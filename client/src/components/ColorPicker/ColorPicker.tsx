import { useState } from "react";
import { SketchPicker } from "react-color";

import styles from "./ColorPicker.module.scss";

interface ColorPickerPropsTypes {
  color: string;
  setColor: () => void;
}

export const ColorPicker = ({ color, handleChange }: ColorPickerPropsTypes) => {
  const [displayPicker, setDisplayPicker] = useState(false);

  return (
    <div className={styles.container}>
      <div
        className={styles.colorContainer}
        onClick={() => setDisplayPicker(!displayPicker)}
      >
        <div className={styles.color} style={{ backgroundColor: color }} />
      </div>
      {displayPicker ? (
        <div className={styles.popover}>
          <div
            className={styles.cover}
            onClick={() => setDisplayPicker(false)}
          />
          <SketchPicker color={color} onChange={handleChange} />
        </div>
      ) : null}
    </div>
  );
};
