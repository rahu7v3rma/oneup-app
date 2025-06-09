import * as Keychain from 'react-native-keychain';

interface TokenData {
  authToken: string | null;
  userData: any | null;
  tempAuthToken: string | null;
}

class TokenService {
  private static _instance: TokenService;

  private constructor() {}

  public static getInstance(): TokenService {
    if (!TokenService._instance) {
      TokenService._instance = new TokenService();
    }
    return TokenService._instance;
  }

  // Store the authentication token
  public async setAuthToken(token: string): Promise<boolean> {
    try {
      await Keychain.setGenericPassword('auth_token', token, {
        service: 'auth_token',
      });
      return true;
    } catch (error) {
      console.error('Failed to store auth token', error);
      return false;
    }
  }

  // Retrieve the authentication token
  public async getAuthToken(): Promise<string | null> {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: 'auth_token',
      });
      return credentials ? credentials.password : null;
    } catch (error) {
      console.error('Failed to retrieve auth token', error);
      return null;
    }
  }

  // Store temporary auth token (for email verification flow)
  public async setTempAuthToken(token: string): Promise<boolean> {
    try {
      await Keychain.setGenericPassword('temp_auth_token', token, {
        service: 'temp_auth_token',
      });
      return true;
    } catch (error) {
      console.error('Failed to store temp auth token', error);
      return false;
    }
  }

  // Retrieve temporary auth token
  public async getTempAuthToken(): Promise<string | null> {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: 'temp_auth_token',
      });
      return credentials ? credentials.password : null;
    } catch (error) {
      console.error('Failed to retrieve temp auth token', error);
      return null;
    }
  }

  // Store user data
  public async setUserData(userData: any): Promise<boolean> {
    try {
      await Keychain.setGenericPassword('user_data', JSON.stringify(userData), {
        service: 'user_data',
      });
      return true;
    } catch (error) {
      console.error('Failed to store user data', error);
      return false;
    }
  }

  // Retrieve user data
  public async getUserData(): Promise<any | null> {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: 'user_data',
      });
      return credentials ? JSON.parse(credentials.password) : null;
    } catch (error) {
      console.error('Failed to retrieve user data', error);
      return null;
    }
  }

  // Clear all tokens and user data
  public async clearAllTokens(): Promise<boolean> {
    try {
      await Keychain.resetGenericPassword({ service: 'auth_token' });
      await Keychain.resetGenericPassword({ service: 'user_data' });
      await Keychain.resetGenericPassword({ service: 'temp_auth_token' });
      return true;
    } catch (error) {
      console.error('Failed to clear tokens', error);
      return false;
    }
  }

  // Get all token data at once
  public async getTokenData(): Promise<TokenData> {
    const [authToken, userData, tempAuthToken] = await Promise.all([
      this.getAuthToken(),
      this.getUserData(),
      this.getTempAuthToken(),
    ]);

    return {
      authToken,
      userData,
      tempAuthToken,
    };
  }
}

export default TokenService.getInstance();
