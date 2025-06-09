import React, { FC } from 'react';
import Svg, { Path } from 'react-native-svg';

export const LogOut: FC = () => {
  return (
    <Svg width={14} height={15} viewBox="0 0 14 15" fill="none">
      <Path
        d="M1.5 14.02c-.413 0-.766-.147-1.06-.44A1.445 1.445 0 010 12.52v-11C0 1.108.147.754.44.46.735.168 1.088.02 1.5.02H7v1.5H1.5v11H7v1.5H1.5zm9-3.5L9.437 9.458l1.688-1.688H5v-1.5h6.125L9.437 4.583 10.5 3.52l3.5 3.5-3.5 3.5z"
        fill="#8F8184"
      />
    </Svg>
  );
};
