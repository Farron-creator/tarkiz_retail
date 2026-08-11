import { useMutation } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { GeneralResponse } from '@/types/api';

import { Adjustment, AdjustmentRequest } from '../types';

export type UpdateAdjustmentDTO = {
  id: number;
  data: AdjustmentRequest;
};

export async function updateAdjustment({ id, data }: UpdateAdjustmentDTO) {
  const res = await axios.put<GeneralResponse<Adjustment>>(`/adjustment/${id}`, data);

  return res.data;
}

type UseUpdateAdjustmentOptions = {
  config?: MutationConfig<typeof updateAdjustment>;
};

export function useUpdateAdjustment({ config }: UseUpdateAdjustmentOptions = {}) {
  return useMutation(updateAdjustment, {
    ...config,
    onSuccess: (...args) => {
      queryClient.invalidateQueries(['adjustments']);
      queryClient.invalidateQueries(['adjustment', args[1].id]);

      if (config?.onSuccess) {
        config.onSuccess(...args);
      }
    },
  });
}
