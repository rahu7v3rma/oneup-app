import React, { FC } from 'react';
import Svg, { Path } from 'react-native-svg';

const Mark: FC = () => {
  return (
    <Svg width={12} height={10} viewBox="0 0 12 10" fill="none">
      <Path
        d="M4.104 9.438L.062 5.417l1.063-1.084 2.98 2.98 6.77-6.75 1.063 1.062-7.834 7.813z"
        fill="#04BA6A"
      />
    </Svg>
  );
};

export default Mark;
