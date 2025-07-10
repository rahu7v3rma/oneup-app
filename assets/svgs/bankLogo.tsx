import React from 'react';
import Svg, { Path, type SvgProps } from 'react-native-svg';

const BankLogo: React.FunctionComponent<SvgProps> = ({}) => {
  return (
    <Svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <Path
        d="M15.3334 1.3335L2.66669 8.00016V10.6668H28V8.00016M21.3334 13.3335V22.6668H25.3334V13.3335M2.66669 29.3335H28V25.3335H2.66669M13.3334 13.3335V22.6668H17.3334V13.3335M5.33335 13.3335V22.6668H9.33335V13.3335H5.33335Z"
        fill="#707077"
      />
    </Svg>
  );
};

export default BankLogo;
