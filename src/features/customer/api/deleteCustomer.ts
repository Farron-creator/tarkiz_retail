import { useMutation } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { GeneralResponse } from '@/types/api';

import { Customer } from '../types';

type CustomerDeleteDTO = {
  id: number;
};

export async function deleteCustomer({ id }: CustomerDeleteDTO) {
  const res = await axios.delete<GeneralResponse<Customer>>(`/customer/${id}`);

  return res.data;
}

type UseDeleteCustomerOptions = {
  config?: MutationConfig<typeof deleteCustomer>;
};

export function useDeleteCustomer({ config }: UseDeleteCustomerOptions = {}) {
  return useMutation(deleteCustomer, {
    ...config,
    onSuccess: (...args) => {
      queryClient.invalidateQueries(['customers']);

      if (config?.onSuccess) {
        config.onSuccess(...args);
      }
    },
  });
}
