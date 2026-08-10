import { useMutation } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { GeneralResponse } from '@/types/api';

import { Sale, SaleRequest } from '../types';

type SaleCreateDTO = {
  data: SaleRequest;
};

export async function createSale({ data }: SaleCreateDTO) {
  const res = await axios.post<GeneralResponse<Sale>>(`/sale`, data);

  return res.data;
}

type UseCreateSaleOptions = {
  config?: MutationConfig<typeof createSale>;
};

export function useCreateSale({ config }: UseCreateSaleOptions = {}) {
  return useMutation(createSale, {
    ...config,
    onSuccess: (...args) => {
      queryClient.invalidateQueries(['sales']);

      if (config?.onSuccess) {
        config.onSuccess(...args);
      }
    },
  });
}
