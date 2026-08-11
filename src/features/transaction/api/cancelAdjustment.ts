  import { useMutation } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { GeneralResponse } from '@/types/api';

import { Adjustment } from '../types';

type AdjustmentCancelDTO = {
  id: number;
};

export async function cancelAdjustment({ id }: AdjustmentCancelDTO) {
  const res = await axios.patch<GeneralResponse<Adjustment>>(`/adjustment/${id}/cancel`);

  return res.data;
}

type UseCancelAdjustmentOptions = {
  config?: MutationConfig<typeof cancelAdjustment>;
};

export function useCancelAdjustment({ config }: UseCancelAdjustmentOptions = {}) {
  return useMutation(cancelAdjustment, {
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
