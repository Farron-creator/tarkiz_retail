import { useMutation } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { GeneralResponse } from '@/types/api';

import { Product, ProductRequest } from '../types';

export type UpdateProductDTO = {
  id: number;
  data: ProductRequest;
};

export async function updateProduct({ id, data }: UpdateProductDTO) {
  const res = await axios.put<GeneralResponse<Product>>(`/product/${id}`, data);

  return res.data;
}

type UseUpdateProductOptions = {
  config?: MutationConfig<typeof updateProduct>;
};

export function useUpdateProduct({ config }: UseUpdateProductOptions = {}) {
  return useMutation(updateProduct, {
    ...config,
    onSuccess: (...args) => {
      queryClient.invalidateQueries(['products']);
      queryClient.invalidateQueries(['product', args[1].id]);

      if (config?.onSuccess) {
        config.onSuccess(...args);
      }
    },
  });
}
