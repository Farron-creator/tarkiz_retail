import { useMutation } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { GeneralResponse } from '@/types/api';

import { Purchase } from '../types';

type PurchaseCancelDTO = {
  id: number;
};

export async function cancelPurchase({ id }: PurchaseCancelDTO) {
  const res = await axios.patch<GeneralResponse<Purchase>>(`/purchase/${id}/cancel`);

  return res.data;
}

type UseCancelPurchaseOptions = {
  config?: MutationConfig<typeof cancelPurchase>;
};

export function useCancelPurchase({ config }: UseCancelPurchaseOptions = {}) {
  return useMutation(cancelPurchase, {
    ...config,
    onSuccess: (...args) => {
      queryClient.invalidateQueries(['purchases']);
      queryClient.invalidateQueries(['purchase', args[1].id]);

      if (config?.onSuccess) {
        config.onSuccess(...args);
      }
    },
  });
}
