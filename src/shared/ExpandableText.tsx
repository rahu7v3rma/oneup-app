import React, { useState } from 'react';
import { Text } from 'react-native';

import { useThemeStyles } from '../theme/ThemeStylesProvider';

type ExpandableTextProps = {
  text: string;
  maxWords: number;
};

const ExpandableText: React.FC<ExpandableTextProps> = ({ text, maxWords }) => {
  const styles = useThemeStyles();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const truncatedText = text.split(' ').slice(0, maxWords).join(' ');

  return (
    <Text
      style={[
        styles.textInterRegular,
        styles.fontSize13,
        styles.textSupporting,
      ]}
    >
      {isExpanded ? text : truncatedText}
      {text.length > truncatedText.length && (
        <Text
          style={[
            styles.textInterMedium,
            styles.fontSize13,
            styles.truncationLink,
          ]}
          onPress={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? ' Show Less' : ' Read More'}
        </Text>
      )}
    </Text>
  );
};

export default ExpandableText;
