import { BarChart } from '@mantine/charts';
import { useSalesSummary } from '../api';
import { SalesSummaryQuery } from '../types';
import { useOutletContext } from '@/features/outlet';
import { useState } from 'react';
import { formatCurrency} from '@/utils/format';


type Props = {
    chartMode?: 'quantity' | 'penjualan';
} & SalesSummaryQuery;

/**
 * Used to display recent sales chart
 * @param {string} chartMode chart mode
 * @returns JSX.Element
 */
export const RecentSalesChart: React.FC<Props> = ({
    chartMode
}) => {
    // setChartMode(chartMode === 'quantity' ? 'penjualan' : 'quantity')
    // Get today's date
    let currentDate = new Date();

    // Calculate the date 7 days ago
    let sevenDaysAgo = new Date(currentDate);
    sevenDaysAgo.setDate(currentDate.getDate() - 6);
    const { outlet } = useOutletContext();

    const [params, setParams] = useState<SalesSummaryQuery>({
        outlet: outlet?.id,
        status: ['approved'],
        startDate: sevenDaysAgo,
        endDate: new Date(),
    });

    const { data: dataSales, isLoading, isError } = useSalesSummary({ params });


    const data = dataSales?.map((item) => ({
        date: (new Date(item.date)).toLocaleDateString('id-ID', { weekday: 'long' }),
        penjualan: item.total / 1000,
        quantity: item.quantity,
        Gelas: item.quantity,
        labelPenjualan: formatCurrency(item.total),
    }));

    const combinedData = dataSales?.reduce((acc, item) => {
        const date = (new Date(item.date)).toLocaleDateString('id-ID', { weekday: 'long' });
    
        const existingItem = acc.find((entry: { date: string }) => entry.date === date);
    
        const combinedData = dataSales?.reduce((acc: { date: string, penjualan: number, quantity: number, Gelas: number, labelPenjualan: string }[], item) => {
            const date = (new Date(item.date)).toLocaleDateString('id-ID', { weekday: 'long' });

            const existingItem = acc.find((entry: { date: string }) => entry.date === date);

            if (existingItem) {
                existingItem.penjualan += item.total / 1000;
                existingItem.quantity += item.quantity;
                existingItem.Gelas += item.quantity;
                existingItem.labelPenjualan = formatCurrency(existingItem.penjualan * 1000);
            } else {
                acc.push({
                    date,
                    penjualan: item.total / 1000,
                    quantity: item.quantity,
                    Gelas: item.quantity,
                    labelPenjualan: formatCurrency(item.total),
                });
            }

            return acc;
        }, []);
    
        return acc;
    }, []);
    


    return (
        <div className="px-8 py-4">
            <h2 className="text-right"> {sevenDaysAgo.toLocaleDateString('id-ID')} - {currentDate.toLocaleDateString('id-ID')} </h2>
            {chartMode === 'penjualan' ? (
                <BarChart
                    h={250}
                    data={data ?? []}
                    dataKey="date"
                    tooltipAnimationDuration={200}
                    withLegend
                    withTooltip={false}
                    // valueFormatter={(value) => formatSplitThousand(value)}
                    xAxisProps={{ padding: { left: 20, right: 10 } }}
                    yAxisProps={{ padding: { top: 30, bottom: 0 } }}
                    barProps={{ radius: 5 }}
                    unit='K'
                    series={[
                        { name: 'penjualan', color: 'blue.3' },
                    ]}
                />
            ) : (
                <BarChart
                    h={250}
                    data={data ?? []}
                    dataKey="date"
                    tooltipAnimationDuration={200}
                    withLegend
                    withTooltip={false}
                    xAxisProps={{ padding: { left: 20, right: 10 } }}
                    yAxisProps={{ padding: { top: 30, bottom: 0 } }}
                    barProps={{ radius: 5 }}
                    series={[
                        { name: 'Gelas', color: 'blue.3' },
                    ]}
                />
            )}

        </div>
    );
};
