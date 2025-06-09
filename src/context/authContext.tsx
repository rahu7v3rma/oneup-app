import { AxiosError } from 'axios';
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import Toast from 'react-native-toast-message';

import AuthService from '../api/services/auth.service';
import TokenService from '../api/services/token.service';

interface User {
  email: string;
  faceID?: boolean;
  password: string;
  first_name: string;
  last_name: string;
  display_name: string;
  date_of_birth: string;
  phone_number: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  zipcode: string;
  id?: number;
  avatar?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  signIn: (credentials: LoginCredentials) => Promise<boolean>;
  signOut: () => Promise<boolean>;
  loading: boolean;
  register: (formattedData: User) => Promise<boolean>;
  isEmailVerified: boolean;
  isOtpExempt: boolean;
  forgotPassword: (email: string) => Promise<boolean>;
  verifyResetToken: (token: string) => Promise<boolean>;
  confirmResetPassword: (token: string, password: string) => Promise<boolean>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
  updateUser: (avatar: any, email: string, displayName: string) => Promise<boolean>;
}

// Update the default context value
export const AuthContext = createContext<AuthContextType>({
  user: null,
  signIn: async () => false,
  signOut: async () => false,
  loading: true,
  register: async () => false,
  isEmailVerified: false,
  isOtpExempt: false,
  forgotPassword: async () => false,
  verifyResetToken: async () => false,
  confirmResetPassword: async () => false,
  changePassword: async () => false,
  updateUser: async () => false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isOtpExempt, setIsOtpExempt] = useState(false);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const register = async (formattedData: User): Promise<boolean> => {
    try {
      const response = await AuthService.register(formattedData);
      console.log('this is the response dta', response.data);
      if (response.data && response.success) {
        const { auth_token, ...userData} = response.data;

        await TokenService.setAuthToken(auth_token);
        await TokenService.setUserData(userData);

        setUser(userData);

        Toast.show({
          type: 'success',
          text1: 'Registration Successful',
          text2: 'Your account has been created successfully!',
          position: 'top',
          visibilityTime: 4000,
        });

        return true;
      } else {
        const errorMessage = response?.message || 'Registration failed';

        Toast.show({
          type: 'error',
          text1: 'Registration Failed',
          text2: errorMessage,
          position: 'top',
          visibilityTime: 4000,
        });

        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      const axiosError = error as AxiosError<any>;
      const errorMessage =
        axiosError.response?.data?.message ||
        'An error occurred during registration';

      Toast.show({
        type: 'error',
        text1: 'Registration Error',
        text2: errorMessage,
        position: 'top',
        visibilityTime: 4000,
      });

      return false;
    }
  };
  const signIn = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const response = await AuthService.login(credentials);

      if (response.data && response.success) {
        const { auth_token, ...userData } = response.data; // Changed from response.data.data to response.data
        const isExempt = response.data.exempt || false; // Changed from response.data.data.exempt

        setIsOtpExempt(isExempt);
        await TokenService.setAuthToken(auth_token); // Changed from token to auth_token
        await TokenService.setUserData(userData);

        setUser(userData);
        setIsEmailVerified(true);

        Toast.show({
          type: 'success',
          text1: 'Login Successful',
          text2: 'You have been logged in successfully!',
          position: 'top',
          visibilityTime: 4000,
        });

        return true;
      } else if (response.data && response.code === 'email_not_verified') {
        setIsEmailVerified(false);
        const { auth_token } = response.data; // Changed from response.data.data to response.data
        await TokenService.setTempAuthToken(auth_token); // Changed from token to auth_token

        Toast.show({
          type: 'warning',
          text1: 'Email Not Verified',
          text2: 'Please verify your email to continue.',
          position: 'top',
          visibilityTime: 4000,
        });

        return false;
      } else {
        const errorMessage = response?.message || 'Login failed';

        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: errorMessage,
          position: 'top',
          visibilityTime: 4000,
        });

        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      const axiosError = error as AxiosError<any>;
      const errorMessage =
        axiosError.response?.data?.message || 'An error occurred during login';

      Toast.show({
        type: 'error',
        text1: 'Login Error',
        text2: errorMessage,
        position: 'top',
        visibilityTime: 4000,
      });

      return false;
    }
  };

const updateUser = async (
  image: any | null,
  email: string,
  displayName: string
): Promise<boolean> => {
  try {
    setLoading(true);
    
    const formData = new FormData();
    
    // Only append avatar if image exists
    if (image) {
      formData.append('avatar', {
        uri: image.uri,
        type: image.type || 'image/jpeg',
        name: image.fileName || `avatar-${Date.now()}.jpg`,
      } as any);
    }
    
    // Always append email and display_name
    formData.append('email', email);
    formData.append('display_name', displayName);
    
    console.log('Sending form data:', formData);
    
    const response = await AuthService.updateUser(formData);
    
    if (response.data && response.success) {
      // Make sure we're correctly updating the user state with the response data
      const updatedUser = { ...user, ...response.data };
      setUser(updatedUser);
      await TokenService.setUserData(updatedUser);

      Toast.show({
        type: 'success',
        text1: 'Profile Updated',
        text2: 'Your profile has been updated successfully',
        position: 'top',
        visibilityTime: 4000,
      });
      return true;
    } else {
      const errorMessage = response?.message || 'Failed to update profile';
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: errorMessage,
        position: 'top',
        visibilityTime: 4000,
      });
      return false;
    }
  } catch (error) {
    console.error('Update profile error:', error);
    const axiosError = error as AxiosError<any>;
    const errorMessage =
      axiosError.response?.data?.message ||
      'An unexpected error occurred while updating your profile';

    Toast.show({
      type: 'error',
      text1: 'Update Error',
      text2: errorMessage,
      position: 'top',
      visibilityTime: 4000,
    });
    return false;
  } finally {
    setLoading(false);
  }
};


  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      const response = await AuthService.forgetPassword(email);

      if (response.data && response.success) {
        Toast.show({
          type: 'success',
          text1: 'Password Reset Requested',
          text2:
            'If an account exists with this email, you will receive password reset instructions.',
          position: 'top',
          visibilityTime: 4000,
        });

        return true;
      } else {
        const errorMessage =
          response.message || 'Password reset request failed';

        Toast.show({
          type: 'error',
          text1: 'Request Failed',
          text2: errorMessage,
          position: 'top',
          visibilityTime: 4000,
        });

        return false;
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      const axiosError = error as AxiosError<any>;
      const errorMessage =
        axiosError.response?.data?.message ||
        'An error occurred during password reset request';

      Toast.show({
        type: 'error',
        text1: 'Request Error',
        text2: errorMessage,
        position: 'top',
        visibilityTime: 4000,
      });

      return false;
    }
  };

  const verifyResetToken = async (token: string): Promise<boolean> => {
    try {
      const response = await AuthService.verifyResetToken(token);

      if (response.data && response.success) {
        Toast.show({
          type: 'success',
          text1: 'Token Verified',
          text2: 'Your reset token has been verified successfully.',
          position: 'top',
          visibilityTime: 4000,
        });

        return true;
      } else {
        const errorMessage = response?.message || 'Token verification failed';

        Toast.show({
          type: 'error',
          text1: 'Verification Failed',
          text2: errorMessage,
          position: 'top',
          visibilityTime: 4000,
        });

        return false;
      }
    } catch (error) {
      console.error('Token verification error:', error);
      const axiosError = error as AxiosError<any>;
      const errorMessage =
        axiosError.response?.data?.message ||
        'An error occurred during token verification';

      Toast.show({
        type: 'error',
        text1: 'Verification Error',
        text2: errorMessage,
        position: 'top',
        visibilityTime: 4000,
      });

      return false;
    }
  };

  const confirmResetPassword = async (
    token: string,
    password: string,
  ): Promise<boolean> => {
    try {
      const response = await AuthService.confirmResetPassword(token, password);

      if (response.data && response.success) {
        Toast.show({
          type: 'success',
          text1: 'Password Reset Successful',
          text2: 'Your password has been changed successfully.',
          position: 'top',
          visibilityTime: 4000,
        });

        return true;
      } else {
        const errorMessage = response?.message || 'Password reset failed';

        Toast.show({
          type: 'error',
          text1: 'Reset Failed',
          text2: errorMessage,
          position: 'top',
          visibilityTime: 4000,
        });

        return false;
      }
    } catch (error) {
      console.error('Password reset error:', error);
      const axiosError = error as AxiosError<any>;
      const errorMessage =
        axiosError.response?.data?.message ||
        'An error occurred during password reset';

      // Check for password validation errors
      if (axiosError.response?.data?.code === 'password_does_not_conform') {
        const passwordErrors = axiosError.response?.data?.data?.password || [
          'Password does not meet requirements',
        ];

        Toast.show({
          type: 'error',
          text1: 'Password Error',
          text2: passwordErrors.join(', '),
          position: 'top',
          visibilityTime: 4000,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Reset Error',
          text2: errorMessage,
          position: 'top',
          visibilityTime: 4000,
        });
      }

      return false;
    }
  };

 const changePassword = async (currentPassword: string, newPassword: string) => {
  try {
    const response = await AuthService.changePassword(currentPassword, newPassword);

    if (response.data && response.success) {
      Toast.show({
        type: 'success',
        text1: 'Password Change Successful',
        text2: 'Your password has been changed successfully.',
        position: 'top',
        visibilityTime: 4000,
      });

      return true;
    } else {
      const errorMessage = response?.message || 'Password change failed';

      Toast.show({
        type: 'error',
        text1: 'Change Failed',
        text2: errorMessage,
        position: 'top',
        visibilityTime: 4000,
      });

      return false;
    }
  } catch (error) {
    console.error('Password change error:', error);
    const axiosError = error as AxiosError<any>;
    const errorMessage =
      axiosError.response?.data?.message ||
      'An error occurred during password change';

    Toast.show({
      type: 'error',
      text1: 'Change Error',
      text2: errorMessage,
      position: 'top',
      visibilityTime: 4000,
    });

    return false;
  }

 }

  const signOut = async () => {
    try {
      await TokenService.clearAllTokens();
      setUser(null);
      setIsEmailVerified(false);
      setIsOtpExempt(false);
      return true;
    } catch (err) {
      return false;
    }
  };

  const checkLoginStatus = async () => {
    try {
      const { authToken, userData } = await TokenService.getTokenData();

      if (authToken && userData) {
        console.log('this is the user data', userData);
        setUser(userData);
        setIsEmailVerified(true);
        setIsOtpExempt(userData.exempt || false);
      } else {
        setUser(null);
        setIsEmailVerified(false);
        setIsOtpExempt(false);
      }
    } catch (err) {
      console.error('Auto-login failed', err);
      setUser(null);
      setIsEmailVerified(false);
      setIsOtpExempt(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
        loading,
        register,
        isEmailVerified,
        isOtpExempt,
        forgotPassword,
        verifyResetToken,
        confirmResetPassword,
        changePassword,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
