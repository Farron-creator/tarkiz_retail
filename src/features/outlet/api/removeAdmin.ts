import { useMutation } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { GeneralResponse } from '@/types/api';

type RemoveAdminDTO = {
  outletId: number;
  employeeId: number;
};

export async function RemoveAdmin({ outletId, employeeId }: RemoveAdminDTO) {
  const res = await axios.delete<GeneralResponse>(`/outlet/${outletId}/admin/${employeeId}`);

  return res.data;
}

type UseRemoveAdminOptions = {
  config?: MutationConfig<typeof RemoveAdmin>;
};

export function useRemoveAdmin({ config }: UseRemoveAdminOptions = {}) {
  return useMutation(RemoveAdmin, {
    ...config,
    onSuccess: (...args) => {
      queryClient.invalidateQueries(['outlet-admins', args[1].outletId]);

      if (config?.onSuccess) {
        config.onSuccess(...args);
      }
    },
  });
}
