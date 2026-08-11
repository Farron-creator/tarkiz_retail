import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
  page: {
    backgroundColor: 'white',
    fontFamily: 'Times-Roman',
    padding: '2cm',
  },
  section: {
    marginBottom: 24,
    fontSize: 16,
  },
  header: {
    textAlign: 'center',
    fontFamily: 'Times-Bold',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
});
