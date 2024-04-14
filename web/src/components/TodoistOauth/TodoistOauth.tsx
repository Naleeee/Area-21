import axios from 'axios';
import React, {useEffect} from 'react';
import {NextRouter, useRouter} from 'next/router';
import {loginOauth, logoutOauth} from '@/scripts/Utils';
import {Config, User} from '@/types';

interface TodoistOauthProps {
  config: Config;
  user: User;
  img: string;
  isLogged: boolean;
  findConnectedOauth: () => void;
}

const TodoistOauth = ({
  config,
  user,
  img,
  isLogged,
  findConnectedOauth,
}: TodoistOauthProps) => {
  const redirectUri: string = process.env.NEXTAUTH_URL + '/services';
  const router: NextRouter = useRouter();

  const handleLogin = async () => {
    if (!isLogged) {
      const url = `https://todoist.com/oauth/authorize?client_id=${process.env.TODOIST_CLIENT_ID}&redirect_uri=${redirectUri}&scope=data:read_write`;
      window.location.assign(url);
    } else {
      await logoutOauth(config.api, user.token, 'todoist');
      await findConnectedOauth();
    }
  };

  useEffect(() => {
    if (router.query.code && !isLogged && !router.query.from) {
      (async (code: string | Array<string>) => {
        const data: {
          client_id: string | undefined;
          client_secret: string | undefined;
          redirect_uri: string;
          code: string | Array<string>;
          grant_type: string;
        } = {
          client_id: process.env.TODOIST_CLIENT_ID,
          client_secret: process.env.TODOIST_CLIENT_SECRET,
          redirect_uri: redirectUri,
          code: code,
          grant_type: 'authorization_code',
        };

        axios
          .post('https://todoist.com/oauth/access_token', data)
          .then(async response => {
            await loginOauth(
              config.api,
              user.token,
              'todoist',
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

export default TodoistOauth;
