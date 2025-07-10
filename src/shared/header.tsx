import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { useNavigation } from '@react-navigation/native';
import Text from '@shared/text';
import { RootNavigationProp } from 'navigation';
import React, { FunctionComponent } from 'react';
import { StyleSheet, View } from 'react-native';

import { Fonts } from '../theme/fonts';
import { useThemeStyles } from '../theme/ThemeStylesProvider';

import BackButton from './backButton';

type Props = {
  title: string;
};

const Header: FunctionComponent<Props> = ({ title }: Props) => {
  const navigation = useNavigation<RootNavigationProp>();
  const themeStyles = useThemeStyles();

  const onGoBack = () => {
    navigation.goBack();
  };

  return (
    <View
      style={[
        themeStyles.flexRow,
        themeStyles.justifyContentBetween,
        themeStyles.mt11,
        themeStyles.mb10,
      ]}
    >
      <View>
        <BackButton onPress={onGoBack} />
      </View>
      <View>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View>
        <FontAwesome6
          name="ellipsis"
          iconStyle="solid"
          size={20}
          style={themeStyles.textMuted}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 17,
    lineHeight: 20,
    fontFamily: Fonts.InterSemiBold,
    fontWeight: '600',
  },
});

export default Header;
