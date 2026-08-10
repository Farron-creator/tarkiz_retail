import { useMutation } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { GeneralResponse } from '@/types/api';

import { Customer, CustomerRequest } from '../types';

export type UpdateCustomerDTO = {
  id: number;
  data: CustomerRequest;
};

export async function updateCustomer({ id, data }: UpdateCustomerDTO) {
  const res = await axios.put<GeneralResponse<Customer>>(`/customer/${id}`, data);

  return res.data;
}

type UseUpdateCustomerOptions = {
  config?: MutationConfig<typeof updateCustomer>;
};

export function useUpdateCustomer({ config }: UseUpdateCustomerOptions = {}) {
  return useMutation(updateCustomer, {
    ...config,
    onSuccess: (...args) => {
      queryClient.invalidateQueries(['customers']);
      queryClient.invalidateQueries(['customer', args[1].id]);

      if (config?.onSuccess) {
        config.onSuccess(...args);
      }
    },
  });
}
