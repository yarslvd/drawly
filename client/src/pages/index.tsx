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

  return (
    <>
      <Head>
        <title>drawly</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <ToolBar tool={tool} setTool={setTool} />
        <Menu />
        {/*<Settings*/}
        {/*  color={color}*/}
        {/*  setColor={(newColor) => {*/}
        {/*    setColor(newColor);*/}
        {/*    document.dispatchEvent(new CustomEvent("figure-settings"));*/}
        {/*  }}*/}
        {/*  width={width}*/}
        {/*  setWidth={(newWidth) => {*/}
        {/*    setWidth(newWidth);*/}
        {/*    document.dispatchEvent(new CustomEvent("figure-settings"));*/}
        {/*  }}*/}
        {/*/>*/}
        <div
          style={{ width: "100wh", height: "100vh" }}
          className="canvas_container"
        >
          <Canvas
            tool={tool}
            color={color}
            width={width}
            widthCanvas="1920"
            heightCanvas="1080"
          />
        </div>
      </main>
    </>
  );
}
