import Head from "next/head";
import Link from "next/link";
import { Container, Button } from "@mui/material";

import styles from "../styles/Home.module.scss";
import { CanvasCard } from "@/components/CanvasCard/CanvasCard";
import {
  useAddCanvasMutation,
  useGetCanvasesListMutation,
} from "@/store/api/fetchCanvasApi";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuthMe, selectIsAuthMe } from "@/store/slices/authSlice";
import { useRouter } from "next/router";
import { fetchAuthApi } from "@/store/api/fetchAuthApi";
import Cookies from "js-cookie";

const userToken = () => {
  return Cookies.get("access_token") ? Cookies.get("access_token") : null;
};

const Home = () => {
  const [canvases, setCanvases] = useState([]);

  const router = useRouter();
  const [getList] = useGetCanvasesListMutation();
  const [addCanvas] = useAddCanvasMutation();

  let { userInfo, error } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const isAuth = useSelector(selectIsAuthMe);
  console.log("isAuth", isAuth);

  useEffect(() => {
    const getMe = async () => {
      try {
        dispatch(fetchAuthMe(userToken()));
        if (!isAuth) {
          router.push("/login");
        }

        (async () => {
          const list = await getList([]);
          console.log({ list });
          try{
            setCanvases(list.data.canvases);
          }
          catch(err) {
            console.log(err);
          }
        })();
      } catch (e) {
        console.log("error while fetching me: ", e);
      }
    };
    getMe();
  }, []);

  const handleCreateCanvas = async () => {
    const res = await addCanvas({
      canvas: { layers: [[]] },
      title: "New canvas",
      preview: "",
    });

    console.log({ res });

    router.push("/canvas/" + res.data.canvas.id);
  };

  return (
    <>
      <Head>
        <title>Home</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Container maxWidth="xl" className={styles.container}>
          <nav className={styles.navigationContainer}>
            <Link href="/" className={styles.logoLink}>
              <h1 className={styles.logoText}>drawly</h1>
            </Link>
            <div className={styles.menu}>
              <Button>Settings</Button>
              <Button>Logout</Button>
            </div>
          </nav>
          <div className={styles.canvasContainer}>
            <div className={styles.heading}>
              <h1>Canvases</h1>
              <Button
                variant="contained"
                className={styles.button}
                onClick={handleCreateCanvas}
              >
                New
              </Button>
            </div>
            <div className={styles.cardContainer}>
              {canvases.map((canvas) => {
                return <CanvasCard canvas={canvas} />;
              })}
            </div>
          </div>
        </Container>
      </main>
    </>
  );
};

export default Home;
