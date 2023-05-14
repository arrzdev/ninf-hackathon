import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, user-scalable=0, 
        initial-scale=1.0, minimum-scale=1.0, maximum-scale=5.0 viewport-fit=cover"/>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
