import { useMutation } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { GeneralResponse } from '@/types/api';

import { Expense, ExpenseRequest } from '../types';

type ExpenseCreateDTO = {
  data: ExpenseRequest;
};

export async function createExpense({ data }: ExpenseCreateDTO) {
  const res = await axios.post<GeneralResponse<Expense>>(`/expense`, data);

  return res.data;
}

type UseCreateExpenseOptions = {
  config?: MutationConfig<typeof createExpense>;
};

export function useCreateExpense({ config }: UseCreateExpenseOptions = {}) {
  return useMutation(createExpense, {
    ...config,
    onSuccess: (...args) => {
      queryClient.invalidateQueries(['expenses']);

      if (config?.onSuccess) {
        config.onSuccess(...args);
      }
    },
  });
}
