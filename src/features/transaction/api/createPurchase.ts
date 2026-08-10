import { useMutation } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { GeneralResponse } from '@/types/api';

import { Purchase, PurchaseRequest } from '../types';

type PurchaseCreateDTO = {
  data: PurchaseRequest;
};

export async function createPurchase({ data }: PurchaseCreateDTO) {
  const res = await axios.post<GeneralResponse<Purchase>>(`/purchase`, data);

  return res.data;
}

type UseCreatePurchaseOptions = {
  config?: MutationConfig<typeof createPurchase>;
};

export function useCreatePurchase({ config }: UseCreatePurchaseOptions = {}) {
  return useMutation(createPurchase, {
    ...config,
    onSuccess: (...args) => {
      queryClient.invalidateQueries(['purchases']);

      if (config?.onSuccess) {
        config.onSuccess(...args);
      }
    },
  });
}
