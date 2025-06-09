import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useThemeStyles } from '../theme/ThemeStylesProvider';

import BackButton from './backButton';
import Text from './text';

type Props = {
  children?: React.ReactNode;
  title?: string;
  onBack?: () => void;
};

const PageLayout = ({ children, title, onBack }: Props) => {
  const themeStyles = useThemeStyles();

  return (
    <View
      style={[
        styles.container,
        themeStyles.themeContainerColor,
        themeStyles.flex1,
      ]}
    >
      <View style={[themeStyles.flexRow, themeStyles.alignItemsCenter]}>
        <BackButton onPress={onBack!} />
        <Text style={[styles.title, themeStyles.themeTextColor]}>{title}</Text>
      </View>
      {children}
    </View>
  );
};

export default PageLayout;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    paddingLeft: 20,
    fontSize: 16,
  },
});
