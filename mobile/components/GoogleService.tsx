import {Image, Pressable, StyleSheet, View} from 'react-native';
import * as React from 'react';
import * as Google from 'expo-auth-session/providers/google';
import {makeRedirectUri} from 'expo-auth-session';
import axios from 'axios';
import {CLIENT_ID_GOOGLE, SECRET_GOOGLE} from '@env';
import theme from '../utils/theme';
import IparamsService from '../Iparams';

const GoogleService = (props: IparamsService) => {
  const [isConnected, setConnection] = React.useState(false);

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

  async function is_signed_in() {
    axios
      .post(
        `http://${props.target.ip}:${props.target.port}/oauth/isconnected`,
        {
          name: 'google',
        },
        {
          headers: {
            Authorization: `Bearer ${props.data.token}`,
          },
        }
      )
      .then(async response => {
        if (response.data.message !== 'Is connected') setConnection(false);
        else setConnection(true);
      })
      .catch(error => {
        console.log(
          '[Mobile] Error - Google: Could not verify user connection',
          error
        );
      });
  }

  function login(token: string, refreshToken: string) {
    axios
      .post(
        `http://${props.target.ip}:${props.target.port}/oauth/google/alreadyLoggedIn`,
        {
          token: token,
          refresh_token: refreshToken,
        },
        {
          headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${props.data.token}`,
          },
        }
      )
      .then(async () => {
        is_signed_in();
      })
      .catch(error => {
        console.log('[Mobile] Error - Google: OAuth login failed:', error);
      });
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

  is_signed_in();
  if (isConnected) {
    return (
      <View style={styles.Provider}>
        <Pressable
          onPress={() => {
            promptAsync().then(response => {
              getToken(response.params.code).then(responseToken => {
                login(responseToken.token, responseToken.refresh_token);
              });
            });
          }}
          style={styles.Button}
        >
          <Image
            style={styles.Logo}
            source={require('../assets/companies/google.png')}
          />
        </Pressable>
      </View>
    );
  }
  return (
    <View style={styles.Provider}>
      <Pressable
        onPress={() => {
          promptAsync().then(response => {
            getToken(response.params.code).then(responseToken => {
              login(responseToken.token, responseToken.refresh_token);
            });
          });
        }}
        style={styles.Button}
      >
        <Image
          style={styles.Logo}
          source={require('../assets/companies/googleGrey.png')}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  Provider: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    height: 150,
    elevation: 5,
  },
  Button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    padding: 10,
    backgroundColor: theme.Grey,
  },
  Logo: {
    resizeMode: 'contain',
    width: 120,
    height: 120,
  },
});

export default GoogleService;
