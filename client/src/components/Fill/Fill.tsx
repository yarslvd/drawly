import {ChangeEventHandler, FC, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import {setFillColor} from "@/store/slices/dataSlice";
import styles from './Fill.module.scss';
import {BlockPicker, SketchPicker} from "react-color";

export const Fill:FC = () => {
    const dispatch = useDispatch();
    const [displayPicker, setDisplayPicker] = useState(false);
    const fillColor = useSelector((state) => state.data.fillColor);

    const handleFillColor: ChangeEventHandler<HTMLInputElement> = (color) => {
        dispatch(setFillColor(color.hex));
    }

    return(
        <div className={styles.container}>
            <h4>Fill</h4>
            <div className={styles.options}>
                <label className={styles.checkboxContainer} >
                    <input type="checkbox" className={styles.checkbox}/>
                    <span className={styles.checkmark}></span>
                </label>
                <div className={styles.colorPickerContainer}>
                    <div className={styles.colorPicker}>
                        <div
                            onClick={() => setDisplayPicker(!displayPicker)}
                        >
                            <div className={styles.color} style={{ backgroundColor: fillColor }}/>
                        </div>
                        <input type="text" value={fillColor} onChange={handleFillColor}/>
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
                            <BlockPicker color={fillColor} onChange={handleFillColor} />
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}