import { useQuery } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';

import { Supplier } from '../types';

type SupplierDTO = {
  id: number;
};

export async function getSupplier({ id }: SupplierDTO) {
  const res = await axios.get<Supplier>(`/supplier/${id}`);

  return res.data;
}

type QueryFnType = typeof getSupplier;

type UseSupplierOptions = {
  id: number;
  config?: QueryConfig<QueryFnType>;
};

export function useSupplier({ config, id }: UseSupplierOptions) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['supplier', id],
    queryFn: () => getSupplier({ id }),
  });
}
