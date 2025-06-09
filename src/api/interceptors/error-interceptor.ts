import axios from 'axios';

const ErrorInterceptor = () => {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            console.error(
              'Bad Request: The server could not understand the request due to invalid syntax.',
            );
            break;
          case 401:
            console.error(
              'Unauthorized: Access is denied due to invalid credentials.',
            );
            break;
          case 403:
            console.error(
              'Forbidden: You do not have permission to access this resource.',
            );
            break;
          case 404:
            console.error(
              'Not Found: The requested resource could not be found.',
            );
            break;
          case 409:
            console.error(
              'Conflict: The request could not be completed due to a conflict with the current state of the resource.',
            );
            break;
          default:
            if (error.response.status >= 500) {
              console.error(
                'Server Error: An error occurred on the server. Please try again later.',
              );
            }
            break;
        }
      } else {
        console.error(
          'Network Error: There was a problem with the request. Please check your network connection.',
        );
      }
      return Promise.reject(error);
    },
  );
};

export default ErrorInterceptor;
