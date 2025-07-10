import React from 'react';
import Svg, { Path } from 'react-native-svg';

type PlayIconProps = {
  color: string;
  size?: number;
};

const PlayIcon: React.FC<PlayIconProps> = ({ color, size = 24 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 25 24" fill="none">
      <Path
        d="M12.625 5C7.656 5 2.625 6.546 2.625 9.5C2.625 12.454 7.656 14 12.625 14C17.594 14 22.625 12.454 22.625 9.5C22.625 6.546 17.595 5 12.625 5ZM7.625 14.938V17.938C8.862 18.237 10.23 18.42 11.625 18.479V15.479C10.2774 15.4275 8.93787 15.2464 7.625 14.938ZM13.625 15.478V18.478C14.9726 18.4265 16.3121 18.2454 17.625 17.937V14.937C16.3121 15.2454 14.9726 15.4265 13.625 15.478ZM19.625 14.297V17.297C21.426 16.542 22.625 15.44 22.625 14V11C22.625 12.44 21.426 13.542 19.625 14.297ZM5.625 17.297V14.297C3.825 13.542 2.625 12.439 2.625 11V14C2.625 15.439 3.825 16.542 5.625 17.297Z"
        fill={color}
      />
    </Svg>
  );
};

export default PlayIcon;
