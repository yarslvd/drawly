import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';

import { dataSlice } from "@/store/slices/dataSlice";

const store = () =>
    configureStore({
        reducer: {
            [dataSlice.name]: dataSlice.reducer,
        },
        devTools: true,
    });

export const wrapper = createWrapper(store);