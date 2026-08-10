import { Button } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconChevronRight } from '@tabler/icons-react';

import { useOutletContext } from '@/features/outlet';

import { useInfiniteSuppliers } from '../api';
import { Supplier, SupplierQuery } from '../types';

import { SupplierUpdateForm } from './SupplierUpdateForm';

const defaultParams: SupplierQuery = {
  page: 1,
  limit: 5,
};

export const SupplierList: React.FC = () => {
  const { outlet } = useOutletContext();
  const { data, isFetching, hasNextPage, fetchNextPage } = useInfiniteSuppliers({
    params: { ...defaultParams, company: outlet?.company.id },
  });

  const suppliers =
    data?.pages.reduce((prev, { result }) => [...prev, ...result], [] as Supplier[]) ?? [];

  function handleUpdate(supplier: Supplier) {
    return () => {
      if (!outlet?.company) return;

      modals.open({
        title: 'Update Supplier',
        children: <SupplierUpdateForm supplier={supplier} company={outlet.company.id} />,
      });
    };
  }

  return (
    <div>
      {suppliers.map((supplier) => (
        <div
          key={supplier.id}
          className="flex items-center justify-between py-4 border-b border-gray-300 active:bg-gray-100 transition px-5 cursor-pointer"
          onClick={handleUpdate(supplier)}
          aria-hidden
        >
          <div className="font-semibold">{supplier.name}</div>
          <div>
            <IconChevronRight className="w-6 h-6 text-gray-600" stroke={1.3} />
          </div>
        </div>
      ))}
      <div className="px-5">
        {isFetching ? (
          <div className="text-center">loading...</div>
        ) : (
          hasNextPage && (
            <Button variant="subtle" fullWidth onClick={() => fetchNextPage()}>
              Lihat Semua
            </Button>
          )
        )}
      </div>
    </div>
  );
};
