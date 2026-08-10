import { useMutation } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { GeneralResponse } from '@/types/api';

import { Supplier, SupplierRequest } from '../types';

export type UpdateSupplierDTO = {
  id: number;
  data: SupplierRequest;
};

export async function updateSupplier({ id, data }: UpdateSupplierDTO) {
  const res = await axios.put<GeneralResponse<Supplier>>(`/supplier/${id}`, data);

  return res.data;
}

type UseUpdateSupplierOptions = {
  config?: MutationConfig<typeof updateSupplier>;
};

export function useUpdateSupplier({ config }: UseUpdateSupplierOptions = {}) {
  return useMutation(updateSupplier, {
    ...config,
    onSuccess: (...args) => {
      queryClient.invalidateQueries(['suppliers']);
      queryClient.invalidateQueries(['supplier', args[1].id]);

      if (config?.onSuccess) {
        config.onSuccess(...args);
      }
    },
  });
}
