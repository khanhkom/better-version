import React from 'react';
import { ThemeProvider as RestyleProvider } from '@shopify/restyle';
import theme from '../restyle';

interface RestyleThemeProviderProps {
  children: React.ReactNode;
}

const RestyleThemeProvider: React.FC<RestyleThemeProviderProps> = ({
  children,
}) => {
  return <RestyleProvider theme={theme}>{children}</RestyleProvider>;
};

export default RestyleThemeProvider;
