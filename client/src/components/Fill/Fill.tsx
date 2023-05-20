import {ChangeEventHandler, FC, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import {setFillColor, setFillOpacity, setDisplayFill} from "@/store/slices/dataSlice";
import styles from './Fill.module.scss';
import {BlockPicker} from "react-color";

export const Fill:FC = () => {
    const dispatch = useDispatch();
    const [displayPicker, setDisplayPicker] = useState(false);
    const fillColor = useSelector((state) => state.data.fillColor);
    const fillOpacity = useSelector((state) => state.data.fillOpacity);
    const displayFill = useSelector((state) => state.data.displayFill);

    const handleFillColor: ChangeEventHandler<HTMLInputElement> = (color) => {
        dispatch(setFillColor(color.hex));
    }

    const validateHex = (color) => {
        const option = new Option().style;
        option.color = color;
        dispatch(setFillColor(color));
    };

    const handleKeyDown = (event) => {
        const inputColor = event.target.value;
        if (event.key === 'Backspace' && inputColor.length === 1) {
            event.preventDefault();
        }
    };

    const handleFillOpacity = (value) => {
        const parsedValue = parseFloat(value);
        if (!isNaN(parsedValue) && parsedValue >= 0 && parsedValue <= 100) {
            dispatch(setFillOpacity(parsedValue * 0.01));
        }
        else if(parsedValue > 100) {
            dispatch(setFillOpacity(1));
        }
        else {
            dispatch(setFillOpacity(0));
        }
    }

    return(
        <div className={styles.container}>
            <h4>Fill</h4>
            <div className={styles.options}>
                <label className={styles.checkboxContainer} >
                    <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={displayFill}
                        onChange={() => dispatch(setDisplayFill(!displayFill))}
                    />
                    <span className={styles.checkmark}></span>
                </label>
                <div className={styles.colorPickerContainer}>
                    <div className={styles.colorPicker}>
                        <div
                            onClick={() => setDisplayPicker(!displayPicker)}
                        >
                            <div className={styles.color} style={{ backgroundColor: fillColor }}/>
                        </div>
                        <input
                            type="text"
                            value={'#' + fillColor.slice(1)}
                            onChange={(e) => validateHex(e.target.value)}
                            onKeyDown={handleKeyDown}
                            maxLength={7}
                        />
                    </div>
                    <div className={styles.opacity}>
                        <input
                            type="text"
                            value={fillOpacity * 100 + '%'}
                            onChange={(e) => handleFillOpacity(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>

                    {displayPicker ? (
                        <div className={styles.popover}>
                            <div
                                className={styles.cover}
                                onClick={() => setDisplayPicker(false)}
                            />
                            <BlockPicker color={fillColor} onChange={handleFillColor} />
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}