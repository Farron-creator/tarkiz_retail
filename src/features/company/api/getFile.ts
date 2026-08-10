import { useQuery } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';

import { File } from '../types';

type FileDTO = {
  id: number;
};

export async function getFile({ id }: FileDTO) {
  const res = await axios.get<File>(`/file/${id}`);

  return res.data;
}

type QueryFnType = typeof getFile;

type UseFileOptions = {
  id: number;
  config?: QueryConfig<QueryFnType>;
};

export function useFile({ config, id }: UseFileOptions) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['file', id],
    queryFn: () => getFile({ id }),
  });
}
