import { useQuery } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { dayjs } from '@/lib/dayjs';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';

import { ExpensesSummary, ExpensesSummaryQuery } from '../types';

type SummariesDTO = {
  params?: ExpensesSummaryQuery;
};

export async function getExpensesSummary({ params }: SummariesDTO) {
  const res = await axios.get<ExpensesSummary[]>(`/expense/summary`, {
    params: {
      ...params,
      startDate: params?.startDate ? dayjs(params?.startDate).startOf('d').utc(true).toDate() : '',
      endDate: params?.endDate ? dayjs(params?.endDate).endOf('d').utc(true).toDate() : '',
    },
  });

  return res.data;
}

type QueryFnType = typeof getExpensesSummary;

type UseExpensesSummaryOptions = {
  params?: ExpensesSummaryQuery;
  config?: QueryConfig<QueryFnType>;
};

export function useExpensesSummary({ config, params }: UseExpensesSummaryOptions = {}) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['expenses-summary', params],
    queryFn: () => getExpensesSummary({ params }),
  });
}
