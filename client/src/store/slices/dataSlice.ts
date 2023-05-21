import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Tools } from "@/data/Constants";

interface DataStateTypes {
  tool: any;
  strokeColor: string | null;
  fillColor: string | null;
  strokeWidth: number | null;
  borderRadius: number | null;
  strokeOpacity: number | null;
  fillOpacity: number | null;
  borderWidth: number | null;
  displayStroke: boolean | null;
  displayFill: boolean | null;
  imageURL: string | null;
  imageFilters: string;
}

const initialState: DataStateTypes = {
  tool: Tools.MOVE,
  strokeColor: "#000000",
  fillColor: "#000000",
  strokeWidth: 5,
  borderRadius: 0,
  strokeOpacity: 1,
  fillOpacity: 1,
  borderWidth: 5,
  displayStroke: true,
  displayFill: true,
  imageURL: "",
  imageFilters: "none",
};

export const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setTool: (state, action: PayloadAction<any>) => {
      state.tool = action.payload;
    },
    setStrokeColor: (state, action: PayloadAction<string>) => {
      state.strokeColor = action.payload;
    },
    setFillColor: (state, action: PayloadAction<string>) => {
      state.fillColor = action.payload;
    },
    setStrokeWidth: (state, action: PayloadAction<number>) => {
      state.strokeWidth = action.payload;
    },
    setBorderRadius: (state, action: PayloadAction<number>) => {
      state.borderRadius = action.payload;
    },
    setStrokeOpacity: (state, action: PayloadAction<number>) => {
      state.strokeOpacity = action.payload;
    },
    setFillOpacity: (state, action: PayloadAction<number>) => {
      state.fillOpacity = action.payload;
    },
    setBorderWidth: (state, action: PayloadAction<number>) => {
      state.borderWidth = action.payload;
    },
    setDisplayStroke: (state, action: PayloadAction<boolean>) => {
      state.displayStroke = action.payload;
    },
    setDisplayFill: (state, action: PayloadAction<boolean>) => {
      state.displayFill = action.payload;
    },
    setImageURL: (state, action: PayloadAction<string>) => {
      state.imageURL = action.payload;
    },
    setImageFilters: (state, action: PayloadAction<string>) => {
      state.imageFilters = action.payload;
    },
  },
});

export const {
  setTool,
  setStrokeWidth,
  setStrokeColor,
  setFillColor,
  setBorderRadius,
  setStrokeOpacity,
  setFillOpacity,
  setBorderWidth,
  setDisplayStroke,
  setDisplayFill,
  setImageURL,
  setImageFilters,
} = dataSlice.actions;
export const selectData = (state) => state.data.data;
export default dataSlice.reducer;