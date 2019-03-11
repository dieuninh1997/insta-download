import React from 'react';
import {
  View, Image, Text, StyleSheet,
} from 'react-native';

export default class InstaDownloading extends React.PureComponent {
  render() {
    const { item } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.thumbnaiContainer}>
          {item.isVideo ? (
            <Image style={styles.playIcon} source={require('../../assets/images/icon_play_circled.png')} />
          ) : null}
          <Image source={{ uri: item.displayUrl }} style={styles.imageThumbnai} />
        </View>
        <View style={styles.content}>
          <View style={styles.ownerInfoContainer}>
            <Image source={{ uri: item.ownerInfo.profile_pic_url }} style={styles.avatar} />
            <Text style={styles.username}>{item.ownerInfo.username}</Text>
          </View>
          <Text style={styles.caption} numberOfLines={2}>{item.caption}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 8,
    borderRadius: 2,
    elevation: 4,
  },
  thumbnaiContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    width: 120,
    height: 120,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  imageThumbnai: {
    width: '90%',
    height: '90%',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 6,
  },
  ownerInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#999999',
  },
  username: {
    marginLeft: 10,
    fontSize: 18,
    color: '#000',
  },
  caption: {
    marginTop: 4,
    fontSize: 14,
  },
});
