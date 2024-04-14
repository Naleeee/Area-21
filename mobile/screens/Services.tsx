import {View} from 'react-native';
import Header from '../components/Header';
import GithubService from '../components/GithubService';
import SpotifyService from '../components/SpotifyService';
import FacebookService from '../components/FacebookService';
import ToDoIstService from '../components/ToDoIstService';
import GoogleService from '../components/GoogleService';

import theme from '../utils/theme';
import IparamsNav from '../Iparams';

export default function Services(params: IparamsNav) {
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
        <Header title="Services" />
      </View>
      <View
        style={{
          marginLeft: '10%',
          flex: 8,
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
        }}
      >
        <GithubService
          data={params.route.params.data}
          navigation={params.navigation}
          target={params.route.params.target}
        />
        <SpotifyService
          data={params.route.params.data}
          navigation={params.navigation}
          target={params.route.params.target}
        />
        <FacebookService
          data={params.route.params.data}
          navigation={params.navigation}
          target={params.route.params.target}
        />
        <GoogleService
          data={params.route.params.data}
          navigation={params.navigation}
          target={params.route.params.target}
        />
        <ToDoIstService
          data={params.route.params.data}
          navigation={params.navigation}
          target={params.route.params.target}
        />
      </View>
    </View>
  );
}
