import { useMutation } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { GeneralResponse } from '@/types/api';

import { Product, ProductRequest } from '../types';

type ProductCreateDTO = {
  data: ProductRequest;
};

export async function createProduct({ data }: ProductCreateDTO) {
  const res = await axios.post<GeneralResponse<Product>>(`/product`, data);

  return res.data;
}

type UseCreateProductOptions = {
  config?: MutationConfig<typeof createProduct>;
};

export function useCreateProduct({ config }: UseCreateProductOptions = {}) {
  return useMutation(createProduct, {
    ...config,
    onSuccess: (...args) => {
      queryClient.invalidateQueries(['products']);

      if (config?.onSuccess) {
        config.onSuccess(...args);
      }
    },
  });
}
