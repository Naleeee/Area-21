import {Image, Pressable, StyleSheet, View} from 'react-native';
import * as React from 'react';
import {makeRedirectUri, useAuthRequest} from 'expo-auth-session';
import axios from 'axios';
import {CLIENT_ID_GITHUB, SECRET_GITHUB} from '@env';
import theme from '../utils/theme';
import IparamsService from '../Iparams';

const GithubService = (props: IparamsService) => {
  const [isConnected, setConnection] = React.useState(false);
  const discovery = {
    authorizationEndpoint: 'https://github.com/login/oauth/authorize',
    tokenEndpoint: 'https://github.com/login/oauth/access_token',
    revocationEndpoint: `https://github.com/settings/connections/applications/${CLIENT_ID_GITHUB}`,
  };
  const [, , promptAsync] = useAuthRequest(
    {
      clientId: CLIENT_ID_GITHUB,
      scopes: ['repo', 'project'],
      usePKCE: false,
      redirectUri: makeRedirectUri({
        scheme: 'Area21',
        useProxy: true,
      }),
      extraParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
    discovery
  );

  async function logout() {
    axios
      .get(
        `http://${props.target.ip}:${props.target.port}/oauth/github/logout`,
        {
          headers: {
            Authorization: `Bearer ${props.data.token}`,
          },
        }
      )
      .then(async () => {
        console.log('github disconnected');
        setConnection(false);
      })
      .catch(error => {
        console.log(
          '[Mobile] Error - GitHub: Could not verify user connection',
          error
        );
      });
  }

  async function is_signed_in() {
    axios
      .post(
        `http://${props.target.ip}:${props.target.port}/oauth/isconnected`,
        {
          name: 'github',
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
          '[Mobile] Error - GitHub: Could not verify user connection',
          error
        );
      });
  }

  async function getToken(code: string) {
    const response = await axios
      .post(
        'https://github.com/login/oauth/access_token',
        {
          client_id: CLIENT_ID_GITHUB,
          client_secret: SECRET_GITHUB,
          code: code,
          redirectUri: makeRedirectUri({
            scheme: 'Area21',
            useProxy: true,
          }),
        },
        {
          headers: {
            'content-type': 'application/json',
          },
        }
      )
      .catch(error => {
        console.log(
          '[Mobile] Error - GitHub : Could not receive user tokens:',
          error
        );
      });
    return {
      token: response?.data.split(/[=&]+/)[1],
      refresh_token: response?.data.split(/[=&]+/)[5],
    };
  }

  async function signIn(token: string) {
    axios
      .post(
        `http://${props.target.ip}:${props.target.port}/oauth/github`,
        {
          token: token.token,
          refresh_token: token.refresh_token,
        },
        {
          headers: {
            Authorization: `Bearer ${props.data.token}`,
            'content-type': 'application/json',
          },
        }
      )
      .then(async () => {
        is_signed_in();
      })
      .catch(error => {
        console.log('[Mobile] Error - GitHub: errorin failed:', error);
      });
  }

  is_signed_in();
  if (isConnected) {
    return (
      <View style={styles.Provider}>
        <Pressable
          onPress={() => {
            logout();
          }}
          style={styles.Button}
        >
          <Image
            style={styles.Logo}
            source={require('../assets/companies/github.png')}
          />
        </Pressable>
      </View>
    );
  }
  return (
    <View style={styles.Provider}>
      <Pressable
        onPress={() => {
          promptAsync({useProxy: true}).then(response => {
            getToken(response.params.code).then(token => {
              signIn(token);
            });
          });
        }}
        style={styles.Button}
      >
        <Image
          style={styles.Logo}
          source={require('../assets/companies/githubGrey.png')}
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
  },
  Button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    padding: 10,
    backgroundColor: theme.Grey,
    elevation: 5,
  },
  Logo: {
    resizeMode: 'contain',
    width: 120,
    height: 120,
  },
});

export default GithubService;
