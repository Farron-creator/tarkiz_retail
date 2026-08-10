import { useMutation } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { GeneralResponse } from '@/types/api';

import { Company, CompanyRequest } from '../types';

export type UpdateCompanyDTO = {
  id: number;
  data: CompanyRequest;
};

export async function updateCompany({ id, data }: UpdateCompanyDTO) {
  const res = await axios.put<GeneralResponse<Company>>(`/company/${id}`, data);

  return res.data;
}

type UseUpdateCompanyOptions = {
  config?: MutationConfig<typeof updateCompany>;
};

export function useUpdateCompany({ config }: UseUpdateCompanyOptions = {}) {
  return useMutation(updateCompany, {
    ...config,
    onSuccess: (...args) => {
      queryClient.invalidateQueries(['companies']);
      queryClient.invalidateQueries(['company', args[1].id]);

      if (config?.onSuccess) {
        config.onSuccess(...args);
      }
    },
  });
}
