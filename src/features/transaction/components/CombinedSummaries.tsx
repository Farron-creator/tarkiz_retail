import { Table } from '@mantine/core';
import { useId } from 'react';

import { dayjs } from '@/lib/dayjs';
import { formatCurrency } from '@/utils/format';

import { usePurchasesSummary, useSalesSummary } from '../api';
import { SalesSummary, SalesSummaryQuery } from '../types';
import { SalesSummaries } from './SalesSummaries';

type Props = {
  hideTable?: boolean;
  withProduct?: boolean;
  hideProfit?: boolean;
} & SalesSummaryQuery;

export const CombinedSummaries: React.FC<Props> = ({
  withProduct,
  hideTable,
  hideProfit,
  ...params
}) => {
  
  const sale = useSalesSummary({ params });
  sale.data?.forEach((item) => {
    item.date = dayjs(item.date).format();
    
  });
  // type CombinedDataFormat = {
  //   [date: string]: {
  //     value: number;
  //     tipe: string;
  //   };
  // };

  type CombinedDataFormat = {
    date: string,
    value: number,
    tipe: string
  };

  let combinedSaleData: CombinedDataFormat[] = [];
  sale.data?.forEach(entry => {
    const date = entry.date.split("T")[0];  // Extract the date part
    combinedSaleData.push({date: date, value: entry.total, tipe: 'sales'});
  });


  const purchase = usePurchasesSummary({
    params: { ...params },
    config: { enabled: !hideProfit },
  });


  let combinedPurchaseData: CombinedDataFormat[] = [];
  purchase.data?.forEach(entry => {
    const date = entry.date.split("T")[0];  // Extract the date part
    combinedPurchaseData.push({date: date, value: entry.total, tipe: 'purchase'});
  });

  // Combine the data side by side
const combinedData: { date: string, purchaseTotal: number, salesTotal: number, profitTotal:number }[] = [];

[...combinedPurchaseData, ...combinedSaleData].forEach(entry => {
    const date = dayjs(new Date(entry.date)).format().split("T")[0];  // Extract the date part
    const existingEntry = combinedData.find(item => item.date === date);

    if (existingEntry) {
        if (entry.tipe === 'sales') {
          existingEntry.salesTotal += entry.value;
        } else if (entry.tipe === 'purchase') {
          existingEntry.purchaseTotal += entry.value;
        }
        existingEntry.profitTotal = existingEntry.salesTotal - existingEntry.purchaseTotal;
    } else {
        const newEntry = {
            date,
            purchaseTotal: (entry.tipe === 'purchase') ? entry.value : 0,
            salesTotal: (entry.tipe === 'sales')  ? entry.value : 0,
            profitTotal: 0
        };
        combinedData.push(newEntry);
    }
});

  const id = useId();

  const isLoading = sale.isLoading;
  const isError = purchase.isError || sale.isError;

  const totalSales = sale.data?.reduce(
    (acc, summary) => [acc[0] + summary.quantity, acc[1] + summary.total],
    [0, 0]
  );
  const totalPurchases = purchase.data?.reduce(
    (acc, summary) => [acc[0] + summary.quantity, acc[1] + summary.total],
    [0, 0]
  );

  function productSummary() {
    if (!withProduct || !sale.data ) return null;

    return (sale.data  ?? []).reduce((acc, sale) => {
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
    }, [] as Omit<SalesSummary, 'date'>[]);
  }

  const ErrorState = () => (
    <tr>
      <td colSpan={4} className="text-center text-red-600">
        <div className="py-4">Terjadi Kesalahan</div>
      </td>
    </tr>
  );

  const LoadingState = () => (
    <>
      <tr>
        <td colSpan={4}>
          <div className="bg-gray-200 w-full h-4 rounded-sm animate-pulse"></div>
        </td>
      </tr>
      <tr>
        <td colSpan={4}>
          <div className="bg-gray-200 w-full h-4 rounded-sm animate-pulse"></div>
        </td>
      </tr>
      <tr>
        <td colSpan={4}>
          <div className="bg-gray-200 w-full h-4 rounded-sm animate-pulse"></div>
        </td>
      </tr>
    </>
  );

  return (
    <div className="overflow-auto relative shadow-lg shadow-gray-200 bg-white rounded-md">
      <Table>
        <thead>
          {!hideTable && (
            <tr>
              <th className="whitespace-nowrap">Tanggal</th>
              <th className="whitespace-nowrap">Penjualan</th>
              <th className="whitespace-nowrap">Pengeluaran</th>
              <th>Laba</th>
            </tr>
          )}
        </thead>
        <tbody>
          {isLoading && <LoadingState />}
          {isError && <ErrorState />}
          {!isLoading && !isError && (
            <>
              {!hideTable &&
                combinedData.map(({ date, purchaseTotal, salesTotal, profitTotal }, i) => (
                  <tr key={`${id}_${i}`}>
                    <td>{dayjs(date).format('DD MMMM YYYY')}</td>
                    <td className="text-right">{formatCurrency(purchaseTotal)}</td>
                    <td className="text-right">{formatCurrency(salesTotal)}</td>
                    <td className="text-right">{formatCurrency(profitTotal)}</td>
                  </tr>
                ))}

                
              {productSummary()?.map((item) => (
                <tr key={item.id} className="font-bold">
                  <td colSpan={2} className=" text-center">
                    {item.name}
                  </td>
                  <td className="">{item.quantity}</td>
                  <td className="text-right">{formatCurrency(item.total)}</td>
                </tr>
              ))}
              {totalSales && totalSales[0] ? (
                <>
                  <tr className="bg-gray-50">
                    <td colSpan={3} className="w-full">
                      <div className="font-bold text-center">Total Penjualan</div>
                    </td>
                    <td className="text-right">
                      <span className="font-bold text-right">{formatCurrency(totalSales[1])}</span>
                    </td>
                  </tr>

                  {!!totalPurchases && (
                    <>
                      <tr className="bg-gray-50">
                        <td colSpan={3} className="w-full">
                          <div className="font-bold text-center">Total Pengeluaran</div>
                        </td>
                        <td className="text-right">
                          <span className="font-bold text-right">
                            {formatCurrency(totalPurchases[1])}
                          </span>
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td colSpan={3} className="w-full">
                          <div className="font-bold text-center">Laba Kotor</div>
                        </td>
                        <td className="text-right">
                          <span className="font-bold text-right">
                            {formatCurrency(totalSales[1] - totalPurchases[1])}
                          </span>
                        </td>
                      </tr>
                    </>
                  )}
                </>
              ) : (
                <tr>
                  <td colSpan={4} className="text-center">
                    <div className="py-4">Data tidak ditemukan</div>
                  </td>
                </tr>
              )}
            </>
          )}
        </tbody>
      </Table>
    </div>
  );
};
