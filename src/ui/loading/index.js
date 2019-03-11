import React from 'react';
import { View } from 'react-native';
import Modal from 'react-native-modal';
import Spinner from 'react-native-spinkit';

export default class InstaLoading extends React.PureComponent {
  render() {
    return (
      <Modal
        animationIn="fadeIn"
        animationOut="fadeOut"
        backdropOpacity="0.5"
        isVisible
        avoidKeyboard
        useNativeDriver
        transparent
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'transparent',
        }}
        >
          <Spinner style={{ marginBottom: 50 }} isVisible size={50} type="Circle" color="#37b0f2" />
        </View>
      </Modal>
    );
  }
}
