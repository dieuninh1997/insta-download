import { Navigation } from 'react-native-navigation';
import registerScreens from './src/configs/screen.config';

registerScreens();

Navigation.events().registerAppLaunchedListener(() => {
//   Navigation.setRoot({
//     root: {
//       stack: {
//         children: [{
//           component: {
//             name: 'insta.HomeScreen',
//           },
//         }],
//       },
//     },
//   });


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
                      text: 'Downloading',
                    },
                  },
                },
              ],
              options: {
                bottomTab: {
                  text: 'home',
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
                    name: 'insta.DownloadedScreen',
                    passProps: {
                      text: 'Recent Downloaded',
                    },
                  },
                },
              ],
              options: {
                bottomTab: {
                  text: 'album',
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
                  text: 'settings',
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
