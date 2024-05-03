import {SessionProvider } from 'next-auth/react';
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from 'next-themes';
import ThemeToggle from '@/components/ui/theme-toggle';

export default function App({ Component, pageProps }: AppProps) {
  return (
  <SessionProvider session={pageProps.session}>
    {/* <ThemeProvider attribute="class"> */}
      
    <Component {...pageProps} />
    {/* </ThemeProvider> */}
  </SessionProvider>
  )
}
