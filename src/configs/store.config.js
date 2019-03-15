import { createStore } from 'redux';
import { persistStore, persistCombineReducers } from 'redux-persist';
import createEncryptor from 'redux-persist-transform-encrypt';
import storage from 'redux-persist/lib/storage';
import DeviceInfo from 'react-native-device-info';
import rootReducer from './reducers.config';

const encryptor = createEncryptor({
  secretKey: DeviceInfo.getUniqueID(),
  onError(error) {
    console.log('createEncryptor', error);
  },
});

const persistConfig = {
  key: 'root',
  storage,
  transforms: [encryptor],
};

const persistedReducer = persistCombineReducers(persistConfig, rootReducer);

const initStore = () => {
  const store = createStore(persistedReducer);
  const persistor = persistStore(store);
  return { store, persistor };
};

const { store } = initStore();

export default store;
