import { StyleProp, ViewStyle } from 'react-native';

export interface ISettingInput {
  icon: any;
  title: string;
  style?: StyleProp<ViewStyle>;
  handlePress: () => void;
}
