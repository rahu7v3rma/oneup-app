import * as React from 'react';
import Svg, { G, Path, Defs, ClipPath, Rect } from 'react-native-svg';

type Props = Record<string, never>;

const Commanders: React.FunctionComponent<Props> = ({}: Props) => {
  return (
    <Svg width={28} height={15} viewBox="0 0 28 15" fill="none">
      <G clipPath="url(#clip0_1_766)">
        <Path
          d="M19.1194 0L20.0144 2.69714L19.3485 4.70142L17.7939 0H10.8254L9.57545 3.76853L8.33049 0H0L2.61698 4.17685L6.20194 15H12.9477L14.3034 10.9085L15.6553 15H23.0354L28 0H19.1194ZM3.54846 3.7525L1.82395 1.00091H7.59037L9.03919 5.38686L6.56448 12.8584L3.54846 3.7525ZM12.2037 14.0213H7.25176L11.2962 1.81002L13.7684 9.29025L12.2037 14.0213ZM12.0993 1.00091H17.0538L18.8161 6.32095L16.3363 13.8098L12.0993 1.00091ZM22.2865 14.0152H17.3357L21.0818 2.7033L20.5179 1.00091H26.594L22.2865 14.0152Z"
          fill="#FFB612"
        />
        <Path
          d="M18.8122 6.32221L16.3325 13.8111L12.0992 1.00098H17.0538L18.8122 6.32221ZM20.5179 1.00098L21.0793 2.70337L17.3332 14.0152H22.2839L26.5965 1.00098H20.5179ZM7.59031 1.00098H1.82393L3.54844 3.7525L6.56947 12.8584L9.03919 5.38687L7.59031 1.00098ZM7.25176 14.0152H12.21L13.7747 9.29031L11.2962 1.81008L7.25176 14.0152Z"
          fill="#5A1414"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_1_766">
          <Rect width={28} height={15} fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};
export default Commanders;
