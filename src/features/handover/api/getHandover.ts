import { useQuery } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';

import { Handover } from '../types';

type HandoverDTO = {
  id: number;
};

export async function getHandover({ id }: HandoverDTO) {
  const res = await axios.get<Handover>(`/handover/${id}`);

  return res.data;
}

type QueryFnType = typeof getHandover;

type UseHandoverOptions = {
  id: number;
  config?: QueryConfig<QueryFnType>;
};

export function useHandover({ config, id }: UseHandoverOptions) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['handover', id],
    queryFn: () => getHandover({ id }),
  });
}
