import { useMutation } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { GeneralResponse } from '@/types/api';

import { Adjustment, AdjustmentRequest } from '../types';

type AdjustmentCreateDTO = {
  data: AdjustmentRequest;
};

export async function createAdjustment({ data }: AdjustmentCreateDTO) {
  const res = await axios.post<GeneralResponse<Adjustment>>(`/adjustment`, data);

  return res.data;
}

type UseCreateAdjustmentOptions = {
  config?: MutationConfig<typeof createAdjustment>;
};

export function useCreateAdjustment({ config }: UseCreateAdjustmentOptions = {}) {
  return useMutation(createAdjustment, {
    ...config,
    onSuccess: (...args) => {
      queryClient.invalidateQueries(['adjustments']);

      if (config?.onSuccess) {
        config.onSuccess(...args);
      }
    },
  });
}
