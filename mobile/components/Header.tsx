import React from 'react';
import {View, Text, Image, StyleSheet, Dimensions} from 'react-native';

import theme from '../utils/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function Header(props: {title: string}) {
  return (
    <View style={styles.Container}>
      <Image style={styles.Logo} source={require('../assets/AreaLogo.png')} />
      <Text style={styles.HeaderText}>{props.title}</Text>
      <View style={styles.VerticleLine} />
    </View>
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: theme.White,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: SCREEN_WIDTH,
  },
  HeaderText: {
    fontWeight: '500',
    fontSize: 30,
    color: theme.DarkBlue,
  },
  Logo: {
    resizeMode: 'contain',
    width: 60,
    height: 60,
  },
  VerticleLine: {
    width: '90%',
    height: 2,
    backgroundColor: theme.DarkBlue,
    marginTop: 5,
    marginBottom: 10,
  },
});
