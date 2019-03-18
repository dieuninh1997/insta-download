import React from 'react';
import {
  View, Text, CameraRoll, Platform, Image, StyleSheet, Linking, TouchableOpacity,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import PhotoGrid from 'react-native-photo-grid';
import ImageBrowser from 'react-native-interactive-image-gallery';

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

  navigationButtonPressed({ buttonId }) {
    // will be called when "buttonOne" is clicked
    if (buttonId === 'buttonInsta') {
      // open instagram app
      Linking.openURL('instagram://explore')
        .catch(err => console.error('An error occurred', err));
    }
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
  }

  tryLoadPhotos() {
    const { loadingMore } = this.state;
    if (!loadingMore) {
      this.setState({ loadingMore: true }, () => { this.loadData(); });
    }
  }

  async loadData() {
    const { lastCursor } = this.state;
    const params = {
      first: 35,
      groupTypes: 'All',
      assetType: 'Photos',
    };
    if (Platform.OS === 'android') {
      delete params.groupTypes;// groupTypes is not supported in android
    }
    if (lastCursor) {
      params.after = lastCursor;
    }
    const res = await CameraRoll.getPhotos(params);
    this.appendAssets(res);
  }

  appendAssets(data) {
    const { assets } = this.state;
    const newAssets = data.edges;
    const newState = {
      loadingMore: false,
    };
    if (!data.page_info.has_next_page) {
      newState.noMoreData = true;
    }
    if (newAssets.length > 0) {
      newState.lastCursor = data.page_info.end_cursor;
      newState.assets = assets.concat(newAssets);
    }
    this.setState(newState);
  }

  endReached() {
    const { noMoreData } = this.state;
    if (!noMoreData) {
      this.tryLoadPhotos();
    }
  }


  renderItem(item, itemSize) {
    return (
      <TouchableOpacity
        key={item.id}
        style={{
          width: itemSize, height: itemSize, borderWidth: 1, borderColor: '#000',
        }}
        onPress={() => {
          // Do Something
        }}
      >
        <Image
          resizeMode="cover"
          style={{ flex: 1 }}
          source={{ uri: item.src }}
        />
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
});
