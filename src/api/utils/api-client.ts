import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { Platform } from 'react-native';

import AuthInterceptor from '../interceptors/auth-interceptor';

// Create a platform interceptor to add platform=mobile to all requests
const addPlatformInterceptor = (client: AxiosInstance) => {
  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    // Initialize params if not present
    config.params = config.params || {};

    // Add platform=mobile to all requests
    config.params.platform = 'mobile';

    // Add appropriate user agent - using the proper way to set headers
    const deviceInfo = Platform.OS === 'ios' ? 'iOS' : 'Android';
    config.headers.set('User-Agent', `OneUp-App/${deviceInfo}`);

    return config;
  });
};

const createApiClient = (baseURL: string): AxiosInstance => {
  const client = axios.create({
    baseURL: baseURL,
    timeout: 10000,
  });

  console.log('🔧 API Client Configuration:', {
    baseURL: baseURL,
    timeout: 10000,
  });

  // Apply interceptors
  addPlatformInterceptor(client);
  AuthInterceptor(client);

  return client;
};

const API_BASE_URLS = {
  account: 'http://127.0.0.1:8000',
};

export const AccountApiClient = createApiClient(API_BASE_URLS.account);
export const BaseURLForImages = 'http://192.168.100.14:8000';
