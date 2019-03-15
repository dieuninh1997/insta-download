import * as types from './home.types';

export const addUrl = (data, callback) => ({
  type: types.ADD_URL,
  payload: { data, callback },
});
export const removeUrl = (data, callback) => ({
  type: types.REMOVE_URL,
  payload: { data, callback },
});
export const downloadUrl = (data, callback) => ({
  type: types.DOWNLOAD_URL,
  payload: { data, callback },
});
