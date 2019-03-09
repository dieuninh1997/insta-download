import { Navigation } from 'react-native-navigation';
import registerScreens from './src/configs/screen.config';

registerScreens();

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      component: {
        name: 'HomeScreen',
      },
    },
  });
});
