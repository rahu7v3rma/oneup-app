import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import Toast from 'react-native-toast-message';

interface ApiRequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean;
}

const ApiRequest = (client: AxiosInstance) => ({
  get: async <T>(url: string, config?: ApiRequestConfig): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await client.get<T>(url, config);
      if (response.status === 204 || response.status === 202) {
        return <T>[];
      }
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  post: async <T>(
    url: string,
    data?: any,
    config?: ApiRequestConfig,
  ): Promise<any> => {
    try {
      const response: AxiosResponse<T> = await client.post<T>(
        url,
        data,
        config,
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  put: async <T>(
    url: string,
    data?: any,
    config?: ApiRequestConfig,
  ): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await client.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  patch: async <T>(
    url: string,
    data?: any,
    config?: ApiRequestConfig,
  ): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await client.patch<T>(
        url,
        data,
        config,
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  delete: async <T>(url: string, config?: ApiRequestConfig): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await client.delete<T>(url, config);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
});

const handleError = (error: any) => {
  if (error.response) {
    const statusCode = error.response.data.status;
    const errorMessage = error.response.data.message;

    switch (statusCode) {
      case 401:
        Toast.show({
          type: 'error',
          text1: 'Authentication Error',
          text2: errorMessage || 'Something went wrong. Please try again.',
        });
        break;

      case 400:
        Toast.show({
          type: 'error',
          text1: 'Bad Request',
          text2:
            errorMessage ||
            'The request was invalid. Please check your input and try again.',
          position: 'top',
        });
        break;

      case 404:
        Toast.show({
          type: 'error',
          text1: 'Page Not Found',
          text2:
            errorMessage ||
            'We couldn’t find what you were looking for. Please try again.',
          position: 'top',
        });
        break;

      case 409:
        Toast.show({
          type: 'error',
          text1: 'Action Couldn’t Be Completed',
          text2:
            errorMessage ||
            'It looks like there’s already exist. Please check and try again.',
          position: 'top',
        });
        break;

      case 500:
        Toast.show({
          type: 'error',
          text1: 'Server Issues',
          text2:
            errorMessage ||
            'Something went wrong on our end. Please try again in a bit.',
          position: 'top',
        });
        break;

      default:
        Toast.show({
          type: 'error',
          text1: 'Unexpected Error',
          text2: errorMessage,
          position: 'top',
        });
        break;
    }
  } else if (error.request) {
    Toast.show({
      type: 'error',
      text1: 'Connection Problem',
      text2: 'We’re having trouble connecting. Please check your internet.',
      position: 'top',
    });
  } else {
    Toast.show({
      type: 'error',
      text1: 'Oops!',
      text2: error.message || 'Something went wrong. Please try again.',
      position: 'top',
    });
  }
};

export default ApiRequest;
