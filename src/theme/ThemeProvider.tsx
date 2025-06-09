import { createContext, ReactNode, useContext, useState } from 'react';

import { darkColors, lightColors } from './colors';

const ThemeContext = createContext({
  theme: 'dark',
  themeColors: darkColors,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const defaultTheme = 'dark';
  const [theme, setTheme] = useState(defaultTheme);
  const [themeColors, setThemeColors] = useState(
    defaultTheme === 'dark' ? darkColors : lightColors,
  );

  const toggleTheme = () => {
    const prevTheme = theme;
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    setThemeColors(prevTheme === 'dark' ? lightColors : darkColors);
  };

  return (
    <ThemeContext.Provider value={{ theme, themeColors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
