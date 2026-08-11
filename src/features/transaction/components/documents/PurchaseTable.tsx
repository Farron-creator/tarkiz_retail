import { Text, View } from '@react-pdf/renderer';

import { Table, TableData } from '@/components/document';
import { dayjs } from '@/lib/dayjs';
import { formatCurrency } from '@/utils/format';

import { PurchasesSummary } from '../../types';

import { styles } from './styles';

type Props = {
  title?: string;
  purchases: PurchasesSummary[];
};

export const PurchaseTable: React.FC<Props> = ({ title = 'Rincian Pembelian', purchases }) => {
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
          ...(purchases.map((purchase) => [
            { value: dayjs(purchase.date).format('DD/MM/YYYY') },
            { value: purchase.name },
            { value: purchase.quantity },
            { value: formatCurrency(purchase.total / purchase.quantity), align: 'right' },
            { value: formatCurrency(purchase.total), align: 'right' },
          ]) as TableData[][]),
          [
            { value: 'Total Pengeluaran', span: 2, weight: 'bold' },
            { value: purchases.reduce((x, y) => x + y.quantity, 0) },
            {
              value: formatCurrency(
                purchases.reduce((x, y) => x + y.total / y.quantity, 0) / purchases.length || 0
              ),
              align: 'right',
            },
            { value: formatCurrency(purchases.reduce((x, y) => x + y.total, 0)), align: 'right' },
          ],
        ]}
        sizes={[0.15, 0.25, 0.15, 0.2, 0.25]}
      />
    </View>
  );
};
