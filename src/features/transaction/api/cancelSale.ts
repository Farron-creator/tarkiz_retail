import { useMutation } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { GeneralResponse } from '@/types/api';

import { Sale } from '../types';

type SaleCancelDTO = {
  id: number;
};

export async function cancelSale({ id }: SaleCancelDTO) {
  const res = await axios.patch<GeneralResponse<Sale>>(`/sale/${id}/cancel`);

  return res.data;
}

type UseCancelSaleOptions = {
  config?: MutationConfig<typeof cancelSale>;
};

export function useCancelSale({ config }: UseCancelSaleOptions = {}) {
  return useMutation(cancelSale, {
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
