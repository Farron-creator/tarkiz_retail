import { useMutation } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { GeneralResponse } from '@/types/api';

import { Supplier } from '../types';

type SupplierDeleteDTO = {
  id: number;
};

export async function deleteSupplier({ id }: SupplierDeleteDTO) {
  const res = await axios.delete<GeneralResponse<Supplier>>(`/supplier/${id}`);

  return res.data;
}

type UseDeleteSupplierOptions = {
  config?: MutationConfig<typeof deleteSupplier>;
};

export function useDeleteSupplier({ config }: UseDeleteSupplierOptions = {}) {
  return useMutation(deleteSupplier, {
    ...config,
    onSuccess: (...args) => {
      queryClient.invalidateQueries(['suppliers']);

      if (config?.onSuccess) {
        config.onSuccess(...args);
      }
    },
  });
}
