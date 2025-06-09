import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ThemeColors } from '../../theme/colors';
import { Fonts } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';

import { GameStatus } from './Team';

type ActionButtonsProps = {
  status: GameStatus;
  onBetPress: () => void;
  onChatPress: () => void;
};

const ActionButtons = ({
  status,
  onChatPress,
  onBetPress,
}: ActionButtonsProps) => {
  const theme = useTheme();

  const styles = getStyles(theme.themeColors);
  return (
    <View style={styles.buttonsContainer}>
      {status === 'before' && (
        <TouchableOpacity
          style={[styles.betButton, styles.commonButton]}
          onPress={onBetPress}
        >
          <Text style={[styles.betButtonText, styles.commonButtonText]}>
            Bet on Game
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.chatButton, styles.commonButton]}
        onPress={onChatPress}
      >
        <Text style={[styles.chatButtonText, styles.commonButtonText]}>
          Game Chat
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const getStyles = (themeColor: ThemeColors) =>
  StyleSheet.create({
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginTop: 10,
      gap: 10,
    },
    commonButton: {
      flex: 1,
      flexDirection: 'row',
      verticalAlign: 'middle',
      justifyContent: 'center',
      paddingVertical: 19,
      paddingHorizontal: 20,
      borderRadius: 10,
      borderWidth: 2,
    },
    betButton: {
      backgroundColor: themeColor.btnBG,
    },
    betButtonText: {
      color: themeColor.text,
    },
    chatButton: {
      borderColor: themeColor.btnBG,
    },
    chatButtonText: {
      color: themeColor.btnBG,
    },
    commonButtonText: {
      fontFamily: Fonts.WorkSansSemiBold,
      fontSize: 15,
      textAlign: 'center',
    },
  });

export { ActionButtons };
