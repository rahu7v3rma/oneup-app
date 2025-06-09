import moment from 'moment';
import { Platform } from 'react-native';

import { API_BASE_URL } from './config';

export const COMMON = {
  get isIos() {
    return Platform.OS === 'ios';
  },
  get apiBaseUrl() {
    if (API_BASE_URL) {
      return API_BASE_URL;
    } else {
      return this.isIos
        ? 'http://127.0.0.1:8000/'
        : 'http://192.168.1.40:8000/';
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
