import type { ViewStyle } from 'react-native';

/**
 * Positioning utilities for absolute-positioned components.
 * Everything is a multiple of 4 to coincide with the spacing utilities.
 */
export default {
  pRelative: {
    position: 'relative',
  },
  pAbsolute: {
    position: 'absolute',
  },
} satisfies Record<string, ViewStyle>;
