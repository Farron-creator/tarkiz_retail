import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';
import { PaginatedResult } from '@/types/api';

import { Adjustment, AdjustmentQuery } from '../types';

type AdjustmentsDTO = {
  params?: AdjustmentQuery;
};

export async function getAdjustments({ params }: AdjustmentsDTO) {
  const res = await axios.get<PaginatedResult<Adjustment>>(`/adjustment`, { params });

  return res.data;
}

type QueryFnType = typeof getAdjustments;

type UseAdjustmentsOptions = {
  params?: AdjustmentQuery;
  config?: QueryConfig<QueryFnType>;
};

export function useAdjustments({ config, params }: UseAdjustmentsOptions = {}) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['adjustments', params],
    queryFn: () => getAdjustments({ params }),
    keepPreviousData: true,
  });
}

export function useInfiniteAdjustments({ params }: UseAdjustmentsOptions = {}) {
  return useInfiniteQuery<ExtractFnReturnType<QueryFnType>>({
    queryKey: ['adjustments', { ...params, infinite: true }],
    queryFn: ({ pageParam: page = 1 }) => getAdjustments({ params: { ...params, page } }),
    getNextPageParam: ({ metadata }) => (metadata.hasNext ? metadata.page + 1 : undefined),
    getPreviousPageParam: ({ metadata }) => (metadata.hasPrev ? metadata.page - 1 : undefined),
  });
}
