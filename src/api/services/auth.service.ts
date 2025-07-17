import { AxiosResponse } from 'axios';

import { AccountApiClient } from '../utils/api-client';
import { AuthApiEndpoints } from '../utils/api-endpoints';
import ApiRequest from '../utils/api-request';

import tokenService from './token.service';

const request = ApiRequest(AccountApiClient);
const AuthService = {
  register: async (data: any) => {
    try {
      console.log('This is register api ', AuthApiEndpoints.REGISTER);
      console.log(data);
      const response: AxiosResponse['data'] = await request.post(
        AuthApiEndpoints.REGISTER,
        data,
      );
      return response;
    } catch (error) {
      console.error('Error in register:', error);
      throw error;
    }
  },

  login: async (credentials: { email: string; password: string }) => {
    const response: AxiosResponse['data'] = await request.post(
      AuthApiEndpoints.LOGIN,
      credentials,
    );

    return response;
  },

  updateUser: async (data: any) => {
    try {
      const response: AxiosResponse['data'] = await request.put(
        AuthApiEndpoints.UPDATEUSER,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      return response;
    } catch (error) {
      console.error('Error in updateUser:', error);
      throw error;
    }
  },

  forgetPassword: async (email: string) => {
    try {
      console.log('this is the email', email);
      const response: AxiosResponse['data'] = await request.post(
        AuthApiEndpoints.FORGETPASSWORD,
        { email }, // Changed: wrap email in an object
        {
          headers: {
            'Content-Type': 'application/json', // Added: ensure JSON content type
          },
        },
      );
      return response;
    } catch (error) {
      console.error('Error in forgetPassword:', error);
      throw error;
    }
  },

  verifyResetToken: async (token: string) => {
    const response: AxiosResponse['data'] = await request.post(
      AuthApiEndpoints.RESETPASSWORDVERFIY,
      { token },
    );
    return response;
  },

  confirmResetPassword: async (token: string, password: string) => {
    const response: AxiosResponse['data'] = await request.post(
      AuthApiEndpoints.RESETPASSWORDCONFIRM,
      {
        token,
        password,
      },
    );
    return response;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const response: AxiosResponse['data'] = await request.post(
      AuthApiEndpoints.CHANGEPASSWORD,
      {
        old_password: currentPassword,
        new_password: newPassword,
      },
    );
    return response;
  },

  logout: async () => {
    try {
      await Promise.all([tokenService.clearAllTokens()]);
      return true;
    } catch (error) {
      console.error('Error in logout:', error);
      throw error;
    }
  },
};

export default AuthService;
