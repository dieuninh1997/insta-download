import React from 'react';
import {
  View, Text, StyleSheet,
} from 'react-native';
import BaseScreen from '../basescreen';

class SettingsScreen extends BaseScreen {
  render() {
    return (
      <View style={styles.container}>
        <Text>Settings Screen</Text>
      </View>
    );
  }
}
export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
