import React from 'react';
import Svg, { Path } from 'react-native-svg';

type MessageIconProps = {
  color: string;
  size?: number;
};

const MessageIcon: React.FC<MessageIconProps> = ({ color, size = 24 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 25 24" fill="none">
      <Path
        d="M20.125 2H4.125C3.025 2 2.135 2.9 2.135 4L2.125 22L6.125 18H20.125C21.225 18 22.125 17.1 22.125 16V4C22.125 2.9 21.225 2 20.125 2ZM18.125 14H6.125V12H18.125V14ZM18.125 11H6.125V9H18.125V11ZM18.125 8H6.125V6H18.125V8Z"
        fill={color}
      />
    </Svg>
  );
};

export default MessageIcon;
