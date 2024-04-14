import {Image, Pressable, StyleSheet, View} from 'react-native';
import * as React from 'react';
import {makeRedirectUri, useAuthRequest} from 'expo-auth-session';
import axios from 'axios';
import {CLIENT_ID_TODOIST, SECRET_TODOIST} from '@env';
import theme from '../utils/theme';
import IparamsService from '../Iparams';

const ToDoIstService = (props: IparamsService) => {
  const [isConnected, setConnection] = React.useState(false);
  const discovery = {
    authorizationEndpoint: 'https://todoist.com/oauth/authorize',
    tokenEndpoint: 'https://todoist.com/oauth/access_token',
    revocationEndpoint: 'https://api.todoist.com/sync/v9/access_tokens/revoke',
  };
  const [, , promptAsync] = useAuthRequest(
    {
      clientId: CLIENT_ID_TODOIST,
      scopes: ['data:read_write'],
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
        `http://${props.target.ip}:${props.target.port}/oauth/todoist/logout`,
        {
          headers: {
            Authorization: `Bearer ${props.data.token}`,
          },
        }
      )
      .then(async () => {
        setConnection(false);
      })
      .catch(error => {
        console.log(
          '[Mobile] Error - Todoist: Could not verify user connection',
          error
        );
      });
  }

  async function is_signed_in() {
    axios
      .post(
        `http://${props.target.ip}:${props.target.port}/oauth/isconnected`,
        {
          name: 'todoist',
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
          '[Mobile] Error - Todoist: Could not verify user connection',
          error
        );
      });
  }

  async function getToken(code: string | undefined) {
    const response_token = await axios
      .post(
        'https://todoist.com/oauth/access_token',
        {
          client_id: CLIENT_ID_TODOIST,
          client_secret: SECRET_TODOIST,
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
          '[Mobile] Error - ToDoIst: Could not receive user tokens:',
          error
        );
        return '';
      });
    return response_token.data.access_token;
  }

  async function signin(token: string) {
    axios
      .post(
        `http://${props.target.ip}:${props.target.port}/oauth/todoist`,
        {
          token: token,
          refresh_token: token,
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
        console.log('[Mobile] Error - Todoist: Login failed:', error);
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
            source={require('../assets/companies/todoist.png')}
          />
        </Pressable>
      </View>
    );
  }
  return (
    <View style={styles.Provider}>
      <Pressable
        onPress={() => {
          promptAsync({useProxy: true})
            .then(response => {
              if (response.type === 'success') {
                getToken(response.params.code).then(response_token => {
                  signin(response_token);
                });
              }
            })
            .catch(response => {
              console.log(response);
            });
        }}
        style={styles.Button}
      >
        <Image
          style={styles.Logo}
          source={require('../assets/companies/todoistGrey.png')}
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

export default ToDoIstService;
