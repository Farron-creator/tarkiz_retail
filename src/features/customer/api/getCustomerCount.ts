import { useQuery } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';

import { CustomerCount, CustomerCountQuery } from '../types';

type CustomerCountDTO = {
  params?: CustomerCountQuery;
};

export async function getCustomerCount({ params }: CustomerCountDTO) {
  const res = await axios.get<CustomerCount>(`/customer/count`, { params });

  return res.data;
}

type QueryFnType = typeof getCustomerCount;

type UseCustomerCountOptions = {
  params?: CustomerCountQuery;
  config?: QueryConfig<QueryFnType>;
};

export function useCustomerCount({ config, params }: UseCustomerCountOptions = {}) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['customer-count', params],
    queryFn: () => getCustomerCount({ params }),
    keepPreviousData: true,
  });
}
