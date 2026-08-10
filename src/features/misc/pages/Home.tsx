import { IconArrowBarToDown, IconArrowBarUp, IconReceipt } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { Image } from '@mantine/core';

import { MenuList } from '@/components/navigation';
import { useAuth } from '@/features/auth';
import { OutletPick } from '@/features/outlet';
import { RecentSales } from '@/features/transaction';
import { useCompany, useFile } from '@/features/company';
import { useOutletContext } from '@/features/outlet';

export const Home: React.FC = () => {
  const { creds, getRoleText } = useAuth();
  const { outlet } = useOutletContext();
  const { data: company } = useCompany({ id: outlet?.company.id ?? 0, });
  const { data: file } = useFile({ id: company?.logo ?? 0, });

  return (
    <main>
      <section className="bg-blue-800 w-full rounded-b-xl px-5 pt-8 pb-20 relative">
        <OutletPick />

        <div className="text-white font-black text-xl">{creds?.name}</div>
        <div className="text-sm font-semibold text-white">{getRoleText()}</div>

        <div className="absolute right-5 top-5">
        <div className="bg-blue-100 text-blue-600 p-1 rounded-lg w-16 h-16">
        {file?.path ? (
          <Image
            
            radius="md"
            h={100}
            w="auto"
            fit="scale-down"
            src={file.path}
          />
        ) : (
          <img src="/images/tarkiz-retail-logo.png" alt="" className="w-16" />
        )}
        </div>
          {/* <img src="/images/tarkiz-retail-logo.png" alt="" className="w-16" /> */}
        </div>
        
      </section>

      <section className="bg-white mx-auto max-w-xs w-full -mt-14 shadow shadow-gray-200 rounded-xl z-50 relative">
        <div className="w-full grid grid-cols-3 divide-x divide-gray-300 py-4">
          <Link to="/sales/create" className="px-4 flex flex-col items-center justify-center">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <IconArrowBarUp className="w-7 h-7" />
            </div>
            <div className="text-xs mt-1">Penjualan</div>
          </Link>
          <Link to="/purchases/create" className="px-4 flex flex-col items-center justify-center">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <IconArrowBarToDown className="w-7 h-7" />
            </div>
            <div className="text-xs mt-1">Pengeluaran</div>
          </Link>
          <Link to="/transaction" className="px-4 flex flex-col items-center justify-center">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <IconReceipt className="w-7 h-7" />
            </div>
            <div className="text-xs mt-1">Riwayat</div>
          </Link>
        </div>
      </section>

      <section className="px-5 my-8">
        <MenuList
          navigations={[
            // {
            //   title: 'Data Master',
            //   href: '/data-master',
            //   icon: '/images/cog.svg',
            // },
            {
              title: 'Laporan Serah Terima',
              href: '/handover',
              icon: '/images/postor.svg',
            },
            {
              title: 'Statistik Harian',
              href: '/transaction/summary',
              icon: '/images/report-up.svg',
            },
            {
              title: 'Statistik Bulanan',
              href: '/transaction/summary/monthly',
              icon: '/images/attendance.svg',
            },
          ]}
        />
      </section>

      <section className="my-6">
        <div className="px-5 flex justify-between">
          <h2 className="text-lg font-bold mb-1">Penjualan Terbaru</h2>
        </div>
        <RecentSales />
      </section>

      <div className="flex items-center justify-center w-full pb-12">
        <img src="/images/tarkiz-retail-logo.png" alt="" className="w-16" />
      </div>
    </main>
  );
};
