import { useQuery } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { dayjs } from '@/lib/dayjs';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';

import { SalesSummary, SalesSummaryQuery } from '../types';

type SummariesDTO = {
  params?: SalesSummaryQuery;
};

export async function getSalesSummary({ params }: SummariesDTO) {
  // print params to console
  
  // console.log(params?.startDate);
  // console.log(params?.endDate);
  // console.log(dayjs(params?.startDate).subtract(8, 'hour'));
  // console.log(dayjs(params?.endDate).subtract(8, 'hour'));
  const res = await axios.get<SalesSummary[]>(`/sale/summary`, {
    params: {
      ...params,
      startDate: params?.startDate ? dayjs.utc(params?.startDate).format('YYYY-MM-DD') : '',
      endDate: params?.endDate ? dayjs.utc(params?.endDate).format('YYYY-MM-DD') : '',
    },
  
  });

  return res.data;
}

type QueryFnType = typeof getSalesSummary;

type UseSalesSummaryOptions = {
  params?: SalesSummaryQuery;
  config?: QueryConfig<QueryFnType>;
};

export function useSalesSummary({ config, params }: UseSalesSummaryOptions = {}) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['sales-summary', params],
    queryFn: () => getSalesSummary({ params }),
  });
}
