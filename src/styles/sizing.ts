import type { ViewStyle } from 'react-native';

/**
 * Sizing utility styles with Bootstrap inspired naming.
 *
 * https://getbootstrap.com/docs/5.0/utilities/sizing/
 */
export default {
  h0: {
    height: 0,
  },
  h100: {
    height: '100%',
  },
  w60: {
    width: '60%',
  },
  w80: {
    width: '80%',
  },
  w100: {
    width: '100%',
  },
  mw100: {
    maxWidth: '100%',
  },
} satisfies Record<string, ViewStyle>;
