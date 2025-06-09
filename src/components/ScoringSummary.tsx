import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageSourcePropType,
  TouchableOpacity,
} from 'react-native';

import PhiladelphiaEaglesLogo from '../../assets/png/philadelphia-eagles-logo.png';
import WashingtonCommandersLogo from '../../assets/png/washington-commanders-logo.png';
import Accordion from '../shared/accordion';
import { ThemeColors } from '../theme/colors';
import { Fonts } from '../theme/fonts';
import { useTheme } from '../theme/ThemeProvider';

const ScoringSummaryAccordionHeader = ({
  teamLogo,
  title,
  subtitle,
  unreadCount,
  readCount,
}: {
  teamLogo: ImageSourcePropType;
  title: string;
  subtitle: string;
  unreadCount: number;
  readCount: number;
}) => {
  const { themeColors } = useTheme();
  const styles = createStyles(themeColors);
  return (
    <View style={styles.accordionHeaderContainer}>
      <View style={styles.accordionItemTitleContainer}>
        <Image source={teamLogo} />
        <View style={styles.accordionItemTitleTextContainer}>
          <Text style={styles.accordionItemTitle}>{title}</Text>
          <Text style={styles.accordionItemSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <View style={styles.accordionItemCountContainer}>
        <Text style={styles.accordionItemCountUnread}>{unreadCount}</Text>
        <Text style={styles.accordionItemCountRead}>{readCount}</Text>
      </View>
    </View>
  );
};

const ScoringSummaryAccordionContent = ({
  content,
}: {
  content: { id: number; time: string; text: string }[];
}) => {
  const { themeColors } = useTheme();
  const styles = createStyles(themeColors);
  return (
    <View style={styles.accordionItemContentContainer}>
      {content.map((item) => (
        <View style={styles.accordionItemContentItemContainer} key={item.id}>
          <Text style={styles.accordionItemContentTime}>{item.time}</Text>
          <Text style={styles.accordionItemContentText}>{item.text}</Text>
        </View>
      ))}
    </View>
  );
};

const scoringSummaryAccordianItems = Array.from({ length: 4 }, (_, i) => ({
  id: i + 1,
  header: (
    <ScoringSummaryAccordionHeader
      teamLogo={i === 0 ? PhiladelphiaEaglesLogo : WashingtonCommandersLogo}
      title="Touchdown"
      subtitle="5 Plays, 17 Yards, 2:15"
      unreadCount={99}
      readCount={99}
    />
  ),
  content: (
    <ScoringSummaryAccordionContent
      content={Array.from({ length: 3 }, (__, ci) => ({
        id: ci + 1,
        time: '10:58',
        text: '[4th & 13 @ CLE 30] c. Boswell 48 yard field goal attempt is good. Center-C. Kuntz, Holder-C. Waltman',
      }))}
    />
  ),
}));

const ScoringSummary = () => {
  const { themeColors } = useTheme();
  const styles = createStyles(themeColors);
  const [is2ndQuarterOpen, setIs2ndQuarterOpen] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.scoringSummaryText}>Scoring Summary</Text>
      <View style={styles.divider} />
      <TouchableOpacity
        style={styles.secondQuarterContainer}
        onPress={() => setIs2ndQuarterOpen(!is2ndQuarterOpen)}
      >
        <Text style={styles.secondQuarterText}>2nd Quarter</Text>
        <FontAwesome6
          name="chevron-down"
          size={12}
          style={styles.secondQuarterIcon}
          iconStyle="solid"
        />
      </TouchableOpacity>
      {is2ndQuarterOpen && <Accordion items={scoringSummaryAccordianItems} />}
    </View>
  );
};

export const ScoringSummaryPreview = () => {
  const { themeColors } = useTheme();
  const styles = createStyles(themeColors);
  return (
    <View style={styles.scoringSummaryPreviewContainer}>
      <ScoringSummary />
    </View>
  );
};

const createStyles = (themeColors: ThemeColors) => {
  return StyleSheet.create({
    container: {
      width: '100%',
    },
    scoringSummaryText: {
      fontSize: 13,
      fontFamily: Fonts.RobotoRegular,
      color: themeColors.textWhite,
    },
    divider: {
      width: '100%',
      height: 1,
      marginTop: 5,
      backgroundColor: themeColors.inputPlaceholderClr,
    },
    secondQuarterContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      marginTop: 10,
      marginRight: 10,
      marginBottom: 12,
    },
    secondQuarterText: {
      fontSize: 13,
      fontFamily: Fonts.RobotoRegular,
      color: themeColors.textWhite,
    },
    accordionItemTitle: {
      fontSize: 10,
      fontFamily: Fonts.WorkSansRegular,
      color: themeColors.textWhite,
    },
    accordionItemSubtitle: {
      fontSize: 8,
      marginTop: 2,
      fontFamily: Fonts.WorkSansRegular,
      color: themeColors.inputPlaceholderClr,
    },
    accordionItemTitleTextContainer: {
      flexDirection: 'column',
    },
    accordionItemCountContainer: {
      flexDirection: 'row',
      gap: 10,
      position: 'absolute',
      right: 5,
      alignSelf: 'center',
    },
    accordionItemCountUnread: {
      fontSize: 10,
      fontFamily: Fonts.WorkSansRegular,
      color: themeColors.textWhite,
    },
    accordionItemCountRead: {
      fontSize: 10,
      fontFamily: Fonts.WorkSansRegular,
      color: themeColors.inputPlaceholderClr,
    },
    accordionItemContentContainer: {
      flexDirection: 'column',
      gap: 10,
    },
    accordionItemContentItemContainer: {
      flexDirection: 'row',
      gap: 10,
    },
    accordionItemContentTime: {
      fontSize: 10,
      fontFamily: Fonts.WorkSansRegular,
      color: themeColors.inputPlaceholderClr,
    },
    accordionItemContentText: {
      fontSize: 8.8,
      fontFamily: Fonts.WorkSansRegular,
      color: themeColors.inputPlaceholderClr,
      width: '84%',
    },
    accordionItemTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    accordionHeaderContainer: {
      flexDirection: 'row',
      flex: 1,
    },
    scoringSummaryPreviewContainer: {
      flex: 1,
      paddingTop: 100,
      backgroundColor: themeColors.appBG,
      paddingHorizontal: 16,
    },
    secondQuarterIcon: {
      color: themeColors.inputPlaceholderClr,
    },
  });
};

export default ScoringSummary;
