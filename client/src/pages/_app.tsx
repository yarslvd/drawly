import type { AppProps } from "next/app";
import { GoogleOAuthProvider } from '@react-oauth/google';

import { wrapper } from "@/store";
import "@/styles/globals.css";

function App({ Component, pageProps }: AppProps) {
  return (
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLEOAUTH_CLIENT_ID}>
        <Component {...pageProps} />
      </GoogleOAuthProvider>
  )
}

export default wrapper.withRedux(App);
