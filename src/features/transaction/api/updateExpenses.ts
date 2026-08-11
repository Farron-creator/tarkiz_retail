import { useMutation } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { GeneralResponse } from '@/types/api';

import { Expense, ExpenseRequest } from '../types';

export type UpdateExpenseDTO = {
  id: number;
  data: ExpenseRequest;
};

export async function updateExpense({ id, data }: UpdateExpenseDTO) {
  const res = await axios.put<GeneralResponse<Expense>>(`/expense/${id}`, data);

  return res.data;
}

type UseUpdateExpenseOptions = {
  config?: MutationConfig<typeof updateExpense>;
};

export function useUpdateExpense({ config }: UseUpdateExpenseOptions = {}) {
  return useMutation(updateExpense, {
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
