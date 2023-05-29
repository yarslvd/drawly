import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.REACT_APP_BASE_URL}/api/users`,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.userToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const fetchAuthApi = createApi({
  reducerPath: "fetchAuthApi",
  baseQuery: baseQuery,
  endpoints: (build) => ({
    updateUser: build.mutation({
      query: (event) => ({
        url: `/`,
        method: "PATCH",
        body: event,
      }),
    }),
    uploadAvatar: build.mutation({
      query: ({ file, id }) => ({
        url: `/avatar`,
        method: "POST",
        body: file,
      }),
    }),
    getPublicUser: build.query({
      query: (id) => `/${id}`,
    }),
  }),
});

export const {
  useUpdateUserMutation,
  useUploadAvatarMutation,
  useGetPublicUserQuery,
} = fetchAuthApi;
