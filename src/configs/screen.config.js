import { Navigation } from 'react-native-navigation';
import screens from '../components';

const registerScreens = () => {
  Navigation.registerComponent('HomeScreen', () => screens.HomeScreen);
  Navigation.registerComponent('TodoScreen', () => screens.TodoScreen);
};

export default registerScreens;
