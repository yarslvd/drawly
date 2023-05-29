import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CanvasClass } from "../../data/Canvas";

const baseQuery = fetchBaseQuery({
  baseUrl: `http://localhost:4000/api/canvases`,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.userToken;

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
      query: ({ id, canvas }) => ({
        url: `/`,
        method: "PATCH",
        body: {
          id,
          title: "canvas title", // canvas.title
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
    getFirstCanvas: build.mutation({
      query: () => ({
        url: `/first`,
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
  useGetFirstCanvasMutation,
  useAddCanvasMutation,
  useDeleteCanvasMutation,
} = fetchCanvasApi;
