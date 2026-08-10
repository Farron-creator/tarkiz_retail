import { Button, Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';

import { useCreateCustomer } from '../api';
import { CustomerRequest } from '../types';
import { useCompanies } from '@/features/company';

type Props = {
  company?: number;
  onSuccess?: VoidFunction;
};

export const CustomerCreateForm: React.FC<Props> = ({ company, onSuccess }) => {
  const form = useForm<CustomerRequest>({
    initialValues: {
      name: '',
      address: '',
      status: 'active',
      company: company ?? 1,
    },
  });
  const { mutateAsync, isLoading } = useCreateCustomer();
  const { data } = useCompanies({ params: { limit: -1 }, config: { enabled: !company } });

  const handleSubmit = form.onSubmit(async (values) => {
    await mutateAsync(
      { data: values },
      {
        onError({ response }) {
          form.setErrors((response?.data as any).errors);
        },
        onSuccess() {
          if (onSuccess) {
            onSuccess();
          }
          notifications.show({
            message: 'Customer berhasil dibuat',
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
        <TextInput label="Address" required {...form.getInputProps('address')} />
        {!company && (
          <Select
            {...form.getInputProps('company')}
            label="Perusahaan"
            required
            value={form.values['company'] == 0 ? '' : form.values['company'].toString()}
            onChange={(v) => form.setFieldValue('company', parseInt(v || '0'))}
            searchable
            withinPortal
            data={[
              { label: 'Pilih Perusahaan', value: '' },
              ...(data?.result ?? []).map(({ id, name }) => ({
                value: id.toString(),
                label: name,
              })),
            ]}
          />
        )}
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
          Tambah
        </Button>
      </div>
    </form>
  );
};
