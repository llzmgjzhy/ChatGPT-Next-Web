"use client";

import { useCallback, useState } from "react";
import { useResizeObserver } from "@wojtekmaj/react-hooks";
import { pdfjs, Document, Page, Thumbnail } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

import "./pdf-preview.scss";
import type { PDFDocumentProxy } from "pdfjs-dist";
import LeftIcon from "../icons/pdf-left.svg";
import RightIcon from "../icons/pdf-right.svg";
import { IconButton } from "@/app/components/button";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const options = {
  cMapUrl: "/cmaps/",
  standardFontDataUrl: "/standard_fonts/",
};

const resizeObserverOptions = {};

const maxWidth = 800;

type PDFFile = string | File | null;

export function PdfBook() {
  const [file, setFile] = useState<PDFFile>("./lesson_book.pdf");
  const [numPages, setNumPages] = useState<number>();
  const [PageNumber, setPageNumber] = useState<number>(1);
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>();

  const onResize = useCallback<ResizeObserverCallback>((entries) => {
    const [entry] = entries;

    if (entry) {
      setContainerWidth(entry.contentRect.width);
    }
  }, []);

  useResizeObserver(containerRef, resizeObserverOptions, onResize);

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const { files } = event.target;

    const nextFile = files?.[0];

    if (nextFile) {
      setFile(nextFile);
    }
  }
  const changePage = useCallback(
    (offset: number) =>
      setPageNumber((prevPageNumber) => (prevPageNumber || 1) + offset),
    [],
  );

  const previousPage = useCallback(() => changePage(-1), [changePage]);

  const nextPage = useCallback(() => changePage(1), [changePage]);

  function onDocumentLoadSuccess({
    numPages: nextNumPages,
  }: PDFDocumentProxy): void {
    setNumPages(nextNumPages);
  }

  function onPageNumberChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ): void {
    const { value } = event.target;
    if (Number(value) <= 0) {
      setPageNumber(1);
      return;
    }
    if (Number(value) >= (numPages || 0)) return;
    setPageNumber(Number(value));
  }

  return (
    <div className="FilePreview">
      <div className="FilePreview__container">
        {/* <div className="FilePreview__container__load">
          <label htmlFor="file">Load from file:</label>{" "}
          <input onChange={onFileChange} type="file" />
        </div> */}
        <div className="FilePreview__container__document" ref={setContainerRef}>
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            options={options}
          >
            <div className="Test__container__content__page">
              <Page
                pageNumber={PageNumber}
                width={
                  containerWidth ? Math.min(containerWidth, maxWidth) : maxWidth
                }
                className={"FilePreview__container__Page"}
              />
            </div>
          </Document>
        </div>
      </div>
      <div className="Test__container__content__controls">
        <IconButton
          icon={<LeftIcon />}
          disabled={(PageNumber || 0) <= 1}
          onClick={previousPage}
          shadow
          className="Test__container__content__controls__button"
        />
        <p>
          {"  "}
          <input
            onChange={onPageNumberChange}
            value={PageNumber}
            type="number"
          />
          / {numPages || "--"}
        </p>
        <IconButton
          icon={<RightIcon />}
          disabled={(PageNumber || 0) >= (numPages || 0)}
          onClick={nextPage}
          className="Test__container__content__controls__button"
          shadow
        />
      </div>
    </div>
  );
}
