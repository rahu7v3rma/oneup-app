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
  const styles = useThemeStyles();

  const onGoBack = () => {
    navigation.goBack();
  };

  return (
    <View
      style={[
         styles.flexRow,
        styles.justifyContentBetween,
        styles.alignItemsCenter,
        styles.ph4,
        styles.pv4,
      ]}
    >
      <View>
        <BackButton onPress={onGoBack} />
      </View>
      <View>
        <Text style={containerStyles.title}>{title}</Text>
      </View>
      <View>
        <FontAwesome6
          name="ellipsis"
          iconStyle="solid"
          size={20}
          style={styles.textMuted}
        />
      </View>
    </View>
  );
};

const containerStyles = StyleSheet.create({
  title: {
    fontSize: 17,
    lineHeight: 20,
    fontFamily: Fonts.InterSemiBold,
    fontWeight: '600',
  },
});

export default Header;
