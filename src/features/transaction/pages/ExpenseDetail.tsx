import { ActionIcon, Button, Menu, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconArrowBarToDown, IconCheck, IconDots } from '@tabler/icons-react';
import { useParams } from 'react-router-dom';

import { Navbar } from '@/components/navigation';
import { dayjs } from '@/lib/dayjs';
import { formatCurrency } from '@/utils/format';

import { useCancelExpense, useExpense } from '../api';
import { ExpenseStatus } from '../components';

export const ExpenseDetail: React.FC = () => {
  const { id } = useParams<'id'>();
  const { data, isLoading, isError } = useExpense({ id: parseInt(id!) });
  const cancelMutation = useCancelExpense();

  function handleCancel() {
    modals.openConfirmModal({
      title: 'Batalkan Transaksi',
      children: <Text size="sm">Apakah anda yakin untuk membatalkan transaksi ini?</Text>,
      centered: true,
      closeOnConfirm: false,
      onConfirm: async () => {
        await cancelMutation.mutateAsync(
          { id: parseInt(id!) },
          {
            onSuccess: () => {
              notifications.show({
                message: 'Transaksi berhasil dibatalkan',
                color: 'green',
                icon: <IconCheck />,
              });
              modals.closeAll();
            },
            onError: () => {
              notifications.show({
                message: 'Transaksi tidak bisa dibatalkan',
                color: 'red',
              });
            },
          }
        );
      },
    });
  }

  if (isLoading || isError) return null;

  return (
    <main className="bg-white min-h-screen pb-6 relative">
      <Navbar />

      <section className="flex flex-col items-center justify-center mt-8">
        <div className="bg-orange-100 text-orange-600 p-2 rounded-lg">
          <IconArrowBarToDown className="w-8 h-8" />
        </div>
        <div className="font-bold text-lg mt-2">Pembelian</div>
      </section>

      <section className="px-5 py-4">
        <section className="border-b border-dashed border-gray-400 pb-4">
          <div className="flex items-center justify-between text-sm mb-3">
            <div className="text-gray-600 font-medium">Kode</div>
            <div className="font-bold">{data.code}</div>
          </div>
          <div className="flex items-center justify-between text-sm mb-3">
            <div className="text-gray-600 font-medium">Tanggal Transaksi</div>
            <div className="font-bold">{dayjs(data.date).format('D MMMM YYYY HH:mm')}</div>
          </div>
          <div className="flex items-center justify-between text-sm mb-3">
            <div className="text-gray-600 font-medium">Status</div>
            <ExpenseStatus status={data.status} />
          </div>
          <div className="flex items-center justify-between text-sm mb-3">
            <div className="text-gray-600 font-medium">Pegawai</div>
            <div className="font-bold">{data.user.name}</div>
          </div>
          <div className="text-sm mt-3">
            <div className="text-gray-600 font-medium mb-1">Catatan</div>
            <div className="text-xs font-medium">{data.note}</div>
          </div>
        </section>

        <div className="py-3">
          {data.items.map((item) => (
            <div key={item.id} className="flex justify-between mb-3 last:mb-0">
              <div>
                <div className="font-bold">{item.product.name}</div>
                <div className="text-gray-600 text-xs font-medium">
                  {item.quantity} {item.product.unit} x {formatCurrency(item.price)}
                </div>
              </div>
              <div className="font-bold">{formatCurrency(item.total)}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t text-base border-dashed border-gray-400 pt-4">
          <div className="font-bold">Total</div>
          <div className="font-bold">{formatCurrency(data.total)}</div>
        </div>
      </section>

      <div className="fixed bottom-0 bg-white max-w-md py-4 px-5 flex w-full items-center space-x-4 border-t border-gray-200">
        <Button fullWidth>Cetak</Button>

        {data.status == 'accepted' && (
          <Menu position="top-end" width={200}>
            <Menu.Target>
              <ActionIcon variant="outline" color="gray" size="lg">
                <IconDots />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item color="red" onClick={handleCancel}>
                Batalkan Transaksi
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
      </div>
    </main>
  );
};
