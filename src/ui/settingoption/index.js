import React from 'react';
import {
  View, Text, StyleSheet, FlatList,
} from 'react-native';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button';

export default class InstaSettingOption extends React.PureComponent {
  state={
    themeMode: null,
  }

  onSelect(index, value) {
    this.setState({
      themeMode: value,
    });
  }

  _renderItem=({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.itemSubTitle}>{item.subTitle}</Text>
    </View>
  )


  render() {
    const {
      header, title, data, radio,
    } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.header}>{header}</Text>
        <View style={styles.themeContainer}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.options}>
            {radio ? (
              <RadioGroup
                onSelect={(index, value) => this.onSelect(index, value)}
              >
                <RadioButton value="off">
                  <Text>Off</Text>
                </RadioButton>

                <RadioButton value="auto">
                  <Text>Auto</Text>
                </RadioButton>

                <RadioButton value="on">
                  <Text>On</Text>
                </RadioButton>
              </RadioGroup>
            ) : (
              <FlatList
                data={data}
                renderItem={this._renderItem}
                keyExtractor={(item, index) => `${item}-${index}`}
              />
            )}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 14,
    color: '#37b0f2',
    fontWeight: 'bold',
  },
  themeContainer: {
    flexDirection: 'row',
  },
  title: {
    flex: 1,
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  },
  options: {
    flex: 1,
    flexDirection: 'row',
  },
  content: {

  },
  itemContainer: {
    marginTop: 20,

  },
  itemTitle: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  itemSubTitle: {
    color: '#666666',
    fontSize: 14,
  },
});
