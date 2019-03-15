import _ from 'lodash';
import * as types from './home.types';

const initialState = {
  downloads: [],
};
export default function init(state = initialState, action) {
  switch (action.type) {
  case types.ADD_URL:
    return { ...state, downloads: [...state.downloads, action.payload.data] };
  case types.REMOVE_URL:
    return { ...state, downloads: _.filter(state.downloads, item => item !== action.payload.data) };
  default:
    return state;
  }
}