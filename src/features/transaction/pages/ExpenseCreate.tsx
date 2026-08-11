import { ActionIcon, Button, Textarea } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconChevronLeft, IconCirclePlus } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

import { OutletAdminSelect, useOutletContext } from '@/features/outlet';
import { Product, ProductPick, useProducts } from '@/features/product';
import { formatCurrency } from '@/utils/format';

import { useCreateExpense } from '../api';
import { AccountCategorySelect, ExpenseItemList, ExpenseSummary } from '../components';
import { ExpenseRequest } from '../types';
import { useState } from 'react';

const initialValues: Omit<ExpenseRequest, 'sourceId' | 'date'> = {
  source: 'outlet',
  note: '',
  items: [],
  accountCategory: 'umumOperasional',
  employee_id: 0,
};

export const ExpenseCreate: React.FC = () => {
  const [showOutletAdminSelect, setShowOutletAdminSelect] = useState(false);

  const { outlet } = useOutletContext();
  const { data } = useProducts({
    params: { company: outlet?.company.id, limit: -1, category: 'expense' },
  });
  const { mutateAsync } = useCreateExpense();
  const form = useForm<ExpenseRequest>({
    initialValues: {
      ...initialValues,
      sourceId: outlet?.id ?? 0,
      date: new Date(),
    },
  });

  const products = data?.result ?? [];
  const total = form.values['items'].reduce(
    (prev, curr) => prev + curr.quantity * (curr.price || 0),
    0
  );

  function handleItemChange(items: ExpenseRequest['items']) {
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
      title: 'Tambah Pengeluaran',
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
        <AccountCategorySelect
          {...form.getInputProps('accountCategory')}
            onChange={(v) => {
              form.setFieldValue('accountCategory', v ?? '')
              setShowOutletAdminSelect(v === 'gaji' || v === "tunjangan");
            }}
            required
            label="Pilih Kategori"
            placeholder="Pilih Kategori"
        />

      {showOutletAdminSelect && (
        <OutletAdminSelect
          {...form.getInputProps('employee_id')}
          onChange={(v) => {
            form.setFieldValue('employee_id', v !== null ? parseInt(v) : 0);
          }}
          value={form.values['employee_id'] != 0 ? form.values['employee_id'].toString() : ''}
          label="Pilih Pegawai"
          placeholder="Pilih Pegawai"
        />
      )}
       
        <Textarea
          {...form.getInputProps('note')}
          label="Catatan"
          placeholder="Tambahkan catatan"
          variant="filled"
        />
      </section>

      <section className="px-5">
        <ExpenseItemList
          products={products}
          items={form.values['items']}
          onChange={handleItemChange}
        />

        <div className="flex items-center justify-end mt-4">
          <Button
            variant="subtle"
            leftSection={<IconCirclePlus size={16} />}
            size="xs"
            onClick={handleAddProduct}
            disabled={products?.length == form.values['items'].length}
          >
            Tambah Pengeluaran
          </Button>
        </div>
      </section>

      <ExpenseSummary total={total} items={form.values['items']} products={products} />

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
