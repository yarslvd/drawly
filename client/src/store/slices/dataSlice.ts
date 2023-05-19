import {createSlice, PayloadAction} from "@reduxjs/toolkit";

import { Tools } from "@/data/Constants";

interface DataStateTypes {
    tool: any;
    strokeColor: string | null;
    fillColor: string | null;
    strokeWidth: number | null;
}

const initialState: DataStateTypes = {
    tool: Tools.MOVE,
    strokeColor: '#00000',
    fillColor: '#00000',
    strokeWidth: 5,
}

export const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        setTool: (state, action:PayloadAction<any>) => {
            state.tool = action.payload;
        },
        setStrokeColor: (state, action:PayloadAction<string>) => {
            state.strokeColor = action.payload;
        },
        setFillColor: (state, action:PayloadAction<string>) => {
            state.fillColor = action.payload;
        },
        setStrokeWidth: (state, action:PayloadAction<number>) => {
            state.strokeWidth = action.payload;
        }
    }
});

export const { setTool, setStrokeWidth, setStrokeColor, setFillColor } = dataSlice.actions;
export const selectData = (state) => state.data.data;
export default dataSlice.reducer;