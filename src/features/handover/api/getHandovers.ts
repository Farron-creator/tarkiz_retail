import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';
import { PaginatedResult } from '@/types/api';

import { Handover, HandoverQuery } from '../types';

type HandoversDTO = {
  params?: HandoverQuery;
};

export async function getHandovers({ params }: HandoversDTO) {
  const res = await axios.get<PaginatedResult<Handover>>(`/handover`, { params });

  return res.data;
}

type QueryFnType = typeof getHandovers;

type UseHandoversOptions = {
  params?: HandoverQuery;
  config?: QueryConfig<QueryFnType>;
};

export function useHandovers({ config, params }: UseHandoversOptions = {}) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['handovers', params],
    queryFn: () => getHandovers({ params }),
    keepPreviousData: true,
  });
}

export function useInfiniteHandovers({ params }: UseHandoversOptions = {}) {
  return useInfiniteQuery<ExtractFnReturnType<QueryFnType>>({
    queryKey: ['handovers', params],
    queryFn: ({ pageParam: page = 1 }) => getHandovers({ params: { ...params, page } }),
    getNextPageParam: ({ metadata }) => (metadata.hasNext ? metadata.page + 1 : undefined),
    getPreviousPageParam: ({ metadata }) => (metadata.hasPrev ? metadata.page - 1 : undefined),
  });
}
