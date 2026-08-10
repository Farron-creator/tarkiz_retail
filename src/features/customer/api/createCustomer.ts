import { useMutation } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { GeneralResponse } from '@/types/api';

import { Customer, CustomerRequest } from '../types';

type CustomerCreateDTO = {
  data: CustomerRequest;
};

export async function createCustomer({ data }: CustomerCreateDTO) {
  const res = await axios.post<GeneralResponse<Customer>>(`/customer`, data);

  return res.data;
}

type UseCreateCustomerOptions = {
  config?: MutationConfig<typeof createCustomer>;
};

export function useCreateCustomer({ config }: UseCreateCustomerOptions = {}) {
  return useMutation(createCustomer, {
    ...config,
    onSuccess: (...args) => {
      queryClient.invalidateQueries(['customers']);

      if (config?.onSuccess) {
        config.onSuccess(...args);
      }
    },
  });
}
