import {Text, View, ScrollView} from 'react-native';
import Header from '../components/Header';
import Area from '../components/Area';
import axios from 'axios';
import React, {useState, useEffect} from 'react';
import {useFocusEffect} from '@react-navigation/native';

import theme from '../utils/theme';
import IparamsNav from '../Iparams';

function AreaList({
  areaData,
  data,
  ip,
  port,
  navigation,
  ondelete,
}: {
  areaData: {title: string; area_id: number}[];
  data: string;
  ip: string;
  port: string;
  ondelete: Function;
}) {
  return (
    <View style={{flex: 8}}>
      {areaData &&
        areaData.map((item: {title: string; area_id: number}) => (
          <Area
            title={item.title}
            id={item.area_id}
            data={data}
            key={item.area_id}
            ip={ip}
            port={port}
            navigation={navigation}
            ondelete={ondelete}
          />
        ))}
    </View>
  );
}

export default function App(params: IparamsNav) {
  const [data] = useState(params.route.params.data.token);
  const [areaData, setAreaData] = useState(null);
  const [hasError, setErrorFlag] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const fetchAreas = async () => {
    axios
      .get(
        `http://${params.route.params.target.ip}:${params.route.params.target.port}/dashboard/userid/${params.route.params.data.user_id}`,
        {
          headers: {
            Authorization: `Bearer ${params.route.params.data.token}`,
          },
        }
      )
      .then(async response => {
        if (response.status === 200) {
          setAreaData(response.data);
          return;
        } else {
          throw new Error('Failed to fetch areas');
        }
      })
      .catch(error => {
        console.log('[Mobile] Error - Could not receive areas:', error);
        setErrorFlag(true);
      });
  };

  useEffect(() => {
    const intervalID = setInterval(() => {
      fetchAreas();
      return;
    }, 5000);
    return () => clearInterval(intervalID);
  }, []);

  useEffect(() => {
    fetchAreas();
    setRefresh(false);
  }, [refresh]);

  useFocusEffect(() => {
    setRefresh(true);
  });

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
        <Header title="Dashboard" />
      </View>
      <View style={{flex: 8}}>
        <ScrollView>
          <View>
            {!hasError && (
              <AreaList
                areaData={areaData}
                data={data}
                ip={params.route.params.target.ip}
                port={params.route.params.target.port}
                navigation={params.navigation}
                ondelete={setRefresh}
              />
            )}
          </View>
          <View>{hasError && <Text> An error has occurred </Text>}</View>
        </ScrollView>
      </View>
    </View>
  );
}
