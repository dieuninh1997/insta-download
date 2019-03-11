import { Navigation } from 'react-native-navigation';
import screens from '../components';

const registerScreens = () => {
  Navigation.registerComponent('insta.HomeScreen', () => screens.HomeScreen);
  Navigation.registerComponent('insta.SettingsScreen', () => screens.SettingsScreen);
  Navigation.registerComponent('insta.DownloadedScreen', () => screens.DownloadedScreen);
};

export default registerScreens;
