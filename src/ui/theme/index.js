import { createTheme } from 'react-native-theming';

const themes = [
  createTheme({// light theme
    backgroundColor: '#ffffff',
    textColor: '#000000',
    activeColor: '#000000',
    inactiveColor: '#999999',
    statusBar: 'dark-content',
  }),
  createTheme({// dark theme
    backgroundColor: '#000000',
    textColor: '#ffffff',
    activeColor: '#ffffff',
    inactiveColor: '#999999',
    statusBar: 'light-content',
  }),
];
export default themes;
