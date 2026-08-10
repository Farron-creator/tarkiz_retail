import { useMutation } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { GeneralResponse } from '@/types/api';

import { Handover, HandoverRequest } from '../types';

export type UpdateHandoverDTO = {
  id: number;
  data: HandoverRequest;
};

export async function updateHandover({ id, data }: UpdateHandoverDTO) {
  const res = await axios.put<GeneralResponse<Handover>>(`/handover/${id}`, data);

  return res.data;
}

type UseUpdateHandoverOptions = {
  config?: MutationConfig<typeof updateHandover>;
};

export function useUpdateHandover({ config }: UseUpdateHandoverOptions = {}) {
  return useMutation(updateHandover, {
    ...config,
    onSuccess: (...args) => {
      queryClient.invalidateQueries(['handovers']);
      queryClient.invalidateQueries(['handover', args[1].id]);

      if (config?.onSuccess) {
        config.onSuccess(...args);
      }
    },
  });
}
