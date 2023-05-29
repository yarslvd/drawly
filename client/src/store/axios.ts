import axios from "axios";
import Cookies from "js-cookie";

const instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Headers": "*",
    "Content-Type": "application/json",
  },
  credentials: "include",
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  config.headers.Authorization = Cookies.get("access_token");
  console.log(Cookies.get("access_token"));
  return config;
});

instance.interceptors.response.use(
    (response) => response,
    (error) => {
      console.log("redirected", error);
      if (error.response.status === 401) {
        window.location = "/login";
      }
    }
);

export default instance;