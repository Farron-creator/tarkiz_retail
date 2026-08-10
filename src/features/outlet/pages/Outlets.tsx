import { Button } from '@mantine/core';
import { IconBuildingStore, IconLogout } from '@tabler/icons-react';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from '@/features/auth';
import { clsx } from '@/utils/format';

import { useOutletContext } from '../hooks';

export const Outlets: React.FC = () => {
  const { creds, logout } = useAuth();
  const [selected, setSelected] = useState<number | null>(null);
  const { outlet, setOutlet, outlets } = useOutletContext();

  function handleSelect() {
    if (selected == null) return;
    setOutlet(selected);
  }

  if (!creds) return <Navigate to="/login" replace />;
  if (outlet) return <Navigate to="/" replace />;

  return (
    <main className="pb-24">
      <header className="px-5 py-5 flex items-center justify-center">
        <h1 className="font-bold text-lg">Pilih Outlet</h1>
      </header>

      <div className="space-y-4 px-5">
        {outlets.length == 0 && <div>Anda tidak mempunyai akses ke aplikasi Outlet.</div>}
        {outlets.map((outlet) => (
          <div
            key={outlet.id}
            className={clsx(
              'cursor-pointer border shadow shadow-gray-300 rounded-md w-full p-4 transition',
              selected == outlet.id
                ? 'bg-blue-50 border-blue-200 bg-opacity-40'
                : 'bg-white border-gray-100'
            )}
            onClick={() => setSelected(outlet.id)}
            aria-hidden="true"
          >
            <div className="flex">
              <div className="p-2 rounded-lg flex-shrink-0 bg-blue-100">
                <IconBuildingStore className="text-blue-600 w-6 h-6" stroke={2} />
              </div>
              <div className="flex-grow pl-4">
                <div className="">
                  <h2 className="font-bold text-base line-clamp-1">{outlet.name}</h2>
                  <p className="text-sm text-gray-600 line-clamp-1">{outlet.company.name}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-5 mt-8">
        <Button
          onClick={() => logout()}
          leftIcon={<IconLogout size={14} />}
          color="red"
          variant="subtle"
          fullWidth
        >
          Logout
        </Button>
      </div>

      <div className="max-w-md mx-auto fixed bottom-0 w-full p-4 bg-white">
        <Button disabled={selected == null} fullWidth onClick={handleSelect}>
          Pilih Outlet
        </Button>
      </div>
    </main>
  );
};
