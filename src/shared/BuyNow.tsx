import React,{useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity,Image } from 'react-native';
import { lightColors, darkColors } from '../theme/colors';
// import { darkColors } from '../theme/colors';
import { Fonts } from '../theme/fonts';
interface BuyNowProps {
  onPress: () => void;
  balanceWarning?: string; // Optional custom warning
  show?: boolean; // Conditional rendering
  buy_coins:boolean;
  selAmount:any;
}

const BuyNow: React.FC<BuyNowProps> = ({
  onPress,
  balanceWarning = 'Your balance is low',
  show = true,
  buy_coins,
  selAmount,
}) => {
  if (!show) return null;

  return (
    <View>
        {buy_coins?
        <View style={styles.container}>
            <Image style={{width:20,height:20,tintColor:lightColors.textGreen,marginRight:10}} source={require('../../assets/png/rounded_exclamation_mark.png')} />
            <Text style={styles.warningText}>{balanceWarning}</Text>
            <TouchableOpacity style={styles.buyButton} onPress={onPress}>
                <Text style={styles.buyText}>BUY COINS</Text>
            </TouchableOpacity>
        </View>
        :
        <View style={styles.container}>
            <Text style={[styles.warningText,{textAlign:'center'}]}>{`You will win ${selAmount} 🪙 if PHL wins`}</Text>
        </View>
        }
        
    </View>
  );
};

export default BuyNow;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 10,
    // backgroundColor: darkColors.charcoalBlue,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor:'#070F17',
    borderWidth:2,
    borderColor:darkColors.charcoalBlue
  },
  warningText: {
    // color: lightColors.slateGray,
    color:darkColors.textSupporting,
    fontSize: 14,
    fontFamily: Fonts.InterRegular,
    flex: 1,
  },
  buyButton: {
    backgroundColor: lightColors.textGreen,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginLeft: 10,
  },
  buyText: {
    color: darkColors.primaryBlack,
    fontWeight: '700',
    fontSize: 12,
    fontFamily: Fonts.InterBold,
  },
});
