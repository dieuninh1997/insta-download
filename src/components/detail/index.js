import React from 'react';
import {
  View, Text, StyleSheet, Image,
} from 'react-native';
import Video from 'react-native-video';

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
      },
    };
  }

  render() {
    const { data } = this.props;
    const isVideo = data.node.type === 'video/mp4';
    console.log('========================================');
    console.log('data', data);
    console.log('========================================');
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
