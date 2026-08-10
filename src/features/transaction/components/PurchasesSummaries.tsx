import { Table } from '@mantine/core';
import { useId } from 'react';

import { dayjs } from '@/lib/dayjs';
import { formatCurrency } from '@/utils/format';

import { usePurchasesSummary, useSalesSummary } from '../api';
import { PurchasesSummary, PurchasesSummaryQuery } from '../types';

type Props = {
  hideTable?: boolean;
  withProduct?: boolean;
  hideProfit?: boolean;
} & PurchasesSummaryQuery;

export const PurchasesSummaries: React.FC<Props> = ({
  withProduct,
  hideTable,
  hideProfit,
  ...params
}) => {
  const purchase = usePurchasesSummary({ params });

  const sortedPurchaseData = purchase.data?.sort((a, b) => {
    if (a.date === b.date) {
        return b.quantity - a.quantity; // Sort by quantity in descending order if dates are the same
    }
    return a.date.localeCompare(b.date); // Sort by date in ascending order
  });

  // Create a new object with updated data
  const sortedPurchase = { ...purchase, data: sortedPurchaseData };

  const sale = useSalesSummary({
    params: { ...params },
    config: { enabled: !hideProfit },
  });
  const id = useId();

  const isLoading = purchase.isLoading;
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
    if (!withProduct || !sortedPurchase.data) return null;

    return (sortedPurchase.data ?? []).reduce((acc, sale) => {
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
              <th className="whitespace-nowrap">Barang</th>
              <th>Jumlah</th>
              <th>Total</th>
            </tr>
          )}
        </thead>
        <tbody>
          {isLoading && <LoadingState />}
          {isError && <ErrorState />}
          {!isLoading && !isError && (
            <>
              {!hideTable &&
                sortedPurchase.data?.map(({ name, date, total, quantity }, i) => (
                  <tr key={`${id}_${i}`}>
                    <td>{dayjs(date, 'YYYY-MM-DD').format('DD MMMM YYYY')}</td>
                    <td>{name}</td>
                    <td>{quantity}</td>
                    <td className="text-right">{formatCurrency(total)}</td>
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
              {totalPurchases && totalPurchases[0] ? (
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

                  {!!totalSales && (
                    <>
                      <tr className="bg-gray-50">
                        <td colSpan={3} className="w-full">
                          <div className="font-bold text-center">Total Penjualan</div>
                        </td>
                        <td className="text-right">
                          <span className="font-bold text-right">
                            {formatCurrency(totalSales[1])}
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
