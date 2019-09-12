/* @flow */
/* eslint-disable no-redeclare */

import { useContext, useMemo } from 'react';
import deepmerge from 'deepmerge';
import createReactContext, { type Context } from 'create-react-context';
import createThemeProvider, {
  type ThemeProviderType,
} from '@callstack/react-theme-provider/lib/createThemeProvider';
import createWithTheme, {
  type WithThemeType,
} from '@callstack/react-theme-provider/lib/createWithTheme';
import DefaultTheme from '../styles/DefaultTheme';
import type { Theme, ThemeShape } from '../types';

type ThemingType<T, S> = {
  ThemeContext: Context<T>,
  ThemeProvider: ThemeProviderType<T>,
  withTheme: WithThemeType<T, S>,
  useTheme: () => T,
};

type $DeepShape<O: Object> = $Shape<
  $ObjMap<O, (<V: Object>(V) => $DeepShape<V>) & (<V>(V) => V)>
>;

function createTheming<T: Object, S>(defaultTheme: T): ThemingType<T, S> {
  const ThemeContext: Context<T> = createReactContext(defaultTheme);

  const ThemeProvider: ThemeProviderType<T> = createThemeProvider(
    defaultTheme,
    ThemeContext
  );
  const withTheme: WithThemeType<T, S> = createWithTheme(
    ThemeProvider,
    ThemeContext
  );

  const useTheme = (overrides?: $DeepShape<T>): T => {
    const theme = useContext(ThemeContext);
    const result = useMemo(
      () =>
        theme && overrides ? deepmerge(theme, overrides) : theme || overrides,
      [theme, overrides]
    );

    return result;
  };

  return {
    ThemeContext,
    ThemeProvider,
    withTheme,
    useTheme,
  };
}

export const {
  ThemeContext,
  ThemeProvider,
  withTheme,
  useTheme,
}: ThemingType<?Theme, ThemeShape> = createTheming(DefaultTheme);
