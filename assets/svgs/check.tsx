import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function Check() {
  return (
    <Svg width={13} height={8} viewBox="0 0 13 8" fill="none">
      <Path
        d="M6.99 7.712L13 1.702 11.586.288l-4.6 4.6-4.6-4.6L.98 1.702l6.01 6.01z"
        fill="#8F8184"
      />
    </Svg>
  );
}

export default Check;
