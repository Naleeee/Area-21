import React from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';

import theme from '../utils/theme';

export default function Button(props: {onPress(): void; title: string}) {
  return (
    <View style={styles.ButtonView}>
      <Pressable style={styles.Button} onPress={props.onPress}>
        <Text style={styles.ButtonTitle}>{props.title}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  ButtonView: {
    width: 340,
    height: 50,
    backgroundColor: theme.Purple,
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
