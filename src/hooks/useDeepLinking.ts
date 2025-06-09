import { useEffect } from 'react';
import { Linking } from 'react-native';

import { navigationRef } from '../navigation';

export default function useDeepLinking() {
  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      const url = event.url;
      try {
        const parsedUrl = new URL(url);
        const path = parsedUrl.pathname;
        const token = parsedUrl.searchParams.get('token');

        if (path === '/reset-password' && token && navigationRef.isReady()) {
          navigationRef.navigate('ResetPassword', { token });
        }
      } catch (err) {
        console.warn('Invalid deep link URL:', url);
      }
    };

    // Handle when app is open
    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Handle initial URL (when app is opened from a deep link)
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);
}
