import React from 'react';
import {
  View, Text,
} from 'react-native';
import styles from './settings.styles';

class SettingsScreen extends React.PureComponent {
  static options(passProps) {
    return {
      topBar: {
        visible: true,
        animate: true, // Controls whether TopBar visibility changes should be animated
        hideOnScroll: true,
        drawBehind: false,
        title: {
          text: passProps.text,
          fontSize: 18,
          fontWeight: 'bold',
          color: '#000',
          fontFamily: 'Helvetica',
        },
        rightButtons: {
          id: 'buttonInsta',
          icon: require('../../assets/images/icon_insta.png'),
        },
      },
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Settings Screen</Text>
      </View>
    );
  }
}
export default SettingsScreen;
