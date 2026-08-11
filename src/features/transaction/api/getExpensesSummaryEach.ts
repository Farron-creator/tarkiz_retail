import { useQuery } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { dayjs } from '@/lib/dayjs';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';

import { ExpensesSummaryEach, ExpensesSummaryQuery } from '../types';

type SummariesDTO = {
  params?: ExpensesSummaryQuery;
};

export async function getExpensesSummaryEach({ params }: SummariesDTO) {
  const res = await axios.get<ExpensesSummaryEach[]>(`/expense/summaryeach`, {
    params: {
      ...params,
      startDate: params?.startDate ? dayjs(params?.startDate).startOf('d').utc(true).toDate() : '',
      endDate: params?.endDate ? dayjs(params?.endDate).endOf('d').utc(true).toDate() : '',
    },
  });

  return res.data;
}

type QueryFnType = typeof getExpensesSummaryEach;

type UseExpensesSummaryOptions = {
  params?: ExpensesSummaryQuery;
  config?: QueryConfig<QueryFnType>;
};

export function useExpensesSummaryEach({ config, params }: UseExpensesSummaryOptions = {}) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['expenses-summary-each', params],
    queryFn: () => getExpensesSummaryEach({ params }),
  });
}
