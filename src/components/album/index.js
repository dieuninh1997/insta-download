import React from 'react';
import {
  View, Text, CameraRoll, Platform, FlatList, Image, StyleSheet, Dimensions,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import BaseScreen from '../basescreen';

class AlbumScreen extends BaseScreen {
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

  renderItem = ({ item }) => {
    if (!item) {
      return (
        <View style={styles.photoContainer}>
          <Image resizeMode="contain" source={require('../../assets/images/icon_bubble.png')} style={styles.photo} />
        </View>
      );
    }
    return (
      <View style={styles.photoContainer}>
        <Image resizeMode="contain" source={{ uri: item.node.image.uri }} style={{ width: 50, height: 50 }} />
      </View>
    );
  }


  render() {
    const { assets } = this.state;
    return (
      <View style={styles.container}>
        {assets.length ? (
          <FlatList
            style={styles.listAssets}
            data={assets}
            numColumns={3}
            keyExtractor={(item, index) => `${item}-${index}`}
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

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listAssets: {
    margin: 10,
  },
  photoContainer: {
    width: width / 3.2,
    height: width / 3,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    margin: 1,
  },
  photo: {
    flex: 1,
  },
  emptyText: {
    color: '#999999',
    fontSize: 14,
  },
});
