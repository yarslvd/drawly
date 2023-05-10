import { useState } from "react";
import Image from "next/image";

import styles from "./WidthPicker.module.scss";

interface WidthPickerPropsTypes {
  width: number;
  handleChange: (width: number) => void;
}

export const WidthPicker = ({ width, handleChange }: WidthPickerPropsTypes) => {
  const [displayPicker, setDisplayPicker] = useState(false);

  return (
    <div className={styles.container}>
      <div
        className={styles.widthContainer}
        onClick={() => setDisplayPicker(!displayPicker)}
      >
        <Image src="/assets/icons/tools/width.png" width={30} height={30} />
      </div>
      {displayPicker ? (
        <div className={styles.popover}>
          {/*<div className={styles.cover} onClick={() => setDisplayPicker(false)}/>*/}
          <input
            type="range"
            min={1}
            max={20}
            step={1}
            onChange={(e) => handleChange(parseInt(e.target.value))}
            value={width}
          />
        </div>
      ) : null}
    </div>
  );
};
