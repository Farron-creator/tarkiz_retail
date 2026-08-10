import { useMutation } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { GeneralResponse } from '@/types/api';

import { Handover } from '../types';

type HandoverDeleteDTO = {
  id: number;
};

export async function deleteHandover({ id }: HandoverDeleteDTO) {
  const res = await axios.delete<GeneralResponse<Handover>>(`/handover/${id}`);

  return res.data;
}

type UseDeleteHandoverOptions = {
  config?: MutationConfig<typeof deleteHandover>;
};

export function useDeleteHandover({ config }: UseDeleteHandoverOptions = {}) {
  return useMutation(deleteHandover, {
    ...config,
    onSuccess: (...args) => {
      queryClient.invalidateQueries(['handovers']);

      if (config?.onSuccess) {
        config.onSuccess(...args);
      }
    },
  });
}
