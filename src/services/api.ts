import axios, { AxiosError } from 'axios';

import {
  AUTHORIZATION_HEADER_NAME,
  getAuthorizationHeaderValue,
} from '../utils/auth';
import { COMMON } from '../utils/common';

const API_END_POINT = {
  POST_DETAILS: 'post/{0}/',
};

type API_METHOD = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export const getPostDetails = (postId: string) => {
  return authorizedRequest(
    COMMON.stringFormat(API_END_POINT.POST_DETAILS, postId),
    'GET',
  );
};

const baseRequest = (
  url: string,
  method: API_METHOD = 'GET',
  data?: object,
  headers?: { [key: string]: string },
  params?: { [key: string]: string },
): Promise<any> => {
  return apiClient
    .request({
      method,
      url,
      headers,
      data,
      params,
    })
    .then((response) => response.data.data)
    .catch((err: AxiosError | Error) =>
      Promise.reject({
        name: err.name,
        message: err.message,
        status: (err as AxiosError).response?.status || -1,
        data: (err as AxiosError).response?.data,
      }),
    );
};

const authorizedRequest = (
  url: string,
  method: API_METHOD = 'GET',
  data?: object,
  headers?: { [key: string]: string },
  params?: { [key: string]: string },
): Promise<any> => {
  return getAuthorizationHeaderValue().then((authHeaderValue) => {
    if (!headers) {
      headers = {};
    }

    headers[AUTHORIZATION_HEADER_NAME] = authHeaderValue || '';

    return baseRequest(url, method, data, headers, params);
  });
};

const apiClient = axios.create({
  baseURL: COMMON.apiBaseUrl,
  headers: {
    'Content-type': 'application/json',
  },
});
