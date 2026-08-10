import { Button } from '@mantine/core';
import { ErrorBoundary } from 'react-error-boundary';

interface Props {
  children: React.ReactNode;
}

const ErrorFallback = () => {
  return (
    <div className="text-red-500 flex flex-col h-screen justify-center items-center" role="alert">
      <h2 className="text-lg font-semibold">Terjadi Kesalahan</h2>
      <Button className="mt-4" onClick={() => window.location.assign(window.location.origin)}>
        Refresh
      </Button>
    </div>
  );
};

export const ErrorProvider: React.FC<Props> = ({ children }) => {
  return <ErrorBoundary FallbackComponent={ErrorFallback}>{children}</ErrorBoundary>;
};
