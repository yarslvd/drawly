import Head from "next/head";
import { useEffect, useState } from "react";
import { ToolBar } from "@/components/ToolBar/ToolBar";
import { Canvas } from "@/components/Canvas/Canvas";
import { Settings } from "@/components/Settings/Settings";
import { Tools } from "@/data/Constants";
import { Menu } from "@/components/Menu/Menu";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuthMe, selectIsAuthMe } from "@/store/slices/authSlice";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

const userToken = () => {
  return Cookies.get("access_token") ? Cookies.get("access_token") : null;
};

export default function Home() {
  //TODO: think about default tool to set
  const [tool, setTool] = useState<string>(Tools.MOVE);
  const [color, setColor] = useState("#000");
  const [width, setWidth] = useState(5);

  console.log(process.env.API_URI);

  const dispatch = useDispatch();

  const isAuth = useSelector(selectIsAuthMe);
  console.log("isAuth", isAuth);

  useEffect(() => {
    const getMe = async () => {
      try {
        dispatch(fetchAuthMe(userToken()));
      } catch (e) {
        console.log("error while fetching me: ", e);
      }
    };
    getMe();
  }, []);

  useRouter().push("/canvas");

  return <></>;
}
