import { Navigation } from 'react-native-navigation';
import screens from '../components';

const registerScreens = () => {
  Navigation.registerComponent('insta.HomeScreen', () => screens.HomeScreen);
  Navigation.registerComponent('insta.SettingsScreen', () => screens.SettingsScreen);
  Navigation.registerComponent('insta.AlbumScreen', () => screens.AlbumScreen);
};

export default registerScreens;
