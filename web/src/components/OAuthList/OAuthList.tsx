import {
  getProviders,
  signIn,
  signOut,
  useSession,
  ClientSafeProvider,
  LiteralUnion,
} from 'next-auth/react';
import {useEffect, useState} from 'react';
import styles from './OAuthList.module.scss';
import {
  googleLoginOauth,
  getAllServices,
  getOauthList,
  loginOauth,
  logoutOauth,
} from '@/scripts/Utils';
import {FacebookOauth, GithubOauth, TodoistOauth} from '..';
import {ApiResponse, Config, Oauth, Service, User} from '@/types';

const OAuthList = ({
  config,
  user,
  allServices = false,
}: {
  config: Config;
  user: User;
  allServices: Boolean;
}): JSX.Element => {
  const {data: session}: any = useSession();
  const [error, setError] = useState<Boolean>(false);
  const [connectedOauth, setConnectedOauth] = useState<Array<string>>([]);
  const [providers, setProviders] = useState<Array<ClientSafeProvider> | null>(
    null
  );

  useEffect(() => {
    (async () => {
      const response: Record<
        LiteralUnion<string, string>,
        ClientSafeProvider
      > | null = await getProviders();
      if (response) {
        const responseProviders: Record<
          LiteralUnion<string, string>,
          ClientSafeProvider
        > = response;
        const keys: Array<string> = Object.keys(responseProviders);
        const newProviders: Array<ClientSafeProvider> = [];
        keys.forEach(key => {
          const provider: ClientSafeProvider = responseProviders[key];
          newProviders.push(provider);
        });
        setProviders(newProviders);
      }
      if (user?.id && user?.token) await findConnectedOauth();
    })();
  }, []);
  useEffect(() => {
    if (allServices) {
      (async () => {
        if (session && user.token) {
          let response: ApiResponse = {data: null, success: false};
          if (session.provider === 'google') {
            response = await googleLoginOauth(
              config.api,
              user.token,
              session.accessToken,
              session.refreshToken
            );
          } else {
            response = await loginOauth(
              config.api,
              user.token,
              session.provider,
              user.email,
              session.accessToken,
              session.refreshToken
            );
          }

          setError(!response.success);
          if (response.success) await findConnectedOauth();
        }
      })();
    }
  }, [session]);

  const getIcon = (id: string) => {
    if (!allServices) return '/icons/companies/' + id + '.png';

    if (connectedOauth.includes(id)) return '/icons/companies/' + id + '.png';

    return '/icons/companies/disconnected/' + id + '.png';
  };
  const handleClick = async (id: string) => {
    if (!connectedOauth.includes(id)) {
      signIn(id);
    } else {
      await logoutOauth(config.api, user.token, id);
      await findConnectedOauth();
      signOut();
    }
  };
  const findConnectedOauth = async () => {
    const newConnectedOauth: Array<string> = [];
    const oauthList: Array<Oauth> = await getOauthList(
      config.api,
      user.id,
      user.token
    );
    const services: Array<Service> = await getAllServices(
      config.api,
      user.token
    );
    services?.forEach(service => {
      const filteredList: Array<Oauth> = oauthList?.filter(
        oauth => oauth.service_id === service.service_id
      );
      if (filteredList?.length > 0) newConnectedOauth.push(service.name);
    });
    setConnectedOauth(newConnectedOauth);
  };

  return (
    <>
      {!allServices &&
        providers &&
        Object.values(providers).map(provider => {
          if (provider.name === 'Google') {
            return (
              <div key={provider.name} className={styles.provider}>
                <button onClick={() => signIn(provider.id)}>
                  <img src={getIcon(provider.id)} />
                  <p>Sign in with {provider.name}</p>
                </button>
              </div>
            );
          }
        })}
      {allServices && (
        <>
          {providers &&
            Object.values(providers).map(provider => (
              <div key={provider.name} className={styles.service}>
                <button
                  onClick={() => handleClick(provider.id)}
                  title={
                    connectedOauth.includes(provider.id) ? 'Logout' : 'Login'
                  }
                >
                  <img src={getIcon(provider.id)} />
                </button>
              </div>
            ))}
          <div className={styles.service}>
            <GithubOauth
              config={config}
              user={user}
              img={getIcon('github')}
              isLogged={connectedOauth.includes('github')}
              findConnectedOauth={findConnectedOauth}
            />
          </div>
          <div className={styles.service}>
            <TodoistOauth
              config={config}
              user={user}
              img={getIcon('todoist')}
              isLogged={connectedOauth.includes('todoist')}
              findConnectedOauth={findConnectedOauth}
            />
          </div>
          <div className={styles.service}>
            <FacebookOauth
              config={config}
              user={user}
              img={getIcon('facebook')}
              isLogged={connectedOauth.includes('facebook')}
              findConnectedOauth={findConnectedOauth}
            />
          </div>
        </>
      )}
      {error && (
        <p className={styles.error}>Connection problem with this service</p>
      )}
    </>
  );
};

export default OAuthList;
