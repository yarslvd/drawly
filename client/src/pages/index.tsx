import Head from "next/head";
import { useState } from "react";
import { ToolBar } from "@/components/ToolBar/ToolBar";
import { Canvas } from "@/components/Canvas/Canvas";
import { Settings } from "@/components/Settings/Settings";
import { Tools } from "@/data/Constants";

export default function Home() {
  //TODO: think about default tool to set
  const [tool, setTool] = useState<string>(Tools.MOVE);
  const [color, setColor] = useState('#000');
  const [width, setWidth] = useState(5);

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
        <Settings
            color={color}
            setColor={setColor}
            width={width}
            setWidth={setWidth}
        />
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
