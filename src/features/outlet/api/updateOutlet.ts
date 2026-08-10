import { useMutation } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { GeneralResponse } from '@/types/api';

import { Outlet, OutletRequest } from '../types';

export type UpdateOutletDTO = {
  id: number;
  data: OutletRequest;
};

export async function updateOutlet({ id, data }: UpdateOutletDTO) {
  const res = await axios.put<GeneralResponse<Outlet>>(`/outlet/${id}`, data);

  return res.data;
}

type UseUpdateOutletOptions = {
  config?: MutationConfig<typeof updateOutlet>;
};

export function useUpdateOutlet({ config }: UseUpdateOutletOptions = {}) {
  return useMutation(updateOutlet, {
    ...config,
    onSuccess: (...args) => {
      queryClient.invalidateQueries(['outlets']);
      queryClient.invalidateQueries(['outlet', args[1].id]);

      if (config?.onSuccess) {
        config.onSuccess(...args);
      }
    },
  });
}
