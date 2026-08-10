import { useQuery } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { dayjs } from '@/lib/dayjs';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';

import { PurchasesSummary, PurchasesSummaryQuery } from '../types';


type SummariesDTO = {
  params?: PurchasesSummaryQuery;
};

export async function getPurchasesSummary({ params }: SummariesDTO) {
  
  const res = await axios.get<PurchasesSummary[]>(`/purchase/summary`, {
    params: {
      ...params,
      startDate: params?.startDate ? dayjs.utc(params?.startDate).format('YYYY-MM-DD') : '',
      endDate: params?.endDate ? dayjs.utc(params?.endDate).format('YYYY-MM-DD') : '',
    },
  });

  return res.data;
}

type QueryFnType = typeof getPurchasesSummary;

type UsePurchasesSummaryOptions = {
  params?: PurchasesSummaryQuery;
  config?: QueryConfig<QueryFnType>;
};

export function usePurchasesSummary({ config, params }: UsePurchasesSummaryOptions = {}) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['purchases-summary', params],
    queryFn: () => getPurchasesSummary({ params }),
  });
}
