import { Text, View } from '@react-pdf/renderer';

import { Table, TableData } from '@/components/document';
import { dayjs } from '@/lib/dayjs';
import { formatCurrency } from '@/utils/format';

import { SalesSummary } from '../../types';

import { styles } from './styles';

type Props = {
  title?: string;
  sales: SalesSummary[];
};

export const SaleTable: React.FC<Props> = ({ title = 'Rincian Pemasukan', sales }) => {
  return (
    <View style={styles.section}>
      <Text style={{ fontFamily: 'Times-Bold', marginBottom: 4 }}>{title}</Text>
      <Table
        data={[
          [
            { value: 'Tanggal', weight: 'bold' },
            { value: 'Keterangan', weight: 'bold' },
            { value: 'Jumlah', weight: 'bold' },
            { value: 'Harga Satuan Rata-Rata', weight: 'bold' },
            { value: 'Total', weight: 'bold' },
          ],
          ...(sales.map((sale) => [
            { value: dayjs(sale.date).format('DD/MM/YYYY') },
            { value: sale.name },
            { value: sale.quantity },
            { value: formatCurrency(sale.total / sale.quantity), align: 'right' },
            { value: formatCurrency(sale.total), align: 'right' },
          ]) as TableData[][]),
          [
            { value: 'Total Pemasukan', span: 2, weight: 'bold' },
            { value: sales.reduce((x, y) => x + y.quantity, 0) },
            {
              value: formatCurrency(
                sales.reduce((x, y) => x + y.total / y.quantity, 0) / sales.length || 0
              ),
              align: 'right',
            },
            { value: formatCurrency(sales.reduce((x, y) => x + y.total, 0)), align: 'right' },
          ],
        ]}
        sizes={[0.15, 0.25, 0.15, 0.2, 0.25]}
      />
    </View>
  );
};
