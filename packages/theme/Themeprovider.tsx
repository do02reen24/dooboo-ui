import {Colors, ThemeParam, ThemeType, colors, dark, light} from './colors';
import {
  Theme as DefaultTheme,
  ThemeProvider as EmotionThemeProvider,
  withTheme,
} from '@emotion/react';
import React, {useEffect, useState} from 'react';

import {ColorSchemeName} from 'react-native';
import createDoobooContext from './createDoobooContext';
import useColorScheme from './useColorScheme';
import {useMediaQuery} from 'react-responsive';

interface Context {
  themeType: ColorSchemeName;
  media: {
    isPortrait: boolean;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
  };
  theme: DefaultTheme;
  changeThemeType: (themeType?: ColorSchemeName) => void;
  colors: Colors;
}

const [useCtx, DoobooProvider] = createDoobooContext<Context>();

interface Props {
  children?: React.ReactElement;
  initialThemeType?: ThemeType;
  customTheme?: ThemeParam;
}

function ThemeProvider({
  children,
  initialThemeType,
  customTheme,
}: Props): React.ReactElement {
  const isPortrait = useMediaQuery({orientation: 'portrait'});
  const isMobile = useMediaQuery({maxWidth: 767});
  const isTablet = useMediaQuery({minWidth: 767, maxWidth: 992});
  const isDesktop = useMediaQuery({minWidth: 992});

  const colorScheme = useColorScheme();

  const [themeType, setThemeType] = useState(initialThemeType ?? colorScheme);

  useEffect(() => {
    if (!initialThemeType) setThemeType(colorScheme);
  }, [colorScheme, initialThemeType]);

  const changeThemeType = (themeTypeProp?: ColorSchemeName): void => {
    if (!themeTypeProp) {
      setThemeType(themeType === 'light' ? 'dark' : 'light');

      return;
    }

    setThemeType(themeTypeProp);
  };

  const theme = {
    light: {...light, ...customTheme?.light},
    dark: {...dark, ...customTheme?.dark},
  }[themeType ?? 'light'];

  const media = {
    isPortrait,
    isMobile,
    isTablet,
    isDesktop,
  };

  return (
    <DoobooProvider
      value={{
        media,
        themeType,
        changeThemeType,
        theme,
        colors,
      }}
    >
      <EmotionThemeProvider theme={{...theme, ...media}}>
        {children}
      </EmotionThemeProvider>
    </DoobooProvider>
  );
}

export {useCtx as useTheme, ThemeProvider, withTheme};
