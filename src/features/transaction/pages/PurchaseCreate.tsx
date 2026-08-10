import { ActionIcon, Button, Select, Textarea } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconChevronLeft, IconCirclePlus } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

import { useOutletContext } from '@/features/outlet';
import { Product, ProductPick, useProducts, useSuppliers } from '@/features/product';
import { formatCurrency } from '@/utils/format';

import { useCreatePurchase, useSale, useSalesSummary } from '../api';
import { PurchaseItemList, PurchaseSummary } from '../components';
import { PurchaseRequest } from '../types';
import { useSupplier } from '@/features/product';
import { useMemo, useState } from 'react';
import { useCompany } from '@/features/company';
// import { useSales } from '@/features/transaction';
import { useSales } from '../api';
import { SalesSummaryQuery, TransactionStatus } from '../types';


const initialValues: Omit<PurchaseRequest, 'sourceId' | 'date'> = {
  source: 'outlet',
  note: '',
  supplier: '',
  supplier_id: 0,
  sales_id: 0,
  sales_code: '',
  items: [],
};

export const PurchaseCreate: React.FC = () => {
  const [selectedSales, setSelectedSales] = useState<number | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null);
  const { outlet } = useOutletContext();
  //const { data: sales } = SalesSummaryQuery({ params: { outlet: outlet?.company.id } });
  const { data: product } = useProducts({
    params: { company: outlet?.company.id, limit: -1 },
  });

  

  // const [sales, setSales] = useState<SalesSummaryQuery>({
  //   outlet: outlet?.id,
  //   status: ['accepted'],
  //   startDate: new Date(),
  //   endDate: new Date(),
  // });

  //const { data: sales } = useSales({  params: { outlet: outlet?.company.id }  });
  const { data: sales } = useSales({ params: { outlet: outlet?.id, status: ['accepted','approved'] } });
  const { data: suppliers } = useSuppliers({
    params: { company: outlet?.company.id, limit: -1 },
  });

  
  // ?const { data: customers } = useCustomers({ params: { limit: -1 } });
  const { data: company } = useCompany({ id: outlet?.company.id ?? 0, });
  // const selectData = useMemo(() => {
  //   // const adminIds = (admins?.result ?? []).map(({ id }) => id);

  //   return (suppliers?.result ?? [])
  //     .filter(({ company }) => company == outlet?.company.id)
  //     .map((supplier) => ({
  //       label: `${supplier.name} (${supplier.description})`,
  //       value: supplier.id.toString(),
  //     }));
  // }, [company, suppliers]);

  const { mutateAsync } = useCreatePurchase();
  const form = useForm<PurchaseRequest>({
    initialValues: {
      ...initialValues,
      sourceId: outlet?.id ?? 0,
      date: new Date(),
    },
  });

  const products = product?.result ?? [];
  const total = form.values['items'].reduce(
    (prev, curr) => prev + curr.quantity * (curr.price || 0),
    0
  );

  



  function handleItemChange(items: PurchaseRequest['items']) {
    form.setFieldValue('items', items);
  }

  function handleAddItem(product: Product) {
    form.setFieldValue('items', [
      ...form.values['items'],
      { product: product.id, quantity: 1, price: product.price, type: 'stock' },
    ]);
    modals.closeAll();
  }

  function handleAddProduct() {
    const items = form.values['items'];

    modals.open({
      title: 'Tambah Barang',
      children: (
        <ProductPick
          products={products.filter((product) => {
            return !(items.filter((item) => item.product == product.id).length > 0);
          })}
          onSubmit={handleAddItem}
        />
      ),
    });
  }

  async function handleSubmit() {
    await mutateAsync(
      { data: form.values },
      {
        onSuccess: () => {
          notifications.show({
            color: 'green',
            message: 'Pengeluaran berhasil dibuat',
            autoClose: 1000,
          });
          form.setValues({ ...form.values, date: new Date(), ...initialValues });
        },
        onError: () => {
          notifications.show({
            color: 'red',
            message: 'Pengeluaran gagal dibuat',
            autoClose: 1000,
          });
        },
      }
    );
  }

  return (
    <main className="mb-32">
      <header className="px-4 sticky top-0 z-10 bg-white py-3.5">
        <Link to="/" className="flex items-center">
          <ActionIcon variant="transparent">
            <IconChevronLeft className="text-gray-800" />
          </ActionIcon>
          <div className="font-bold ml-4">Pengeluaran</div>
        </Link>
      </header>

      <section className="px-5 mt-3 space-y-3">
        <DateInput
          {...form.getInputProps('date')}
          label="Tanggal"
          variant="filled"
          valueFormat="D MMMM YYYY HH:mm"
        />

        <Select
          {...form.getInputProps('sales_id')}
          label="Penjualan"
          value={selectedSales != null ? selectedSales.toString() : ''}
          searchable
          onChange={(v) => {
            console.log("isi pilihan :");
            console.log(v);
            form.setFieldValue('sales_id', v ? parseInt(v) : 0)
            setSelectedSales(v ? parseInt(v) : null);
            sales?.result.map((sale) => {
              if (sale.id == (v ? parseInt(v) : null)) {
                setSelectedSales(sale.id);
                form.setFieldValue('sales_code', sale.code);
                form.setFieldValue('sales_id', sale.id);
              }
            });
                    
            setSelectedSales(v ? parseInt(v) : null);
            }
          }
          data={[
            { label: '(Tanpa Penjualan)', value: '' },
            ...(sales?.result ?? []).map(({ id, code }) => ({ label: code, value: id.toString() })),
          ]}
        />
        
        <Select
          {...form.getInputProps('supplier_id')}
          label="Supplier"
          value={selectedSupplier != null ? selectedSupplier.toString() : ''}
          searchable
          onChange={(v) => {
            console.log("isi pilihan :");
            console.log(v);
            form.setFieldValue('supplier_id', v ? parseInt(v) : 0)
            setSelectedSupplier(v ? parseInt(v) : null);
            suppliers?.result.map((supplier) => {
              if (supplier.id == (v ? parseInt(v) : null)) {
                setSelectedSupplier(supplier.id);
                form.setFieldValue('supplier', supplier.name);
                form.setFieldValue('supplier_id', supplier.id);
              }
            });
                    
            setSelectedSupplier(v ? parseInt(v) : null);
            }
          }
          data={[
            { label: '(Tanpa Supplier)', value: '' },
            ...(suppliers?.result ?? []).map(({ id, name }) => ({ label: name, value: id.toString() })),
          ]}
        />

        
         
        <Textarea
          {...form.getInputProps('note')}
          label="Catatan"
          placeholder="Tambahkan catatan"
          variant="filled"
        />
      </section>

      <section className="px-5">
        <PurchaseItemList
          products={products}
          items={form.values['items']}
          onChange={handleItemChange}
        />

        <div className="flex items-center justify-end mt-4">
          <Button
            variant="subtle"
            leftIcon={<IconCirclePlus size={16} />}
            size="xs"
            onClick={handleAddProduct}
            // disabled={products?.length == form.values['items'].length}
          >
            Tambah Barang
          </Button>
        </div>
      </section>

      <PurchaseSummary total={total} items={form.values['items']} products={products} />

      <div className="max-w-md bottom-0 fixed bg-white py-4 w-full border-t border-gray-50 px-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-600">Total</div>
            <div className="font-bold">{total > 0 ? formatCurrency(total) : '-'}</div>
          </div>

          <Button disabled={form.values['items'].length == 0} onClick={handleSubmit}>
            Checkout
          </Button>
        </div>
      </div>
    </main>
  );
};
