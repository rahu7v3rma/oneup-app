import { AxiosError, AxiosResponse } from 'axios';
import * as Keychain from 'react-native-keychain';

const AuthInterceptor = (ApiClient: any) => {
  ApiClient.interceptors.request.use(
    async (config: any) => {
      const credentials = await Keychain.getGenericPassword({
        service: 'auth_token',
      });
      const accessToken = credentials ? credentials.password : null;

      if (accessToken) {
        // Using the Django expected format: X-AuthorizationToken: [token_value]
        config.headers['X-Authorization'] = `Token ${accessToken}`;
      }

      return config;
    },
    (error: AxiosError) => Promise.reject(error),
  );

  // Response Interceptor for error handling
  ApiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: any) => {
      if (error.code === 'ECONNABORTED') {
        console.error('Request timed out');
      } else {
        console.error('Other error:', error.message);
      }
      return Promise.reject(error);
    },
  );
};

export default AuthInterceptor;
