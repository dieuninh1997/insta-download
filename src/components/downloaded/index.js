import React from 'react';
import {
  View, Text, CameraRoll, Platform, FlatList, Image, Linking,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import styles from './downloaded.styles';

class DownloadedScreen extends React.PureComponent {
  static options(passProps) {
    return {
      topBar: {
        visible: true,
        animate: true, // Controls whether TopBar visibility changes should be animated
        hideOnScroll: true,
        drawBehind: true,
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
  }

  navigationButtonPressed({ buttonId }) {
    // will be called when "buttonOne" is clicked
    if (buttonId === 'buttonInsta') {
      // open instagram app
      Linking.openURL('instagram://explore');
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
    console.log('========================================');
    console.log('ress', res);
    console.log('========================================');
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
        <Image resizeMode="contain" source={{ uri: item.node.image.uri }} style={styles.photo} />
      </View>
    );
  }


  render() {
    const { assets } = this.state;
    console.log('========================================');
    console.log('assets', assets);
    console.log('========================================');
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
export default DownloadedScreen;
