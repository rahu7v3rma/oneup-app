import React from 'react';
import Svg, {
  Defs,
  G,
  Mask,
  Path,
  Rect,
  type SvgProps,
} from 'react-native-svg';

const Bank: React.FunctionComponent<SvgProps> = ({ width, height }) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
    >
      <Defs>
        <Mask
          id="mask0_0_440"
          maskUnits="userSpaceOnUse"
          x={0}
          y={0}
          width={24}
          height={24}
        >
          <Rect width={24} height={24} fill="#D9D9D9" />
        </Mask>
      </Defs>
      <G mask="url(#mask0_0_440)">
        <Path
          d="M5 17V10H7V17H5ZM11 17V10H13V17H11ZM2 21V19H22V21H2ZM17 17V10H19V17H17ZM2 8V6L12 1L22 6V8H2Z"
          fill="#04BA6A"
        />
      </G>
    </Svg>
  );
};

export default Bank;
