import { Platform, StyleSheet } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';

import { ThemeColors } from '../theme/colors';
import { useTheme } from '../theme/ThemeProvider';

export type BottomSheetRef = {
  open: () => void;
  close: () => void;
};

const BottomSheet = ({
  ref,
  children,
  height = Platform.OS === 'ios' ? 310 : 340,
  wrapperBg = 'transparent',
}: {
  ref: React.RefObject<BottomSheetRef>;
  children: React.ReactNode;
  height?: number;
  wrapperBg?: string;
}) => {
  const { themeColors } = useTheme();
  const styles = createStyles(themeColors, height, wrapperBg);
  return (
    <RBSheet
      ref={ref}
      draggable={true}
      dragOnContent={true}
      customStyles={{
        wrapper: styles.wrapper,
        container: styles.container,
        draggableIcon: styles.draggableIcon,
      }}
      customModalProps={{
        statusBarTranslucent: true,
      }}
    >
      {children}
    </RBSheet>
  );
};

const createStyles = (
  themeColors: ThemeColors,
  height: number,
  wrapperBg: string,
) => {
  return StyleSheet.create({
    container: {
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      backgroundColor: themeColors.cardBG,
      height,
      paddingTop: 11,
    },
    wrapper: {
      backgroundColor: wrapperBg,
    },
    draggableIcon: {
      width: 70,
      height: 3,
      backgroundColor: themeColors.text,
    },
  });
};

export default BottomSheet;
