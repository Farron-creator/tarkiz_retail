import { Button, TextInput, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';

import { useUpdateSupplier } from '../api';
import { Supplier, SupplierRequest } from '../types';

type Props = {
  supplier: Supplier;
  company?: number;
  onSuccess?: VoidFunction;
};

export const SupplierUpdateForm: React.FC<Props> = ({ supplier, company, onSuccess }) => {
  const form = useForm<SupplierRequest>({
    initialValues: {
      name: supplier.name,
      description: supplier.description,
      company,
    },
  });
  const { mutateAsync, isLoading } = useUpdateSupplier();

  const handleSubmit = form.onSubmit(async (values) => {
    await mutateAsync(
      { id: supplier.id, data: values },
      {
        onError({ response }) {
          form.setErrors((response?.data as any).errors);
        },
        onSuccess() {
          if (onSuccess) {
            onSuccess();
          }
          notifications.show({
            message: 'Supplier berhasil dibuat',
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
        <TextInput label="Nama" required {...form.getInputProps('name')} />
        <Textarea label="Deskripsi" {...form.getInputProps('description')} />
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
