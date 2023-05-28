import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CanvasClass } from "../../data/Canvas";

const baseQuery = fetchBaseQuery({
  baseUrl: `http://localhost:4000/api/canvases`,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYiLCJuYW5vSW90Ijo3MDEsImlhdCI6MTY4NTMwNDcxNSwiZXhwIjoxNjg1MzExOTE1fQ.0KhtximCSqFWWjLx52IdLRCecNsOopMQOtkZ8WGHfM4"; //getState().auth.userToken;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const fetchCanvasApi = createApi({
  reducerPath: "fetchCanvasApi",
  baseQuery: baseQuery,
  endpoints: (build) => ({
    updateCanvas: build.mutation({
      query: ({ id, canvas, title }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: {
          title,
          content: canvas.layers,
        },
      }),
    }),
    getCanvas: build.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "GET",
      }),
    }),
    addCanvas: build.mutation({
      query: ({ canvas, title }) => ({
        url: "/",
        method: "POST",
        body: {
          title: title,
          content: JSON.stringify(canvas.layers),
        },
      }),
    }),
    deleteCanvas: build.mutation({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useUpdateCanvasMutation,
  useGetCanvasMutation,
  useAddCanvasMutation,
  useDeleteCanvasMutation,
} = fetchCanvasApi;
