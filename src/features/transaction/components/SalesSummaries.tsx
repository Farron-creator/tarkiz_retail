import { useState } from 'react';
import { Table, Input } from '@mantine/core';
import { useId } from 'react';
import { IconSearch } from '@tabler/icons-react'; // Import the search icon

import { dayjs } from '@/lib/dayjs';
import { formatCurrency } from '@/utils/format';

import { usePurchasesSummary, useSalesSummary } from '../api';
import { SalesSummary, SalesSummaryQuery } from '../types';

type Props = {
  hideTable?: boolean;
  withProduct?: boolean;
  hideProfit?: boolean;
} & SalesSummaryQuery;

export const SalesSummaries: React.FC<Props> = ({
  withProduct,
  hideTable,
  hideProfit,
  ...params
}) => {
  const [searchTerm, setSearchTerm] = useState(''); // New state for search term
  const sale = useSalesSummary({ params });
  const sortedSaleData = sale.data?.sort((a, b) => {
    if (a.date === b.date) {
      return b.quantity - a.quantity; // Sort by quantity in descending order if dates are the same
    }
    return a.date.localeCompare(b.date); // Sort by date in ascending order
  });

  // Create a new object with updated data
  const sortedSale = { ...sale, data: sortedSaleData };

  const purchase = usePurchasesSummary({
    params: { ...params },
    config: { enabled: !hideProfit },
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

  // Filter data based on search term
  const filteredData = sortedSale.data?.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function productSummary() {
    if (!withProduct || !filteredData) return null;

    return (filteredData ?? []).reduce((acc, sale) => {
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
      {/* Search Input */}
      <div className="p-4">
        <Input
          placeholder="Search by product name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<IconSearch size={16} />} // Add the search icon here
        />
      </div>
      
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
                filteredData?.map(({ name, date, total, quantity }, i) => (
                  <tr key={`${id}_${i}`}>
                    <td>{dayjs(date).format('DD MMMM YYYY')}</td>
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
