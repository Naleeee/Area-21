import * as React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import theme from '../utils/theme';
import DropDownPicker from 'react-native-dropdown-picker';

const DropDownList = (props: any) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(-1);
  const [setItems] = React.useState();

  const submitting = (value: number | null) => {
    if (value >= 0) props.updator(value);
  };
  return (
    <View style={styles.Container}>
      <View style={styles.TitleView}>
        <Text style={styles.Title}>{props.title}</Text>
      </View>
      <View style={styles.DropdownView}>
        <DropDownPicker
          open={open}
          value={value}
          items={props.data}
          setOpen={setOpen}
          setValue={setValue}
          onChangeValue={submitting}
          setItems={setItems}
          autoScroll={true}
          placeholder={props.placeholder}
          style={styles.DropdownBox}
          textStyle={styles.DropdownText}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    width: 340,
    height: 70,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 5,
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
  DropdownView: {
    width: 340,
    height: 200,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    borderRadius: 10,
  },
  DropdownBox: {
    width: 340,
    height: 50,
    marginRight: 20,
    fontSize: 16,
    borderColor: theme.Purple,
    borderRadius: 10,
    backgroundColor: theme.White,
    borderWidth: 2,
  },
  DropdownText: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default DropDownList;
