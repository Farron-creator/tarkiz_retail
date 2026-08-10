import { ActionIcon, Button } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IconChevronLeft } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

import { useOutletContext } from '@/features/outlet';

import { SupplierCreateForm, SupplierList } from '../components';

export const Suppliers: React.FC = () => {
  const { outlet } = useOutletContext();

  function handleAdd() {
    if (!outlet?.company.id) return;

    openModal({
      title: 'Tambah Supplier',
      children: <SupplierCreateForm company={outlet.company.id} />,
    });
  }

  return (
    <main>
      <header className="px-4 sticky top-0 z-10 bg-white py-3.5 border-b border-gray-200">
        <Link to="/" className="flex items-center">
          <ActionIcon variant="transparent">
            <IconChevronLeft className="text-gray-800" />
          </ActionIcon>
          <div className="font-bold ml-4">Kembali</div>
        </Link>
      </header>

      <section className="flex items-center justify-between px-5 mt-7 mb-4">
        <h1 className="text-lg font-bold">Data Supplier</h1>
        <Button size="xs" onClick={handleAdd}>
          Tambah
        </Button>
      </section>

      <SupplierList />
    </main>
  );
};
