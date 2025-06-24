import { useNavigation } from '@react-navigation/native';
import { FC, useContext } from 'react';
import { ScrollView, Alert } from 'react-native';

import { LogOut } from '../../../../assets/svgs/settingSVGs/logOut.tsx';
import { AuthContext } from '../../../context/authContext.tsx';
import { ISettingInput } from '../../../interfaces/settingInput.interface.ts';
import { OptionsContainer } from '../../../shared/OptionsContainer.tsx';

export const SignOut: FC = () => {
  const { signOut } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              const signOutResult = await signOut();
              if (signOutResult) {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                });
              }
            } catch (error) {
              console.error('Error signing out:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            } finally {
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  const inputs: Array<ISettingInput> = [
    {
      icon: <LogOut />,
      title: 'Sign Out of 1-Up',
      handlePress: handleSignOut,
    },
  ];

  return (
    <ScrollView>
      <OptionsContainer title="" inputs={inputs} />
    </ScrollView>
  );
};
