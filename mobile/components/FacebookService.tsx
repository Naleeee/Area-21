import {Image, Pressable, StyleSheet, View} from 'react-native';
import * as React from 'react';
import * as Facebook from 'expo-auth-session/providers/facebook';
import axios from 'axios';
import {CLIENT_ID_FACEBOOK} from '@env';
import {makeRedirectUri} from 'expo-auth-session';
import theme from '../utils/theme';
import IparamsService from '../Iparams';

const FacebookService = (props: IparamsService) => {
  const [isConnected, setConnection] = React.useState(false);
  const [, , promptAsync] = Facebook.useAuthRequest({
    clientId: CLIENT_ID_FACEBOOK,
    extraParams: {
      access_type: 'offline',
      prompt: 'consent',
    },
    scopes: [
      'pages_show_list',
      'user_friends',
      'pages_read_engagement',
      'pages_manage_metadata',
      'pages_read_user_content',
      'pages_manage_ads',
      'pages_manage_posts',
      'pages_manage_engagement',
    ],
    redirectUri: makeRedirectUri({
      scheme: 'Area21',
      useProxy: true,
    }),
  });

  async function logout() {
    axios
      .get(
        `http://${props.target.ip}:${props.target.port}/oauth/facebook/logout`,
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
          '[Mobile] Error - Facebook: Could not verify user connection',
          error
        );
      });
  }

  async function is_signed_in() {
    axios
      .post(
        `http://${props.target.ip}:${props.target.port}/oauth/isconnected`,
        {
          name: 'Facebook',
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
          '[Mobile] Error - Facebook: Could not verify user connection',
          error
        );
      });
  }

  async function signIn(token: string) {
    axios
      .post(
        `http://${props.target.ip}:${props.target.port}/oauth/facebook/`,
        {
          token: token,
          refresh_token: token,
        },
        {
          headers: {
            Authorization: `Bearer ${props.data.token}`,
            'content-type': 'application/json',
          },
        }
      )
      .then(() => is_signed_in())
      .catch(error => {
        console.log('[Mobile] Error - Facebook: Login failed:', error);
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
            source={require('../assets/companies/facebook.png')}
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
            signIn(response?.params.access_token);
          });
        }}
        style={styles.Button}
      >
        <Image
          style={styles.Logo}
          source={require('../assets/companies/facebookGrey.png')}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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

export default FacebookService;
