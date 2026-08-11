import { Document, Image, Page, Text, View } from '@react-pdf/renderer';

import { Table, TableData } from '@/components/document';
import { Company } from '@/features/company';
import { Outlet } from '@/features/outlet';
import { dayjs } from '@/lib/dayjs';
import { formatCurrency } from '@/utils/format';

import { SalesSummary, ExpensesSummary } from '../../types';

import { ExpenseTable } from './ExpenseTable';
import { SaleTable } from './SaleTable';
import { styles } from './styles';

type Props = {
  company: Company;
  startDate: Date;
  endDate: Date;
  transactions: {
    outlet: Outlet;
    startDate: Date;
    endDate: Date;
    sales: SalesSummary[];
    expenses: ExpensesSummary[];
  }[];
};

export const CompanyDocument: React.FC<Props> = ({ transactions, startDate, endDate, company }) => {
  const [sale, expense] = transactions.reduce(
    (x, { sales, expenses }) => {
      const totalSale = sales.reduce((x, y) => x + y.total, 0);
      const totalExpense = expenses.reduce((x, y) => x + y.total, 0);

      return [x[0] + totalSale, x[1] + totalExpense];
    },
    [0, 0]
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image
            source="/images/abude-logo.png"
            style={{ width: 75, height: 75, marginBottom: 16 }}
          />
          <Text style={{ marginBottom: '12px' }}>Laporan Pemasukan dan Pengeluaran</Text>
          <Text>
            {dayjs(startDate).format('D MMMM')} - {dayjs(endDate).format('D MMMM')}
          </Text>
        </View>

        <View style={{ width: '100%', marginBottom: 24, paddingHorizontal: 56 }}>
          <Text
            style={{
              marginBottom: 8,
              fontSize: 14,
              fontFamily: 'Times-Bold',
            }}
          >
            Rekapitulasi
          </Text>
          <View
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 6,
              fontSize: 14,
            }}
          >
            <Text>Perusahaan</Text>
            <Text style={{ fontFamily: 'Times-Bold' }}>{company.name}</Text>
          </View>
          <View
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 6,
              fontSize: 14,
            }}
          >
            <Text>Total Pemasukan</Text>
            <Text style={{ fontFamily: 'Times-Bold' }}>{formatCurrency(sale)}</Text>
          </View>
          <View
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 6,
              fontSize: 14,
            }}
          >
            <Text>Total Pengeluaran</Text>
            <Text style={{ fontFamily: 'Times-Bold' }}>{formatCurrency(expense)}</Text>
          </View>
          <View
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 6,
              fontSize: 14,
            }}
          >
            <Text>Total Laba Kotor</Text>
            <Text style={{ fontFamily: 'Times-Bold' }}>{formatCurrency(sale - expense)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={{ fontFamily: 'Times-Bold', marginBottom: 4 }}>Rincian</Text>
          <Table
            data={[
              [
                { value: 'Outlet', weight: 'bold' },
                { value: 'Pemasukan', weight: 'bold' },
                { value: 'Pengeluaran', weight: 'bold' },
                { value: 'Laba Kotor', weight: 'bold' },
              ],
              ...(transactions.map(({ outlet, sales, expenses }) => {
                const sale = sales.reduce((x, y) => x + y.total, 0);
                const expense = expenses.reduce((x, y) => x + y.total, 0);

                return [
                  { value: outlet.name },
                  { value: formatCurrency(sale), align: 'right' },
                  { value: formatCurrency(expense), align: 'right' },
                  { value: formatCurrency(sale - expense), align: 'right' },
                ];
              }) as TableData[][]),
              [
                { value: 'Total', weight: 'bold' },
                { value: formatCurrency(sale), align: 'right', weight: 'bold' },
                {
                  value: formatCurrency(expense),
                  align: 'right',
                  weight: 'bold',
                },
                {
                  value: formatCurrency(sale - expense),
                  align: 'right',
                  weight: 'bold',
                },
              ],
            ]}
            sizes={[0.25, 0.25, 0.25, 0.25]}
          />
        </View>
      </Page>

      {transactions.map(({ outlet, sales, expenses }) => {
        const totalSale = sales.reduce((x, y) => x + y.total, 0);
        const totalExpense = expenses.reduce((x, y) => x + y.total, 0);

        return (
          <Page key={outlet.id} size="A4" style={styles.page}>
            <View style={{ width: '100%', marginBottom: 24, paddingHorizontal: 56 }}>
              <Text
                style={{
                  marginBottom: 24,
                  fontSize: 18,
                  fontFamily: 'Times-Bold',
                  textAlign: 'center',
                }}
              >
                {outlet.name}
              </Text>
              <View
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 6,
                  fontSize: 14,
                }}
              >
                <Text>Total Pemasukan</Text>
                <Text style={{ fontFamily: 'Times-Bold' }}>{formatCurrency(totalSale)}</Text>
              </View>
              <View
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 6,
                  fontSize: 14,
                }}
              >
                <Text>Total Pengeluaran</Text>
                <Text style={{ fontFamily: 'Times-Bold' }}>{formatCurrency(totalExpense)}</Text>
              </View>
              <View
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 6,
                  fontSize: 14,
                }}
              >
                <Text>Total Laba Kotor</Text>
                <Text style={{ fontFamily: 'Times-Bold' }}>
                  {formatCurrency(totalSale - totalExpense)}
                </Text>
              </View>
            </View>

            <SaleTable sales={sales} />

            <ExpenseTable expenses={expenses} />
          </Page>
        );
      })}
    </Document>
  );
};
