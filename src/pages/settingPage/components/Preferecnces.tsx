import { useNavigation } from '@react-navigation/native';
import { FC } from 'react';
import { ScrollView } from 'react-native';

import {
  Handshake,
  ProfileIcon,
  Wallet,
} from '../../../../assets/svgs/index.tsx';
import { ISettingInput } from '../../../interfaces/settingInput.interface.ts';
import { RootNavigationProp } from '../../../navigation/settingNav/SettingNav.tsx';
import { OptionsContainer } from '../../../shared/OptionsContainer.tsx';
import { useTheme } from '../../../theme/ThemeProvider.tsx';

export const Preferences: FC = () => {
  const { themeColors } = useTheme();
  const navigation = useNavigation<RootNavigationProp>();

  const inputs: Array<ISettingInput> = [
    {
      icon: <ProfileIcon />,
      title: 'Account',
      handlePress: () => {
        navigation.navigate('Account');
      },
      style: {
        borderBottomWidth: 1,
        borderColor: themeColors.inputPlaceholderClr,
      },
    },
    {
      icon: <Wallet />,
      title: 'Wallet',
      handlePress: () => {
        navigation.navigate('WalletNav');
      },
      style: {
        borderBottomWidth: 1,
        borderColor: themeColors.inputPlaceholderClr,
      },
    },
    {
      icon: <Handshake />,
      title: 'Onboarding Tutorial',
      handlePress: () => {},
    },
  ];
  return (
    <ScrollView>
      <OptionsContainer title="Preferences" inputs={inputs} />
    </ScrollView>
  );
};
