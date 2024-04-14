import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardTypeOptions,
} from 'react-native';

import theme from '../utils/theme';

export default function Input(props: {
  title: string;
  updator: Function;
  mode: KeyboardTypeOptions | undefined;
  placeholder: string | undefined;
  secureTextEntry: boolean;
}) {
  const [data, setData] = React.useState('');

  const submitting = () => {
    props.updator(data);
  };

  if (props.title !== null) {
    return (
      <View style={styles.Container}>
        <View style={styles.TitleView}>
          <Text style={styles.Title}>{props.title}</Text>
        </View>
        <View style={styles.InputView}>
          <TextInput
            style={styles.Input}
            keyboardType={props.mode}
            onChangeText={(value: string) => setData(value)}
            onEndEditing={submitting}
            placeholder={props.placeholder}
            placeholderTextColor={theme.DarkBlue}
            secureTextEntry={props.secureTextEntry}
          />
        </View>
      </View>
    );
  }
  return (
    <View style={styles.OnlyInput}>
      <View style={styles.InputView}>
        <TextInput
          style={styles.Input}
          keyboardType={props.mode}
          onChangeText={(value: string) => setData(value)}
          onEndEditing={submitting}
          placeholder={props.placeholder}
          placeholderTextColor={theme.DarkBlue}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  Container: {
    width: 340,
    height: 70,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  OnlyInput: {
    width: 340,
    height: 70,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  TitleView: {
    height: 20,
    justifyContent: 'flex-start',
  },
  Title: {
    fontWeight: '500',
    fontSize: 16,
    color: theme.DarkBlue,
  },
  InputView: {
    width: 340,
    height: 50,
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: theme.White,
    borderRadius: 10,
    borderColor: theme.Purple,
    borderWidth: 2,
  },
  Input: {
    width: 340,
    height: 50,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 5,
    marginBottom: 5,
    fontSize: 16,
  },
});
