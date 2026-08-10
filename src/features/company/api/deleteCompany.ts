import { useMutation } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { GeneralResponse } from '@/types/api';

import { Company } from '../types';

type CompanyDeleteDTO = {
  id: number;
};

export async function deleteCompany({ id }: CompanyDeleteDTO) {
  const res = await axios.delete<GeneralResponse<Company>>(`/company/${id}`);

  return res.data;
}

type UseDeleteCompanyOptions = {
  config?: MutationConfig<typeof deleteCompany>;
};

export function useDeleteCompany({ config }: UseDeleteCompanyOptions = {}) {
  return useMutation(deleteCompany, {
    ...config,
    onSuccess: (...args) => {
      queryClient.invalidateQueries(['companies']);

      if (config?.onSuccess) {
        config.onSuccess(...args);
      }
    },
  });
}
