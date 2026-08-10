import { useQuery } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';

import { Purchase } from '../types';

type PurchaseDTO = {
  id: number;
};

export async function getPurchase({ id }: PurchaseDTO) {
  const res = await axios.get<Purchase>(`/purchase/${id}`);

  return res.data;
}

type QueryFnType = typeof getPurchase;

type UsePurchaseOptions = {
  id: number;
  config?: QueryConfig<QueryFnType>;
};

export function usePurchase({ config, id }: UsePurchaseOptions) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['purchase', id],
    queryFn: () => getPurchase({ id }),
  });
}
