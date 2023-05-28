import {useState} from "react";
import { Button } from '@mui/material';

import styles from './TextEditor.module.scss';
import {setText} from "@/store/slices/dataSlice";
import {useDispatch, useSelector} from "react-redux";

export const TextEdit = () => {
    const dispatch = useDispatch();
    const [textInput, setTextInput] = useState('');

    const handleTextChange = () => {
        dispatch(setText(textInput));
    }

    return(
        <div className={styles.container}>
            <h4>Text edit</h4>
            <input
                type="text"
                className={styles.input}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}/>
            <Button
                variant='contained'
                className={styles.button}
                onClick={handleTextChange}
            >Save</Button>
        </div>
    );
}