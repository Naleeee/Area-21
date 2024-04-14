import axios from 'axios';
import React, {useEffect} from 'react';
import {NextRouter, useRouter} from 'next/router';
import {loginOauth, logoutOauth} from '@/scripts/Utils';
import {Config, User} from '@/types';

interface FacebookOauthProps {
  config: Config;
  user: User;
  img: string;
  isLogged: boolean;
  findConnectedOauth: () => void;
}

const FacebookOauth = ({
  config,
  user,
  img,
  isLogged,
  findConnectedOauth,
}: FacebookOauthProps): JSX.Element => {
  const redirectUri: string =
    process.env.NEXTAUTH_URL + '/services?from=facebook';
  const router: NextRouter = useRouter();

  const handleLogin = async () => {
    if (!isLogged) {
      const url = `https://www.facebook.com/v16.0/dialog/oauth?client_id=${process.env.FACEBOOK_CLIENT_ID}&redirect_uri=${redirectUri}&usePKCE=false&scope=pages_show_list,user_friends,pages_read_engagement,pages_manage_metadata,pages_read_user_content,pages_manage_ads,pages_manage_posts,pages_manage_engagement`;
      window.location.assign(url);
    } else {
      await logoutOauth(config.api, user.token, 'facebook');
      await findConnectedOauth();
    }
  };

  useEffect(() => {
    if (router.query.code && !isLogged && router.query.from === 'facebook') {
      (async code => {
        axios
          .get(process.env.NEXTAUTH_URL + '/api/facebook?code=' + code)
          .then(async response => {
            await loginOauth(
              config.api,
              user.token,
              'facebook',
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

export default FacebookOauth;
