import { ActionIcon, Button, Menu, Text, Image } from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconArrowBarUp, IconCheck, IconDots } from '@tabler/icons-react';
import { useParams } from 'react-router-dom';

import { LoadingScreen } from '@/components/elements';
import { Navbar } from '@/components/navigation';
import { dayjs } from '@/lib/dayjs';
import { formatCurrency } from '@/utils/format';

import { useCancelSale, useSale } from '../api';
import { SaleStatus } from '../components';
import { useReactToPrint } from 'react-to-print';
import { useCompany, useFile } from '@/features/company';
import { useOutletContext } from '@/features/outlet';
import { Capacitor } from '@capacitor/core';


import { registerPlugin } from '@capacitor/core';

interface EchoPlugin {
    echo(options: { value: string }): Promise<{ value: string }>;
}

const Echo = registerPlugin<EchoPlugin>('Echo');

export const SaleDetail: React.FC = () => {
  const { id } = useParams<'id'>();
  const { data, isLoading, isError } = useSale({ id: parseInt(id!) });
  const cancelMutation = useCancelSale();
  const { outlet } = useOutletContext();
  const { data: company } = useCompany({ id: outlet?.company.id ?? 0, });
  const { data: file } = useFile({ id: company?.logo ?? 0, });

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

  async function handlePrint() {
    if (Capacitor.getPlatform() === 'web') {
      window.print();
    } else if (Capacitor.getPlatform() === 'android') {
      // Empty function or custom behavior for Android
      // insert company name to data
      const updatedDataSale = { ...data, "company": outlet?.company.name };
      const { value } = await Echo.echo({ value: JSON.stringify(updatedDataSale)});
      console.log('Response from native:', value);
    }
  }

  if (isLoading || isError) return <LoadingScreen />;

  return (
    <main className="bg-white min-h-screen pb-6 relative">
      <Navbar />

      <section className="flex flex-col items-center justify-center mt-8">
        <div className="bg-blue-100 text-blue-600 p-2 rounded-lg w-20 h-20">
        {file?.path ? (
          <Image
            
            radius="md"
            h={100}
            w="auto"
            fit="scale-down"
            src={file.path}
          />
        ) : (
          <IconArrowBarUp className="w-8 h-8" />
        )}
        </div>
        <div className="font-bold text-lg mt-2">Penjualan</div>
      </section>

      <section className="px-5 py-4">
        <section className="border-b border-dashed border-gray-400 pb-4">
          <div className="flex items-center justify-between text-sm mb-3">
            <div className="text-gray-600 font-medium">Kode</div>
            <div className="font-bold">{data.code}</div>
          </div>
          <div className="flex items-center justify-between text-sm mb-3">
            <div className="text-gray-600 font-medium">Customer</div>
            <div className="font-bold">{data.customer}</div>
          </div>
          <div className="flex items-center justify-between text-sm mb-3">
            <div className="text-gray-600 font-medium">Tanggal Transaksi</div>
            <div className="font-bold">{dayjs(data.date).format('D MMMM YYYY HH:mm')}</div>
          </div>
          <div className="flex items-center justify-between text-sm mb-3">
            <div className="text-gray-600 font-medium">Status</div>
            <SaleStatus status={data.status} />
          </div>
          <div className="flex items-center justify-between text-sm mb-3">
            <div className="text-gray-600 font-medium">Pegawai</div>
            <div className="font-bold">{data.user.name}</div>
          </div>
          <div className="text-sm mt-3">
            <div className="text-gray-600 font-medium mb-1">Catatan</div>
            <div className="text-gray-800 text-xs font-medium">
              {data.note || '(tidak ada catatan)'}
            </div>
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
        <Button fullWidth onClick={handlePrint}>Cetak</Button>
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
