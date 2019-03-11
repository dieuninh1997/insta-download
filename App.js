import { Navigation } from 'react-native-navigation';
import registerScreens from './src/configs/screen.config';

registerScreens();

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      bottomTabs: {
        options: {
          bottomTabs: {
            currentTabIndex: 0,
          },
        },
        children: [
          {
            stack: {
              children: [
                {
                  component: {
                    id: 'home',
                    name: 'insta.HomeScreen',
                    passProps: {
                      text: 'Home',
                    },
                  },
                },
              ],
              options: {
                bottomTab: {
                  text: 'Home',
                  icon: require('./src/assets/images/icon_new.png'),
                  selectedTextColor: '#000',
                  textColor: '#999',
                  fontFamily: 'Helvetica',
                },
              },
            },
          },
          {
            stack: {
              children: [
                {
                  component: {
                    id: 'album',
                    name: 'insta.AlbumScreen',
                    passProps: {
                      text: 'Album',
                    },
                  },
                },
              ],
              options: {
                bottomTab: {
                  text: 'Album',
                  icon: require('./src/assets/images/icon_picture.png'),
                  selectedTextColor: '#000',
                  textColor: '#999',
                  fontFamily: 'Helvetica',
                },
              },
            },
          },
          {
            stack: {
              children: [
                {
                  component: {
                    id: 'settings',
                    name: 'insta.SettingsScreen',
                    passProps: {
                      text: 'Settings',
                    },
                  },
                },
              ],
              options: {
                bottomTab: {
                  text: 'Settings',
                  icon: require('./src/assets/images/icon_settings.png'),
                  selectedTextColor: '#000',
                  textColor: '#999',
                  fontFamily: 'Helvetica',
                },
              },
            },
          },
        ],
      },
    },
  });
});
