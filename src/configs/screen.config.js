import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';
import screens from '../components';
import store from './store.config';

const registerScreens = () => {
  Navigation.registerComponentWithRedux('insta.HomeScreen', () => screens.HomeScreen, Provider, store);
  Navigation.registerComponentWithRedux('insta.SettingsScreen', () => screens.SettingsScreen, Provider, store);
  Navigation.registerComponentWithRedux('insta.AlbumScreen', () => screens.AlbumScreen, Provider, store);
  Navigation.registerComponentWithRedux('insta.DetailScreen', () => screens.DetailScreen, Provider, store);
};

export default registerScreens;
