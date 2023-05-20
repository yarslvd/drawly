import type { AppProps } from "next/app";
import Provider from 'react-redux';

import { wrapper } from "@/store";
import "@/styles/globals.css";

function App({ Component, pageProps }: AppProps) {
  return(
      <Component {...pageProps} />
  );
}

export default wrapper.withRedux(App);
