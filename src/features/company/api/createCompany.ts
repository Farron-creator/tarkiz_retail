import { useMutation } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { GeneralResponse } from '@/types/api';

import { Company, CompanyRequest } from '../types';

type CompanyCreateDTO = {
  data: CompanyRequest;
};

export async function createCompany({ data }: CompanyCreateDTO) {
  const res = await axios.post<GeneralResponse<Company>>(`/company`, data);

  return res.data;
}

type UseCreateCompanyOptions = {
  config?: MutationConfig<typeof createCompany>;
};

export function useCreateCompany({ config }: UseCreateCompanyOptions = {}) {
  return useMutation(createCompany, {
    ...config,
    onSuccess: (...args) => {
      queryClient.invalidateQueries(['companies']);

      if (config?.onSuccess) {
        config.onSuccess(...args);
      }
    },
  });
}
