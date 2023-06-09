import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Alert, Button } from "@mui/material";
import { useDispatch } from "react-redux";

import styles from "./ResetPassword.module.scss";

import { fetchResetPassword } from "../../store/slices/authSlice";
import Head from "next/head";

const Index = () => {
  const dispatch = useDispatch();
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = async (values) => {
    dispatch(fetchResetPassword(values));
    setSent(true);
  };

  return (
    <>
      <Head>
        <title>Reset Password</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <section className={styles.background}>
          <div className={styles.contentContainer}>
            <Link href="/" className={styles.logo}>
              <h2>drawly</h2>
            </Link>
            <div className={styles.heading}>
              <h1 style={{ lineHeight: "90%", marginBottom: "10px" }}>
                Reset Password
              </h1>
              <span>Enter the email address associated with your account</span>
            </div>
            {!Object.keys(errors).length == 0 && (
              <Alert severity="warning" style={{ borderRadius: "10px" }}>
                {/*{Object.values(errors)[0].message}*/}
              </Alert>
            )}
            {sent && (
              <Alert severity="success" style={{ borderRadius: "10px" }}>
                If there is an account associated with this email, we have sent
                an instructions
              </Alert>
            )}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className={styles.inputs}>
                <div className={styles.form}>
                  <label htmlFor="email">Email</label>
                  <div className={styles.field}>
                    <input
                      type="email"
                      id="email"
                      {...register("email", {
                        pattern: {
                          value:
                            /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
                          message: "Please, enter a valid email",
                        },
                      })}
                      placeholder="user@example.com"
                      onChange={() => setSent(false)}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.button}>
                <Button type="submit" variant="contained">
                  Send
                </Button>
              </div>
            </form>
          </div>
          <div className={styles.image}>
            <div className={styles.text}>
              <h2>drawly</h2>
            </div>
            <img src="/assets/bg/resetpass.jpg" alt="" />
          </div>
        </section>
      </main>
    </>
  );
};

export default Index;
