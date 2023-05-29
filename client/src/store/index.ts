import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";

import { dataSlice } from "@/store/slices/dataSlice";
import { authReducer } from "./slices/authSlice";
import { fetchAuthApi } from './api/fetchAuthApi';
import { fetchCanvasApi } from "./api/fetchCanvasApi";

const store = () =>
  configureStore({
    reducer: {
      [dataSlice.name]: dataSlice.reducer,
      [fetchCanvasApi.reducerPath]: fetchCanvasApi.reducer,
        auth: authReducer,
    },
    devTools: true,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat([fetchCanvasApi.middleware, fetchAuthApi.middleware]),
  });

export const wrapper = createWrapper(store);
