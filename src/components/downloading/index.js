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
          <Image source={{ uri: item.displayUrl }} style={styles.thumbnai} />
        </View>
        <View style={styles.content}>
          <View style={styles.ownerInfoContainer}>
            <Image source={{ uri: item.ownerInfo.profile_pic_url }} style={styles.avatar} />
            <Text style={styles.username}>{item.ownerInfo.username}</Text>
          </View>
          <Text style={styles.caption} numberOfLines={2} ellipsizeMode="tail">{item.caption}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 8,
    width: '100%',
    borderRadius: 10,
    elevation: 4,
    paddingHorizontal: 4,
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
  thumbnai: {
    width: '100%',
    height: '100%',
  },
  content: {
    paddingLeft: 10,
  },
  ownerInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderColor: '#999999',
    borderWidth: 1,
  },
  username: {
    marginLeft: 10,
  },
});
