import { useMutation } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { GeneralResponse } from '@/types/api';

import { Purchase } from '../types';

type PurchaseDeleteDTO = {
  id: number;
};

export async function deletePurchase({ id }: PurchaseDeleteDTO) {
  const res = await axios.delete<GeneralResponse<Purchase>>(`/purchase/${id}`);

  return res.data;
}

type UseDeletePurchaseOptions = {
  config?: MutationConfig<typeof deletePurchase>;
};

export function useDeletePurchase({ config }: UseDeletePurchaseOptions = {}) {
  return useMutation(deletePurchase, {
    ...config,
    onSuccess: (...args) => {
      queryClient.invalidateQueries(['purchases']);

      if (config?.onSuccess) {
        config.onSuccess(...args);
      }
    },
  });
}
