import { useMutation } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { GeneralResponse } from '@/types/api';

import { Sale } from '../types';

type SaleDeleteDTO = {
  id: number;
};

export async function deleteSale({ id }: SaleDeleteDTO) {
  const res = await axios.delete<GeneralResponse<Sale>>(`/sale/${id}`);

  return res.data;
}

type UseDeleteSaleOptions = {
  config?: MutationConfig<typeof deleteSale>;
};

export function useDeleteSale({ config }: UseDeleteSaleOptions = {}) {
  return useMutation(deleteSale, {
    ...config,
    onSuccess: (...args) => {
      queryClient.invalidateQueries(['sales']);

      if (config?.onSuccess) {
        config.onSuccess(...args);
      }
    },
  });
}
