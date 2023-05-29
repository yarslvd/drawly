import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "../axios";
import Cookies from "js-cookie";

const authAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Headers": "*",
    "Content-Type": "application/json",
  },
  credentials: "include",
  withCredentials: true,
});

authAxios.interceptors.request.use((config) => {
  config.headers.Authorization = Cookies.get("access_token");
  return config;
});

const userToken = Cookies.get("access_token")
  ? Cookies.get("access_token")
  : null;

export const fetchLogin = createAsyncThunk(
  "auth/fetchLogin",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await authAxios.post("/api/auth/login", params);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const fetchAuthMe = createAsyncThunk(
  "auth/fetchAuthMe",
  async (userToken_, { rejectWithValue }) => {
    try {
      console.log({ userToken_ });
      const { data } = await authAxios.get("/api/auth/getMe", userToken_);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchSignup = createAsyncThunk(
  "auth/fetchSignup",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await authAxios.post("/api/auth/register", params);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const fetchResetPassword = createAsyncThunk(
  "auth/fetchResetPassword",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await authAxios.post(
        "/api/auth/password-reset/",
        params
      );
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const fetchConfirmEmail = createAsyncThunk(
  "auth/fetchConfirmEmail",
  async (params, { rejectWithValue }) => {
    try {
      console.log(params);
      const { data } = await authAxios.get(`/api/auth/email-confirm/${params}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const fetchChangePassword = createAsyncThunk(
  "auth/fetchChangePassword",
  async (info, { rejectWithValue }) => {
    try {
      const { token, values } = info;
      const { data } = await authAxios.post(
        `/api/auth/password-reset/${token}`,
        values
      );
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const fetchCheckToken = createAsyncThunk(
  "auth/fetchCheckToken",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await authAxios.post(`/api/auth/checkToken/${params}`);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

interface AuthState {
  userInfo: any | null;
  userToken: string | null;
  error: string | null;
  status: "loading" | "resolved" | "rejected";
}

const initialState: AuthState = {
  userInfo: null,
  userToken,
  error: null,
  status: "loading",
};

interface LoginPayload {
  token: string;
  // Add other properties as needed
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducer: {},
  extraReducers: (builder) => {
    builder
      //LOGIN
      .addCase(fetchLogin.pending, (state) => {
        state.userInfo = null;
        state.userToken = null;
        state.status = "loading";
      })
      .addCase(fetchLogin.fulfilled, (state, action: PayloadAction<any>) => {
        state.userInfo = action.payload;
        state.userToken = action.payload.token;
        state.status = "resolved";
      })
      .addCase(fetchLogin.rejected, (state, action: PayloadAction<string>) => {
        state.userInfo = null;
        state.userToken = null;
        state.error = action.payload;
        state.status = "rejected";
      })

      //REGISTER
      .addCase(fetchSignup.pending, (state) => {
        state.userInfo = null;
        state.status = "loading";
      })
      .addCase(fetchSignup.fulfilled, (state, action) => {
        state.userInfo = action.payload;
        state.status = "resolved";
      })
      .addCase(fetchSignup.rejected, (state, action) => {
        state.userInfo = null;
        console.log(action.payload);
        state.error = action.payload;
        state.status = "rejected";
      })

      //RESET PASSWORD (SEND LINK)
      .addCase(fetchResetPassword.pending, (state) => {
        state.userInfo = null;
        state.status = "loading";
      })
      .addCase(fetchResetPassword.fulfilled, (state, action) => {
        state.userInfo = action.payload;
        state.status = "resolved";
      })
      .addCase(fetchResetPassword.rejected, (state, action) => {
        state.userInfo = null;
        console.log(action.payload);
        state.error = action.payload;
        state.status = "rejected";
      })

      //CONFIRM EMAIL
      .addCase(fetchConfirmEmail.pending, (state) => {
        state.userInfo = null;
        state.status = "loading";
      })
      .addCase(fetchConfirmEmail.fulfilled, (state, action) => {
        state.userInfo = action.payload;
        state.status = "resolved";
      })
      .addCase(fetchConfirmEmail.rejected, (state, action) => {
        state.userInfo = null;
        state.error = action.payload;
        state.status = "rejected";
      })

      //CHANGE PASSWORD
      .addCase(fetchChangePassword.pending, (state) => {
        state.userInfo = null;
        state.status = "loading";
      })
      .addCase(fetchChangePassword.fulfilled, (state, action) => {
        state.userInfo = action.payload;
        state.status = "resolved";
      })
      .addCase(fetchChangePassword.rejected, (state, action) => {
        state.userInfo = null;
        state.error = action.payload;
        state.status = "rejected";
      })

      //CHECK TOKEN
      .addCase(fetchCheckToken.pending, (state) => {
        state.userInfo = null;
        state.status = "loading";
      })
      .addCase(fetchCheckToken.fulfilled, (state, action) => {
        state.userInfo = action.payload;
        state.status = "resolved";
      })
      .addCase(fetchCheckToken.rejected, (state, action) => {
        state.userInfo = null;
        state.error = action.payload;
        state.status = "rejected";
      })

      //GET ME
      .addCase(fetchAuthMe.pending, (state) => {
        state.userInfo = null;
        state.status = "loading";
      })
      .addCase(fetchAuthMe.fulfilled, (state, action) => {
        state.userInfo = action.payload;
        state.status = "resolved";
      })
      .addCase(fetchAuthMe.rejected, (state, action) => {
        state.userInfo = null;
        state.status = "rejected";
      });
  },
});

export const selectIsAuth = (state) => Boolean(state.auth.userToken);
export const selectIsAuthMe = (state) => Boolean(state.auth.userInfo);

export const authReducer = authSlice.reducer;
