import { Select, Table } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconAdjustments, IconCalendar, IconCategory } from '@tabler/icons-react';
import { useMemo, useState } from 'react';

import { Navbar } from '@/components/navigation';
import { Authorization } from '@/features/auth';
import { OutletSelect, useOutletContext } from '@/features/outlet';
import { formatCurrency, formatScale } from '@/utils/format';

import { usePurchasesSummary, useSalesSummary } from '../api';
import { PurchasesSummary, PurchasesSummaryQuery, SalesSummary, SalesSummaryQuery, TransactionStatus } from '../types';
import { ProductStock, ProductStockQuery, useProduct, useProductStock } from '@/features/product';



export const StockRecapitulation: React.FC = () => {
  const { outlet } = useOutletContext();
  //set saldo awal

  

  // const [params, setParams] = useState<PurchasesSummaryQuery>({
  //   outlet: outlet?.id,
  //   status: ['accepted'],
  //   startDate: new Date(),
  //   endDate: new Date(),
  // });

  // const { data: dataPembelian, isLoading, isError } = usePurchasesSummary({ params });


  const [params, setParams] = useState<ProductStockQuery>({
    outlet: outlet?.id,
    status: ['accepted'],
    startDate: new Date(),
    endDate: new Date(),
  });

  const { data: dataProductStock, isLoading, isError } = useProductStock({ params });

  
  const result = useMemo(() => {
    
    if (!dataProductStock) return [];

    return (dataProductStock ?? []).reduce((acc, sale) => {
      const existingSummary = acc.find((s) => s.id === sale.id);
      if (existingSummary) {
        existingSummary.totalLastStock += sale.totalLastStock
        existingSummary.totalPurchase += sale.totalPurchase
        existingSummary.totalSales += sale.totalSales
        existingSummary.totalUsed += sale.totalUsed
        existingSummary.totalStock += sale.totalStock;
      } else {
        acc.push({
          id: sale.id,
          name: sale.name,
          quantity: sale.quantity,
          totalLastStock: sale.totalLastStock,
          totalPurchase: sale.totalPurchase,
          totalSales: sale.totalSales,
          totalUsed: sale.totalUsed,
          totalStock: sale.totalStock + sale.totalPurchase - sale.totalUsed -(sale.totalSales * sale.quantity),
          createdAt: new Date(),
          updatedAt: new Date()

        });
      }
      return acc;
    }, [] as ProductStock[]);
  }, [dataProductStock]);

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
      <Navbar title="Rekapitulasi Stok" withBorder to="/" />

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
          onChange={([startDate, endDate]) => {
            setParams({
              ...params,
              startDate: startDate ?? undefined,
              endDate: endDate ?? undefined,
            });
          }}
        />
        {/* <Select
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
        /> */}
      </section>

      <section className="px-100 my-6">
        <div className="overflow-auto relative shadow-lg shadow-gray-200 bg-white rounded-md">
          <Table>
            <Table.Thead>
              <Table.Tr>
                <th className="text-left" >Barang</th>
                <th className="text-left">Saldo Awal</th>
                <th className="text-left">Pembelian</th>
                <th className="text-left">Penjualan</th>
                <th className="text-left">Used</th>
                <th className="text-left">Akhir</th>
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
                      <Table.Td className="text-left">{item.totalLastStock}</Table.Td>
                      <Table.Td className="text-left">{item.totalPurchase}</Table.Td>
                      <Table.Td className="text-left">{item.totalSales}</Table.Td>
                      <Table.Td className="text-left">{item.totalUsed}</Table.Td>
                      <Table.Td className="text-left">{formatScale(item.totalStock)}</Table.Td>
                      {/* <Table.Td className="text-right">{formatCurrency(item.total / item.quantity)}</Table.Td>
                      <Table.Td className="text-right">{formatCurrency(item.total)}</Table.Td> */}
                    </Table.Tr>
                  ))}
                  <Table.Tr className="bg-gray-50">
                    <Table.Td colSpan={4} className="w-full">
                      <div className="font-bold text-center">Rekap Stok</div>
                    </Table.Td>
                    <Table.Td className="text-center">
                      <span className="font-bold text-left">
                        {formatScale(
                          result.reduce((prev, curr) => {
                            return prev + curr.totalStock;
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
