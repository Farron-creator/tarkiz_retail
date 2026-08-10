import { useMutation } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { GeneralResponse } from '@/types/api';

import { Supplier, SupplierRequest } from '../types';

type SupplierCreateDTO = {
  data: SupplierRequest;
};

export async function createSupplier({ data }: SupplierCreateDTO) {
  const res = await axios.post<GeneralResponse<Supplier>>(`/supplier`, data);

  return res.data;
}

type UseCreateSupplierOptions = {
  config?: MutationConfig<typeof createSupplier>;
};

export function useCreateSupplier({ config }: UseCreateSupplierOptions = {}) {
  return useMutation(createSupplier, {
    ...config,
    onSuccess: (...args) => {
      queryClient.invalidateQueries(['suppliers']);

      if (config?.onSuccess) {
        config.onSuccess(...args);
      }
    },
  });
}
