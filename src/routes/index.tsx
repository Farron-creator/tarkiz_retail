import { Route, Routes } from 'react-router-dom';

import { HomeLayout, AuthLayout, AppLayout, PlainLayout } from '@/components/layout';
import { lazyImport } from '@/utils/lazyImport';

const { Login } = lazyImport(() => import('@/features/auth'), 'Login');
const { Development } = lazyImport(() => import('@/features/misc'), 'Development');
const { Home } = lazyImport(() => import('@/features/misc'), 'Home');
const { DataMaster } = lazyImport(() => import('@/features/misc'), 'DataMaster');
const { Profile } = lazyImport(() => import('@/features/employee'), 'Profile');
const { Products } = lazyImport(() => import('@/features/product'), 'Products');
const { Suppliers } = lazyImport(() => import('@/features/product'), 'Suppliers');
const { Attendances } = lazyImport(() => import('@/features/employee'), 'Attendances');
const { Outlets } = lazyImport(() => import('@/features/outlet'), 'Outlets');

const { Handovers } = lazyImport(() => import('@/features/handover'), 'Handovers');
const { HandoverCreate } = lazyImport(() => import('@/features/handover'), 'HandoverCreate');

const { Transactions } = lazyImport(() => import('@/features/transaction'), 'Transactions');
const { SaleCreate } = lazyImport(() => import('@/features/transaction'), 'SaleCreate');
const { SaleDetail } = lazyImport(() => import('@/features/transaction'), 'SaleDetail');
const { PurchaseCreate } = lazyImport(() => import('@/features/transaction'), 'PurchaseCreate');
const { PurchaseDetail } = lazyImport(() => import('@/features/transaction'), 'PurchaseDetail');
const { TransactionSummary } = lazyImport(
  () => import('@/features/transaction'),
  'TransactionSummary'
);

const { TransactionSummaryMonthly } = lazyImport(
  () => import('@/features/transaction'),
  'TransactionSummaryMonthly'
);

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route element={<HomeLayout />}>
          <Route index element={<Home />} />
          <Route path="transaction" element={<Transactions />} />
          <Route path="profile" element={<Profile />} />
          <Route path="data-master" element={<DataMaster />} />
        </Route>

        <Route path="transaction/summary" element={<TransactionSummary />} />
        
        <Route path="transaction/summary/monthly" element={<TransactionSummaryMonthly />} />

        <Route path="sales/:id" element={<SaleDetail />} />
        <Route path="sales/create" element={<SaleCreate />} />

        <Route path="purchases/:id" element={<PurchaseDetail />} />
        <Route path="purchases/create" element={<PurchaseCreate />} />

        <Route path="handover" element={<Handovers />} />
        <Route path="handover/create" element={<HandoverCreate />} />

        <Route path="attendance" element={<Attendances />} />
        <Route path="product" element={<Products />} />
        <Route path="supplier" element={<Suppliers />} />

        <Route path="development" element={<Development />} />
      </Route>

      <Route path="/" element={<PlainLayout />}>
        <Route path="outlet" element={<Outlets />} />
      </Route>

      <Route path="/" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
      </Route>
    </Routes>
  );
};
