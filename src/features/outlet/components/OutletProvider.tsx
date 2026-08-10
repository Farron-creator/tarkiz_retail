import { useEffect, useState } from 'react';

import { LoadingScreen } from '@/components/elements';
import { useAuth } from '@/features/auth';
import storage from '@/utils/storage';

import { useOutlets } from '../api';
import { OutletContext } from '../contexts';
import { Outlet } from '../types';

type Props = {
  children: React.ReactNode;
};

export const OutletProvider: React.FC<Props> = ({ children }) => {
  const [selected, setSelected] = useState<Outlet | null>(storage.getOutlet());
  const { creds } = useAuth();
  const { data, isLoading } = useOutlets({ params: { limit: -1 }, config: { enabled: !!creds } });

  function setOutlet(id: number | null) {
    if (id == null) return setSelected(null);

    if (isLoading) return;

    const filteredOutlet = data?.result.filter((outlet) => outlet.id == id);

    if (filteredOutlet?.length == 0 || !filteredOutlet) {
      return setSelected(null);
    }

    storage.setOutlet(filteredOutlet[0]);
    setSelected(filteredOutlet[0]);
  }

  useEffect(() => {
    if (creds == null) {
      storage.clear();
      setSelected(null);
    }
  }, [creds]);

  if (isLoading && creds != null) return <LoadingScreen />;

  return (
    <OutletContext.Provider value={{ outlet: selected, setOutlet, outlets: data?.result ?? [] }}>
      {children}
    </OutletContext.Provider>
  );
};
