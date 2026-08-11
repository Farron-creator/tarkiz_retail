import { PDFViewer, Document, Page, pdf, BlobProvider, StyleSheet } from '@react-pdf/renderer';
import { Document as PDocument, Page as PDpage, pdfjs } from 'react-pdf';


import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { LoadingScreen } from '@/components/elements';
import { getOutlet } from '@/features/outlet';
import { dayjs } from '@/lib/dayjs';

import { getExpensesSummary, getPurchasesSummary, getSalesSummary } from '../api';
import { OutletDocument, OutletDocumentProps } from '../components';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

// import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

export const OutletSummary: React.FC = () => {
  const [params] = useSearchParams();
  const startDate = dayjs(params.get('startDate') || new Date()).toDate();
  const endDate = dayjs(params.get('endDate') || new Date()).toDate();
  const { id } = useParams<'id'>();
  const canvasRef = useRef();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['outlet-summary'],
    queryFn: () => getSummaryData({ id: id as string, startDate, endDate }),
  });

  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageWidth, setPageWidth] = useState(window.innerWidth); // Initial width
  const [scale, setScale] = useState(1); // Initial scale

  const onHandleLoadSuccess = (pdf: PDFDocumentProxy) => {
    setNumPages(pdf.numPages);
    const firstPage = pdf.getPage(1); // Get the first page
    firstPage.then((page) => {
      const viewport = page.getViewport({ scale: 1 });
      const width = viewport.width;
      setPageWidth(width); // Set page width to match the first page width
    });
  };

  const handleBackButtonClick = () => {
    history.back();
  };

  const handleLoadSuccess = () => {
    console.log('load success');
  };

  const zoomIn = () => {
    setScale(scale + 0.1); // Increase scale by 0.1
  };

  const zoomOut = () => {
    setScale(scale - 0.1); // Decrease scale by 0.1
  };

  useEffect(() => {
    if (!data) return;

    console.log(data);
    (async () => {
      const blob = await pdf(<OutletDocument {...data} />).toBlob();
      const blobWithType = new Blob([blob], { type: 'application/pdf' });

      


      if (blobWithType) {
        const url = URL.createObjectURL(blobWithType);
        const link = document.createElement('a');

        // link.href = url;
        // link.download = `laporan abude.pdf`;
        // document.body.appendChild(link);
        // link.click();
        // document.body.removeChild(link);

        const objectElement = document.getElementById('pdf-object');

        if (objectElement) {
          objectElement.setAttribute('data', url);
        }

      }

    })();
  }, [data]);

  if (isLoading) return <LoadingScreen />;
  if (isError) return <div>Terjadi Kesalahan</div>;
  return (
    <main className="w-full bg-black flex flex-col items-center justify-center h-screen">
      <button
        onClick={handleBackButtonClick}
        className="absolute top-0 left-0 mt-4 ml-4 px-4 py-0 bg-gray-800 text-white rounded"
      >
        Back
      </button>
      {/* <object id="pdf-object" width="100" height="100" type="application/pdf" title="PDF Viewer">
         PDF viewing fail
      </object> */}


      {/* <PDFViewer className="max-w-md w-full h-screen">
        <OutletDocument {...data} />

      </PDFViewer> */}
      <div>
        <button onClick={zoomIn}>Zoom In</button>
        <button onClick={zoomOut}>Zoom Out</button>
      </div>
{/* 
      <BlobProvider document={<OutletDocument {...data} />}>
        {({ blob, url, loading }) => {
          return loading ? <LoadingScreen /> : (
           
              <PDocument file={url} renderMode="canvas"
              onLoadSuccess={(pdf) => onHandleLoadSuccess(pdf)}
              >
            {
              Array.from(new Array(numPages), (el, index) => (
                <PDpage key={`page_${index + 1}`} pageNumber={index + 1} width={pageWidth} scale={scale}/>
              ))
            }
          </PDocument>
             
         
          );
        }}
      </BlobProvider> */}
    </main>
    // <main className="w-full bg-black flex items-center justify-center h-screen">
    //   <PDFViewer className="max-w-md w-full h-screen">
    //     <OutletDocument {...data} />
    //   </PDFViewer>
    // </main>

  );
};

type SummaryParams = {
  id: number | string;
  startDate: Date;
  endDate: Date;
};

async function getSummaryData({ id, startDate, endDate }: SummaryParams) {
  const outlet = await getOutlet({ id: Number(id) });
  const sales = await getSalesSummary({
    params: {
      outlet: id,
      startDate: dayjs(startDate).utc(true).startOf('d').toDate(),
      endDate: dayjs(endDate).utc(true).endOf('d').toDate(),
      status: ['accepted', 'approved'],
    },
  });
  const purchases = await getPurchasesSummary({
    params: {
      outlet: id,
      startDate: dayjs(startDate).utc(true).startOf('d').toDate(),
      endDate: dayjs(endDate).utc(true).endOf('d').toDate(),
      status: ['accepted', 'approved'],
    },
  });
  const expenses = await getExpensesSummary({
    params: {
      outlet: id,
      startDate: dayjs(startDate).utc(true).startOf('d').toDate(),
      endDate: dayjs(endDate).utc(true).endOf('d').toDate(),
      status: ['accepted', 'approved'],
    },
  });

  return {
    outlet,
    startDate,
    endDate,
    sales,
    purchases,
    expenses
  } as OutletDocumentProps;
}
