import '@/styles/globals.css';
import styles from '@/styles/MainPage.module.scss';
import Head from 'next/head';
import {NextRouter, useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import {SessionProvider} from 'next-auth/react';
import {LoadingPage} from '@/components';
import type {AppProps} from 'next/app';
import type {Config, User} from '@/types';

const App = ({Component, pageProps}: AppProps): JSX.Element => {
  const router: NextRouter = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [config, setConfig] = useState<Config>({
    api: process.env.API_URL,
    url: process.env.API_URL?.split(':')
      .filter(
        (_, idx) =>
          idx !=
          (process.env.API_URL?.split(':').length
            ? process.env.API_URL?.split(':').length
            : 0) -
            1
      )
      .join(':'),
    port: process.env.API_URL?.split(':').pop(),
    setter: undefined,
  });

  const checkRoutes = () => {
    const valueLocalStorage: string | null = localStorage.getItem('user');
    let userParsed: any | undefined = undefined;
    if (valueLocalStorage) {
      userParsed = JSON.parse(valueLocalStorage);
      setUser(userParsed);
    }
    if (
      (!userParsed || !userParsed.id || !userParsed.token) &&
      router.pathname != '/login' &&
      router.pathname != '/register' &&
      router.pathname != '/admin'
    )
      router.push('/login');

    if (
      userParsed &&
      userParsed.id &&
      userParsed.token &&
      (router.pathname === '/' || router.pathname === '/login')
    )
      router.push('/dashboard');
  };

  useEffect(() => {
    if (!config.setter) {
      setConfig({
        api: config.api,
        url: config.url,
        port: config.port,
        setter: setConfig,
      });
    }
    checkRoutes();
    document.onkeydown = e => {
      const valueLocalStorage: string | null = localStorage.getItem('user');
      if (e.key === 'Dead' && e.altKey === true && !valueLocalStorage)
        router.push('/admin');
    };
    return () => {
      document.onkeydown = null;
    };
  }, []);

  useEffect(() => {
    checkRoutes();
  }, [router.pathname]);

  if (
    router.pathname != '/login' &&
    router.pathname != '/register' &&
    router.pathname != '/admin' &&
    !user
  )
    return <LoadingPage />;

  return (
    <SessionProvider session={pageProps.session}>
      <Head>
        <title>Area 21</title>
        <link rel="shortcut icon" href="/icons/Area21.png" />
      </Head>
      <main id={styles.page}>
        <Component {...pageProps} config={config} user={user} />
      </main>
    </SessionProvider>
  );
};

export default App;
