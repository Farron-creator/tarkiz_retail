import { useMutation } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { GeneralResponse } from '@/types/api';

import { Sale, SaleRequest } from '../types';

export type UpdateSaleDTO = {
  id: number;
  data: SaleRequest;
};

export async function updateSale({ id, data }: UpdateSaleDTO) {
  const res = await axios.put<GeneralResponse<Sale>>(`/sale/${id}`, data);

  return res.data;
}

type UseUpdateSaleOptions = {
  config?: MutationConfig<typeof updateSale>;
};

export function useUpdateSale({ config }: UseUpdateSaleOptions = {}) {
  return useMutation(updateSale, {
    ...config,
    onSuccess: (...args) => {
      queryClient.invalidateQueries(['sales']);
      queryClient.invalidateQueries(['sale', args[1].id]);

      if (config?.onSuccess) {
        config.onSuccess(...args);
      }
    },
  });
}
