import React, { useState, useEffect } from "react";
import pdf from "../assets/Pankaj_Kumar_Resume.pdf";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const Resume = () => {
  const [width, setWidth] = useState(1200);

  useEffect(() => {
    setWidth(window.innerWidth);
  }, []);

  return (
    <div className="flex h-[100vh] justify-center items-center p-5">
      <Document file={pdf}>
        <Page pageNumber={1} scale={width > 500 ? 1.0 : 0.7} />
      </Document>
    </div>
  );
};

export default Resume;
