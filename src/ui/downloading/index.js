import React from 'react';
import { View, Image, Text } from 'react-native';
import styles from './downloading.styles';

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
