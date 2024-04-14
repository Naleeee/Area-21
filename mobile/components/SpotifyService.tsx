import {Image, Pressable, StyleSheet, View} from 'react-native';
import * as React from 'react';
import {makeRedirectUri, useAuthRequest} from 'expo-auth-session';
import axios from 'axios';
import {CLIENT_ID_SPOTIFY, SECRET_SPOTIFY} from '@env';
import theme from '../utils/theme';
import IparamsService from '../Iparams';

const SpotifyService = (props: IparamsService) => {
  const [isConnected, setConnection] = React.useState(false);
  const discovery = {
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: 'https://accounts.spotify.com/api/token',
  };
  const [, , promptAsync] = useAuthRequest(
    {
      clientId: CLIENT_ID_SPOTIFY,
      scopes: [
        'user-follow-modify',
        'user-read-email',
        'playlist-modify-public',
        'user-read-playback-state',
        'user-modify-playback-state',
      ],
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
        `http://${props.target.ip}:${props.target.port}/oauth/spotify/logout`,
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
          '[Mobile] Error - Spotify: Could not verify user connection',
          error
        );
      });
  }

  async function is_signed_in() {
    axios
      .post(
        `http://${props.target.ip}:${props.target.port}/oauth/isconnected`,
        {
          name: 'spotify',
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
          '[Mobile] Error - Spotify: Could not verify user connection',
          error
        );
      });
  }

  async function signin(token: string, refreshToken: string) {
    axios
      .post(
        `http://${props.target.ip}:${props.target.port}/oauth/spotify`,
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
        console.log('[Mobile] Error - Spotify: Login failed:', error);
      });
  }

  async function getToken(code: string) {
    const response = await axios
      .post(
        'https://accounts.spotify.com/api/token',
        {
          client_id: CLIENT_ID_SPOTIFY,
          client_secret: SECRET_SPOTIFY,
          code: code,
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
          '[Mobile] Error - Spotify: Could not receive user tokens:',
          error
        );
      });
    return {
      token: response?.data.access_token,
      refreshToken: response?.data.refresh_token,
    };
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
            source={require('../assets/companies/spotify.png')}
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
            getToken(response.params.code).then(responseToken => {
              signin(responseToken.token, responseToken.refreshToken);
            });
          });
        }}
        style={styles.Button}
      >
        <Image
          style={styles.Logo}
          source={require('../assets/companies/spotifyGrey.png')}
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

export default SpotifyService;
