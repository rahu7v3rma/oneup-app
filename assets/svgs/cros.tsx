import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function Cross() {
  return (
    <Svg width={10} height={10} viewBox="0 0 10 10" fill="none">
      <Path
        d="M1.063 10L0 8.937 3.938 5 0 1.062 1.063 0 5 3.938 8.938 0 10 1.063 6.062 5 10 8.938 8.937 10 5 6.062 1.062 10z"
        fill="#8F8184"
      />
    </Svg>
  );
}

export default Cross;
