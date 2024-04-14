import axios from 'axios';
import React from 'react';
import {View, StyleSheet, TouchableOpacity, Image, Text} from 'react-native';

import theme from '../utils/theme';

export default function Area(props: {
  id: string;
  title: string;
  port: string;
  ip: string;
  data: {user_id: string; token: string};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigation: any;
  ondelete: Function;
}) {
  const DeleteArea = () => {
    axios
      .delete(`http://${props.ip}:${props.port}/dashboard/` + props.id, {
        headers: {
          Authorization: `Bearer ${props.data}`,
        },
      })
      .then(() => {
        props.ondelete(true);
        console.log(`[Mobile] Area ${props.id} successfully deleted`);
      })
      .catch(error => {
        console.log('[Mobile] Error - Could not delete area:', error);
      });
  };

  const EditArea = () => {
    axios
      .get(`http://${props.ip}:${props.port}/dashboard/` + props.id, {
        headers: {
          Authorization: `Bearer ${props.data}`,
        },
      })
      .then(response => {
        props.navigation.navigate('ManageArea', {
          edit: true,
          areaId: response.data.area_id,
          areaTitle: response.data.title,
          actionId: response.data.action_id,
          reactionId: response.data.reaction_id,
        });
      })
      .catch(error => {
        console.log('[Mobile] Error - Could not edit area:', error);
      });
  };

  return (
    <View style={styles.AreaCard}>
      <View style={styles.TitleCard}>
        <Text style={styles.Title}>{props.title}</Text>
      </View>
      <View>
        <TouchableOpacity onPress={EditArea}>
          <Image style={styles.Icon} source={require('../assets/edit.png')} />
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity onPress={DeleteArea}>
          <Image style={styles.Icon} source={require('../assets/trash.png')} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  AreaCard: {
    width: 340,
    height: 130,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.Purple,
    borderRadius: 15,
    shadowColor: theme.DarkBlue,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 5,
  },
  TitleCard: {
    height: 90,
    width: 190,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  Title: {
    fontWeight: '500',
    fontSize: 20,
    color: theme.White,
  },
  Icon: {
    margin: 10,
    width: 40,
    height: 40,
  },
});
