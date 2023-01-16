import '@/styles/globals.css';
import type { AppProps } from 'next/app';
// import Font Awesome CSS
import "@fortawesome/fontawesome-svg-core/styles.css";

import { PlaylistProvider } from '@/contexts/PlaylistContext';
import { config } from "@fortawesome/fontawesome-svg-core";
// Tell Font Awesome to skip adding the CSS automatically 
// since it's already imported above
config.autoAddCss = false;

export default function App({ Component, pageProps }: AppProps) {


  const Layout = (Component as any).layout || (({ children }: any) => <>{children}</>);


  return (
    <PlaylistProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </PlaylistProvider>
  )
}
