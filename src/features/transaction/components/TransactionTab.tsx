import { Button } from '@mantine/core';
import { useState } from 'react';

type Props = {
  onChange: (status: string) => void;
};

export const TransactionTab: React.FC<Props> = ({ onChange }) => {
  const [selected, setSelected] = useState<'penjualan' | 'Pengeluaran'>('penjualan');

  function handleClick(status: 'penjualan' | 'Pengeluaran') {
    return () => {
      setSelected(status);
      onChange(status);
    };
  }

  return (
    <section className="flex items-center px-5 mb-4">
      <Button
        radius="lg"
        variant={selected == 'penjualan' ? 'filled' : 'light'}
        onClick={handleClick('penjualan')}
        className="mr-2"
      >
        Penjualan
      </Button>
      <Button
        radius="lg"
        variant={selected == 'Pengeluaran' ? 'filled' : 'light'}
        onClick={handleClick('Pengeluaran')}
        className="mr-2"
      >
        Pengeluaran
      </Button>
    </section>
  );
};
