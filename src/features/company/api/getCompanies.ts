import { useQuery } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';
import { PaginatedResult } from '@/types/api';

import { Company, CompanyQuery } from '../types';

type CompaniesDTO = {
  params?: CompanyQuery;
};

export async function getCompanies({ params }: CompaniesDTO) {
  const res = await axios.get<PaginatedResult<Company>>(`/company`, { params });

  return res.data;
}

type QueryFnType = typeof getCompanies;

type UseCompaniesOptions = {
  params?: CompanyQuery;
  config?: QueryConfig<QueryFnType>;
};

export function useCompanies({ config, params }: UseCompaniesOptions = {}) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['companies', params],
    queryFn: () => getCompanies({ params }),
    keepPreviousData: true,
  });
}
