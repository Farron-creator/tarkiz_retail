import { Button, Loader, Select } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconArrowBarUp, IconCalendar, IconCategory } from '@tabler/icons-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Authorization } from '@/features/auth';
import { OutletSelect, useOutletContext } from '@/features/outlet';
import { dayjs } from '@/lib/dayjs';
import { formatCurrency } from '@/utils/format';

import { useInfiniteSales } from '../api';
import { Sale, SaleQuery, TransactionStatus } from '../types';

import { SaleStatus } from './SaleStatus';

const SaleItem: React.FC<Sale> = (sale) => {
  return (
    <Link
      to={`/sales/${sale.id}`}
      className="w-full flex items-center active:bg-gray-100 px-5 py-2 transition cursor-pointer"
    >
      <div className="flex-shrink-0">
        <div className="rounded-lg p-2 bg-blue-100 text-blue-600">
          <IconArrowBarUp className="w-6 h-6" />
        </div>
      </div>
      <div className="flex-grow px-3">
        <div className="font-bold text-sm capitalize">{sale.code}</div>
        <SaleStatus status={sale.status} />
      </div>
      <div className="flex-grow text-right">
        <div className="font-bold">{formatCurrency(sale.total)}</div>
        <div className="text-xs font-semibold text-gray-600">
          {dayjs(sale.date).format('D MMM YYYY HH:mm')}
        </div>
      </div>
    </Link>
  );
};

type Props = {
  query?: SaleQuery;
};

export const SaleList: React.FC<Props> = () => {
  const { outlet } = useOutletContext();
  const [params, setParams] = useState<SaleQuery>({ outlet: outlet?.id });
  const { data, isFetching, hasNextPage, fetchNextPage } = useInfiniteSales({
    params,
    config: {
      enabled: (!params.startDate && !params.endDate) || (!!params.startDate && !!params.endDate),
    },
  });

  const sales = data?.pages.reduce((prev, { result }) => [...prev, ...result], [] as Sale[]);

  return (
    <>
      <div className="px-5 mb-4 space-y-2">
        <Authorization role={['owner', 'superadmin']}>
          <OutletSelect
            placeholder="Pilih Outlet"
            icon={<IconCategory size={14} />}
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
          icon={<IconCalendar size={14} />}
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
      {sales?.length == 0 && <div className="px-5">Belum ada penjualan</div>}
      {sales?.map((sale) => (
        <SaleItem key={sale.id} {...sale} />
      ))}
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
