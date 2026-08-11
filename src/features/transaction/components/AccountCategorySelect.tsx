import { Select, SelectProps } from '@mantine/core';


type Props = {
  accountCategory?: string;
} & Omit<SelectProps, 'data'>;

export const AccountCategorySelect: React.FC<Props> = (props) => {
 
  return (
    <Select
      {...props}
      data={[
        {
          value: 'umum',
          label: 'Umum',
        },
        {
          value: 'gaji',
          label: 'Gaji',
        },
        {
          value: 'tunjangan',
          label: 'Tunjangan',
        }
      ]}
    />
  );
};
