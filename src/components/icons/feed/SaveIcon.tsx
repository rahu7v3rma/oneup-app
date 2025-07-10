import React from 'react';
import Svg, { Path } from 'react-native-svg';

type SaveIconProps = {
  color: string;
  size?: number;
};

const SaveIcon: React.FC<SaveIconProps> = ({ color, size = 24 }) => {
  const scale = size / 24;
  const width = 14 * scale;
  const height = 18 * scale;

  return (
    <Svg width={width} height={height} viewBox="0 0 14 18" fill="none">
      <Path
        d="M0 18V2C0 1.45 0.196 0.979333 0.588 0.588C0.98 0.196667 1.45067 0.000666667 2 0H12C12.55 0 13.021 0.196 13.413 0.588C13.805 0.98 14.0007 1.45067 14 2V18L7 15L0 18Z"
        fill={color}
      />
    </Svg>
  );
};

export default SaveIcon;
