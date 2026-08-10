import { App } from '@capacitor/app';
import { QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';

import { AuthProvider } from '@/features/auth';
import { OutletProvider } from '@/features/outlet';
import { queryClient } from '@/lib/react-query';

import { DateProvider } from './DateProvider';
import { ErrorProvider } from './ErrorProvider';
import { StyleProvider } from './StyleProvider';

type Props = {
  children: React.ReactNode;
};

const BackProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  useEffect(() => {
    App.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack) return navigate(-1);

      App.exitApp();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
};

export const AppProvider: React.FC<Props> = ({ children }) => {
  return (
    <ErrorProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <StyleProvider>
            <AuthProvider>
              <OutletProvider>
                <HelmetProvider>
                  <DateProvider>
                    <BackProvider>{children}</BackProvider>
                  </DateProvider>
                </HelmetProvider>
              </OutletProvider>
            </AuthProvider>
          </StyleProvider>
        </Router>
      </QueryClientProvider>
    </ErrorProvider>
  );
};
