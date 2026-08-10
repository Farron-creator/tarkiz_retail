import { useMutation } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { GeneralResponse } from '@/types/api';

import { Purchase, PurchaseRequest } from '../types';

export type UpdatePurchaseDTO = {
  id: number;
  data: PurchaseRequest;
};

export async function updatePurchase({ id, data }: UpdatePurchaseDTO) {
  const res = await axios.put<GeneralResponse<Purchase>>(`/purchase/${id}`, data);

  return res.data;
}

type UseUpdatePurchaseOptions = {
  config?: MutationConfig<typeof updatePurchase>;
};

export function useUpdatePurchase({ config }: UseUpdatePurchaseOptions = {}) {
  return useMutation(updatePurchase, {
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
