import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

import type { ThemeColors } from '../../theme/colors';
import { useTheme } from '../../theme/ThemeProvider';

type Tab = 'LINES' | 'PENDING' | 'PAST';

const MLBTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('LINES');

  const tabs: Tab[] = ['LINES', 'PENDING', 'PAST'];

  const handleTabPress = (tab: Tab) => {
    setActiveTab(tab);
  };
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  const createStyles = (themeColors: ThemeColors) => {
    return StyleSheet.create({
      mainView: {
        width: screenWidth * 0.95,
        height: screenHeight * 0.05,
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: themeColors.charcoalBlue,
        borderRadius: 8,
        fontFamily: 'Inter',
        fontSize: 10,
      },
      tabButton: {
        width: screenWidth * 0.3,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
      },
      tabText: {
        fontSize: 12,
        fontWeight: '500',
      },
      activeTabBg: {
        backgroundColor: '#194E38',
        borderWidth: 1,
        borderColor: themeColors.textGreen,
      },
      activeTabtext: {
        color: themeColors.textGreen,
      },
      inactiveTabText: {
        color: themeColors.textWhite,
      },
      inactiveTabBg: {
        backgroundColor: themeColors.charcoalBlue,
      },
    });
  };
  const { themeColors } = useTheme();
  const styles = createStyles(themeColors);

  return (
    <View style={styles.mainView}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[
            styles.tabButton,
            activeTab === tab ? styles.activeTabBg : styles.inactiveTabBg,
          ]}
          onPress={() => handleTabPress(tab)}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === tab ? styles.activeTabtext : styles.inactiveTabText,
            ]}
          >
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default MLBTab;
