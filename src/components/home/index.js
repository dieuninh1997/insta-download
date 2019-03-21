import React from 'react';
import {
  View, CameraRoll, PermissionsAndroid, Clipboard, FlatList, StyleSheet, Image, Text, Linking, Alert, RefreshControl, ScrollView,
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import Swipeout from 'react-native-swipeout';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PubSub from 'pubsub-js';
import { Navigation } from 'react-native-navigation';
import InstaDownloading from '../ista_downloading';
import { isValidateUrl } from '../../utils/validate';
import * as homeAction from '../../redux/home/home.actions';

class HomeScreen extends React.PureComponent {
  static options(passProps) {
    return {
      topBar: {
        visible: true,
        animate: true, // Controls whether TopBar visibility changes should be animated
        hideOnScroll: false,
        drawBehind: false,
        title: {
          text: passProps.text,
          fontSize: 18,
          fontWeight: 'bold',
          color: '#000',
          fontFamily: 'Helvetica',
        },
        rightButtons: {
          id: 'buttonInstaHome',
          icon: require('../../assets/images/icon_insta.png'),
        },
      },
    };
  }

  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this); // <== Will be automatically unregistered when unmounted
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'buttonInstaHome') {
      Linking.openURL('instagram://explore')
        .catch(err => console.error('An error occurred', err));
    }
  }

  state = {
    refreshing: false,
  };

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.loadData();
  }

  componentDidMount = async () => {
    this.loadData();
  }

  loadData = () => {
    this.requestExternalStoragePermission();
    this.getNewUrlFromClipboard();
    this.setState({ refreshing: false });
  }

  requestExternalStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
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
    // const urlClipboard = 'https://www.instagram.com/p/Bu3wK7ng7_w/?utm_source=ig_web_button_share_sheet';
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
      const { homeActionProps } = this.props;
      const res = await fetch(url);
      const data = await res.json();
      homeActionProps.addUrl({ url, data });
    } catch (error) {
      console.log('error handleGetDownloadLink', error);
    }
  }

  handlePressDownload = async (data) => {
    PubSub.publish('download', { message: 'isDownloading', item: data });

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
        PubSub.publish('download', 'downloaded');
      }, 1000);
    } catch (error) {
      console.log('error handlePressDownload', error);
    }
  }

  handleDelete = (item) => {
    console.log('========================================');
    console.log('item', item);
    console.log('========================================');
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

  renderItem=({ item }) => {
    const swipeoutBtnRight = [
      {
        text: 'Delete',
        component: <View style={styles.iconContainer}><Image source={require('../../assets/images/icon_trash.png')} style={styles.iconDelete} /></View>,
        onPress: () => this.handleDelete(item),
      },
      {
        text: 'Download',
        component: <View style={styles.iconContainer}><Image source={require('../../assets/images/icon_downloading.png')} style={styles.iconDownload} /></View>,
        onPress: () => this.handlePressDownload(item),
      },
    ];
    return (
      <Swipeout right={swipeoutBtnRight} backgroundColor="#ffffff" buttonWidth={40}>
        <InstaDownloading item={item} />
      </Swipeout>
    );
  }


  render() {
    const { downloads } = this.props;
    const { refreshing } = this.state;
    return (
      <ScrollView refreshControl={(
        <RefreshControl
          refreshing={refreshing}
          onRefresh={this._onRefresh}
        />
      )}
      >
        <View style={styles.container}>
          { downloads ? (
            <FlatList
              data={downloads}
              renderItem={this.renderItem}
              keyExtractor={(item, index) => `${index}`}
            />
          ) : (
            <Text>Empty </Text>
          )}


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
      </ScrollView>
    );
  }
}
const mapStateToProps = (state) => {
  console.log('========================================');
  console.log('state', state);
  console.log('state.downloads', state.downloads);
  console.log('========================================');
  return { downloads: state.downloads.downloads };
};
const mapDispatchToProps = dispatch => ({
  homeActionProps: bindActionCreators(homeAction, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iconContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconDelete: {
    width: 24,
    height: 24,
  },
  iconDownload: {
    width: 24,
    height: 24,
  },
});
