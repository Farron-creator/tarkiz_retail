import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';
import { PaginatedResult } from '@/types/api';

import { Expense, ExpenseQuery } from '../types';

type ExpensesDTO = {
  params?: ExpenseQuery;
};

export async function getExpenses({ params }: ExpensesDTO) {
  const res = await axios.get<PaginatedResult<Expense>>(`/expense`, { params });

  return res.data;
}

type QueryFnType = typeof getExpenses;

type UseExpensesOptions = {
  params?: ExpenseQuery;
  config?: QueryConfig<QueryFnType>;
};

export function useExpenses({ config, params }: UseExpensesOptions = {}) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['expenses', params],
    queryFn: () => getExpenses({ params }),
    keepPreviousData: true,
  });
}

export function useInfiniteExpenses({ params }: UseExpensesOptions = {}) {
  return useInfiniteQuery<ExtractFnReturnType<QueryFnType>>({
    queryKey: ['expenses', { ...params, infinite: true }],
    queryFn: ({ pageParam: page = 1 }) => getExpenses({ params: { ...params, page } }),
    getNextPageParam: ({ metadata }) => (metadata.hasNext ? metadata.page + 1 : undefined),
    getPreviousPageParam: ({ metadata }) => (metadata.hasPrev ? metadata.page - 1 : undefined),
  });
}
