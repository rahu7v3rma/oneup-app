import * as Keychain from 'react-native-keychain';

import { resetStore } from '../store';

export const setAuthToken = (token: string) => {
  return Keychain.setGenericPassword('token', token);
};

export const getAuthToken = (): Promise<string | null> => {
  return Keychain.getGenericPassword().then((credentials) =>
    credentials === false ? null : credentials.password,
  );
};

export const AUTHORIZATION_HEADER_NAME = 'X-Authorization';

export const getAuthorizationHeaderValue = () => {
  return getAuthToken()
    .then((authToken) => constructAuthorizationHeaderValue(authToken))
    .catch(() => undefined);
};

export const constructAuthorizationHeaderValue = (token: string | null) =>
  `Token ${token || ''}`;

const resetAuthToken = () => {
  return Keychain.resetGenericPassword();
};

export const logoutAction = async () => {
  await resetAuthToken();
  await resetStore();
};
