import React from 'react';
import {
  View, Text, TouchableOpacity, Image, ScrollView, CameraRoll, PermissionsAndroid, Clipboard,
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import { InstaLoading } from '../../ui';
import { isValidateUrl } from '../../utils/validate';
import styles from './home.styles';

class HomeScreen extends React.PureComponent {
  state={
    imageShowUri: null,
    videoUrl: null,
    isVideo: false,
    imageShowName: 'img_insta',
    multialImageShowUri: [],
    isDownloading: false,
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
    const urlClipboard = await Clipboard.getString();
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
      const res = await fetch(url);
      const data = await res.json();
      const displayUrl = data.graphql.shortcode_media.display_url;
      const shortCode = data.graphql.shortcode_media.shortcode;
      let edgeSidecarToChildren = [];
      if (data.graphql.shortcode_media.edge_sidecar_to_children) {
        edgeSidecarToChildren = data.graphql.shortcode_media.edge_sidecar_to_children.edges;
      }
      this.setState({ imageShowUri: displayUrl, imageShowName: shortCode, multialImageShowUri: edgeSidecarToChildren });
    } catch (error) {
      console.log('error handleGetDownloadLink', error);
    }
  }

  handlePressDownload = async () => {
    const {
      imageShowUri, imageShowName, multialImageShowUri, isVideo, videoUrl,
    } = this.state;


    try {
      this.setState({ isDownloading: true });
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
      setTimeout(() => {
        this.setState({ isDownloading: false });
      }, 2000);
    } catch (error) {
      this.setState({ isDownloading: false });
      console.log('error handlePressDownload', error);
    }
  }

  render() {
    const { imageShowUri, isDownloading } = this.state;
    return (
      <ScrollView>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Image
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
          {isDownloading ? <InstaLoading /> : null}
        </View>
      </ScrollView>
    );
  }
}
export default HomeScreen;
