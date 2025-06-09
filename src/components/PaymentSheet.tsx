import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { useNavigation } from '@react-navigation/native';
import { useRef } from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import bankIcon from '../../assets/pngs/bank.png';
import cardIcon from '../../assets/pngs/card.png';
import paypalIcon from '../../assets/pngs/paypal.png';
import venmoIcon from '../../assets/pngs/venmo.png';
import { RootNavigationProp } from '../navigation';
import { Button } from '../shared';
import BottomSheet, { BottomSheetRef } from '../shared/bottomSheet';
import { ThemeColors } from '../theme/colors';
import { Fonts } from '../theme/fonts';
import { useTheme } from '../theme/ThemeProvider';

const paymentMethods: {
  icon: ImageSourcePropType;
  title: string;
  subtitle: string;
  navigate: 'AddBank' | 'Wallet' | 'CardDetails';
  params?: any;
}[] = [
  {
    icon: bankIcon,
    title: 'Bank Account',
    subtitle: 'No fee for money transfers.',
    navigate: 'AddBank',
    params: { addingType: 'bank' },
  },
  {
    icon: cardIcon,
    title: 'Debit & Credit Card',
    subtitle: 'We charge a 3% fee for sending money with credit cards.',
    navigate: 'AddBank',
    params: { addingType: 'card' },
  },
  {
    icon: paypalIcon,
    title: 'Paypal',
    subtitle: 'No fee for money transfers.',
    navigate: 'AddBank',
  },
  {
    icon: venmoIcon,
    title: 'Venmo',
    subtitle: 'No fee for money transfers.',
    navigate: 'AddBank',
  },
];

const PaymentMethod = ({
  icon,
  title,
  subtitle,
}: {
  icon: ImageSourcePropType;
  title: string;
  subtitle: string;
}) => {
  const { themeColors } = useTheme();
  const styles = createStyles(themeColors);
  return (
    <View style={styles.paymentMethodContainer}>
      <View style={styles.paymentMethodIconContainer}>
        <Image source={icon} style={styles.paymentMethodIcon} />
      </View>
      <View>
        <Text style={styles.paymentMethodTitle}>{title}</Text>
        <Text style={styles.paymentMethodSubtitle}>{subtitle}</Text>
      </View>
      <View style={styles.paymentMethodRightIconContainer}>
        <FontAwesome6
          name="chevron-right"
          size={12}
          color={themeColors.textWhite}
          iconStyle="solid"
        />
      </View>
    </View>
  );
};

const PaymentSheet = ({ ref }: { ref: React.RefObject<any> }) => {
  const { themeColors } = useTheme();
  const styles = createStyles(themeColors);
  const navigation = useNavigation<RootNavigationProp>();
  return (
    <BottomSheet ref={ref} wrapperBg="rgba(0, 0, 0, 0.5)">
      <View style={styles.container}>
        <Text style={styles.title}>Link an Account</Text>
        <View style={styles.paymentMethodsContainer}>
          {paymentMethods.map((method, index) => (
            <TouchableOpacity
              onPress={() => {
                ref.current?.close();
                navigation.navigate({
                  name: method.navigate,
                  params: method.params,
                });
              }}
            >
              <View key={index}>
                <PaymentMethod
                  icon={method.icon}
                  title={method.title}
                  subtitle={method.subtitle}
                />
                {index !== paymentMethods.length - 1 && (
                  <View style={styles.paymentMethodSeparator} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </BottomSheet>
  );
};

export const PaymentSheetPreview = () => {
  const { themeColors } = useTheme();
  const ref = useRef<BottomSheetRef>(null);
  const styles = createStyles(themeColors);
  return (
    <View style={styles.previewContainer}>
      <Button title="Open Payment Sheet" onPress={() => ref.current?.open()} />
      <PaymentSheet ref={ref} />
    </View>
  );
};

const createStyles = (themeColors: ThemeColors) => {
  return StyleSheet.create({
    previewContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: themeColors.appBG,
    },
    container: {
      flex: 1,
      padding: 15,
      paddingTop: 5,
    },
    title: {
      fontSize: 30,
      color: themeColors.textWhite,
      fontFamily: Fonts.RobotoBold,
      textAlign: 'center',
    },
    paymentMethodContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    paymentMethodIconContainer: {},
    paymentMethodIcon: {
      width: 35,
      height: 25,
    },
    paymentMethodTitle: {
      color: themeColors.textWhite,
      fontFamily: Fonts.WorkSansMedium,
      fontSize: 12,
    },
    paymentMethodSubtitle: {
      color: themeColors.textWhite,
      fontFamily: Fonts.WorkSansLight,
      fontSize: 10,
    },
    paymentMethodRightIconContainer: {
      marginLeft: 'auto',
      marginRight: 5,
    },
    paymentMethodsContainer: {
      marginTop: 25,
    },
    paymentMethodSeparator: {
      width: '100%',
      height: 1,
      backgroundColor: themeColors.gray1,
      marginVertical: 10,
    },
  });
};

export default PaymentSheet;
