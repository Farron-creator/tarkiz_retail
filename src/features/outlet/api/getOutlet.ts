import { useQuery } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';

import { Outlet } from '../types';

type OutletDTO = {
  id: number;
};

export async function getOutlet({ id }: OutletDTO) {
  const res = await axios.get<Outlet>(`/outlet/${id}`);

  return res.data;
}

type QueryFnType = typeof getOutlet;

type UseOutletOptions = {
  id: number;
  config?: QueryConfig<QueryFnType>;
};

export function useOutlet({ config, id }: UseOutletOptions) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['outlet', id],
    queryFn: () => getOutlet({ id }),
  });
}
