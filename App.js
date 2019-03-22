import { Navigation } from 'react-native-navigation';
import { YellowBox } from 'react-native';
import registerScreens from './src/configs/screen.config';

YellowBox.ignoreWarnings([
  'Warning: isMounted',
  'Module RCTImageLoader',
  'Class RCTC',
  'Remote debugger',
]);

registerScreens();

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      bottomTabs: {
        options: {
          bottomTabs: {
            currentTabIndex: 1,
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
                  icon: require('./src/assets/images/icon_home.png'),
                  selectedTextColor: '#000',
                  selectedIconColor: '#000',
                  iconColor: '#999',
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
                  selectedIconColor: '#000',
                  iconColor: '#999',
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
                  selectedIconColor: '#000',
                  iconColor: '#999',
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
