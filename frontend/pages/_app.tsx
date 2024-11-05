import React from 'react';
import '../styles/globals.css'; // Global CSSはここでインポート
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps}/>;
}

export default MyApp;