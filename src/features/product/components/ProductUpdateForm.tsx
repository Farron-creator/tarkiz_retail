import { Button, NumberInput, Select, TextInput, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';

import { useUpdateProduct, useSuppliers } from '../api';
import { Product, ProductRequest } from '../types';

type Props = {
  product: Product;
  company: number;
  onSuccess?: VoidFunction;
};

export const ProductUpdateForm: React.FC<Props> = ({ product, company, onSuccess }) => {
  const form = useForm<ProductRequest>({
    initialValues: {
      name: product.name,
      description: product.description,
      price: product.price,
      unit: product.unit,
      company,
      category: product.category,
      supplier: product.supplier?.id,
      isDefault: product.isDefault,
    },
  });
  const { mutateAsync, isLoading } = useUpdateProduct();
  const { data } = useSuppliers({ params: { limit: -1, company } });

  const handleSubmit = form.onSubmit(async (values) => {
    await mutateAsync(
      { id: product.id, data: values },
      {
        onError({ response }) {
          form.setErrors((response?.data as any).errors);
        },
        onSuccess() {
          if (onSuccess) {
            onSuccess();
          }
          notifications.show({
            message: 'Produk berhasil diubah',
            color: 'green',
            icon: <IconCheck />,
          });
          modals.closeAll();
        },
      }
    );
  });

  return (
    <form className="relative" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <TextInput {...form.getInputProps('name')} label="Nama" required />
        <Textarea {...form.getInputProps('description')} label="Deskripsi" />
        <NumberInput
          {...form.getInputProps('price')}
          label="Harga"
          required
          hideControls
          icon={<span className="text-xs">Rp.</span>}
        />
        <TextInput
          {...form.getInputProps('unit')}
          placeholder="Masukan Satuan"
          label="Satuan"
          required
        />
        <Select
          {...form.getInputProps('category')}
          value={form.values['category'] ?? ''}
          label="Kategori"
          placeholder="Pilih Kategori"
          required
          data={[
            { label: 'Pengeluaran', value: 'purchase' },
            { label: 'Penjualan', value: 'sale' },
          ]}
        />
        <Select
          {...form.getInputProps('isDefault')}
          label="Default?"
          required
          withinPortal
          data={[
            { label: 'Ya', value: 'true' },
            { label: 'Tidak', value: 'false' },
          ]}
          value={form.values['isDefault'] ? 'true' : 'false'}
          onChange={(v) => form.setFieldValue('isDefault', v == 'true')}
        />
        <Select
          {...form.getInputProps('supplier')}
          value={form.values['supplier']?.toString() ?? ''}
          label="Supplier"
          searchable
          onChange={(v) => form.setFieldValue('supplier', v ? parseInt(v) : undefined)}
          data={[
            { label: '(Tanpa Supplier)', value: '' },
            ...(data?.result ?? []).map(({ id, name }) => ({ label: name, value: id.toString() })),
          ]}
        />
      </div>

      <div className="flex items-center justify-end gap-4 mt-4">
        <Button
          type="button"
          variant="default"
          onClick={() => modals.closeAll()}
          loading={isLoading}
        >
          Batal
        </Button>
        <Button type="submit" loading={isLoading}>
          Simpan
        </Button>
      </div>
    </form>
  );
};
