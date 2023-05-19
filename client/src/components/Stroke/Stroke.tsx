import {ChangeEventHandler, FC, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import {setStrokeColor} from "@/store/slices/dataSlice";
import styles from './Stroke.module.scss';
import {BlockPicker, ColorChangeHandler} from "react-color";

export const Stroke:FC = () => {
    const dispatch = useDispatch();
    const [displayPicker, setDisplayPicker] = useState(false);
    const strokeColor = useSelector((state) => state.data.strokeColor);

    const handleStrokeColor: ChangeEventHandler<HTMLInputElement> = (color) => {
        dispatch(setStrokeColor(color.hex));
    }

    return(
        <div className={styles.container}>
            <h4>Stroke</h4>
            <div className={styles.options}>
                <label className={styles.checkboxContainer} >
                    <input type="checkbox" className={styles.checkbox}/>
                    <span className={styles.checkmark}></span>
                </label>
                <div className={styles.colorPickerContainer}>
                    <div className={styles.colorPicker}>
                        <div
                            className={styles.colorContainer}
                            onClick={() => setDisplayPicker(!displayPicker)}
                        >
                            <div className={styles.color} style={{ backgroundColor: strokeColor }}/>
                        </div>
                        <input type="text" value={strokeColor} onChange={handleStrokeColor}/>
                    </div>
                    <div className={styles.opacity}>
                        <input type="text"/>
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
            </div>
        </div>
    );
}