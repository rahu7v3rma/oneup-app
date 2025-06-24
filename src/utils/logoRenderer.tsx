import { View, Image } from 'react-native';
import { SvgUri } from 'react-native-svg';

const isSvg = (uri: string | undefined) => {
  if (!uri || typeof uri !== 'string') return false;
  return uri.toLowerCase().endsWith('.svg');
};

export const renderLogo = (
  logoSource: string | number | undefined | null,
  styles: any,
  width: number,
  height: number,
) => {
  if (!logoSource) {
    return <View style={styles.logoPlaceholder} />;
  }

  if (typeof logoSource === 'number') {
    return <Image source={logoSource} style={styles.teamLogo} />;
  }

  if (typeof logoSource === 'string') {
    return isSvg(logoSource) ? (
      <View style={styles.teamLogo}>
        <SvgUri uri={logoSource} width={width} height={height} />
      </View>
    ) : (
      <Image source={{ uri: logoSource }} style={styles.teamLogo} />
    );
  }

  return <View style={styles.logoPlaceholder} />;
};
