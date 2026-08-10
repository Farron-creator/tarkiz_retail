import { MantineProvider, MantineThemeOverride } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import '@/styles/globals.css';

const theme: MantineThemeOverride = {
  fontFamily: 'Nunito, sans-serif',
  headings: {
    fontFamily: 'Nunito, sans-serif',
  },
};

type Props = {
  children: React.ReactNode;
};

export const StyleProvider: React.FC<Props> = ({ children }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    const root = document.getElementById('root');
    root?.scrollTo(0, 0);
  }, [pathname]);

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
      <Notifications autoClose={5000} />
      <ModalsProvider
        modalProps={{
          styles: {
            title: {
              fontWeight: 700,
              fontSize: 16,
            },
          },
        }}
        labels={{ confirm: 'Konfirmasi', cancel: 'Batal' }}
      >
        {children}
      </ModalsProvider>
    </MantineProvider>
  );
};
