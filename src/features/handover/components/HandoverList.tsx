import { Badge, Button } from '@mantine/core';
import { useState } from 'react';

import { dayjs } from '@/lib/dayjs';
import { formatCurrency } from '@/utils/format';

import { useInfiniteHandovers } from '../api';
import { Handover, HandoverQuery } from '../types';

import { HandoverDetail } from './HandoverDetail';

export type HandoverListProps = Omit<HandoverQuery, 'page' | 'limit'>;

export const HandoverList: React.FC<HandoverListProps> = (params) => {
  const [selected, setSelected] = useState<Handover | null>(null);
  const { data, isLoading, isFetching, hasNextPage, fetchNextPage } = useInfiniteHandovers({
    params,
  });

  const handovers = data?.pages.reduce(
    (prev, { result }) => [...prev, ...result],
    [] as Handover[]
  );

  if (isLoading)
    return (
      <div className="space-x-4 px-5">
        <div className="bg-white w-full rounded-md shadow-md shadow-gray-200 border border-gray-200 p-3">
          <div className="w-full flex items-center justify-between mb-4">
            <div className="bg-gray-200 rounded-md h-4 w-20 animate-pulse"></div>
          </div>

          <div className="bg-gray-200 rounded-md h-6 mb-4 w-full animate-pulse"></div>
          <div className="bg-gray-200 rounded-md h-6 w-full animate-pulse"></div>
        </div>
      </div>
    );

  return (
    <>
      <div className="px-5 space-y-4">
        {handovers?.map((handover) => (
          <div
            key={handover.id}
            className="bg-white w-full rounded-md shadow-md shadow-gray-200 border border-gray-200 p-3"
          >
            <div className="w-full flex items-center justify-between">
              <Badge color="gray" radius="sm">
                {handover.shift.name || 'Shift'}
              </Badge>

              <div className="text-gray-600 font-medium text-xs leading-none">
                {dayjs(handover.date, 'YYYY-MM-DD').format('D MMMM YYYY')}
              </div>
            </div>

            <div className="grid grid-cols-2 divide-x divide-gray-300 my-3">
              <div>
                <div className="text-xs text-gray-600 font-medium">Total Setoran</div>
                <div className="text-sm font-bold">{formatCurrency(handover.cashReceived)}</div>
              </div>
              <div className="pl-4">
                <div className="text-xs text-gray-600 font-medium">Total Penjualan</div>
                <div className="text-sm font-bold">{formatCurrency(handover.salesTotal)}</div>
              </div>
            </div>

            <div>
              <Button size="xs" fullWidth onClick={() => setSelected(handover)}>
                Detail
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="px-5">
        {handovers?.length == 0 && <div>Data tidak ditemukan</div>}
        {isFetching ? (
          <div className="text-center mt-2">loading...</div>
        ) : (
          hasNextPage && (
            <Button variant="subtle" fullWidth onClick={() => fetchNextPage()}>
              Lihat Semua
            </Button>
          )
        )}
      </div>

      <HandoverDetail handoverId={selected?.id || null} onClose={() => setSelected(null)} />
    </>
  );
};
