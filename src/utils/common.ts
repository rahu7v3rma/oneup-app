import { once } from 'lodash';
import moment from 'moment';
import { Platform } from 'react-native';

import { API_BASE_URL, WEBSOCKET_BASE_URL, IMAGE_BASE_URL } from './config';

const warnLocalBackend = once(() =>
  console.warn('Working with a local backend'),
);

export const COMMON = {
  get isIos() {
    return Platform.OS === 'ios';
  },
  get apiBaseUrl() {
    if (API_BASE_URL) {
      return API_BASE_URL;
    } else {
      warnLocalBackend();

      return this.isIos
        ? 'http://127.0.0.1:8000/'
        : 'http://192.168.100.16:8000/';
    }
  },
  get websocketBaseUrl() {
    if (WEBSOCKET_BASE_URL) {
      return WEBSOCKET_BASE_URL;
    } else {
      warnLocalBackend();

      return this.isIos
        ? 'http://127.0.0.1:8001/'
        : 'http://192.168.100.16:8000/';
    }
  },
  get imageBaseUrl() {
    if (IMAGE_BASE_URL) {
      return IMAGE_BASE_URL;
    } else {
      warnLocalBackend();

      return this.isIos
        ? 'http://127.0.0.1:8000'
        : 'http://192.168.100.16:8000';
    }
  },
  stringFormat(s: string, ...args: (number | string)[]) {
    return s.replace(/{([0-9]+)}/g, (match, index) =>
      (typeof args[index] === 'undefined' ? match : args[index]).toString(),
    );
  },
  dateStr(date: moment.MomentInput) {
    return moment(date).format('MMMM D, YYYY');
  },
};
