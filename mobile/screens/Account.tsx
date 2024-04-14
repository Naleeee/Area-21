import {Text, View, Alert, StyleSheet, Pressable} from 'react-native';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';

import theme from '../utils/theme';
import axios from 'axios';
import {useState} from 'react';
import IparamsNav from '../Iparams';

export default function Account(params: IparamsNav) {
  const [password, setPassword] = useState('');
  const [passwordChanged, setPasswordChanged] = useState(false);

  const updatePassword = async () => {
    axios
      .put(
        `http://${params.route.params.target.ip}:${params.route.params.target.port}/users/updatepassword`,
        {
          password: password,
        },
        {
          headers: {
            Authorization: `Bearer ${params.route.params.data.token}`,
          },
        }
      )
      .then(async () => {
        Alert.alert('Password changed successfully');
        setPasswordChanged(true);
      })
      .catch(error => {
        console.log('[Mobile] Error - Could not update password:', error);
        return false;
      });
    return false;
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.White,
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}
    >
      <View style={{flex: 2}}>
        <Header title="Account" />
      </View>
      <View
        style={{
          flex: 8,
          alignItems: 'center',
          justifyContent: 'flex-start',
          marginTop: 5,
        }}
      >
        <Input
          title="Set new password"
          placeholder="Current password"
          updator={setPassword}
          secureTextEntry={true}
        />
        {passwordChanged && (
          <Text style={{marginTop: 10}}>Password successfully updated</Text>
        )}
        <Button title="Confirm" onPress={updatePassword} />
        <View style={styles.ButtonView}>
          <Pressable
            style={styles.Button}
            onPress={() => params.navigation.navigate('Login')}
          >
            <Text style={styles.ButtonTitle}>Disconnect</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ButtonView: {
    width: 340,
    height: 50,
    backgroundColor: '#FF5600',
    borderRadius: 30,
    marginTop: 10,
    marginBottom: 10,
  },
  Button: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ButtonTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: theme.White,
  },
});
