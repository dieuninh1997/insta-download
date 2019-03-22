import React from 'react';
import {
  View, Image, Text, StyleSheet, Linking, TouchableOpacity,
} from 'react-native';
import Spinner from 'react-native-spinkit';
import Feather from 'react-native-vector-icons/Feather';

export default class InstaDownloading extends React.PureComponent {
  openUrlByInstaApp = (url) => {
    console.log('========================================');
    console.log('url', url);
    console.log('========================================');
    Linking.openURL(url)
      .catch(err => console.error('An error occurred', err));
  }

  state ={
    isDownloading: false,
    isShowControl: false,
  }

  componentDidMount() {
    PubSub.subscribe('download', this.subscribeDownloading);
  }


  subscribeDownloading= (msg, data) => {
    console.log('========================================');
    console.log('data', data);
    console.log('========================================');
    const { item } = this.props;
    if (data.message === 'isDownloading' && data.item.data.graphql.shortcode_media.id === item.data.graphql.shortcode_media.id) {
      this.setState({ isDownloading: true });
    } else {
      this.setState({ isDownloading: false });
    }
  };

  onDownloadPressed=() => {

  }

  onDeletePressed=() => {}

  onSharePressed=() => {}

  onExternalPressed=() => {}

  onCopyHashPressed=() => {}

  onCopyAllCaptionPressed=() => {}

  onShowControlPressed=() => {
    const { isShowControl } = this.state;
    this.setState({ isShowControl: !isShowControl });
  }

  render() {
    const { item } = this.props;
    const { isDownloading, isShowControl } = this.state;
    const caption = item.data.graphql.shortcode_media.edge_media_to_caption && item.data.graphql.shortcode_media.edge_media_to_caption.edges.length ? item.data.graphql.shortcode_media.edge_media_to_caption.edges[0].node.text : '';
    const isVideo = item.data.graphql.shortcode_media.is_video;
    return (
      <View style={styles.container}>
        <View style={styles.infoContainer}>
          <View style={styles.thumbnaiContainer}>
            <Image source={{ uri: item.data.graphql.shortcode_media.display_url }} style={styles.imageThumbnai} />
            {isVideo ? (
              <Image style={styles.playIcon} resizeMode="cover" source={require('../../assets/images/icon_play_circled.png')} />
            ) : null}
          </View>
          <View style={styles.content}>
            <View style={styles.ownerInfoContainer}>
              <Image source={{ uri: item.data.graphql.shortcode_media.owner.profile_pic_url }} style={styles.avatar} />
              <Text style={styles.username}>{item.data.graphql.shortcode_media.owner.username}</Text>
            </View>
            <View style={styles.captionContainer}>
              <Text style={styles.caption} numberOfLines={2}>{caption}</Text>
            </View>


            <View style={styles.controlView}>
              {isDownloading ? (
                <View style={style.downloadingContainer}>
                  <Spinner style={{ marginTop: 20 }} isVisible size={10} type="9CubeGrid" color="#37b0f2" />
                  <Spinner style={{ marginTop: 20 }} isVisible size={10} type="9CubeGrid" color="#37b0f2" />
                  <Spinner style={{ marginTop: 20 }} isVisible size={10} type="9CubeGrid" color="#37b0f2" />
                </View>
              ) : (null)}
              <TouchableOpacity style={styles.threedots} onPress={this.onShowControlPressed}>
                <Feather name="more-vertical" style={styles.iconThreeDots} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {isShowControl ? (
          <View style={styles.controlContainer}>
            {/* btn download */}
            <TouchableOpacity style={styles.btnControl} onPress={this.onDownloadPressed}>
              <Feather name="download" style={styles.icon} />
            </TouchableOpacity>
            {/* btn delete */}
            <TouchableOpacity style={styles.btnControl} onPress={this.onDeletePressed}>
              <Feather name="trash-2" style={styles.icon} />
            </TouchableOpacity>

            {/* btn share */}
            <TouchableOpacity style={styles.btnControl} onPress={this.onSharePressed}>
              <Feather name="share-2" style={styles.icon} />
            </TouchableOpacity>

            {/* btn view on insta */}
            <TouchableOpacity style={styles.btnControl} onPress={this.onExternalPressed}>
              <Feather name="external-link" style={styles.icon} />
            </TouchableOpacity>

            {/* copy hashtag */}
            {caption ? (
              <TouchableOpacity style={styles.btnControl} onPress={this.onCopyHashPressed}>
                <Feather name="hash" style={styles.icon} />
              </TouchableOpacity>
            ) : null}

            {/* copy all caption */}
            {caption ? (
              <TouchableOpacity style={styles.btnControl} onPress={this.onCopyAllCaptionPressed}>
                <Feather name="copy" style={styles.icon} />
              </TouchableOpacity>
            ) : null}

          </View>
        ) : (null)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    marginVertical: 4,
    borderRadius: 2,
    elevation: 4,
  },
  infoContainer: {
    flexDirection: 'row',
  },
  thumbnaiContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    width: 50,
    height: 50,
    position: 'absolute',
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
  captionContainer: {
    flexDirection: 'row',
  },
  caption: {
    marginTop: 4,
    fontSize: 14,
    flexWrap: 'wrap',
    flex: 1,
  },
  controlView: {
    flexDirection: 'row',
    height: 30,
    marginTop: 10,
    alignItems: 'center',
  },
  controlContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnControl: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 25,
    height: 25,
    borderRadius: 15,
    backgroundColor: '#37b0f2',
    marginLeft: 20,
  },
  icon: {
    fontSize: 16,
    color: '#ffffff',
  },
  iconThreeDots: {
    fontSize: 16,
    color: '#000000',
  },
  threedots: {
    flex: 1,
    alignItems: 'flex-end',
  },
  downloadingContainer: {
    flexDirection: 'row',
    flex: 1,
  },
});
