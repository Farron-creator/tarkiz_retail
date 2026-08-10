import { useQuery } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';
import { PaginatedResult } from '@/types/api';

import { Customer, CustomerQuery } from '../types';

type CustomersDTO = {
  params?: CustomerQuery;
};

export async function getCustomers({ params }: CustomersDTO) {
  const res = await axios.get<PaginatedResult<Customer>>(`/customer`, { params });

  return res.data;
}

type QueryFnType = typeof getCustomers;

type UseCustomersOptions = {
  params?: CustomerQuery;
  config?: QueryConfig<QueryFnType>;
};

export function useCustomers({ config, params }: UseCustomersOptions = {}) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['customers', params],
    queryFn: () => getCustomers({ params }),
    keepPreviousData: true,
  });
}
