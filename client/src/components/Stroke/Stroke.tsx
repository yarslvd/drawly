import { ChangeEventHandler, FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  setDisplayStroke,
  setStrokeColor,
  setStrokeOpacity,
  setBorderWidth,
} from "@/store/slices/dataSlice";
import styles from "./Stroke.module.scss";
import { BlockPicker, ColorChangeHandler } from "react-color";

export const Stroke: FC = ({ displayPicker, setDisplayPicker }) => {
  const dispatch = useDispatch();

  const strokeColor = useSelector((state) => state.data.strokeColor);
  const strokeOpacity = useSelector((state) => state.data.strokeOpacity);
  const displayStroke = useSelector((state) => state.data.displayStroke);
  const borderWidth = useSelector((state) => state.data.borderWidth);

  const handleStrokeWidth = (e) => {
    const value = +e.target.value;
    if (value <= 30) {
      dispatch(setBorderWidth(value));
    }
  };

  const handleStrokeColor: ChangeEventHandler<HTMLInputElement> = (color) => {
    dispatch(setStrokeColor(color.hex));
  };

  const validateHex = (color) => {
    const option = new Option().style;
    option.color = color;
    dispatch(setStrokeColor(color));
  };

  const handleKeyDown = (event) => {
    const inputColor = event.target.value;
    if (event.key === "Backspace" && inputColor.length === 1) {
      event.preventDefault();
    }
  };

  const handleStrokeOpacity = (value) => {
    const parsedValue = parseFloat(value);
    if (!isNaN(parsedValue) && parsedValue >= 0 && parsedValue <= 100) {
      console.log(parsedValue * 0.01);
      dispatch(setStrokeOpacity(parsedValue * 0.01));
    } else if (parsedValue > 100) {
      dispatch(setStrokeOpacity(1));
    } else {
      dispatch(setStrokeOpacity(0));
    }
  };

  return (
    <div className={styles.container}>
      <h4>Stroke</h4>
      <div className={styles.options}>
        <label className={styles.checkboxContainer}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={displayStroke}
            onChange={() => dispatch(setDisplayStroke(!displayStroke))}
          />
          <span className={styles.checkmark}></span>
        </label>
        <div className={styles.colorPickerContainer}>
          <div className={styles.up}>
            <div className={styles.colorPicker}>
              <div onClick={() => setDisplayPicker(!displayPicker)}>
                <div
                  className={styles.color}
                  style={{ backgroundColor: strokeColor }}
                />
              </div>
              <input
                type="text"
                value={"#" + strokeColor?.slice(1)}
                onChange={(e) => validateHex(e.target.value)}
                onKeyDown={handleKeyDown}
                maxLength={7}
              />
            </div>
            <div className={styles.opacity}>
              <input
                type="text"
                value={strokeOpacity * 100 + "%"}
                onChange={(e) => handleStrokeOpacity(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>

            {displayPicker ? (
              <div className={styles.popover}>
                <div
                  className={styles.cover}
                  onClick={() => setDisplayPicker(false)}
                />
                <BlockPicker color={strokeColor} onChange={handleStrokeColor} />
              </div>
            ) : null}
          </div>
          <div className={styles.down}>
            <h5>Stroke width:</h5>
            <div className={styles.inputContainer}>
              <input
                type="text"
                className={styles.inputWidth}
                value={borderWidth}
                onChange={handleStrokeWidth}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
