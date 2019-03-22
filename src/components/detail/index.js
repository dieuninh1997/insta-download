import React from 'react';
import {
  View, StyleSheet, Image, Share,
} from 'react-native';
import Video from 'react-native-video';
import { Navigation } from 'react-native-navigation';

class DetailScreen extends React.PureComponent {
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
        rightButtons: [{
          id: 'btnShare',
          icon: require('../../assets/images/icon_share.png'),
        },
        {
          id: 'btnInfo',
          icon: require('../../assets/images/icon_info.png'),
        },
        ],
      },
    };
  }

  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this); // <== Will be automatically unregistered when unmounted
  }

  // TODO: share
  async navigationButtonPressed({ buttonId }) {
    // will be called when "buttonOne" is clicked
    const { data } = this.props;
    console.log('========================================');
    console.log('data', data);
    console.log('========================================');
    switch (buttonId) {
    case 'btnShare':
      try {
        const res = await Share.share({
          message: 'test',
          url: data.node.info.path,
        });
        switch (res.action) {
        case Share.sharedAction:
          break;
        case Share.dismissedAction:
          break;
        default:
          break;
        }
      } catch (error) {
        console.log('Detail share error', error);
      }
      break;
    case 'btnInfo':
      break;
    default:
      break;
    }
  }


  render() {
    const { data } = this.props;
    const isVideo = data.node.type === 'video/mp4';

    return (
      <View style={styles.container}>
        {
          isVideo ? (
            <Video
              source={{ uri: data.node.image.uri }} // Can be a URL or a local file.
              style={styles.backgroundVideo}
              controls
            />
          ) : (
            <Image style={{ width: '100%', height: '100%' }} resizeMode="contain" source={{ uri: data.node.image.uri }} />
          )
        }
      </View>
    );
  }
}
export default DetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
