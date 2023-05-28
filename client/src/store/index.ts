import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";

import { dataSlice } from "@/store/slices/dataSlice";

import { fetchCanvasApi } from "./api/fetchCanvasApi";

const store = () =>
  configureStore({
    reducer: {
      [dataSlice.name]: dataSlice.reducer,
      [fetchCanvasApi.reducerPath]: fetchCanvasApi.reducer,
    },
    devTools: true,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat([fetchCanvasApi.middleware]),
  });

export const wrapper = createWrapper(store);
