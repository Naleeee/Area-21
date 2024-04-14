import * as React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import Input from './components/Input';
import Button from './components/Button';

import theme from './utils/theme';
import IparamsNav from './Iparams';

export default function Admin(params: IparamsNav) {
  const [ip, setIp] = React.useState('0.0.0.0');
  const [port, setPort] = React.useState('9999');
  const updateIp = (newIp: string) => {
    setIp(newIp);
  };
  const updatePort = (newPort: string) => {
    setPort(newPort);
  };

  const submitting = () => {
    params.navigation.navigate('Login', {
      params: {target: {ip: ip, port: port}},
    });
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
          <Text
            style={{fontSize: 48, fontWeight: '500', color: theme.DarkBlue}}
          >
            Admin page
          </Text>
        </View>
        <View style={styles.LogInView}>
          <Input
            title="Ip"
            placeholder="10.10.10.10"
            updator={updateIp}
            hide={false}
            secureTextEntry={false}
          />
          <Input
            title="Port"
            placeholder="9999"
            updator={updatePort}
            hide={false}
            secureTextEntry={false}
          />
          <Button title="Save" onPress={submitting} />
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
  LogInView: {
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
