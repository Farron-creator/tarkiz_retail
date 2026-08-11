import { Button, Loader, Select } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconArrowBarToDown, IconCalendar, IconCategory, IconDots } from '@tabler/icons-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Authorization } from '@/features/auth';
import { OutletSelect, useOutletContext } from '@/features/outlet';
import { dayjs } from '@/lib/dayjs';
import { formatCurrency } from '@/utils/format';

import { useInfiniteAdjustments } from '../api';
import { Adjustment, AdjustmentQuery, TransactionStatus } from '../types';

import { AdjustmentStatus } from './TransactionStatus';

const AdjustmentItem: React.FC<Adjustment> = (adjustment) => {
  return (
    <Link
      to={`/adjustments/${adjustment.id}`}
      className="w-full block active:bg-gray-100 px-5 py-2 transition cursor-pointer"
    >
      <div className="flex w-full">
        <div className="flex-shrink-0">
          <div className="rounded-lg p-2 bg-orange-100 text-orange-600">
            <IconArrowBarToDown className="w-6 h-6" />
          </div>
        </div>
        <div className="flex-grow px-3">
          <div className="font-bold text-sm capitalize">{adjustment.code}</div>
          <AdjustmentStatus status={adjustment.status} />
        </div>
        <div className="flex-grow text-right">
          <div className="font-bold">{formatCurrency(adjustment.total)}</div>
          <div className="text-xs font-semibold text-gray-600">
            {dayjs(adjustment.date).format('D MMM YYYY HH:mm')}
          </div>
        </div>
      </div>
      {adjustment.items.length > 0 && (
        <div className="text-xs text-gray-600 flex flex-col items-end">
          <ul className="m-0">
            <li>
              {adjustment.items[0].quantity} {adjustment.items[0].product.unit}{' '}
              {adjustment.items[0].product.name}
            </li>
          </ul>
          {adjustment.items.length > 1 && <IconDots stroke={0.9} size={14} />}
        </div>
      )}
    </Link>
  );
};

type Props = {
  query?: AdjustmentQuery;
};

export const AdjustmentList: React.FC<Props> = () => {
  const { outlet } = useOutletContext();
  const [params, setParams] = useState<AdjustmentQuery>({
    outlet: outlet?.id,
    startDate: undefined,
    endDate: undefined,
    status: [],
  });
  const { data, isFetching, hasNextPage, fetchNextPage } = useInfiniteAdjustments({
    params: {
      ...params,
      startDate: params.startDate ? dayjs(params.startDate).utc(true).toDate() : undefined,
      endDate: params.endDate ? dayjs(params.endDate).utc(true).toDate() : undefined,
    },
    config: {
      enabled: (!params.startDate && !params.endDate) || (!!params.startDate && !!params.endDate),
    },
  });

  const adjustments = data?.pages.reduce(
    (prev, { result }) => [...prev, ...result],
    [] as Adjustment[]
  );

  return (
    <>
      <div className="px-5 mb-2 space-y-2">
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
          leftSection={<IconCalendar size={14} />}
          placeholder="Rentang Tanggal"
          type="range"
          clearable
          allowSingleDateInRange
          valueFormat="D MMMM YYYY"
          value={[params.startDate ?? null, params.endDate ?? null]}
          onChange={(v) => {
            setParams({
              ...params,
              startDate: v[0] != null ? dayjs(v[0]).startOf('day').toDate() : undefined,
              endDate: v[1] != null ? dayjs(v[1]).endOf('day').toDate() : undefined,
            });
          }}
        />
        <Select
          placeholder="Status Transaksi"
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
      </div>
      {adjustments?.length == 0 && <div className="px-5">Belum ada pembelian</div>}
      <div className="divide-y divide-gray-200">
        {adjustments?.map((adjustment) => (
          <AdjustmentItem key={adjustment.id} {...adjustment} />
        ))}
      </div>
      <div className="px-5 flex items-center justify-center py-4">
        {isFetching ? (
          <Loader />
        ) : (
          hasNextPage && (
            <Button variant="subtle" fullWidth onClick={() => fetchNextPage()}>
              Lihat Semua
            </Button>
          )
        )}
      </div>
    </>
  );
};
