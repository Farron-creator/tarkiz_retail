import { useQuery } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';

import { Company } from '../types';

type CompanyDTO = {
  id: number;
};

export async function getCompany({ id }: CompanyDTO) {
  const res = await axios.get<Company>(`/company/${id}`);

  return res.data;
}

type QueryFnType = typeof getCompany;

type UseCompanyOptions = {
  id: number;
  config?: QueryConfig<QueryFnType>;
};

export function useCompany({ config, id }: UseCompanyOptions) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['company', id],
    queryFn: () => getCompany({ id }),
  });
}
