import { useMutation } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { GeneralResponse } from '@/types/api';

import { Adjustment } from '../types';

type AdjustmentDeleteDTO = {
  id: number;
};

export async function deleteAdjustment({ id }: AdjustmentDeleteDTO) {
  const res = await axios.delete<GeneralResponse<Adjustment>>(`/adjustment/${id}`);

  return res.data;
}

type UseDeleteAdjustmentOptions = {
  config?: MutationConfig<typeof deleteAdjustment>;
};

export function useDeleteAdjustment({ config }: UseDeleteAdjustmentOptions = {}) {
  return useMutation(deleteAdjustment, {
    ...config,
    onSuccess: (...args) => {
      queryClient.invalidateQueries(['adjustments']);

      if (config?.onSuccess) {
        config.onSuccess(...args);
      }
    },
  });
}
