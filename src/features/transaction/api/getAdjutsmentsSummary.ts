import { useQuery } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { dayjs } from '@/lib/dayjs';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';

import { AdjustmentsSummary, AdjustmentsSummaryQuery } from '../types';

type SummariesDTO = {
  params?: AdjustmentsSummaryQuery;
};

export async function getAdjustmentsSummary({ params }: SummariesDTO) {
  const res = await axios.get<AdjustmentsSummary[]>(`/adjustment/summary`, {
    params: {
      ...params,
      startDate: params?.startDate ? dayjs(params?.startDate).startOf('d').utc(true).toDate() : '',
      endDate: params?.endDate ? dayjs(params?.endDate).endOf('d').utc(true).toDate() : '',
    },
  });

  return res.data;
}

type QueryFnType = typeof getAdjustmentsSummary;

type UseAdjustmentsSummaryOptions = {
  params?: AdjustmentsSummaryQuery;
  config?: QueryConfig<QueryFnType>;
};

export function useAdjustmentsSummary({ config, params }: UseAdjustmentsSummaryOptions = {}) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['adjustments-summary', params],
    queryFn: () => getAdjustmentsSummary({ params }),
  });
}
