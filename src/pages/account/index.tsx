import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Formik } from 'formik';
import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import * as Yup from 'yup';

import { AuthContext } from '../../context/authContext';
import { RootStackParamList } from '../../navigation';
import Button from '../../shared/button';
import InputField from '../../shared/inputField';
import PageLayout from '../../shared/pageLayout';

import ProfilePicture from './components/ProfilePicture';

export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AccountSchema = Yup.object().shape({
  email: Yup.string()
    .email('User email not on file. Please try again.')
    .required('Please enter your email'),
  display_name: Yup.string().required('Please enter your display name'),
});

const Account = () => {
  const navigation = useNavigation();
  const { user, updateUser } = useContext(AuthContext);
  const [image, setImage] = React.useState<any | null>(null);
  const onSaveChanges = async (values: {
    email: string;
    display_name: string;
  }) => {
    const success = await updateUser(image, values.email, values.display_name);
    if (success) {
      navigation.goBack();
    }
  };
  const onChangeImage = (img: any) => {
    setImage(img);
  };
  console.log('User:', user);
  const fetchedUser = {
    email: user?.email || 'Email',
    display_name: user?.display_name || 'Display Name',
  };
  return (
    <PageLayout title={'Account'} onBack={() => navigation.goBack()}>
      <ProfilePicture
        containerStyle={styles.profilePicture}
        onChangeImage={onChangeImage}
        imageUri={user?.avatar ?? ''}
      />

      <Formik<{ email: string; display_name: string }>
        initialValues={fetchedUser}
        onSubmit={onSaveChanges}
        validationSchema={AccountSchema}
      >
        {({ handleChange, handleSubmit, values, errors, touched }) => (
          <View>
            <View style={styles.inputContainer}>
              <InputField
                name="email"
                placeholder="Enter Your Email"
                value={values.email}
                label="Email"
                onChange={handleChange('email')}
                errorMessage={touched.email ? errors.email : undefined}
              />
              <InputField
                placeholder="Enter Display name"
                value={values.display_name}
                name="display_name"
                label="Display Name"
                onChange={handleChange('displayName')}
                containerStyle={styles.displayInput}
                errorMessage={
                  touched.display_name ? errors.display_name : undefined
                }
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button onPress={handleSubmit as any} title={'Save'} />
            </View>
          </View>
        )}
      </Formik>
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  displayInput: {
    marginTop: 12,
  },
  inputContainer: {
    width: '100%',
    marginTop: 12,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 56,
  },
  profilePicture: {
    marginTop: 30,
    marginBottom: 20,
    width: 100,
    height: 100,
  },
});

export default Account;
