import React, { useState, useEffect } from 'react';
import pdfjsLib, { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';
import 'pdfjs-dist/web/pdf_viewer.css';

interface PdfViewerProps {
    url: string;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ url }) => {

    const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
    const scale = 1; // Set Scale for Zoom.

    const IsMobile = () => {
        const r = new RegExp("Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini");
        return r.test(navigator.userAgent);
    };

    const resolution = IsMobile() ? 1.5 : 1; // Set Resolution as per Desktop and Mobile.
    //3.11.174
    useEffect(() => {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min.js';
        LoadPdfFromUrl(url);
    }, [url]);

    const LoadPdfFromUrl = (url: string) => {
        pdfjsLib.getDocument(url).promise.then((pdfDoc_) => {
            setPdfDoc(pdfDoc_);

            // Reference the Container DIV.
            const pdfContainer = document.getElementById("pdf_container")!;
            pdfContainer.style.display = "block";
            pdfContainer.style.height = IsMobile() ? "1200px" : "820px";

            // Loop and render all pages.
            for (let i = 1; i <= pdfDoc_.numPages; i++) {
                RenderPage(pdfContainer, i);
            }
        });
    };

    const RenderPage = (pdfContainer: HTMLElement, num: number) => {
        if (!pdfDoc) return;

        pdfDoc.getPage(num).then((page: PDFPageProxy) => {
            // Create Canvas element and append to the Container DIV.
            const canvas = document.createElement('canvas');
            canvas.id = 'pdf-' + num;
            const ctx = canvas.getContext('2d')!;
            pdfContainer.appendChild(canvas);

            // Create and add empty DIV to add SPACE between pages.
            const spacer = document.createElement("div");
            spacer.style.height = "20px";
            pdfContainer.appendChild(spacer);

            // Set the Canvas dimensions using ViewPort and Scale.
            const viewport = page.getViewport({ scale: scale });
            canvas.height = resolution * viewport.height;
            canvas.width = resolution * viewport.width;

            // Render the PDF page.
            const renderContext = {
                canvasContext: ctx,
                viewport: viewport,
                transform: [resolution, 0, 0, resolution, 0, 0]
            };

            page.render(renderContext);
        });
    };

    
    return (
        <div id="pdf_container">
            {/* Canvas elements will be appended here */}
        </div>
    );
};

export default PdfViewer;
