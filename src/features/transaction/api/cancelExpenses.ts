import { useMutation } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { GeneralResponse } from '@/types/api';

import { Expense } from '../types';

type ExpenseCancelDTO = {
  id: number;
};

export async function cancelExpense({ id }: ExpenseCancelDTO) {
  const res = await axios.patch<GeneralResponse<Expense>>(`/expense/${id}/cancel`);

  return res.data;
}

type UseCancelExpenseOptions = {
  config?: MutationConfig<typeof cancelExpense>;
};

export function useCancelExpense({ config }: UseCancelExpenseOptions = {}) {
  return useMutation(cancelExpense, {
    ...config,
    onSuccess: (...args) => {
      queryClient.invalidateQueries(['expenses']);
      queryClient.invalidateQueries(['expense', args[1].id]);

      if (config?.onSuccess) {
        config.onSuccess(...args);
      }
    },
  });
}
