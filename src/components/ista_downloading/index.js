import React from 'react';
import {
  View, Image, Text, StyleSheet, Linking, TouchableOpacity, Clipboard, ToastAndroid, Alert, CameraRoll, Share,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import RNFetchBlob from 'rn-fetch-blob';
import * as homeAction from '../../redux/home/home.actions';

class InstaDownloading extends React.PureComponent {
  state ={
    isShowControl: false,
  }

  openUrlByInstaApp = (url) => {
    Linking.openURL(url)
      .catch(err => console.error('An error occurred', err));
  }

  onDownloadPressed=async (data) => {
    const _data = data.data;
    const imageShowUri = _data.graphql.shortcode_media.display_url;
    const imageShowName = _data.graphql.shortcode_media.shortcode;
    let edgeSidecarToChildren = [];
    if (_data.graphql.shortcode_media.edge_sidecar_to_children) {
      edgeSidecarToChildren = _data.graphql.shortcode_media.edge_sidecar_to_children.edges;
    }
    const multialImageShowUri = edgeSidecarToChildren;
    const isVideo = _data.graphql.shortcode_media.is_video;
    const videoUrl = isVideo ? _data.graphql.shortcode_media.video_url : null;

    try {
      if (multialImageShowUri.length > 0) {
        multialImageShowUri.forEach(async (item) => {
          const name = item.node.shortcode;
          const uri = item.node.is_video ? item.node.video_url : item.node.display_url;
          const fileExt = item.node.is_video ? 'mp4' : 'jpg';
          const type = item.node.is_video ? 'video' : 'photo';
          const res = await RNFetchBlob.config({
            path: `${RNFetchBlob.fs.dirs.DocumentDir}/${name}.${fileExt}`,
          }).fetch('GET', uri);

          await CameraRoll.saveToCameraRoll(res._data, type);
        });
      } else {
        const fileExt = isVideo ? 'mp4' : 'jpg';
        const type = isVideo ? 'video' : 'photo';
        const urlDownload = isVideo ? videoUrl : imageShowUri;
        const res = await RNFetchBlob.config({
          path: `${RNFetchBlob.fs.dirs.DocumentDir}/${imageShowName}.${fileExt}`,
        }).fetch('GET', urlDownload);

        await CameraRoll.saveToCameraRoll(res.data, type);
      }
      setTimeout(() => {
        ToastAndroid.show('Downloaded!', ToastAndroid.SHORT);
        PubSub.publish('download', 'downloaded');
      }, 1000);
    } catch (error) {
      console.log('error handlePressDownload', error);
    }
  }

  onDeletePressed=(item) => {
    Alert.alert(
      null,
      'Are you sure delete this post?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            const { homeActionProps } = this.props;
            homeActionProps.removeUrl(item);
          },
        },
      ],
      { cancelable: false },
    );
  }

  onSharePressed= async (item) => {
    try {
      const res = await Share.share({
        message: item.urlClipboard,
      });
      switch (res.action) {
      case Share.sharedAction:
        console.log('========================================');
        console.log('action', res.activityType);
        console.log('========================================');
        break;
      case Share.dismissedAction:
        console.log('========================================');
        console.log('dismis');
        console.log('========================================');
        break;
      default:
        break;
      }
    } catch (error) {
      console.log('========================================');
      console.log('error', error);
      console.log('========================================');
    }
  }

  onExternalPressed=(urlClipboard) => {
    Linking.openURL(urlClipboard)
      .catch(err => console.error('An error occurred', err));
  }

  onCopyHashPressed=(caption) => {
    const hashtag = this.getHashTags(caption);
    Clipboard.setString(hashtag);
    const msg = `Hashtag copied! ${hashtag}`;
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  }

  onCopyAllCaptionPressed=(caption) => {
    Clipboard.setString(caption);
    ToastAndroid.show('All caption copied!', ToastAndroid.SHORT);
  }

  onShowControlPressed=() => {
    const { isShowControl } = this.state;
    this.setState({ isShowControl: !isShowControl });
  }

   getHashTags=(inputText) => {
     const regex = /(#[^\W_][\w-]*)/gi;
     const matches = [];
     let a;
     while (a = regex.exec(inputText)) {
       matches.push(a[0]);
     }
     const res = matches.toString().replace(/,/gi, ' ');
     console.log('========================================');
     console.log('res', res);
     console.log('========================================');
     return res;
   }

   render() {
     const { item } = this.props;
     const { isShowControl } = this.state;
     const caption = item.data.graphql.shortcode_media.edge_media_to_caption && item.data.graphql.shortcode_media.edge_media_to_caption.edges.length ? item.data.graphql.shortcode_media.edge_media_to_caption.edges[0].node.text : '';
     const isVideo = item.data.graphql.shortcode_media.is_video;

     return (
       <TouchableOpacity style={styles.container} activeOpacity={0.8} onPress={() => this.onExternalPressed(item.urlClipboard)}>
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
               <TouchableOpacity style={styles.threedots} onPress={this.onShowControlPressed}>
                 <Feather name="more-vertical" style={styles.iconThreeDots} />
               </TouchableOpacity>
             </View>
           </View>
         </View>

         {isShowControl ? (
           <View style={styles.controlContainer}>
             {/* btn download */}
             <TouchableOpacity style={styles.btnControl} onPress={() => this.onDownloadPressed(item)}>
               <Feather name="download" style={styles.icon} />
             </TouchableOpacity>
             {/* btn delete */}
             <TouchableOpacity style={styles.btnControl} onPress={() => this.onDeletePressed(item)}>
               <Feather name="trash-2" style={styles.icon} />
             </TouchableOpacity>

             {/* btn share */}
             <TouchableOpacity style={styles.btnControl} onPress={() => this.onSharePressed(item)}>
               <Feather name="share-2" style={styles.icon} />
             </TouchableOpacity>

             {/* btn view on insta */}
             <TouchableOpacity style={styles.btnControl} onPress={() => this.onExternalPressed(item.urlClipboard)}>
               <Feather name="external-link" style={styles.icon} />
             </TouchableOpacity>

             {/* copy hashtag */}
             {caption ? (
               <TouchableOpacity style={styles.btnControl} onPress={() => this.onCopyHashPressed(caption)}>
                 <Feather name="hash" style={styles.icon} />
               </TouchableOpacity>
             ) : null}

             {/* copy all caption */}
             {caption ? (
               <TouchableOpacity style={styles.btnControl} onPress={() => this.onCopyAllCaptionPressed(caption)}>
                 <Feather name="copy" style={styles.icon} />
               </TouchableOpacity>
             ) : null}

           </View>
         ) : (null)}
       </TouchableOpacity>
     );
   }
}
const mapStateToProps = state => ({ downloads: state.downloads.downloads });
const mapDispatchToProps = dispatch => ({
  homeActionProps: bindActionCreators(homeAction, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(InstaDownloading);

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
