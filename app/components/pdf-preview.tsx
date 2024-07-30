"use client";

import { useCallback, useState } from "react";
import { useResizeObserver } from "@wojtekmaj/react-hooks";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

import "./pdf-preview.scss";
import type { PDFDocumentProxy } from "pdfjs-dist";
import LeftIcon from "../icons/pdf-left.svg";
import RightIcon from "../icons/pdf-right.svg";
import PlusIcon from "../icons/plus.svg";
import MinusIcon from "../icons/minus.svg";
import { IconButton } from "@/app/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectGroup,
  SelectValue,
} from "@/components/ui/select";
import { useSupabase } from "@/lib/context/SupabaseProvider";
import { access } from "fs";
import { set } from "react-hook-form";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const options = {
  cMapUrl: "/cmaps/",
  standardFontDataUrl: "/standard_fonts/",
  disableAutoFetch: true,
  disableStream: true,
};

const resizeObserverOptions = {};

const maxWidth = 1500;

type PDFFile = string | File | null;

export function PdfBook() {
  // const [file, setFile] = useState<PDFFile>("http://localhost:5050/pdf");
  let { session } = useSupabase();
  const access_token = session?.access_token || "";
  function setFileName(fileName: string = "lesson_book.pdf") {
    const urlPath = `/api/pdf/${fileName}/${access_token}`;
    return urlPath;
  }
  const [file, setFile] = useState<PDFFile>(setFileName());
  const [numPages, setNumPages] = useState<number>();
  const [PageNumber, setPageNumber] = useState<number>(1);
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(400);
  const [pageScale, setPageScale] = useState<number>(1);

  const onResize = useCallback<ResizeObserverCallback>((entries) => {
    const [entry] = entries;

    if (entry) {
      setContainerWidth(entry.contentRect.width);
    }
  }, []);

  useResizeObserver(containerRef, resizeObserverOptions, onResize);

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
    if (Number(value) >= (numPages || 0)) {
      setPageNumber(Number(numPages));
      return;
    }
    setPageNumber(Number(value));
  }

  function onSelectChange(event: string) {
    setPageNumber(1);
    setFile(event);
  }

  function pageZoomIn() {
    if (pageScale <= 1.4) {
      setPageScale(pageScale + 0.1);
    }
  }

  function pageZoomOut() {
    if (pageScale >= 0.6) {
      setPageScale(pageScale - 0.1);
    }
  }

  return (
    <div className="FilePreview">
      <div className="FilePreview__container">
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
                renderTextLayer={true}
                scale={pageScale}
                className={"FilePreview__container__Page"}
              />
            </div>
          </Document>
        </div>
      </div>
      <div className="Test__container__content__controls">
        <IconButton
          icon={<PlusIcon />}
          onClick={pageZoomIn}
          shadow
          className="Test__container__content__controls__button"
        />
        <IconButton
          icon={<MinusIcon />}
          onClick={pageZoomOut}
          shadow
          className="Test__container__content__controls__button"
        />
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
        <Select onValueChange={onSelectChange} defaultValue={String(file)}>
          <SelectTrigger className="w-[130px] bg-white">
            <SelectValue placeholder="选择文档" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>选择文档</SelectLabel>
              <SelectItem value="http://47.121.195.173:3000/lesson_book.pdf">
                课本
              </SelectItem>
              <SelectItem value="http://47.121.195.173:3000/reference_book.pdf">
                参考资料
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
