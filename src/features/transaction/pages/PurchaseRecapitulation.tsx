import { Select, Table } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconAdjustments, IconCalendar, IconCategory } from '@tabler/icons-react';
import { useMemo, useState } from 'react';

import { Navbar } from '@/components/navigation';
import { Authorization } from '@/features/auth';
import { OutletSelect, useOutletContext } from '@/features/outlet';
import { formatCurrency } from '@/utils/format';

import { usePurchasesSummary } from '../api';
import { PurchasesSummary, PurchasesSummaryQuery, TransactionStatus } from '../types';

export const PurchaseRecapitulation: React.FC = () => {
  const { outlet } = useOutletContext();
  const [params, setParams] = useState<PurchasesSummaryQuery>({
    outlet: outlet?.id,
    status: ['accepted'],
    startDate: new Date(),
    endDate: new Date(),
  });

  const { data, isLoading, isError } = usePurchasesSummary({ params });

  const result = useMemo(() => {
    if (!data) return [];

    return (data ?? []).reduce((acc, sale) => {
      const existingSummary = acc.find((s) => s.id === sale.id);
      if (existingSummary) {
        existingSummary.quantity += sale.quantity;
        existingSummary.total += sale.total;
      } else {
        acc.push({
          id: sale.id,
          name: sale.name,
          quantity: sale.quantity,
          total: sale.total,
        });
      }
      return acc;
    }, [] as Omit<PurchasesSummary, 'date'>[]);
  }, [data]);

  const ErrorState = () => (
    <Table.Tr>
      <Table.Td colSpan={4} className="text-center text-red-600">
        <div className="py-4">Terjadi Kesalahan</div>
      </Table.Td>
    </Table.Tr>
  );

  const LoadingState = () => (
    <>
      <Table.Tr>
        <Table.Td colSpan={4}>
          <div className="bg-gray-200 w-full h-4 rounded-sm animate-pulse"></div>
        </Table.Td>
      </Table.Tr>
      <Table.Tr>
        <Table.Td colSpan={4}>
          <div className="bg-gray-200 w-full h-4 rounded-sm animate-pulse"></div>
        </Table.Td>
      </Table.Tr>
      <Table.Tr>
        <Table.Td colSpan={4}>
          <div className="bg-gray-200 w-full h-4 rounded-sm animate-pulse"></div>
        </Table.Td>
      </Table.Tr>
    </>
  );

  return (
    <main className="bg-gray-50">
      <Navbar title="Rekapitulasi Pembelian" withBorder to="/" />

      <section className="px-5 space-y-2">
        <Authorization role={['owner', 'superadmin']}>
          <OutletSelect
            placeholder="Pilih Outlet"
            leftSection={<IconCategory size={14} />}
            value={params.outlet?.toString()}
            onChange={(v) => {
              if (v == null) return;

              setParams({
                ...params,
                outlet: v,
              });
            }}
          />
        </Authorization>
        <DatePickerInput
          type="range"
          valueFormat="D MMMM YYYY"
          placeholder="Rentang Tanggal"
          leftSection={<IconCalendar size={14} />}
          value={[params.startDate ?? null, params.endDate ?? null]}
          allowSingleDateInRange
          onChange={([startDate, endDate]) =>
            setParams({
              ...params,
              startDate: startDate ?? undefined,
              endDate: endDate ?? undefined,
            })
          }
        />
        <Select
          leftSection={<IconAdjustments size={14} />}
          data={[
            { value: 'accepted', label: 'Diterima' },
            { value: 'approved', label: 'Direkap' },
            { value: 'canceled', label: 'Batal' },
          ]}
          value={params.status ? params.status[0] : undefined}
          onChange={(v) => {
            if (v == null) return;

            setParams({ ...params, status: [v as TransactionStatus] });
          }}
        />
      </section>

      <section className="px-5 my-4">
        <div className="overflow-auto relative shadow-lg shadow-gray-200 bg-white rounded-md">
          <Table>
            <Table.Thead>
              <Table.Tr>
                <th>Barang</th>
                <th>Jumlah</th>
                <th>Harga Rata-rata</th>
                <th>Total</th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {isLoading && <LoadingState />}
              {isError && <ErrorState />}
              {!isLoading && !isError && (
                <>
                  {result.map((item) => (
                    <Table.Tr key={item.id}>
                      <Table.Td className="text-left">{item.name}</Table.Td>
                      <Table.Td className="text-left">{item.quantity}</Table.Td>
                      <Table.Td className="text-right">{formatCurrency(item.total / item.quantity)}</Table.Td>
                      <Table.Td className="text-right">{formatCurrency(item.total)}</Table.Td>
                    </Table.Tr>
                  ))}
                  <Table.Tr className="bg-gray-50">
                    <Table.Td colSpan={3} className="w-full">
                      <div className="font-bold text-center">Total Pembelian</div>
                    </Table.Td>
                    <Table.Td className="text-right">
                      <span className="font-bold text-right">
                        {formatCurrency(
                          result.reduce((prev, curr) => {
                            return prev + curr.total;
                          }, 0)
                        )}
                      </span>
                    </Table.Td>
                  </Table.Tr>
                </>
              )}
            </Table.Tbody>
          </Table>
        </div>
      </section>
    </main>
  );
};
