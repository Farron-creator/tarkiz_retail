import { ScrollArea, Table } from '@mantine/core';
import { useId } from 'react';

import { dayjs } from '@/lib/dayjs';
import { formatCurrency } from '@/utils/format';

import { useExpensesSummaryEach, useSalesSummary } from '../api';
import { ExpensesSummaryEach, ExpensesSummaryQuery } from '../types';

type Props = {
  hideTable?: boolean;
  withProduct?: boolean;
  hideProfit?: boolean;
} & ExpensesSummaryQuery;

export const ExpensesSummariesEach: React.FC<Props> = ({
  withProduct,
  hideTable,
  hideProfit,
  ...params
}) => {
  const expense = useExpensesSummaryEach({ params });
  const sale = useSalesSummary({
    params,
    config: { enabled: !hideProfit },
  });
  const id = useId();

  const isLoading = expense.isLoading;
  const isError = expense.isError || sale.isError;

  const totalSales = sale.data?.reduce(
    (acc, summary) => [acc[0] + summary.quantity, acc[1] + summary.total],
    [0, 0]
  );
  const totalExpenses = expense.data?.reduce(
    (acc, summary) => [acc[0] + summary.quantity, acc[1] + summary.total],
    [0, 0]
  );

  function productSummary() {
    if (!withProduct || !expense.data) return null;

    return (expense.data ?? []).reduce((acc, sale) => {
      const existingSummary = acc.find((s) => s.id === sale.id);
      if (existingSummary) {
        existingSummary.quantity += sale.quantity;
        existingSummary.total += sale.total;
      } else {
        acc.push({
          id: sale.id,
          name: sale.name,
          note: sale.note,
          quantity: sale.quantity,
          total: sale.total,
        });
      }
      return acc;
    }, [] as Omit<ExpensesSummaryEach, 'date'>[]);
  }

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
    <div className="overflow-auto relative shadow-lg shadow-gray-200 bg-white rounded-md">
      <ScrollArea w={400}>
      <Table>
        <Table.Thead>
          {!hideTable && (
            <Table.Tr>
              <th className="whitespace-nowrap">Tanggal</th>
              <th className="whitespace-nowrap">Note</th>
              <th className="whitespace-nowrap">Barang</th>
              <th>Jumlah</th>
              <th style={{ textAlign: 'center' }}>Total</th>
            </Table.Tr>
          )}
        </Table.Thead>
        <Table.Tbody>
          {isLoading && <LoadingState />}
          {isError && <ErrorState />}
          {!isLoading && !isError && (
            <>
              {!hideTable &&
                expense.data.map(({ name, note, date, total, quantity }, i) => (
                  <Table.Tr key={`${id}_${i}`}>
                    <Table.Td>{dayjs(date, 'YYYY-MM-DD').format('DD MMMM YYYY')}</Table.Td>
                    <Table.Td>{note}</Table.Td>
                    <Table.Td>{name}</Table.Td>
                    <Table.Td>{quantity}</Table.Td>
                    <Table.Td className="text-right">{formatCurrency(total)}</Table.Td>
                  </Table.Tr>
                ))}
              {productSummary()?.map((item) => (
                <Table.Tr key={item.id} className="font-bold">
                  <Table.Td colSpan={2} className=" text-center">
                    {item.name}
                  </Table.Td>
                  <Table.Td className="">{item.quantity}</Table.Td>
                  <Table.Td className="text-right">{formatCurrency(item.total)}</Table.Td>
                </Table.Tr>
              ))}
              {totalExpenses && totalExpenses[0] ? (
                <>
                  <Table.Tr className="bg-gray-50">
                    <Table.Td colSpan={4} className="w-full">
                      <div className="font-bold text-center">Total Pengeluaran</div>
                    </Table.Td>
                    <Table.Td className="text-right">
                      <span className="font-bold text-right">
                        {formatCurrency(totalExpenses[1])}
                      </span>
                    </Table.Td>
                  </Table.Tr>

                  {!!totalSales && (
                    <>
                      <Table.Tr className="bg-gray-50">
                        <Table.Td colSpan={4} className="w-full">
                          <div className="font-bold text-center">Total Penjualan</div>
                        </Table.Td>
                        <Table.Td className="text-right">
                          <span className="font-bold text-right">
                            {formatCurrency(totalSales[1])}
                          </span>
                        </Table.Td>
                      </Table.Tr>
                      <Table.Tr className="bg-gray-50">
                        <Table.Td colSpan={4} className="w-full">
                          <div className="font-bold text-center">Laba Kotor</div>
                        </Table.Td>
                        <Table.Td className="text-right">
                          <span className="font-bold text-right">
                            {formatCurrency(totalSales[1] - totalExpenses[1])}
                          </span>
                        </Table.Td>
                      </Table.Tr>
                    </>
                  )}
                </>
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={5} className="text-center">
                    <div className="py-4">Data tidak ditemukan</div>
                  </Table.Td>
                </Table.Tr>
              )}
            </>
          )}
        </Table.Tbody>
      </Table>
      </ScrollArea>
    </div>
  );
};
