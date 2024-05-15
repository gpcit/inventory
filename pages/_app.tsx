import {SessionProvider } from 'next-auth/react';
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import AnimatedTitle from '@/components/AnimatedTitle';

export default function App({ Component, pageProps }: AppProps) {
  return (
  <SessionProvider session={pageProps.session}>
    {/* <ThemeProvider attribute="class"> */}
      
    <Component {...pageProps} />
    {/* </ThemeProvider> */}
  </SessionProvider>
  )
}
