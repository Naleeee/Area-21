import * as React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import Input from './components/Input';
import Button from './components/Button';
import ShakeEventExpo from './components/Shaker';
import axios from 'axios';
import theme from './utils/theme';
import IparamsNav from './Iparams';

export default function Register(params: IparamsNav) {
  const [username, setUsername] = React.useState('Username');
  const [password, setPassword] = React.useState('Password');
  const updateUsername = (newUsername: string) => {
    setUsername(newUsername);
  };
  const updatePassword = (newPassword: string) => {
    setPassword(newPassword);
  };

  React.useEffect(() => {
    ShakeEventExpo.addListener(() => {
      params.navigation.navigate('Admin');
    });
  }, []);

  const EmailChecker = (email: string, password: string) => {
    const regex = /^[^\s@]+@[^\s@]+.[^\s@]+$/;

    if (!regex.test(email)) {
      console.error('Invalid mail format');
      return;
    }
    Register(email, password);
  };

  const Register = (email: string, password: string) => {
    axios
      .post(
        `http://${params.route.params.target.ip}:${params.route.params.target.port}/users/register`,
        {
          email: email,
          password: password,
        },
        {
          headers: {
            'content-type': 'application/json',
          },
        }
      )
      .then(async response => {
        const user_id = JSON.stringify(response.data.user_id).replace(
          /['"]+/g,
          ''
        );
        const token = JSON.stringify(response.data.token).replace(/['"]+/g, '');
        const ip = params.route.params.target.ip;
        const port = params.route.params.target.port;
        ShakeEventExpo.removeListener();
        params.navigation.navigate('Root', {
          target: {ip: ip, port: port},
          data: {token: token, user_id: user_id},
        });
        return true;
      })
      .catch(() => {
        console.error('Invalid email or password');
        return false;
      });
    return true;
  };

  return (
    <View>
      <LinearGradient
        style={styles.Background}
        colors={[theme.BlueLogIn, theme.PurpleLogIn]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
      >
        <View style={styles.Header}>
          <Image
            style={{width: 130, height: 130, resizeMode: 'contain'}}
            source={require('./assets/AreaLogo.png')}
          />
          <Text
            style={{fontSize: 48, fontWeight: '500', color: theme.DarkBlue}}
          >
            Area 21
          </Text>
        </View>
        <View style={styles.RegisterView}>
          <Input
            title="Email"
            mode="email-address"
            placeholder=""
            updator={updateUsername}
            hide={false}
            secureTextEntry={false}
          />
          <Input
            title="Password"
            placeholder=""
            updator={updatePassword}
            hide={true}
            secureTextEntry={true}
          />
          <View style={{height: 20}} />
          <Button
            title="Register"
            onPress={() => {
              EmailChecker(username, password);
            }}
          />
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  Background: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  Header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 140,
  },
  RegisterView: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  OAuthView: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
