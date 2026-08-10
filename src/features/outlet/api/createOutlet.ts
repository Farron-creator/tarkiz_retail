import { useMutation } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { GeneralResponse } from '@/types/api';

import { Outlet, OutletRequest } from '../types';

type OutletCreateDTO = {
  data: OutletRequest;
};

export async function createOutlet({ data }: OutletCreateDTO) {
  const res = await axios.post<GeneralResponse<Outlet>>(`/outlet`, data);

  return res.data;
}

type UseCreateOutletOptions = {
  config?: MutationConfig<typeof createOutlet>;
};

export function useCreateOutlet({ config }: UseCreateOutletOptions = {}) {
  return useMutation(createOutlet, {
    ...config,
    onSuccess: (...args) => {
      queryClient.invalidateQueries(['outlets']);

      if (config?.onSuccess) {
        config.onSuccess(...args);
      }
    },
  });
}
