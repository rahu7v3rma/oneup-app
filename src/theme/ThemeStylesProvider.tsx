import { createContext, ReactNode, useContext } from 'react';

import { createStyles, defaultStyles } from '../styles';

import { useTheme } from './ThemeProvider';

const ThemeStylesContext = createContext(defaultStyles);

export const ThemeStylesProvider = ({ children }: { children: ReactNode }) => {
  const { themeColors } = useTheme();
  const styles = createStyles(themeColors);

  return (
    <ThemeStylesContext.Provider value={styles}>
      {children}
    </ThemeStylesContext.Provider>
  );
};

export const useThemeStyles = () => useContext(ThemeStylesContext);
