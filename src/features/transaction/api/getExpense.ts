import { useQuery } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';

import { Expense } from '../types';

type ExpenseDTO = {
  id: number;
};

export async function getExpense({ id }: ExpenseDTO) {
  const res = await axios.get<Expense>(`/expense/${id}`);

  return res.data;
}

type QueryFnType = typeof getExpense;

type UseExpenseOptions = {
  id: number;
  config?: QueryConfig<QueryFnType>;
};

export function useExpense({ config, id }: UseExpenseOptions) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['expense', id],
    queryFn: () => getExpense({ id }),
  });
}
