import { FC } from 'react';
import Svg, { Path } from 'react-native-svg';

export const BrandingWatermark: FC = (props) => {
  return (
    <Svg width={16} height={13} viewBox="0 0 16 13" fill="none" {...props}>
      <Path
        d="M6.5 9.52h7v-5h-7v5zm-5 2.5c-.413 0-.766-.147-1.06-.44A1.446 1.446 0 010 10.52V1.513C0 1.101.147.75.44.458A1.45 1.45 0 011.5.02h13c.412 0 .766.147 1.06.44.293.295.44.648.44 1.06v9.006c0 .413-.147.765-.44 1.056a1.45 1.45 0 01-1.06.438h-13zm0-1.5h13v-9h-13v9z"
        fill="#8F8184"
      />
    </Svg>
  );
};
