import { SelectProps, Select } from '@mantine/core';
import { useMemo } from 'react';

import { useOutlets } from '../api';
import { OutletQuery } from '../types';

type Props = Omit<SelectProps, 'data'> & OutletQuery;

export const OutletSelect: React.FC<Props> = (props) => {
  const { data } = useOutlets({ params: { limit: -1 } });

  const program = useMemo(() => {
    if (!data) return [];

    return data.result.map(({ id, name }) => ({
      label: name,
      value: id.toString(),
    }));
  }, [data]);

  return <Select {...props} data={program} searchable />;
};
