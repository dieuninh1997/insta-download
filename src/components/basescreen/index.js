import React from 'react';
import {
  View, Text, StyleSheet, Linking,
} from 'react-native';

class BaseScreen extends React.PureComponent {
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

  navigationButtonPressed({ buttonId }) {
    // will be called when "buttonOne" is clicked
    if (buttonId === 'buttonInsta') {
      // open instagram app
      Linking.openURL('instagram://explore');
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Base screen</Text>
      </View>
    );
  }
}
export default BaseScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
