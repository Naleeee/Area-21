import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import Dashboard from '../screens/Dashboard';
import ManageArea from '../screens/ManageArea';
import Services from '../screens/Services';
import Account from '../screens/Account';

import theme from '../utils/theme';
import Iparams from '../Iparams';

export default function Navbar(props: Iparams) {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          if (route.name === 'Dashboard')
            iconName = focused ? 'ios-grid' : 'ios-grid-outline';
          else if (route.name === 'ManageArea')
            iconName = focused ? 'ios-create' : 'ios-create-outline';
          else if (route.name === 'Services')
            iconName = focused ? 'ios-link' : 'ios-link-outline';
          else if (route.name === 'Account')
            iconName = focused ? 'ios-person' : 'ios-person-outline';

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.DarkBlue,
        tabBarInactiveTintColor: theme.Purple,
        tabBarStyle: {backgroundColor: theme.White},
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        initialParams={{data: props.data, target: props.target}}
      />
      <Tab.Screen
        name="ManageArea"
        component={ManageArea}
        initialParams={{data: props.data, target: props.target, edit: false}}
      />
      <Tab.Screen
        name="Services"
        component={Services}
        initialParams={{
          data: props.data,
          target: props.target,
          update_id: props.update_id,
        }}
      />
      <Tab.Screen
        name="Account"
        component={Account}
        initialParams={{data: props.data, target: props.target}}
      />
    </Tab.Navigator>
  );
}
