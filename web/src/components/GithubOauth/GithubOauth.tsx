import axios from 'axios';
import React, {useEffect} from 'react';
import {NextRouter, useRouter} from 'next/router';
import {loginOauth, logoutOauth} from '@/scripts/Utils';
import {Config, User} from '@/types';

interface GithubOauthProps {
  config: Config;
  user: User;
  img: string;
  isLogged: boolean;
  findConnectedOauth: () => void;
}

const GithubOauth = ({
  config,
  user,
  img,
  isLogged,
  findConnectedOauth,
}: GithubOauthProps): JSX.Element => {
  const redirectUri: string =
    process.env.NEXTAUTH_URL + '/services?from=github';
  const router: NextRouter = useRouter();

  const handleLogin = async () => {
    if (!isLogged) {
      const url = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&usePKCE=false&scope=repo`;
      window.location.assign(url);
    } else {
      await logoutOauth(config.api, user.token, 'github');
      await findConnectedOauth();
    }
  };

  useEffect(() => {
    if (router.query.code && !isLogged && router.query.from === 'github') {
      (async code => {
        axios
          .get(process.env.NEXTAUTH_URL + '/api/github?code=' + code)
          .then(async response => {
            await loginOauth(
              config.api,
              user.token,
              'github',
              null,
              response.data.access_token,
              response.data.access_token
            );
            await findConnectedOauth();
          })
          .catch(err => {
            console.error(err);
          });
      })(router.query.code);
    }
  }, [router.query.code]);

  return (
    <button onClick={handleLogin}>
      <img src={img} />
    </button>
  );
};

export default GithubOauth;
