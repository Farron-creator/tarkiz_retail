import { Button } from '@mantine/core';
import { useState } from 'react';

import { PurchaseList, SaleList } from '../components';

export const Transactions: React.FC = () => {
  const [selected, setSelected] = useState('sale');

  function renderItem() {
    switch (selected) {
      case 'sale':
        return <SaleList />;
      case 'purchase':
        return <PurchaseList />;
      default:
        return null;
    }
  }

  return (
    <main>
      <header className="px-5 mt-8 mb-4">
        <h1 className="font-bold text-xl">Riwayat Transaksi</h1>
      </header>

      <section className="flex items-center px-5 mb-4">
        <Button
          radius="lg"
          variant={selected == 'sale' ? 'filled' : 'light'}
          onClick={() => setSelected('sale')}
          className="mr-2"
        >
          Penjualan
        </Button>
        <Button
          radius="lg"
          variant={selected == 'purchase' ? 'filled' : 'light'}
          onClick={() => setSelected('purchase')}
          className="mr-2"
        >
          Pengeluaran
        </Button>
      </section>

      <section className="pb-24">{renderItem()}</section>
    </main>
  );
};
