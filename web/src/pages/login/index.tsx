import styles from '@/styles/Login.module.scss';
import {Button, Input, Link, LoadingPage, OAuthList} from '@/components';
import {useState, useEffect, FormEventHandler} from 'react';
import Router from 'next/router';
import {tryLogin, loginOauth} from '@/scripts/Utils';
import {useSession, signOut} from 'next-auth/react';
import {ApiResponse, Config, User} from '@/types';

const Login = ({config, user}: {config: Config; user: User}) => {
  const {data: session}: any = useSession();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorLogin, setErrorLogin] = useState<Boolean>(false);

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setErrorLogin(false);
    setEmail(e.target.value);
  };
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setErrorLogin(false);
    setPassword(e.target.value);
  };
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    const response = await tryLogin(config.api, email, password);
    if (response) {
      localStorage.setItem(
        'user',
        JSON.stringify({
          email: email,
          id: response.user_id,
          token: response.token,
        })
      );
      Router.push('/dashboard');
    } else {
      setErrorLogin(true);
    }
  };

  useEffect(() => {
    if (!session) {
      return;
    } else if (session.user !== undefined) {
      (async () => {
        const response: ApiResponse = await loginOauth(
          config.api,
          null,
          session.provider,
          session.user.email,
          session.accessToken,
          session.refreshToken
        );
        if (response.success) {
          localStorage.setItem(
            'user',
            JSON.stringify({
              email: 'Connected with OAuth2',
              id: response.data.user_id,
              token: response.data.token,
            })
          );
          Router.push('/dashboard');
        } else {
          signOut();
        }
      })();
    }
  }, [session?.user]);
  useEffect(() => {
    if (session) signOut();
  }, []);

  if (session) return <LoadingPage />;

  return (
    <div id={styles.login}>
      <div id={styles.backgroundRectangle}>
        <p id={styles.title}>Log In</p>
        <form onSubmit={handleSubmit}>
          <Input
            id="email"
            value={email}
            onChange={handleEmail}
            label="Email"
          />
          <Input
            id="password"
            value={password}
            onChange={handlePassword}
            label="Password"
            type="password"
          />
          <Button type={'submit'}>Login</Button>
          {errorLogin && (
            <p className={styles.errorLogin}>Incorrect email or password.</p>
          )}
          <div id={styles.signUp}>
            <p>Don’t have an account ?</p>
            <Link href="/register">Sign up</Link>
          </div>
        </form>
        <p id={styles.or}>OR</p>
        <OAuthList config={config} user={user} allServices={false} />
      </div>
    </div>
  );
};

export default Login;
