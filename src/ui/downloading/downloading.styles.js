import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    height: 150,
  },
  thumbnaiContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    width: 30,
    height: 30,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  thumbnai: {
    width: 50,
    height: '100%',
  },
  content: {
    marginLeft: 10,
  },
  ownerInfoContainer: {
    flexDirection: 'row',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 10,
  },
});
