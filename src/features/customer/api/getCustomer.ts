import { useQuery } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';

import { Customer } from '../types';

type CustomerDTO = {
  id: number | string;
};

export async function getCustomer({ id }: CustomerDTO) {
  const res = await axios.get<Customer>(`/customer/${id}`);

  return res.data;
}

type QueryFnType = typeof getCustomer;

type UseCustomerOptions = {
  id: number | string;
  config?: QueryConfig<QueryFnType>;
};

export function useCustomer({ config, id }: UseCustomerOptions) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['customer', id],
    queryFn: () => getCustomer({ id }),
  });
}
