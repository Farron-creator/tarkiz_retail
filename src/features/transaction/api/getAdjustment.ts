import { useQuery } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';

import { Adjustment } from '../types';

type AdjustmentDTO = {
  id: number;
};

export async function getAdjustment({ id }: AdjustmentDTO) {
  const res = await axios.get<Adjustment>(`/adjustment/${id}`);

  return res.data;
}

type QueryFnType = typeof getAdjustment;

type UseAdjustmentOptions = {
  id: number;
  config?: QueryConfig<QueryFnType>;
};

export function useAdjustment({ config, id }: UseAdjustmentOptions) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['adjustment', id],
    queryFn: () => getAdjustment({ id }),
  });
}
