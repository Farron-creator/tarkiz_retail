import { Text, View } from '@react-pdf/renderer';

import { Table, TableData } from '@/components/document';
import { dayjs } from '@/lib/dayjs';
import { formatCurrency } from '@/utils/format';

import { ExpensesSummary } from '../../types';

import { styles } from './styles';

type Props = {
  title?: string;
  expenses: ExpensesSummary[];
};

export const ExpenseTable: React.FC<Props> = ({ title = 'Rincian Pengeluaran', expenses }) => {
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
          ...(expenses.map((expense) => [
            { value: dayjs(expense.date).format('DD/MM/YYYY') },
            { value: expense.name },
            { value: expense.quantity },
            { value: formatCurrency(expense.total / expense.quantity), align: 'right' },
            { value: formatCurrency(expense.total), align: 'right' },
          ]) as TableData[][]),
          [
            { value: 'Total Pengeluaran', span: 2, weight: 'bold' },
            { value: expenses.reduce((x, y) => x + y.quantity, 0) },
            {
              value: formatCurrency(
                expenses.reduce((x, y) => x + y.total / y.quantity, 0) / expenses.length || 0
              ),
              align: 'right',
            },
            { value: formatCurrency(expenses.reduce((x, y) => x + y.total, 0)), align: 'right' },
          ],
        ]}
        sizes={[0.15, 0.25, 0.15, 0.2, 0.25]}
      />
    </View>
  );
};
