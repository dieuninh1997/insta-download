import React from 'react';
import {
  View, CameraRoll, PermissionsAndroid, Clipboard, FlatList, StyleSheet,
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import InstaDownloading from '../downloading';
import { isValidateUrl } from '../../utils/validate';

class HomeScreen extends React.PureComponent {
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

  state={
    downloads: [],
    imageShowUri: null,
    videoUrl: null,
    isVideo: false,
    imageShowName: 'img_insta',
    // isDownloading: false,
    multialImageShowUri: [],
  }


  componentDidMount = async () => {
    this.loadData();
  }

  loadData = () => {
    this.requestExternalStoragePermission();
    this.getNewUrlFromClipboard();
  }

  requestExternalStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'My App Storage Permission',
          message: 'My App needs access to your storage '
            + 'so you can save your photos',
        },
      );
      return granted;
    } catch (err) {
      console.error('Failed to request permission ', err);
      return null;
    }
  };


  getNewUrlFromClipboard = async () => {
    // const urlClipboard = await Clipboard.getString();
    const urlClipboard = 'https://www.instagram.com/p/Bu2wmmFnaAS/?utm_source=ig_share_sheet&igshid=wcck81sk0gzg';
    if (isValidateUrl(urlClipboard)) {
      const url = urlClipboard.split('?utm_source=')[0];
      const newUrl = `${url}?__a=1`;
      this.handleGetDownloadLink(newUrl);
      return true;
    }
    // TODO: show toast error
  }

  handleGetDownloadLink = async (url) => {
    try {
      const { downloads } = this.state;
      const res = await fetch(url);
      const data = await res.json();
      const displayUrl = data.graphql.shortcode_media.display_url;
      const shortCode = data.graphql.shortcode_media.shortcode;
      const havingCaption = data.graphql.shortcode_media.edge_media_to_caption;
      let caption = '';
      if (havingCaption.edges.length > 0) {
        caption = havingCaption.edges[0].node.text;
      }
      const isVideo = data.graphql.shortcode_media.is_video;
      const ownerInfo = data.graphql.shortcode_media.owner;
      const itemDownload = {
        caption,
        displayUrl,
        isVideo,
        ownerInfo,
      };
      let edgeSidecarToChildren = [];
      if (data.graphql.shortcode_media.edge_sidecar_to_children) {
        edgeSidecarToChildren = data.graphql.shortcode_media.edge_sidecar_to_children.edges;
      }
      await this.setState({
        imageShowUri: displayUrl,
        imageShowName: shortCode,
        multialImageShowUri: edgeSidecarToChildren,
        downloads: [...downloads, itemDownload],
      });
    } catch (error) {
      console.log('error handleGetDownloadLink', error);
    }
  }

  handlePressDownload = async () => {
    const {
      imageShowUri, imageShowName, multialImageShowUri, isVideo, videoUrl,
    } = this.state;


    try {
      // this.setState({ isDownloading: true });
      if (multialImageShowUri.length > 0) {
        multialImageShowUri.forEach(async (item) => {
          const name = item.node.shortcode;
          const uri = item.node.is_video ? item.node.video_url : item.node.display_url;
          const fileExt = item.node.is_video ? 'mp4' : 'jpg';
          const type = item.node.is_video ? 'video' : 'photo';
          const res = await RNFetchBlob.config({
            path: `${RNFetchBlob.fs.dirs.DocumentDir}/${name}.${fileExt}`,
          }).fetch('GET', uri);

          await CameraRoll.saveToCameraRoll(res.data, type);
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
      // setTimeout(() => {
      //   this.setState({ isDownloading: false });
      // }, 2000);
    } catch (error) {
      // this.setState({ isDownloading: false });
      console.log('error handlePressDownload', error);
    }
  }

  renderItem=({ item }) => (
    <InstaDownloading item={item} />
  )


  render() {
    const { downloads } = this.state;

    return (
      <View style={styles.container}>
        <FlatList
          data={downloads}
          renderItem={this.renderItem}
        />


        {/* <Image
          style={{ width: 300, height: 300 }}
          source={{ uri: imageShowUri }}
        />
        <TouchableOpacity
          onPress={this.handlePressDownload}
          style={{
            backgroundColor: 'blue', width: 100, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 20,
          }}
        >
          <Text style={{ color: '#ffffff', fontSize: 16 }}>Download</Text>
        </TouchableOpacity>
        {isDownloading ? <InstaLoading /> : null} */}
      </View>
    );
  }
}
export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
