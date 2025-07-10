import React from 'react';
import Svg, { G, Path, Defs, ClipPath, Rect } from 'react-native-svg';

type FeedIconProps = {
  color: string;
  size?: number;
};

const FeedIcon: React.FC<FeedIconProps> = ({ color, size = 24 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 25 24" fill="none">
      <G clipPath="url(#clip0_5_2831)">
        <Path
          d="M2.875 7H6.875V17H2.875V7ZM7.875 19H17.875V5H7.875V19ZM18.875 7H22.875V17H18.875V7Z"
          fill={color}
        />
      </G>
      <Defs>
        <ClipPath id="clip0_5_2831">
          <Rect
            width="24"
            height="24"
            fill="white"
            transform="translate(0.875)"
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export default FeedIcon;
