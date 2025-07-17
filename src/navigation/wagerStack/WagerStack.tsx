import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Platform, ActivityIndicator, View, StyleSheet } from 'react-native';
import { ThemeColors } from 'theme/colors';

import InviteToPlay from '../../pages/inviteToPlay';
import MLBPage from '../../screens/MLBPage';
import PlayPage from '../../screens/PlayPage';
import PlayTypePage from '../../screens/PlayTypePage';
import { useTheme } from '../../theme/ThemeProvider';
import BuyCoins from '../../pages/buyCoins/BuyCoins';
import { useThemeStyles } from '../../theme/ThemeStylesProvider';

const Stack = createNativeStackNavigator();

// Restricted US states
const RESTRICTED_STATES = [
  'HI',
  'ID',
  'LA',
  'MI',
  'MT',
  'NV',
  'NY',
  'TN',
  'WA',
];

const WagerStack = () => {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);
  const theme = useTheme();
  const styles = getStyles(theme.themeColors);

  const [isLoading, setIsLoading] = useState(true);
  const themeStyles = useThemeStyles();
  const checkLocationAndSetRoute = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        'https://api.bigdatacloud.net/data/reverse-geocode-client',
      );
      const data = await response.json();

      // Check if it's in the USA
      if (data.countryCode !== 'US') {
        setInitialRoute('NotAllowed');
        return;
      }

      // Get state code (remove 'US-' prefix if present)
      const stateCode =
        data.principalSubdivisionCode?.replace('US-', '') || null;

      // If in restricted state, go to NotAllowed
      if (stateCode && RESTRICTED_STATES.includes(stateCode)) {
        setInitialRoute('NotAllowed');
      } else {
        // User is in allowed US state
        setInitialRoute('MLB');
      }
    } catch (error) {
      console.error('Failed to fetch location data:', error);
      // Default to NotAllowed if we can't determine location
      setInitialRoute('NotAllowed');
    }finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkLocationAndSetRoute();
  }, []);

  if (!initialRoute) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={theme.themeColors.gray1} />
      </View>
    );
  }
    if (isLoading) {
      return (
        <View
          style={[
            themeStyles.flex1,
            themeStyles.appBG,
            themeStyles.justifyContentCenter,
          ]}
        >
          <ActivityIndicator size="large" />
        </View>
      );
    }
  

  
  return (
    <Stack.Navigator
      initialRouteName={"MLB"}
      screenOptions={{
        headerShown: false,
        animation: Platform.OS === 'android' ? 'none' : 'fade',
      }}
    >
      <Stack.Screen name="MLB" component={MLBPage} />
      <Stack.Screen name="NotAllowed" component={PlayPage} />
      <Stack.Screen name="PlayType" component={PlayTypePage} />
      <Stack.Screen name="InviteToPlay" component={InviteToPlay} />
      <Stack.Screen name="BuyCoin" component={BuyCoins} />
    </Stack.Navigator>
  );
};

const getStyles = (themeColor: ThemeColors) => {
  return StyleSheet.create({
    loaderContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: themeColor.appBG,
    },
  });
};
export default WagerStack;
