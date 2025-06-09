import type { ViewStyle } from 'react-native';

/**
 * Spacing utility styles with Bootstrap inspired naming.
 * All styles should be incremented by units of 4.
 *
 * https://getbootstrap.com/docs/5.0/utilities/spacing
 */

export default {
  br0: { borderRadius: 0 },
  br5: { borderRadius: 5 },
  br10: { borderRadius: 10 },
  br15: { borderRadius: 15 },
  br20: { borderRadius: 20 },
  br25: { borderRadius: 25 },
  br30: { borderRadius: 30 },
  br35: { borderRadius: 35 },
  br40: { borderRadius: 40 },
  br45: { borderRadius: 45 },
  br50: { borderRadius: 50 },
} satisfies Record<string, ViewStyle>;
