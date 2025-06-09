import IonIcon from '@react-native-vector-icons/ionicons';
import { TouchableOpacity } from 'react-native';

import { useThemeStyles } from '../theme/ThemeStylesProvider';

type BackButtonProps = Record<string, never>;

export default function BackButton({}: BackButtonProps) {
  const styles = useThemeStyles();

  return (
    <TouchableOpacity
      style={[
        styles.backButton,
        styles.justifyContentCenter,
        styles.alignItemsCenter,
      ]}
    >
      <IonIcon
        name="chevron-back-outline"
        size={12.02}
        style={styles.themeTextColor}
      />
    </TouchableOpacity>
  );
}
