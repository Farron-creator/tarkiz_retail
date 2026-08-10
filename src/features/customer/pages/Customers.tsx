import { Button } from '@mantine/core';
import { modals } from '@mantine/modals';

import { Authorization } from '@/features/auth';

import { CustomerCreateForm, CustomerTable } from '../components';

export const Customers: React.FC = () => {
  function handleAdd() {
    modals.open({
      title: 'Tambah Customer',
       children: <CustomerCreateForm />,
        // children: <h1></h1>
    });
  }

  return (
    <main>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Customer</h1>
        {/* <Button onClick={handleAdd}>Tambah</Button> */}
        <Authorization role={['owner']}>
          <Button onClick={handleAdd}>Tambah</Button>
        </Authorization>
      </div>

      <section className="mb-8">
        <CustomerTable />
      </section>
    </main>
  );
};
