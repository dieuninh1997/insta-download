import React from 'react';
import {
  View, Text, CameraRoll, Platform, Image, StyleSheet, Linking, TouchableOpacity,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import PhotoGrid from 'react-native-photo-grid';
import PubSub from 'pubsub-js';

class AlbumScreen extends React.PureComponent {
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
          id: 'buttonInsta',
          icon: require('../../assets/images/icon_insta.png'),
        },
      },
    };
  }

  state={
    assets: [],
    lastCursor: null,
    noMoreData: false,
    loadingMore: false,

  }

  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this); // <== Will be automatically unregistered when unmounted
  }

  componentDidMount() {
    this.tryLoadPhotos();

    PubSub.subscribe('download', () => {
      console.log('========================================');
      console.log('reload ablbum');
      console.log('========================================');
      this.loadData();
    });
  }

  navigationButtonPressed({ buttonId }) {
    // will be called when "buttonOne" is clicked
    if (buttonId === 'buttonInsta') {
      // open instagram app
      Linking.openURL('instagram://explore')
        .catch(err => console.error('An error occurred', err));
    }
  }

  tryLoadPhotos() {
    const { loadingMore } = this.state;
    if (!loadingMore) {
      this.setState({ loadingMore: true }, () => { this.loadData(); });
    }
  }

  async loadData() {
    const { lastCursor } = this.state;
    const paramsPhotos = {
      first: 35,
      groupTypes: 'All',
      assetType: 'Photos',
      groupName: 'DCIM',
    };
    const paramsVideos = {
      first: 35,
      groupTypes: 'All',
      assetType: 'Videos',
      groupName: 'DCIM',
    };
    if (Platform.OS === 'android') {
      delete paramsPhotos.groupTypes;// groupTypes is not supported in android
      delete paramsVideos.groupTypes;// groupTypes is not supported in android
    }
    if (lastCursor) {
      paramsPhotos.after = lastCursor;
      paramsVideos.after = lastCursor;
    }
    const resPhotos = await CameraRoll.getPhotos(paramsPhotos);
    const resVideos = await CameraRoll.getPhotos(paramsVideos);

    this.appendAssets({ resPhotos, resVideos });
  }

  appendAssets(data) {
    const newAssetsPhotos = data.resPhotos.edges;
    const newAssetsVideos = data.resVideos.edges;
    const newState = {
      loadingMorePhotos: false,
      loadingMoreVideos: false,
    };
    if (!data.resPhotos.page_info.has_next_page || !data.resVideos.page_info.has_next_page) {
      newState.noMoreData = true;
    }
    if (newAssetsPhotos.length > 0 || newAssetsVideos.length > 0) {
      newState.lastCursorPhotos = data.resPhotos.page_info.end_cursor;
      newState.lastCursorVideos = data.resVideos.page_info.end_cursor;
      newState.assets = newAssetsPhotos.concat(newAssetsVideos);
    }
    this.setState(newState);
  }

  endReached() {
    const { noMoreData } = this.state;
    if (!noMoreData) {
      this.tryLoadPhotos();
    }
  }

  goToDetailPhotoOrVideo = (item) => {
    const isVide = item.node.type === 'video/mp4';
    Navigation.push(this.props.componentId, {
      component: {
        id: 'detail',
        name: 'insta.DetailScreen',
        passProps: {
          text: isVide ? 'Photo' : 'Video',
          data: item,
        },
        options: {
          bottomTabs: {
            visible: false,
            drawBehind: true,
            animate: true,
          },
        },
      },
    });
  }

  renderItem =(item, itemSize) => {
    const isVideo = item.node.type === 'video/mp4';
    return (
      <TouchableOpacity
        key={item.node.image.uri}
        style={{
          width: itemSize, height: itemSize, borderWidth: 1, borderColor: '#000',
        }}
        onPress={() => this.goToDetailPhotoOrVideo(item)}
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        >
          <Image
            resizeMode="cover"
            style={{ width: itemSize, height: itemSize }}
            source={{ uri: item.node.image.uri }}
          />
          {isVideo ? (
            <Image style={styles.playIcon} resizeMode="cover" source={require('../../assets/images/icon_play_circled.png')} />
          ) : null}
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const { assets } = this.state;
    return (
      <View style={styles.container}>
        {assets.length ? (
          <PhotoGrid
            data={assets}
            itemsPerRow={3}
            itemMargin={1}
            renderItem={this.renderItem}
          />
        ) : (
          <Text style={styles.emptyText}>Empty</Text>
        )}
      </View>
    );
  }
}
export default AlbumScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listAssets: {
    margin: 10,
  },
  photo: {
    flex: 1,
  },
  emptyText: {
    color: '#999999',
    fontSize: 14,
  },

  playIcon: {
    width: 50,
    height: 50,
    position: 'absolute',
  },
});
