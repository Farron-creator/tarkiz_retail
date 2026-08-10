import { useMutation } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { GeneralResponse } from '@/types/api';

type AddAdminDTO = {
  outletId: number;
  employeeId: number;
};

export async function AddAdmin({ outletId, employeeId }: AddAdminDTO) {
  const res = await axios.put<GeneralResponse>(`/outlet/${outletId}/admin/${employeeId}`);

  return res.data;
}

type UseAddAdminOptions = {
  config?: MutationConfig<typeof AddAdmin>;
};

export function useAddAdmin({ config }: UseAddAdminOptions = {}) {
  return useMutation(AddAdmin, {
    ...config,
    onSuccess: (...args) => {
      queryClient.invalidateQueries(['outlet-admins', args[1].outletId]);

      if (config?.onSuccess) {
        config.onSuccess(...args);
      }
    },
  });
}
