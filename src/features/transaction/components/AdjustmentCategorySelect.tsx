import { Select, SelectProps } from '@mantine/core';


type Props = {
  accountCategory?: string;
} & Omit<SelectProps, 'data'>;

export const AdjustmentCategorySelect: React.FC<Props> = (props) => {
 
  return (
    <Select
      {...props}
      data={[
        {
          value: 'penggunaan',
          label: 'Penggunaan',
        },
        {
          value: 'penyesuaian_penambahan',
          label: 'Penyesuaian Tambah',
        },
        {
          value: 'penyesuaian_pengurangan',
          label: 'Penyesuaian Kurang',
        }
      ]}
    />
  );
};
