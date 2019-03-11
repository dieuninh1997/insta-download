import {
  StyleSheet, Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');
export default StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 55,
  },
  listAssets: {
    margin: 10,
  },
  photoContainer: {
    width: width / 3.2,
    height: width / 3,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    margin: 1,
  },
  photo: {
    flex: 1,
  },
  emptyText: {
    color: '#999999',
    fontSize: 14,
  },
});
