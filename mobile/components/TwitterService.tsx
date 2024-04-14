import {Image, Pressable} from 'react-native';
import * as React from 'react';

const TwitterService = () => {
  return (
    <Pressable>
      <Image
        style={{resizeMode: 'contain'}}
        source={require('../assets/TwitterLogo.png')}
      />
    </Pressable>
  );
};

export default TwitterService;
