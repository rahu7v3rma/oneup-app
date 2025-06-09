import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { ReactNode, useCallback, useState } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';

import { ThemeColors } from '../theme/colors';
import { Fonts } from '../theme/fonts';
import { useTheme } from '../theme/ThemeProvider';

const Accordion = ({
  items: itemsProp,
}: {
  items: {
    id: number;
    header: ReactNode;
    content: ReactNode;
  }[];
}) => {
  const { themeColors } = useTheme();
  const styles = createStyles(themeColors);
  const [items, setItems] = useState(
    itemsProp.map((item) => ({ ...item, isOpen: false })),
  );
  const toggleItem = useCallback(
    (id: number) => {
      const itemsClone = [...items];
      const findItemIndex = itemsClone.findIndex((item) => item.id === id);
      if (findItemIndex !== -1) {
        itemsClone[findItemIndex].isOpen = !itemsClone[findItemIndex].isOpen;
        setItems(itemsClone);
      }
    },
    [items],
  );
  return (
    <View style={styles.container}>
      {items.map((item) => (
        <View style={styles.itemContainer} key={item.id}>
          <TouchableOpacity
            style={styles.itemHeaderContainer}
            onPress={() => toggleItem(item.id)}
          >
            <FontAwesome6
              name={item.isOpen ? 'chevron-up' : 'chevron-down'}
              iconStyle="solid"
              size={12}
              style={styles.chevronDownIcon}
            />
            <View style={styles.itemHeader}>{item.header}</View>
          </TouchableOpacity>
          {item.isOpen && (
            <View style={styles.itemContentContainer}>{item.content}</View>
          )}
        </View>
      ))}
    </View>
  );
};

export default Accordion;

const createStyles = (themeColors: ThemeColors) => {
  return StyleSheet.create({
    container: {
      width: '100%',
      paddingHorizontal: 10,
      borderRadius: 10,
      backgroundColor: themeColors.cardBG,
      paddingVertical: 10,
    },
    itemContainer: {
      width: '100%',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
    },
    accoridionItemTitle: {
      fontSize: 10,
      fontFamily: Fonts.WorkSansRegular,
    },
    itemHeaderContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      height: 35,
    },
    itemContentContainer: {
      width: '100%',
      paddingVertical: 5,
    },
    chevronDownIcon: {
      position: 'relative',
      left: 5,
      color: themeColors.inputPlaceholderClr,
      marginRight: 25,
    },
    itemHeader: {
      flex: 1,
    },
  });
};
