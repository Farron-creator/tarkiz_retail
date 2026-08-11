import { pdf} from '@react-pdf/renderer';
import { pdfjs, Document, Page } from 'react-pdf';


import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { LoadingScreen } from '@/components/elements';
import { getCompany } from '@/features/company';
import { getOutlets } from '@/features/outlet';
import { dayjs } from '@/lib/dayjs';

import { getExpensesSummary, getSalesSummary } from '../api';
import { CompanyDocument } from '../components';

export const CompanySummaryPdf: React.FC = () => {
  const [params] = useSearchParams();
  const startDate = dayjs(params.get('startDate') || new Date()).toDate();
  const endDate = dayjs(params.get('endDate') || new Date()).toDate();
  const { id } = useParams<'id'>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['company-summary'],
    queryFn: () => getSummaryData({ id: id as string, startDate, endDate }),
  });

  const [pageWidth, setPageWidth] = useState(window.innerWidth); // Initial width
  const [scale, setScale] = useState(1); // Initial scale
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [numPages, setNumPages] = useState(0);

  const handleBackButtonClick = () => {
    history.back();
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  }

  useEffect(() => {
    if (!data) return;
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.js',
      import.meta.url,
    ).toString();

    (async () => {
      const blob = await pdf(<CompanyDocument {...data} />).toBlob();
      const blobWithType = new Blob([blob], { type: 'application/pdf' });
      if (blobWithType) {
        const url = URL.createObjectURL(blobWithType);
        setPdfUrl(url);
      }
    })();
  }, [data]);

  if (isLoading) return <LoadingScreen />;
  if (isError) return <div>Terjadi Kesalahan</div>;

  return (
    <main className="bg-black flex flex-col items-center justify-center ">
      <button
        onClick={handleBackButtonClick}
        className="fixed top-0 left-10 mt-4 ml-4 px-4 py-0 bg-gray-800 text-white rounded  z-10"
      >
        Back
      </button>

      <div>
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          {Array.from(
        new Array(numPages),
        (el, index) => (
          <div>
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            width={pageWidth-50}
          />
          {el}
          <hr></hr>
          </div>
        ),
      )}
        </Document>

      </div>
      
   
      
    </main>
  );
};

type SummaryParams = {
  id: number | string;
  startDate: Date;
  endDate: Date;
};

async function getSummaryData({ id, startDate, endDate }: SummaryParams) {
  const company = await getCompany({ id: Number(id) });
  const outlets = await getOutlets({ params: { company: company.id, limit: -1 } });

  const transactions = await Promise.all(
    outlets.result.map(async (outlet) => {
      return {
        outlet,
        startDate,
        endDate,
        sales: await getSalesSummary({
          params: {
            outlet: outlet.id,
            startDate,
            endDate,
            status: ['accepted', 'approved'],
          },
        }),
        expenses: await getExpensesSummary({
          params: {
            outlet: outlet.id,
            startDate,
            endDate,
            status: ['accepted', 'approved'],
          },
        }),
      };
    })
  );

  return {
    company,
    startDate,
    endDate,
    transactions,
  };
}
