import { Select, SelectProps } from '@mantine/core';

import { useShifts } from '@/features/employee';
import { dayjs } from '@/lib/dayjs';

type Props = {
  company?: number;
} & Omit<SelectProps, 'data'>;

export const ShiftSelect: React.FC<Props> = (props) => {
  const { data } = useShifts({ params: { limit: -1, company: props.company } });

  return (
    <Select
      {...props}
      data={[
        ...(data?.result ?? []).map(({ id, name, startTime, endTime }) => ({
          value: id.toString(),
          label: `${name} (${dayjs(startTime, 'HH:mm:ss').format('HH.mm')} - ${dayjs(
            endTime,
            'HH:mm:ss'
          ).format('HH.mm')})`,
        })),
      ]}
    />
  );
};
