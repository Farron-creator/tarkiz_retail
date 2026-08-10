import { ActionIcon, Button, Card, Select, TextInput } from '@mantine/core';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconCategory, IconCheck, IconEdit, IconSearch, IconTrash } from '@tabler/icons-react';
import { Authorization } from '@/features/auth';
import { useForm } from '@mantine/form';

import { Table } from '@/components/elements';
import { dayjs } from '@/lib/dayjs';

import { useCustomers, useDeleteCustomer } from '../api';
import { Customer, CustomerQuery } from '../types';
import { CustomerUpdateForm } from './CustomerUpdateForm';

const initialParams: CustomerQuery = {
  limit: 5,
  page: 1,
};

export const CustomerTable: React.FC = () => {
  const [params, setParams] = useState(initialParams);
  const { data } = useCustomers({ params });
  const deleteMutation = useDeleteCustomer();
  const form = useForm<CustomerQuery>({
    initialValues: {
      keyword: '',
      status: undefined,
    },
  });

  function handlePage(page: number) {
    setParams({ ...params, page });
  }

  function handleRemove(id: number) {
    return () => {
      modals.openConfirmModal({
        title: 'Hapus Customer',
        children: <h2 >Apakah anda yakin untuk menghapus customer ini?</h2>,
        centered: true,
        closeOnConfirm: false,
        onConfirm: async () => {
          await deleteMutation.mutateAsync(
            { id },
            {
              onSuccess: () => {
                notifications.show({
                  message: 'Customer berhasil dihapus',
                  color: 'green',
                  icon: <IconCheck />,
                });
                modals.closeAll();
              },
              onError: () => {
                notifications.show({
                  message: 'Customer tidak bisa dihapus',
                  color: 'red',
                });
              },
            }
          );
        },
      });
    };
  }

  function handleUpdate(customer: Customer) {
    return () => {
      modals.open({
        title: 'Update Customer',
        children: <CustomerUpdateForm customer={customer} />,
      });
    };
  }
  const handleSubmit = form.onSubmit(async (values) => {
    setParams(values);
  });

  function handleReset() {
    form.reset();
    setParams({});
  }

  return (
    <Card p="lg" shadow="sm">
      <div className="flex items-center justify-between mb-4">
        <div className="font-bold text-lg">
          <h2 className="text-gray-800 inline">Customers</h2>
        </div>
        
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4 mb-4">
        <div className="col-span-6 sm:col-span-6 md:col-span-4 lg:col-span-3">
          <TextInput
            {...form.getInputProps('keyword')}
            type="search"
            placeholder="Search"
            icon={<IconSearch size={14} />}
          />
        </div>

        <div className="col-span-6 sm:col-span-6 md:col-span-3 lg:col-span-2">
          <Select
            {...form.getInputProps('status')}
            placeholder="Status"
            icon={<IconCategory size={14} />}
            value={form.values['status'] ?? null}
            data={[
              { label: 'Semua', value: '' },
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' },
            ]}
          />
        </div>

        <div className="flex space-x-3">
          <Button type="submit">Cari</Button>
          <Button variant="default" type="button" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </form>

      <Card.Section>
        {/* <Table
          header={['Nama', 'Address', 'Created At', '']}
          items={data?.result}
          onPageChange={handlePage}
          metadata={data?.metadata}
          renderItem={(customer) => (
            <tr key={customer.id}>
              <td>{customer.name}</td>
              <td>{customer.address}</td>
              <td>{dayjs(customer.createdAt).format('D MMMM YYYY')}</td>
              <td>
              
                <Authorization role={['owner']}>
                  <div className="flex items-center space-x-2">
                  <Button component={Link} to={`/customer/${customer.id}`} size="xs">
                    Detail
                  </Button>
                    <ActionIcon
                      title="Remove customer"
                      onClick={handleRemove(customer.id)}
                      className="hover:bg-gray-100 active:bg-gray-200 text-red-500 rounded-full p-1"
                    >
                      <IconTrash size={18} />
                    </ActionIcon>
                    <ActionIcon
                      title="Update customer"
                      onClick={handleUpdate(customer)}
                      className="hover:bg-gray-100 active:bg-gray-200 text-gray-700 rounded-full p-1"
                    >
                      <IconEdit size={18} />
                    </ActionIcon>
                  </div>
                </Authorization>
              </td>
            </tr>
          )}
        /> */}
      </Card.Section>
    </Card>
  );
};
