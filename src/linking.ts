const linking = {
  prefixes: ['oneupapp://'],
  config: {
    screens: {
      ResetPassword: {
        path: 'reset-password',
        parse: {
          token: (token: string) => `${token}`,
        },
      },
    },
  },
};
export default linking;
