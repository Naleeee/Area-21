import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Login from './Login';
import Register from './Register';
import Root from './Root';
import Admin from './Admin';
import {PORT, BASE_URL} from '@env';

const Stack = createNativeStackNavigator();

export default function App() {
  const target = {target: {ip: BASE_URL, port: PORT}};
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="Login"
      >
        <Stack.Screen name="Login" component={Login} initialParams={target} />
        <Stack.Screen
          name="Register"
          component={Register}
          initialParams={target}
        />
        <Stack.Screen name="Root" component={Root} initialParams={target} />
        <Stack.Screen name="Admin" component={Admin} initialParams={target} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
