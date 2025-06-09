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

  return (
    <View style={containerStyle}>
      <Image style={styles.profileImage} source={{ uri: selectedImage }} />
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
