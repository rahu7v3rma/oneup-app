import { useNavigation } from '@react-navigation/native';
import { FC } from 'react';
import { StyleSheet, View } from 'react-native';

import PageLayout from '../../shared/pageLayout';
import { useTheme } from '../../theme/ThemeProvider';

import { Preferences, Security, SignOut } from './components';

export const SettingsPage: FC = () => {
  const navigation = useNavigation();
  const { themeColors } = useTheme();
  return (
    <PageLayout title="Setting" onBack={() => navigation.goBack()}>
      <View
        style={[
          { backgroundColor: themeColors.appBG },
          styles.settingPageContainer,
        ]}
      >
        <Preferences />
        <Security />
        <SignOut />
      </View>
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  settingPageContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 25,
    marginTop: 25,
  },
});
