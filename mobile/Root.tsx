import * as React from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import Navbar from './components/Navbar';
import IparamsNav from './Iparams';
import theme from './utils/theme';

export default function Root(params: IparamsNav) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        animated={true}
        backgroundColor={theme.White}
        barStyle="dark-content"
        showHideTransition="fade"
      />
      <Navbar
        data={params.route.params.data}
        target={params.route.params.target}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ECF0F1',
  },
});
