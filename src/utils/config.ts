import { Platform } from 'react-native';
import config from 'react-native-config';

export const API_BASE_URL =
  Platform.OS === 'ios' ? config.IOS_BASE_URL : config.ANDROID_BASE_URL;
