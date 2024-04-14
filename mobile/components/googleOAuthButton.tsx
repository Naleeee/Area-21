import {Image, Pressable} from 'react-native';
import ShakeEventExpo from '../components/Shaker';
import * as React from 'react';
import * as Google from 'expo-auth-session/providers/google';
import {makeRedirectUri} from 'expo-auth-session';
import axios from 'axios';
import {CLIENT_ID_GOOGLE, SECRET_GOOGLE} from '@env';

const GoogleOAuthButton = (props: {
  ip: string;
  port: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigation: any;
}) => {
  const [, , promptAsync] = Google.useAuthRequest({
    expoClientId: CLIENT_ID_GOOGLE,
    iosClientId: CLIENT_ID_GOOGLE,
    androidClientId: CLIENT_ID_GOOGLE,
    webClientId: CLIENT_ID_GOOGLE,
    usePKCE: false,
    scopes: ['email https://mail.google.com/'],
    responseType: 'code',
    shouldAutoExchangeCode: false,
    extraParams: {
      access_type: 'offline',
      prompt: 'consent',
    },
    redirectUri: makeRedirectUri({
      scheme: 'Area21',
      useProxy: true,
    }),
  });

  function login(email: string, token: string, refreshToken: string) {
    axios
      .post(
        `http://${props.ip}:${props.port}/oauth/google`,
        {
          email: email,
          token: token,
          refresh_token: refreshToken,
        },
        {
          headers: {
            'content-type': 'application/json',
          },
        }
      )
      .then(async response => {
        ShakeEventExpo.removeListener();
        props.navigation.navigate('Root', {
          data: Object.freeze({
            token: JSON.stringify(response.data.token).replace(/['"]+/g, ''),
            user_id: JSON.stringify(response.data.user_id).replace(
              /['"]+/g,
              ''
            ),
          }),
        });
      })
      .catch(error => {
        console.log('[Mobile] Error - Google: OAuth login failed:', error);
      });
  }

  async function getEmail(token: string) {
    const response = await axios
      .get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      .catch(error => {
        console.log(
          '[Mobile] Error - Google: Could not receive user email:',
          error
        );
      });
    return response?.data.email;
  }

  async function getToken(code: string | undefined) {
    const response = await axios
      .post(
        'https://oauth2.googleapis.com/token',
        {
          code: code,
          client_id: CLIENT_ID_GOOGLE,
          client_secret: SECRET_GOOGLE,
          redirect_uri: makeRedirectUri({
            scheme: 'Area21',
            useProxy: true,
          }),
          grant_type: 'authorization_code',
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )
      .catch(error => {
        console.log(
          '[Mobile] Error - Google: Could not receive user tokens:',
          error
        );
        return {token: '', refresh_token: ''};
      });
    return {
      token: response.data.access_token,
      refresh_token: response.data.refresh_token,
    };
  }

  return (
    <Pressable
      onPress={() => {
        promptAsync().then(response => {
          if (response.type === 'success') {
            getToken(response.params.code).then(
              (responseToken: {token: string; refresh_token: string}) => {
                getEmail(responseToken.token).then(email => {
                  login(
                    email,
                    responseToken.token,
                    responseToken.refresh_token
                  );
                });
              }
            );
          }
        });
      }}
    >
      <Image
        style={{resizeMode: 'contain'}}
        source={require('../assets/google-signin-button.png')}
      />
    </Pressable>
  );
};

export default GoogleOAuthButton;
