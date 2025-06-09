import { AxiosResponse } from 'axios';

import { AccountApiClient } from '../utils/api-client';
import { PasswordResetApiEndpoints } from '../utils/api-endpoints';
import ApiRequest from '../utils/api-request';

const request = ApiRequest(AccountApiClient);

const OtpService = {
  sendOtp: async (phoneNumber: string) => {
    try {
      const url = PasswordResetApiEndpoints.SEND_OTP.replace(
        ':phoneNumber',
        phoneNumber,
      );
      const response: AxiosResponse['data'] = await request.post(url);
      return response;
    } catch (error) {
      console.error('Error in sendOtp:', error);
      throw error;
    }
  },

  verifyOtp: async (receivedOtp: string, token: string) => {
    try {
      const url = PasswordResetApiEndpoints.VERIFY_OTP.replace(
        ':receivedOtp',
        receivedOtp,
      );
      const response: AxiosResponse['data'] = await request.post(url, {
        token,
      });
      return response;
    } catch (error) {
      console.error('Error in verifyOtp:', error);
      throw error;
    }
  },

  verifyRegistrationOtp: async (receivedOtp: string, token: string) => {
    try {
      const url = PasswordResetApiEndpoints.VERIFY_REGISTRATION_OTP.replace(
        ':receivedOtp',
        receivedOtp,
      );
      const response: AxiosResponse['data'] = await request.post(url, {
        token,
      });
      return response;
    } catch (error) {
      console.error('Error in verifyRegistrationOtp:', error);
      throw error;
    }
  },

  changePassword: async (
    token: string,
    oldPassword: string,
    newPassword: string,
  ) => {
    try {
      const response: AxiosResponse['data'] = await request.post(
        PasswordResetApiEndpoints.CHANGE_PASSWORD,
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return response;
    } catch (error) {
      console.error('Error in changePassword:', error);
      throw error;
    }
  },

  changeForgotPassword: async (token: string, newPassword: string) => {
    try {
      const response: AxiosResponse['data'] = await request.post(
        PasswordResetApiEndpoints.CHANGE_FORGOT_PASSWORD,
        { newPassword },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return response;
    } catch (error) {
      console.error('Error in changePassword:', error);
      throw error;
    }
  },

  forgetPassword: async (phoneNumber: string) => {
    try {
      const response: AxiosResponse['data'] = await request.post(
        PasswordResetApiEndpoints.FORGET_PASSWORD,
        { phoneNumber },
      );
      return response;
    } catch (error) {
      console.error('Error in forgetPassword:', error);
      throw error;
    }
  },
};

export default OtpService;
