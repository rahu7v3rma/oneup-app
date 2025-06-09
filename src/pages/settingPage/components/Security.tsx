import { useNavigation } from '@react-navigation/native';
import { FC } from 'react';
import { ScrollView } from 'react-native';

import { BrandingWatermark } from '../../../../assets/svgs/settingSVGs/brandingWatermark.tsx';
import { FingerPrint } from '../../../../assets/svgs/settingSVGs/fingerPrint.tsx';
import ProfileIcon from '../../../../assets/svgs/settingSVGs/profileIcon.tsx';
import { OptionsContainer } from '../../../components/OptionsContainer.tsx';
import { ISettingInput } from '../../../interfaces/settingInput.interface.ts';
import { RootNavigationProp } from '../../../navigation/settingNav/SettingNav.tsx';
import { useTheme } from '../../../theme/ThemeProvider.tsx';

export const Security: FC = () => {
  const { themeColors } = useTheme();
  const navigation = useNavigation<RootNavigationProp>();
  const inputs: Array<ISettingInput> = [
    {
      icon: <ProfileIcon />,
      title: 'Change Password',
      handlePress: () => {
        navigation.navigate('ChangePassword');
      },
      style: {
        borderBottomWidth: 1,
        borderColor: themeColors.inputPlaceholderClr,
      },
    },
    {
      icon: <FingerPrint />,
      title: 'WFace ID',
      handlePress: () => {},
      style: {
        borderBottomWidth: 1,
        borderColor: themeColors.inputPlaceholderClr,
      },
    },
    {
      icon: <BrandingWatermark />,
      title: 'Verify Identity',
      handlePress: () => {},
    },
  ];
  return (
    <ScrollView>
      <OptionsContainer title="Security" inputs={inputs} />
    </ScrollView>
  );
};
