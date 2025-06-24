import React, { useState } from 'react';
import {
  Image,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

import { Edit } from '../../../../assets/svgs';
import { COMMON } from '../../../utils/common';

type ProfilePictureProps = {
  imageUri: string;
  containerStyle?: StyleProp<ViewStyle>;
  onChangeImage?: (imageData: any) => void;
};

export default function ProfilePicture({
  imageUri,
  containerStyle,
  onChangeImage,
}: ProfilePictureProps) {
  console.log('imageUri:', imageUri);
  const [selectedImage, setSelectedImage] = useState(imageUri);

  const onEditProfilePicture = async () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        includeBase64: false,
      },
      (response) => {
        if (response.didCancel) {
          return;
        }
        if (response.errorCode) {
          console.warn('ImagePicker Error: ', response.errorMessage);
          return;
        }

        const asset = response.assets?.[0];
        if (asset && asset.uri) {
          setSelectedImage(asset.uri);

          // Pass the complete asset object to the parent component
          // This includes uri, type, fileName, etc.
          onChangeImage?.(asset);
        }
      },
    );
  };

  const getImageSource = () => {
    // If the image is a local file URI (starts with file://), use it directly
    if (selectedImage?.startsWith('file://')) {
      return { uri: selectedImage };
    }
    // If the image is from the server, prepend the base URL
    return {
      uri: selectedImage ? `${COMMON.imageBaseUrl}${selectedImage}` : undefined,
    };
  };

  return (
    <View style={containerStyle}>
      <Image style={styles.profileImage} source={getImageSource()} />
      <TouchableOpacity style={styles.editIcon} onPress={onEditProfilePicture}>
        <Edit />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  editIcon: {
    position: 'absolute',
    bottom: -4,
    right: -4,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
  },
});
