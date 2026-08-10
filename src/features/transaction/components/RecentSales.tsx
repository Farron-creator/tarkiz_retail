import { Button } from '@mantine/core';
import { IconArrowBarUp } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

import { useOutletContext } from '@/features/outlet';
import { dayjs } from '@/lib/dayjs';
import { formatCurrency } from '@/utils/format';

import { useSales } from '../api';
import { Sale, SaleQuery } from '../types';

const SaleSkeleton: React.FC = () => {
  return (
    <div className="w-full flex items-center px-5 py-2">
      <div className="flex-shrink-0 w-10 h-10 bg-gray-200 animate-pulse rounded-lg"></div>
      <div className="flex-grow px-3 flex flex-col justify-between">
        <div className="h-4 w-24 bg-gray-200 animate-pulse mb-2 rounded"></div>
        <div className="h-3 w-36 bg-gray-200 animate-pulse rounded"></div>
      </div>
    </div>
  );
};

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
      <div className="flex-grow px-3 flex flex-col justify-between">
        <div className="font-bold capitalize">Penjualan</div>
        <div className="text-xs font-semibold text-gray-600">
          {dayjs(sale.date).format('D MMM YYYY HH:mm')}
        </div>
      </div>
      <div className="flex-grow text-right">
        <div className="font-bold">{formatCurrency(sale.total)}</div>
      </div>
    </Link>
  );
};

type Props = {
  query?: SaleQuery;
};

export const RecentSales: React.FC<Props> = () => {
  const { outlet } = useOutletContext();
  const { data, isLoading, isError } = useSales({ params: { outlet: outlet?.id, status: ['accepted','approved'] } });

  if (isLoading || isError)
    return (
      <>
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <SaleSkeleton key={`ssk_${i}`} />
          ))}
      </>
    );

  return (
    <>
      {data.result.map((sale) => (
        <SaleItem key={sale.id} {...sale} />
      ))}
      <div className="px-5 py-3">
        {data.result.length > 0 ? (
          <Button variant="subtle" fullWidth component={Link} to="/transaction">
            Lihat Semua
          </Button>
        ) : (
          <p>Belum Ada penjualan</p>
        )}
      </div>
    </>
  );
};
