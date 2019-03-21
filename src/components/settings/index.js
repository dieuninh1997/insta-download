import React from 'react';
import {
  View, Text, StyleSheet, Linking, Dimensions, TouchableOpacity,
} from 'react-native';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button';
import { Navigation } from 'react-native-navigation';

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

  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this); // <== Will be automatically unregistered when unmounted
  }

  navigationButtonPressed({ buttonId }) {
    // will be called when "buttonOne" is clicked
    if (buttonId === 'buttonInsta') {
      // open instagram app
      Linking.openURL('instagram://explore');
    }
  }

  state={
    themeMode: null,
  }

  onSelect(index, value) {
    this.setState({
      themeMode: value,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Theme</Text>
        {/* theme mode */}
        <View style={styles.themeContainer}>
          <Text style={styles.title}>Night mode</Text>
          <RadioGroup
            style={styles.optionsContainer}
            onSelect={(index, value) => this.onSelect(index, value)}
            size={15}
          >
            <RadioButton value="off" style={styles.radioBtn}>
              <Text>Off</Text>
            </RadioButton>

            <RadioButton value="auto" style={styles.radioBtn}>
              <Text>Auto</Text>
            </RadioButton>

            <RadioButton value="on" style={styles.radioBtn}>
              <Text>On</Text>
            </RadioButton>
          </RadioGroup>
        </View>
        {/* about */}
        <Text style={styles.header}>About</Text>
        {/* version */}
        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.itemTitle}>Version</Text>
          <Text style={styles.itemSubTitle}>1.0.0</Text>
        </TouchableOpacity>

        {/* send feedback */}
        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.itemTitle}>Send feedback</Text>
          <Text style={styles.itemSubTitle}>Please send use feedbacks or question about InstaDownload</Text>
        </TouchableOpacity>

        {/* Rate the app */}
        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.itemTitle}>Rate the app</Text>
          <Text style={styles.itemSubTitle}>Help me and share the app to your friends</Text>
        </TouchableOpacity>

        {/* Change logs */}
        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.itemTitle}>Change logs</Text>
          <Text style={styles.itemSubTitle}>Infomation about versions</Text>
        </TouchableOpacity>

      </View>
    );
  }
}
export default SettingsScreen;
const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  themeContainer: {
    flexDirection: 'row',
    width,
    alignItems: 'center',
  },
  title: {
    flex: 3,
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  },
  optionsContainer: {
    flex: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  header: {
    fontSize: 14,
    color: '#37b0f2',
    fontWeight: 'bold',
    marginTop: 10,
  },
  itemTitle: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
  itemSubTitle: {
    color: '#999999',
    fontSize: 12,
    marginBottom: 20,
  },
  radioBtn: {
    alignItems: 'center',
  },
});
