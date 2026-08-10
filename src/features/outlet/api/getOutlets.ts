import { useQuery } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';
import { PaginatedResult } from '@/types/api';

import { Outlet, OutletQuery } from '../types';

type OutletsDTO = {
  params?: OutletQuery;
};

export async function getOutlets({ params }: OutletsDTO) {
  const res = await axios.get<PaginatedResult<Outlet>>(`/outlet`, { params });

  return res.data;
}

type QueryFnType = typeof getOutlets;

type UseOutletsOptions = {
  params?: OutletQuery;
  config?: QueryConfig<QueryFnType>;
};

export function useOutlets({ config, params }: UseOutletsOptions = {}) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['outlets', params],
    queryFn: () => getOutlets({ params }),
    keepPreviousData: true,
  });
}
